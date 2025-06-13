const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

const upload = multer({ dest: "uploads/" });

router.post("/", upload.single("pdf"), (req, res) => {
  const file = req.file;
  const password = req.body.password;

  if (!file || !password) {
    return res.status(400).send("PDF file and password are required.");
  }

  const inputPath = file.path;
  const outputPath = path.join(
    __dirname,
    "../protected",
    `protected_${Date.now()}.pdf`
  );

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });

  // ✅ This is the fixed command
  const command = `qpdf --password= --encrypt "${password}" "${password}" 256 -- "${inputPath}" "${outputPath}"`;

  exec(command, (error, stdout, stderr) => {
    fs.unlinkSync(inputPath);

    if (error) {
      console.error("Encryption failed:", error);
      console.error("stderr:", stderr);
      return res.status(500).send(`Failed to protect PDF: ${stderr}`);
    }

    res.download(outputPath, "protected.pdf", () => {
      fs.unlinkSync(outputPath);
    });
  });
});

module.exports = router;
