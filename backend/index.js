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
