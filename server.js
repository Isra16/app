const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(bodyParser.json({ type: 'application/json' }));
app.use(bodyParser.urlencoded({ extended: true }));

// Create MySQL connection
const conn = mysql.createConnection({
    host: 'database-1.czyq0i2sme25.us-east-1.rds.amazonaws.com',
    port: '3306',
    user: 'admin',
    password: 'Softix$123',
    database: 'my_db'
});

// Start the server
const server = app.listen(808, function () {
    const host = server.address().address || 'localhost';
    const port = server.address().port;
    console.log(`Server started at http://${host}:${port}`);
});

// Connect to MySQL database
conn.connect((error) => {
    if (error) {
        console.error('Error connecting to the database:', error);
    } else {
        console.log('Connected to the database');
    }
});

// Fetch a specific client
app.get('/client', (req, res) => {
    const query = 'SELECT name, amount, date FROM client WHERE name = "John Doe"';
    conn.query(query, (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        if (result.length === 0) {
            return res.status(404).json({ message: 'Client not found' });
        }
        res.json(result[0]);
    });
});

// User login
app.post('/login', (req, res) => {
    const { id, password } = req.body;
    console.log('Received user data for login:', req.body);

    const sql = 'SELECT * FROM users WHERE id = ?';
    conn.query(sql, [id], (error, results) => {
        if (error) {
            console.error('Error querying database:', error);
            return res.status(500).json({ message: 'Error during authentication' });
        }

        if (results.length > 0) {
            const user = results[0];
            if (password === user.password) {
                console.log('User authenticated:', user);
                res.status(200).json({ message: 'Login successful', user: { id: user.id } });
            } else {
                console.log('Authentication failed: Invalid credentials');
                res.status(401).json({ message: 'Invalid credentials' });
            }
        } else {
            console.log('Authentication failed: User not found');
            res.status(401).json({ message: 'Invalid credentials' });
        }
    });
});

// Update user password
app.put('/users', (req, res) => {
    const { id, oldPassword, newPassword } = req.body;
    console.log(`Received request to update password for user ID: ${id}`);

    const fetchUserSql = 'SELECT * FROM users WHERE id = ?';
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

        const updatePasswordSql = 'UPDATE users SET password = ? WHERE id = ?';
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

// Fetch all clients
app.get("/clients", (req, res) => {
    conn.query("SELECT * FROM client", (error, rows) => {
        if (error) {
            console.error('Error fetching data:', error);
            return res.status(500).json({ message: 'Error fetching data' });
        }
        res.status(200).json(rows);
    });
});

// Add a new client
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

// Update client information
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

// Delete a client
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

// Catch-all route for handling 404 errors
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

// Error-handling middleware for JSON responses
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});
