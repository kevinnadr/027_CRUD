const express = require('express');
let mysql = require("mysql2");
const app = express();
const port = 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Kevinnadr123",
  database: "biodata",
  port: 3308
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to database:" + err.stack);
    return;
  }
    console.log("Connection to database successful");
});

app.get('/api/users', (req, res) => {
    db.query("SELECT * FROM mahasiswa", (err, results) => {
        if (err) {
            console.error("Error retrieving users:" + err.stack);
            res.status(500).send("Error fetching users");
            return;
        }
        res.json(results);
    });
});

app.post('/api/users', (req, res) => {
    const { nama, nim, kelas } = req.body;

    if (!nama || !nim || !kelas) {
        return res.status(400).send("All fields are required");
        
    }

    db.query(
        "INSERT INTO mahasiswa (nama, nim, kelas) VALUES (?, ?, ?)",
        [nama, nim, kelas], 
        (err, results) => {
         if (err) {
                console.error(err);
                return res.status(500).json({ Message: "database error" });
            }
            res.status(201).json({ Message: "User created successfully" });
        }
    );
});

app.put('/api/users/:id', (req, res) => {
    const userId = req.params.id;
    const { nama, nim, kelas } = req.body; 
    
    db.query(
        "UPDATE mahasiswa SET nama = ?, nim = ?, kelas = ? WHERE id = ?",
        [nama, nim, kelas, userId],
        (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ Message: "database error" });
            }
            res.json({ Message: "User updated successfully" });
        }
    );
});

