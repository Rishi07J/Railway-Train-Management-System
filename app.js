const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");

const app = express();
const port = 3000;

// Middleware
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// MySQL Connection
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "0731", 
    database: "railway_reservation"
});

connection.connect((err) => {
    if (err) {
        console.error("Error connecting to database:", err);
        return;
    }
    console.log("Connected to the database");
});

// Serve the home page
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/home.html");
});

// Serve the admin dashboard
app.get("/admin-dashboard", (req, res) => {
    res.sendFile(__dirname + "/public/admin-dashboard.html");
});

// Serve the user dashboard
app.get("/user-dashboard", (req, res) => {
    res.sendFile(__dirname + "/public/user-dashboard.html");
});

// Handle login form submission
app.post("/login", (req, res) => {
    const { username, password } = req.body;

    
    if (username === "admin" && password === "admin123") {
        // Redirect admin to admin dashboard
        res.redirect("/admin-dashboard");
    } else if (username === "user" && password === "user123") {
        // Redirect user to user dashboard
        res.redirect("/user-dashboard");
    } else {
        // Invalid credentials, redirect back to home page with error message
        res.redirect("/?error=1");
    }
});

// Add Train Route
app.post("/add-train", (req, res) => {
    const { train_name, source_station, destination_station, departure_time, arrival_time } = req.body;
    const sql = "INSERT INTO trains (train_name, source_station, destination_station, departure_time, arrival_time) VALUES (?, ?, ?, ?, ?)";
    connection.query(sql, [train_name, source_station, destination_station, departure_time, arrival_time], (err, result) => {
        if (err) {
            console.error("Error adding train:", err);
            res.status(500).send("Error adding train");
            return;
        }
        console.log("New train added:", result);
        
    });
});

// Delete Train Route
app.delete("/delete-train/:id", (req, res) => {
    const trainId = req.params.id;
    const sql = "DELETE FROM trains WHERE id = ?";
    connection.query(sql, [trainId], (err, result) => {
        if (err) {
            console.error("Error deleting train:", err);
            res.status(500).send("Error deleting train");
            return;
        }
        console.log("Train deleted:", result);
        res.sendStatus(200);
    });
});

// Fetch All Trains Route
app.get("/all-trains", (req, res) => {
    const sql = "SELECT * FROM trains";
    connection.query(sql, (err, results) => {
        if (err) {
            console.error("Error fetching trains:", err);
            res.status(500).send("Error fetching trains");
            return;
        }
        res.json(results);
    });
});

// Update Train Route
app.put("/update-train/:id", (req, res) => {
    const trainId = req.params.id;
    const { train_name, source_station, destination_station, departure_time, arrival_time } = req.body;
    const sql = "UPDATE trains SET train_name=?, source_station=?, destination_station=?, departure_time=?, arrival_time=? WHERE id=?";
    connection.query(sql, [train_name, source_station, destination_station, departure_time, arrival_time, trainId], (err, result) => {
        if (err) {
            console.error("Error updating train:", err);
            res.status(500).send("Error updating train");
            return;
        }
        console.log("Train updated:", result);
        res.sendStatus(200);
    });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
