const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;
require('dotenv').config();
app.use(bodyParser.urlencoded({ extended: false }));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD, 
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    ssl: { rejectUnauthorized: false }
  });

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err.stack);
    return;
  }
  console.log('Connected to MySQL');
});

app.get('/', (req, res) => {
  res.render('index');
});

app.post('/register', (req, res) => {
  const { name, address } = req.body;

  const userQuery = 'INSERT INTO users (name) VALUES (?)';
  db.query(userQuery, [name], (err, userResult) => {
    if (err) {
      return res.status(500).send('Error creating user.');
    }

    const userId = userResult.insertId;

    const addressQuery = 'INSERT INTO addresses (user_id, address) VALUES (?, ?)';
    db.query(addressQuery, [userId, address], (err) => {
      if (err) {
        return res.status(500).send('Error creating address.');
      }

      res.send('User and address successfully created.');
    });
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
