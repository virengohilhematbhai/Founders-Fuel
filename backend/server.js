const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");

dotenv.config();
connectDB();

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:3000",
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: true,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/jobs", require("./routes/jobRoutes"));
app.use("/api/contact", require("./routes/contactRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/projects", require("./routes/projectRoutes"));
app.use("/api/chat", require("./routes/chatRoutes"));
app.use("/api/message", require("./routes/messageRoutes"));
app.use("/api/feedback", require("./routes/feedbackRoutes"));
app.use("/api/users", require("./routes/userRoutes"));

// Serve uploads statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({ success: true, message: "FoundersFuel API is running" });
});

// Serve frontend statically only if dist exists
const fs = require("fs");
const distPath = path.join(__dirname, "../frontend/dist");
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get("*", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
} else {
  // API-only mode (Render deployment without frontend build)
  app.use("/api", (req, res) => {
    res.status(404).json({ success: false, message: `API Route ${req.originalUrl} not found` });
  });
  app.get("*", (req, res) => {
    res.status(200).json({ success: true, message: "FoundersFuel API Server is running. Frontend is deployed separately on Vercel." });
  });
}

// Error handler must be LAST (4 params)
app.use(errorHandler);

const PORT = process.env.PORT || 5001;
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📦 Environment: ${process.env.NODE_ENV}`);
});

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: allowedOrigins,
  },
});

io.on("connection", (socket) => {
  console.log("Connected to socket.io");

  // Setup user with their own room so they can receive private notifications
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });

  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;

    if (!chat || !chat.users) return console.log("chat.users not defined");

    // send message to all other participants
    chat.users.forEach((user) => {
      // if it's the sender, don't ping them back
      if (user._id == newMessageRecieved.sender._id) return;
      if (user == newMessageRecieved.sender._id) return;

      socket.in(user._id || user).emit("message recieved", newMessageRecieved);
    });
  });

  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});