const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const multer = require('multer');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
require('dotenv').config();

const app = express();


app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
    session({
        secret: process.env.SESSION_SECRET || 'defaultsecret',
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false },
    })
);


const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});
const bucketName = process.env.S3_BUCKET_NAME;


const storage = multer.memoryStorage();
const upload = multer({ storage });


const conn = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

conn.connect((error) => {
    if (error) {
        console.error('Error connecting to the database:', error);
    } else {
        console.log('Connected to the database');
    }
});


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});

app.post('/admin/login', (req, res) => {
    const { id, password } = req.body;
    console.log('Received user data for login:', req.body);

    const sql = 'SELECT * FROM user WHERE id = ?';
    conn.query(sql, [id], (error, results) => {
        if (error) {
            console.error('Error querying database:', error);
            return res.status(500).json({ message: 'Error during authentication' });
        }

        if (results.length > 0) {
            const user = results[0];
            if (password === user.password) {
                req.session.userId = user.id;
                console.log('User authenticated:', user);
                return res.status(200).json({ message: 'Login successful' });
            } else {
                console.log('Authentication failed: Invalid credentials');
                return res.status(401).json({ message: 'Invalid credentials' });
            }
        } else {
            console.log('Authentication failed: User not found');
            return res.status(401).json({ message: 'Invalid credentials' });
        }
    });
});



app.post('/login', (req, res) => {
    const { id, password } = req.body;
    console.log('Received user data for login:', req.body);

    const sql = 'SELECT * FROM client WHERE id = ?';
    conn.query(sql, [id], (error, results) => {
        if (error) {
            console.error('Error querying database:', error);
            return res.status(500).json({ message: 'Error during authentication' });
        }

        if (results.length > 0) {
            const user = results[0];
            if (password === user.password) {
                req.session.userId = user.id;
                console.log('User authenticated:', user);
                return res.status(200).json({ message: 'Login successful' });
            } else {
                console.log('Authentication failed: Invalid credentials');
                return res.status(401).json({ message: 'Invalid credentials' });
            }
        } else {
            console.log('Authentication failed: User not found');
            return res.status(401).json({ message: 'Invalid credentials' });
        }
    });
});

app.get('/client', (req, res) => {

    if (!req.session.userId) {
        return res.status(401).json({ message: 'Please log in to access client data' });
    }

    const sql = 'SELECT name, amount, AmountPaid, date FROM client WHERE id = ?';
    conn.query(sql, [req.session.userId], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        if (result.length === 0) {
            return res.status(404).json({ message: 'Client not found' });
        }
        res.status(200).json(result[0]);
    });
});


app.post('/clients', (req, res) => {
  const { name, amount, AmountPaid, date } = req.body;
  if (!name || !amount || AmountPaid == null || !date) {
      return res.status(400).json({ message: 'Missing required fields' });
  }

  const sql = 'INSERT INTO client (name, amount, AmountPaid, date) VALUES (?, ?, ?, ?)';
  conn.query(sql, [name, amount, AmountPaid, date], (error) => {
      if (error) {
          console.error('Error inserting data:', error);
          return res.status(500).json({ message: 'Error adding client' });
      }
      res.status(201).json({ message: 'Client added successfully' });
  });
});


app.put('/clients', (req, res) => {
  const { name, amount, newName, dueDate } = req.body;
  if (!name || amount == null || !newName || !dueDate) {
      return res.status(400).json({ message: 'Missing required fields' });
  }

  const parsedDueDate = new Date(dueDate);
  if (isNaN(parsedDueDate.getTime())) {
      return res.status(400).json({ message: 'Invalid date format' });
  }

  const sql = 'UPDATE client SET name = ?, amount = ?, date = ? WHERE name = ?';
  conn.query(sql, [newName, amount, parsedDueDate.toISOString(), name], (error, results) => {
      if (error) {
          console.error('Error updating data:', error);
          return res.status(500).json({ message: 'Error updating client' });
      }
      if (results.affectedRows === 0) {
          return res.status(404).json({ message: 'Client not found' });
      }
      res.status(200).json({ message: `Client updated successfully: ${newName}` });
  });
});


app.delete('/clients/:name', (req, res) => {
  const clientName = decodeURIComponent(req.params.name);
  const sql = 'DELETE FROM client WHERE name = ?';
  conn.query(sql, [clientName], (error, results) => {
      if (error) {
          console.error('Error deleting client:', error);
          return res.status(500).json({ message: 'Error deleting client' });
      }
      if (results.affectedRows === 0) {
          return res.status(404).json({ message: 'Client not found' });
      }
      res.status(200).json({ message: 'Client deleted successfully' });
  });
});


// app.post('/api/payments', upload.single('file'), async (req, res) => {
//     const { file } = req;
//     if (!file) {
//         return res.status(400).json({ message: 'No file uploaded' });
//     }

//     const fileKey = `${Date.now()}-${file.originalname}`;

//     try {
//         console.log("Uploading file to S3:", fileKey, file.mimetype);  

//         const uploadParams = {
//             Bucket: bucketName,
//             Key: fileKey,
//             Body: file.buffer,
//             ContentType: file.mimetype,
//         };

       
//         console.log("S3 Upload Params:", uploadParams);

//         await s3Client.send(new PutObjectCommand(uploadParams));
//         const fileUrl = `https://${bucketName}.s3.amazonaws.com/${fileKey}`;

//         const sql = 'INSERT INTO uploads (image_url) VALUES (?)';
//         conn.query(sql, [fileUrl], (error) => {
//             if (error) {
//                 console.error('MySQL Insert Error:', error);
//                 return res.status(500).json({ message: 'Error saving file URL' });
//             }
//             res.status(200).json({ url: fileUrl });
//         });
//     } catch (err) {
//         console.error('S3 Upload Error:', err);
//         res.status(500).json({ message: 'Error uploading file to S3' });
//     }
// });
app.post("/add-payment", (req, res) => {
    const { clientName, amountPaid, paymentDate } = req.body;
  
    if (!clientName || !amountPaid || !paymentDate) {
      return res.status(400).json({ error: "Missing required fields" });
    }
  
    const sql = "INSERT INTO payments (client_name, amount_paid, payment_date) VALUES (?, ?, ?)";
  
    conn.query(sql, [clientName, amountPaid, paymentDate], (error, results) => {
      if (error) {
        console.error("Error inserting payment:", error);
        return res.status(500).json({ error: "An error occurred while adding the payment" });
      }
  
      res.status(201).json({ message: "Payment added successfully" });
    });
  });
  
  
  
  app.get("/recent-payments", async (req, res) =>{
    const { clientName } = req.query;
 
    if (!clientName) {
      return res.status(400).json({ error: "Client name is required" });
    }
 
    const query = "SELECT amount_paid, payment_date FROM payments WHERE client_name = ? ORDER BY payment_date DESC LIMIT 5";

    conn.query(query, [clientName], (err, results) => {
      if (err) {
        console.error("Error fetching payments:", err.message);
        return res.status(500).json({ error: "Internal server error" });
      }
      res.json(results);
    });
  });
