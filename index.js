const express = require("express");
const mysql = require("mysql");
const dotenv = require("dotenv");
const path = require("path");
const app = express();
const cors = require('cors');

const port = process.env.PORT || 3036;

// Load environment variables
dotenv.config();

app.use(cors());

// MySQL connection
const db = mysql.createConnection({
    host: process.env.NITHRA_DB_HOST,
    user: process.env.NITHRA_DB_USER,
    password: process.env.NITHRA_DB_PASSWORD,
    database: process.env.NITHRA_DB_NAME,
});

db.connect((err) => {
    if (err) {
        console.error("Database connection failed:", err.stack);
        return;
    }
    console.log("Connected to Calendar database.");
});

// Serve static files (index.html and others) from the "public" folder
app.use(express.static(path.join(__dirname, "public")));

// Chatbot Keywords API
app.get("/chatbot_keywords", (req, res) => {
    const query = `
        SELECT 
            ROW_NUMBER() OVER(ORDER BY cdate) AS sno, 
            keyword AS userMessage, 
            bot_reply AS botMessage, 
            deviceid AS deviceId, 
            cdate AS date, 
            platform, 
            deviceinfo AS deviceInfo 
        FROM chatbot_keywords`;

    db.query(query, (err, results) => {
        if (err) {
            console.error("Error executing query:", err);
            res.status(500).json({ error: "Error retrieving data" });
            return;
        }
        res.json(results);
    });
});

// // Start the server
// app.listen(port, () => {
//     console.log(`Server running at http://192.168.58.103:${port}`);
// });


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});


