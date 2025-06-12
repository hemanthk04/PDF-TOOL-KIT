const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const PDFMerger = require("pdf-merger-js"); // Try this first

const upload = multer({ dest: "uploads/" });

router.post("/", upload.array("pdfs"), async (req, res) => {
  console.log("Merge request received");
  console.log("Number of files:", req.files ? req.files.length : 0);

  if (!req.files || req.files.length === 0) {
    console.log("No files received");
    return res.status(400).send("No files uploaded");
  }

  // Try different ways to create PDFMerger instance
  let merger;
  try {
    merger = new PDFMerger.default(); // For newer versions
  } catch (err) {
    try {
      merger = new PDFMerger(); // For older versions
    } catch (err2) {
      merger = PDFMerger(); // Some versions don't need 'new'
    }
  }

  try {
    console.log("Starting merge process...");

    for (const file of req.files) {
      console.log("Adding file:", file.originalname || file.filename);
      await merger.add(file.path);
    }

    // Create merged directory if it doesn't exist
    const mergedDir = path.join(__dirname, "../merged");
    if (!fs.existsSync(mergedDir)) {
      console.log("Creating merged directory");
      fs.mkdirSync(mergedDir, { recursive: true });
    }

    const outputPath = path.join(mergedDir, `merged_${Date.now()}.pdf`);
    console.log("Saving to:", outputPath);

    await merger.save(outputPath);
    console.log("Merge completed successfully");

    res.download(outputPath, "merged.pdf", (err) => {
      if (err) {
        console.error("Download error:", err);
      } else {
        console.log("Download completed");
      }

      // Clean up uploaded files
      req.files.forEach((f) => {
        try {
          fs.unlinkSync(f.path);
        } catch (e) {
          console.error("Error deleting temp file:", e);
        }
      });

      // Clean up merged file
      try {
        fs.unlinkSync(outputPath);
      } catch (e) {
        console.error("Error deleting merged file:", e);
      }
    });
  } catch (err) {
    console.error("Merge error:", err);
    res.status(500).send(`Failed to merge PDFs: ${err.message}`);
  }
});

module.exports = router;
