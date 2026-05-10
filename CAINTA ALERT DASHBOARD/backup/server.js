const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const SECRET = "cainta-secret";

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

/* ---------------- AUTH ---------------- */
app.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (username === "admin" && password === "1234") {
        const token = jwt.sign({ user: username }, SECRET, { expiresIn: "1h" });
        return res.json({ token });
    }

    res.status(401).json({ error: "Invalid credentials" });
});

/* ---------------- MOCK API ---------------- */
app.get("/api/status", (req, res) => {
    res.json({
        flood: Math.random() > 0.7 ? "HIGH" : "SAFE",
        fire: Math.random() > 0.8 ? "DANGER" : "NORMAL",
        quake: Math.random() > 0.9 ? "ACTIVE" : "STABLE"
    });
});

/* ---------------- SOCKET REALTIME ---------------- */
io.on("connection", (socket) => {
    console.log("Client connected");

    setInterval(() => {
        const alert = {
            type: "quake",
            level: Math.random() > 0.8 ? "HIGH" : "LOW",
            lat: 14.58 + Math.random() * 0.1,
            lng: 121.17 + Math.random() * 0.1
        };

        socket.emit("alert", alert);
    }, 5000);
});

server.listen(3000, () => console.log("Server running on http://localhost:3000"));