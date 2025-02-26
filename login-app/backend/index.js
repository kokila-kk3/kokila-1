const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

// MySQL Connection
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// Check connection
connection.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err.stack);
    return;
  }
  console.log('Connected to MySQL database');
});

// Create table if not exists
const createTableQuery = `
  CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
  );
`;
connection.query(createTableQuery, (err, results) => {
  if (err) throw err;
  console.log('User table ready');
});

// Handle login form submission
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const insertQuery = `INSERT INTO users (username, password) VALUES (?, ?)`;
  connection.query(insertQuery, [username, password], (err, results) => {
    if (err) throw err;
    res.send('Login successful! User data saved to database.');
  });
});

app.listen(5000, () => {
  console.log('Backend is running on http://localhost:5000');
});

