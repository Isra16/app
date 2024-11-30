const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const multer = require('multer');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

const app = express();

// Enable CORS
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Session setup
app.use(session({
    secret: 'a8D9!Xy29@kLpQr35$Ns1wZ4t8Uv*ByL',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

// AWS S3 configuration
const s3Client = new S3Client({
    region: 'us-east-1',
    credentials: {
        accessKeyId: 'AKIA4VDBME66RJUJSBFM',
        secretAccessKey: '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',
    },
});
const bucketName = 'softixp';

// Multer setup to handle file uploads in memory
const storage = multer.memoryStorage();
const upload = multer({ storage });

// MySQL database connection
const conn = mysql.createConnection({
    host: 'database-1.czyq0i2sme25.us-east-1.rds.amazonaws.com',
    port: '3306',
    user: 'admin',
    password: 'Softix$123',
    database: 'my_db'
});

conn.connect((error) => {
    if (error) {
        console.error('Error connecting to the database:', error);
    } else {
        console.log('Connected to the database');
    }
});

// Start the server
const server = app.listen(8080, () => {
    console.log(`Server started on http://localhost:8080`);
});

app.post('/login', (req, res) => {
    const { id, password } = req.body;

    const sql = 'SELECT * FROM user WHERE id = ?';
    conn.query(sql, [id], (error, results) => {
        if (error) return res.status(500).json({ message: 'Database error' });
        if (results.length === 0 || results[0].password !== password) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        req.session.userId = results[0].id;
        res.status(200).json({ message: 'Login successful' });
    });
});


app.get('/client', (req, res) => {
    if (!req.session.userId) return res.status(401).json({ message: 'Please log in' });

    const sql = 'SELECT name, amount, date FROM client WHERE name = ?';
    conn.query(sql, [req.session.userId], (err, result) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        if (result.length === 0) return res.status(404).json({ message: 'Client not found' });
        res.status(200).json(result[0]);
    });
});


app.post('/clients', (req, res) => {
    const { name, amount, AmountPaid, date } = req.body;
    if (!name || !amount || AmountPaid == null || !date) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    const id = name.split(' ').slice(0, 2).join('').toLowerCase();
    const sql = 'INSERT INTO client (name, id, password, amount, AmountPaid, date) VALUES (?, ?, ?, ?, ?, ?)';
    conn.query(sql, [name, id, id, amount, AmountPaid, date], (error) => {
        if (error) return res.status(500).json({ message: 'Error adding client' });
        res.status(201).json({ message: 'Client added successfully', id, name, amount });
    });
});


app.put('/clients/update', (req, res) => {
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
        if (error) return res.status(500).json({ message: 'Database error' });
        if (results.affectedRows === 0) return res.status(404).json({ message: 'Client not found' });
        res.status(200).json({ message: 'Client updated successfully' });
    });
});


// File upload route
app.post('/uploads', upload.single('file'), async (req, res) => {
    const { file } = req;
    if (!file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    const fileKey = `${Date.now()}-${file.originalname}`; // Unique file name

    try {
        // Upload to S3
        const uploadParams = {
            Bucket: softixp,
            Key: fileKey,
            Body: file.buffer,
            ContentType: file.mimetype,
        };
        await s3Client.send(new PutObjectCommand(uploadParams));
        const fileUrl = `https://${bucketName}.s3.amazonaws.com/${fileKey}`;

        // Save the file URL to MySQL database
        const sql = 'INSERT INTO uploads (image_url) VALUES (?)';
        conn.query(sql, [fileUrl], (error) => {
            if (error) {
                console.error('MySQL Insert Error:', error);
                return res.status(500).json({ message: 'Error saving file URL' });
            }
            res.status(200).json({ url: fileUrl }); // Respond with S3 file URL
        });
    } catch (err) {
        console.error('S3 Upload Error:', err);
        res.status(500).json({ message: 'Error uploading file to S3' });
    }
});
