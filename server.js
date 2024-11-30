const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const multer = require('multer');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
require('dotenv').config(); // Load .env file

const app = express();

// Middleware setup
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
    session({
        secret: process.env.SESSION_SECRET || 'defaultsecret', // Fallback for missing env variable
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false }, // Set to `true` if using HTTPS
    })
);

// AWS S3 configuration
const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});
const bucketName = process.env.S3_BUCKET_NAME;

// Multer setup
const storage = multer.memoryStorage();
const upload = multer({ storage });

// MySQL database connection
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

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});

// Routes

// Login route
app.post('/login', (req, res) => {
    const { id, password } = req.body;

    if (!id || !password) {
        return res.status(400).json({ message: 'Missing ID or password' });
    }

    const sql = 'SELECT * FROM user WHERE id = ?';
    conn.query(sql, [id], (error, results) => {
        if (error) {
            console.error('Database error:', error);
            return res.status(500).json({ message: 'Database error' });
        }
        if (results.length === 0 || results[0].password !== password) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        req.session.userId = results[0].id;
        res.status(200).json({ message: 'Login successful' });
    });
});

// Get client data
app.get('/client', (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ message: 'Please log in' });
    }

    const sql = 'SELECT name, amount, date FROM client WHERE id = ?';
    conn.query(sql, [req.session.userId], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Database error' });
        }
        if (result.length === 0) {
            return res.status(404).json({ message: 'Client not found' });
        }
        res.status(200).json(result[0]);
    });
});

// Add new client
app.post('/clients', (req, res) => {
    const { name, amount, AmountPaid, date } = req.body;

    if (!name || !amount || AmountPaid == null || !date) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    const id = name.split(' ').slice(0, 2).join('').toLowerCase();
    const sql =
        'INSERT INTO client (name, id, password, amount, AmountPaid, date) VALUES (?, ?, ?, ?, ?, ?)';
    conn.query(sql, [name, id, id, amount, AmountPaid, date], (error) => {
        if (error) {
            console.error('Database error:', error);
            return res.status(500).json({ message: 'Error adding client' });
        }
        res.status(201).json({ message: 'Client added successfully', id, name, amount });
    });
});

// Update client
app.put('/clients/update', (req, res) => {
    const { name, amount, newName, dueDate } = req.body;

    if (!name || amount == null || !newName || !dueDate) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    const sql = 'UPDATE client SET name = ?, amount = ?, date = ? WHERE name = ?';
    conn.query(sql, [newName, amount, dueDate, name], (error, results) => {
        if (error) {
            console.error('Database error:', error);
            return res.status(500).json({ message: 'Database error' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Client not found' });
        }
        res.status(200).json({ message: 'Client updated successfully' });
    });
});

// File upload route
app.post('/uploads', upload.single('file'), async (req, res) => {
    const { file } = req;
    if (!file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    const fileKey = `${Date.now()}-${file.originalname}`;

    try {
        console.log("Uploading file to S3:", fileKey, file.mimetype);  // Debugging line

        const uploadParams = {
            Bucket: bucketName,  // Ensure bucket name is loaded from .env
            Key: fileKey,
            Body: file.buffer,
            ContentType: file.mimetype,
        };

        // Check if the uploadParams are correct
        console.log("S3 Upload Params:", uploadParams);

        await s3Client.send(new PutObjectCommand(uploadParams));
        const fileUrl = `https://${bucketName}.s3.amazonaws.com/${fileKey}`;

        const sql = 'INSERT INTO uploads (image_url) VALUES (?)';
        conn.query(sql, [fileUrl], (error) => {
            if (error) {
                console.error('MySQL Insert Error:', error);
                return res.status(500).json({ message: 'Error saving file URL' });
            }
            res.status(200).json({ url: fileUrl });
        });
    } catch (err) {
        console.error('S3 Upload Error:', err);
        res.status(500).json({ message: 'Error uploading file to S3' });
    }
});
