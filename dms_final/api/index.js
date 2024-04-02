const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

dotenv.config();
mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGO_URL, () => {
  console.log("Connected to MongoDB");
});

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

// File storage setup using Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.resolve(__dirname, "public/uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

// Middleware
app.use(express.json());
app.use(morgan("common"));
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use("/images", express.static(path.join(__dirname, "public/images")));
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

const { spawn } = require('child_process');

app.post("/api/upload", upload.single("file"), (req, res) => {
  const pythonProcess = spawn("python", [
    path.resolve(__dirname, "pdf_reader.py"),
    path.resolve(__dirname, "public/uploads", req.file.originalname),
  ]);

  let responseSent = false;

  pythonProcess.stdout.on("data", (data) => {
    const output = data.toString().trim();
    const dateMatch = output.match(/Extracted Date: (.+)/);
    const glucoseMatch = output.match(/Extracted Glucose Level: (\d+)/);
  
    if (dateMatch && glucoseMatch) {
      const date = dateMatch[1];
      const glucoseLevel = parseInt(glucoseMatch[1]);
  
      // Handle the extracted data as needed
      console.log("Extracted Date:", date);
      console.log("Extracted Glucose Level:", glucoseLevel);
  
      // Send a response to the client or perform other actions
      res.status(200).json({ date, glucoseLevel });
    } else {
      console.error("Error extracting data from Python script");
      res.status(500).json({ error: "Error extracting data from Python script" });
    }
  });

  pythonProcess.stderr.on("data", (data) => {
    console.error(`Error extracting data from the PDF: ${data}`);
    if (!responseSent) {
      res.status(500).json({ error: "Error extracting data from the PDF" });
      responseSent = true;
    }
  });
});

// Routes
app.use("/api/auth", require('./routes/auth'));
app.use('/api/randomcount', require('./routes/randomcount'));
app.use('/api/fastingcount', require('./routes/fastingcount'));

// Server setup
app.listen(8800, () => {
  console.log("Backend server is running");
});
