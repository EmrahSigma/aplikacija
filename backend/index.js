const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // ← empty string!
  database: 'piercing_store',
});


app.get('/piercings', (req, res) => {
  db.query('SELECT * FROM piercings', (err, result) => {
    if (err) return res.status(500).send(err);
    res.json(result);
  });
});

app.listen(3000, () => console.log('Backend running on http://localhost:3000'));
// Sign up route
app.post('/signup', (req, res) => {
  const { ime, priimek, email, password } = req.body;
  const role = 0; // default user

  if (!ime || !priimek || !email || !password) {
    return res.status(400).json({ message: 'Fill in all fields' });
  }

  const query = 'INSERT INTO uporabniki (ime, priimek, email, password, role) VALUES (?, ?, ?, ?, ?)';
  db.query(query, [ime, priimek, email, password, role], (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ message: 'Email already exists' });
      }
      return res.status(500).json({ message: 'Database error', error: err });
    }

    res.status(200).json({ message: 'User registered successfully' });
  });
});

// Sign in route
app.post('/signin', (req, res) => {
  const { email, password } = req.body;

  const query = 'SELECT * FROM uporabniki WHERE email = ? AND password = ?';
  db.query(query, [email, password], (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' });

    if (results.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const user = results[0];
    // Don’t send password back
    delete user.password;

    res.status(200).json({ message: 'Login successful', user });
  });
});

