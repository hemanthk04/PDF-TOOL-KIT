import React, { useState } from "react";
import { Plus, Trash, GithubLogoIcon } from "@phosphor-icons/react";

const Merge = () => {
  const [files, setFiles] = useState([]);
  const [mergedInfo, setMergedInfo] = useState(null);

  const getPDFPageCount = async (file) => {
    try {
      // Simple approach to estimate page count without pdfjs-dist
      const arrayBuffer = await file.arrayBuffer();
      const text = new TextDecoder().decode(arrayBuffer);
      const pageMatches = text.match(/\/Type\s*\/Page[^s]/g);
      return pageMatches ? pageMatches.length : 1;
    } catch {
      return "?";
    }
  };

  const handleFileChange = async (e) => {
    const newFiles = Array.from(e.target.files);

    const filesWithPages = await Promise.all(
      newFiles.map(async (file) => {
        try {
          const pages = await getPDFPageCount(file);
          return { file, name: file.name, pages };
        } catch {
          return { file, name: file.name, pages: "?" };
        }
      })
    );

    setFiles((prev) => [...prev, ...filesWithPages]);
  };

  const handleMerge = () => {
    if (files.length < 2) {
      alert("Select at least two PDFs to merge.");
      return;
    }

    const totalPages = files.reduce(
      (sum, file) => sum + (typeof file.pages === "number" ? file.pages : 0),
      0
    );

    setMergedInfo({
      name: "Merged PDF",
      pages: totalPages,
    });
  };

  const downloadMergedFile = async () => {
    if (files.length < 2) {
      alert("No files to merge.");
      return;
    }

    try {
      const formData = new FormData();

      // Add all PDF files to FormData
      files.forEach((fileObj) => {
        formData.append("pdfs", fileObj.file);
      });

      console.log("Sending request to merge PDFs...");
      console.log("Request URL: http://localhost:5000/api/merge");
      console.log("Number of files:", files.length);

      // Backend is running on port 5000
      const response = await fetch("http://localhost:5000/api/merge", {
        method: "POST",
        body: formData,
        mode: "cors",
      });

      console.log("Response status:", response.status);

      if (response.ok) {
        console.log("Merge successful, downloading...");
        // Get the merged PDF as blob
        const blob = await response.blob();

        // Create download link
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "merged.pdf";
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        const errorText = await response.text();
        console.error("Server error:", errorText);
        alert(`Failed to merge PDFs: ${response.status} - ${errorText}`);
      }
    } catch (error) {
      console.error("Network error:", error);
      alert(`Network error: ${error.message}`);
    }
  };

  const removeFile = (index) => {
    const updated = [...files];
    updated.splice(index, 1);
    setFiles(updated);
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="flex w-full justify-between items-center px-4 font-bold text-xl mb-12">
        <a href="/" className="text-green-700 ">PDF Tool Kit</a>
        <a
          href="https://github.com/hemanthk04/"
          className="bg-green-700 rounded-full p-2 hover:scale-110 transition-all duration-300"
        >
          <GithubLogoIcon size={28} color="white" />
        </a>
      </div>

      {/* Input Files Box */}
      <div className="bg-gray-100 p-6 max-w-5xl mx-auto rounded-xl">
        <h2 className="text-md font-bold text-center mb-6">Input Files</h2>

        {files.length === 0 ? (
          <div className="text-center font-medium text-gray-600">Click to add PDFs</div>
        ) : (
          <div className="flex flex-wrap justify-center gap-4">
            {files.map((file, index) => (
              <div
                key={index}
                className="bg-lime-200 rounded-xl w-72 h-20 px-4 flex justify-center items-center relative overflow-hidden"
              >
                <span className="text-sm font-semibold truncate w-full text-center">
                  {file.name} ({file.pages} pages)
                </span>
                <button
                  className="absolute top-2 right-2 text-black"
                  onClick={() => removeFile(index)}
                >
                  <Trash size={16} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Upload Button */}
        <div className="text-center mt-8">
          <label className="cursor-pointer text-xs inline-flex items-center gap-1 text-white bg-[#222] py-2 px-4 rounded-full hover:bg-opacity-80">
            <Plus size={16} />
            Add PDFs
            <input
              type="file"
              accept="application/pdf"
              multiple
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        </div>
      </div>

      {/* Merged Output */}
      <div className="mt-10 text-center">
        <h2 className="text-md font-bold mb-4">Merged File</h2>

        {mergedInfo ? (
          <button
            className="bg-lime-200 rounded-xl w-72 h-16 mx-auto flex justify-between px-6 items-center hover:scale-105 transition"
            onClick={downloadMergedFile}
          >
            <span className=" text-sm font-semibold">{mergedInfo.name}</span>
            <span className="text-sm font-semibold">
              {mergedInfo.pages} pages
            </span>
          </button>
        ) : (
          <button
            className="bg-lime-200 rounded-xl w-72 h-16 mx-auto font-semibold font-bold hover:scale-105 transition"
            onClick={handleMerge}
          >
            Click to Merge files
          </button>
        )}
      </div>

      {/* Footer */}
      <div className="mt-16 text-center">
        <a
          className="mt-16 text-sm bg-green-800 rounded-full font-medium px-4 py-2 text-white hover:scale-110 transition-all duration-300 "
          href="https://github.com/hemanthk04"
        >
          Made by Hemanth
        </a>
      </div>
    </div>
  );
};

export default Merge;
