const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 5000;

// Routes
app.use("/api/merge", require("./routes/merge"));
// app.use("/api/lock", require("./routes/lock"));
// app.use("/api/image-to-pdf", require("./routes/imagetoPdf"));
// app.use("/api/pdf-to-zip", require("./routes/pdfcompressor"));

app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`)
);
