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


app.post('/logout', (req, res) => {
    if (req.session) {
        req.session.destroy((err) => {
            if (err) {
                console.error('Error destroying session:', err);
                return res.status(500).json({ message: 'Error logging out' });
            }

            res.status(200).json({ message: 'Logout successful' });
        });
    } else {
        res.status(200).json({ message: 'No active session to log out from' });
    }
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


app.put('/admin-pass', (req, res) => {
    const { id, oldPassword, newPassword } = req.body;
    console.log(`Received request to update password for user ID: ${id}`);
  
    const fetchUserSql = 'SELECT * FROM user WHERE id = ?';
    conn.query(fetchUserSql, [id], (error, results) => {
        if (error) {
            console.error('Error querying database:', error);
            return res.status(500).json({ message: 'Database error' });
        }
  
        if (results.length === 0) {
            console.log('User not found');
            return res.status(404).json({ message: 'User not found' });
        }
  
        const user = results[0];
        if (user.password !== oldPassword) {
            console.log('Password update failed: Incorrect old password');
            return res.status(401).json({ message: 'Incorrect old password' });
        }
  
        const updatePasswordSql = 'UPDATE user SET password = ? WHERE id = ?';
        conn.query(updatePasswordSql, [newPassword, id], (updateError, updateResult) => {
            if (updateError) {
                console.error('Error updating password:', updateError);
                return res.status(500).json({ message: 'Failed to update password' });
            }
  
            console.log(`Password updated successfully for user ID: ${id}`);
            res.status(200).json({ message: 'Password updated successfully' });
        });
    });
  });
  


  app.put('/user-pass', (req, res) => {
    const { id, oldPassword, newPassword } = req.body;
    console.log(`Received request to update password for user ID: ${id}`);
  
    const fetchUserSql = 'SELECT * FROM client WHERE id = ?';
    conn.query(fetchUserSql, [id], (error, results) => {
        if (error) {
            console.error('Error querying database:', error);
            return res.status(500).json({ message: 'Database error' });
        }
  
        if (results.length === 0) {
            console.log('User not found');
            return res.status(404).json({ message: 'User not found' });
        }
  
        const user = results[0];
        if (user.password !== oldPassword) {
            console.log('Password update failed: Incorrect old password');
            return res.status(401).json({ message: 'Incorrect old password' });
        }
  
        const updatePasswordSql = 'UPDATE client SET password = ? WHERE id = ?';
        conn.query(updatePasswordSql, [newPassword, id], (updateError, updateResult) => {
            if (updateError) {
                console.error('Error updating password:', updateError);
                return res.status(500).json({ message: 'Failed to update password' });
            }
  
            console.log(`Password updated successfully for user ID: ${id}`);
            res.status(200).json({ message: 'Password updated successfully' });
        });
    });
  });


  app.get("/all-clients", (req, res) => {
    conn.query("SELECT * FROM client", (error, rows) => {
        if (error) {
            console.error('Error fetching data:', error);
            return res.status(500).json({ message: 'Error fetching data' });
        }
        res.status(200).json(rows);
    });
  });
  app.post('/clients', (req, res) => {
    const { name, amount, AmountPaid, date } = req.body;
    
    // Check for required fields
    if (!name || !amount || AmountPaid == null || !date) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    // Extract id from name (first two words, lowercase)
    const words = name.split(' ');
    const id = words.slice(0, 2).join(' ').toLowerCase(); // Take the first two words as id

    // SQL query to insert data
    const sql = 'INSERT INTO client (id, name, password, amount, AmountPaid, date) VALUES (?, ?, ?, ?, ?, ?)';
    conn.query(sql, [id, name, id, amount, AmountPaid, date], (error) => {
        if (error) {
            console.error('Error inserting data:', error);
            return res.status(500).json({ message: 'Error adding client' });
        }
        // Respond with full client details
        res.status(201).json({ 
            message: 'Client added successfully', 
            client: {
                id,
                name,
                password: id, // Password is same as id
                amount,
                AmountPaid,
                date
            }
        });
    });
});



app.put('/client-update', (req, res) => {
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


app.post("/add-payment", upload.single('screenshot'), async (req, res) => {
    const { clientName, amountPaid, paymentDate } = req.body;

    if (!clientName || !amountPaid || !paymentDate) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    let screenshotUrl = null;

    // If there's a screenshot, upload it to S3
    if (req.file) {
        const fileName = `payment_screenshot_${Date.now()}.png`;  // Use a unique name for the file
        const uploadParams = {
            Bucket: bucketName,
            Key: fileName,
            Body: req.file.buffer,
            ContentType: req.file.mimetype,
        };

        try {
            const command = new PutObjectCommand(uploadParams);
            await s3Client.send(command);
            screenshotUrl = `https://${bucketName}.s3.amazonaws.com/${fileName}`;
        } catch (error) {
            console.error("Error uploading screenshot:", error);
            return res.status(500).json({ error: "Error uploading screenshot to S3" });
        }
    }

    // Insert payment data into the database
    const sql = "INSERT INTO payments (client_name, amount_paid, payment_date, screenshot_url) VALUES (?, ?, ?, ?)";
    conn.query(sql, [clientName, amountPaid, paymentDate, screenshotUrl], (error, results) => {
        if (error) {
            console.error("Error inserting payment:", error);
            return res.status(500).json({ error: "An error occurred while adding the payment" });
        }
        res.status(201).json({ message: "Payment added successfully", paymentId: results.insertId });
    });
});

  
  
  app.get("/recent-payments", async (req, res) =>{
    const { clientName } = req.query;
 
    if (!clientName) {
      return res.status(400).json({ error: "Client name is required" });
    }
 
    const query = "SELECT amount_paid, payment_date, screenshot_url FROM payments WHERE client_name = ? ORDER BY payment_date DESC LIMIT 5";

    conn.query(query, [clientName], (err, results) => {
      if (err) {
        console.error("Error fetching payments:", err.message);
        return res.status(500).json({ error: "Internal server error" });
      }
      res.json(results);
    });
  });

  app.get("/all-payments", (req, res) => {
    conn.query("SELECT * FROM payments", (error, rows) => {
      if (error) {
        console.error("Error fetching data:", error);
        return res.status(500).json({ message: "Error fetching data" });
      }
      res.status(200).json(rows);
    });
  });
