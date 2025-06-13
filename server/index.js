const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/merge", require("./routes/merge"));
app.use("/api/lock", require("./routes/lock"));

// ⏳ Add more routes here as you build them
// app.use("/api/image-to-pdf", require("./routes/imageToPdf"));
// app.use("/api/pdf-to-zip", require("./routes/pdfCompressor"));

app.get("/", (req, res) => {
  res.send("🚀 PDF ToolKit API is running");
});

app.listen(PORT, () =>
  console.log(`✅ Server running at: http://localhost:${PORT}`)
);
