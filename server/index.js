const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const PDFMerger = require("pdf-merger-js");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const upload = multer({ dest: "uploads/" });

app.post("/api/merge", upload.array("pdfs"), async (req, res) => {
  const merger = new PDFMerger();

  try {
    for (let file of req.files) {
      await merger.add(file.path);
    }

    const outputPath = path.join(__dirname, "merged", "merged.pdf");
    await merger.save(outputPath);

    res.download(outputPath, "merged.pdf", () => {
      // Cleanup
      req.files.forEach((f) => fs.unlinkSync(f.path));
      fs.unlinkSync(outputPath);
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error merging PDFs.");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
