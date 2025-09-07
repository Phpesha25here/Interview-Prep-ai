require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const connectDB = require("./config/db");

// Route imports
const authRoutes = require('./routes/authRoutes');
const sessionRoutes = require("./routes/sessionRoutes");
const questionRoutes = require("./routes/questionRoutes");
const aiRoutes = require("./routes/aiRoutes"); // ✅ Import aiRoutes

// Connect to database
connectDB();

// Initialize Express app
const app = express();

// Middlewares
app.use(cors({ origin: "*", methods: ["GET", "POST", "PUT", "DELETE"] }));
app.use(express.json());

// Ensure uploads folder exists
const uploadPath = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
}

// Static folder for uploaded images
app.use("/uploads", express.static(uploadPath));

// Routes
app.use('/api/auth', authRoutes);
app.use("/api/sessions", sessionRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/ai', aiRoutes); // ✅ Use aiRoutes for AI-related endpoints


// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
