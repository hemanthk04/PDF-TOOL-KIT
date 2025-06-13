import React, { useState } from "react";
import { Lock, Trash, GithubLogoIcon } from "@phosphor-icons/react";

const Locked = () => {
  const [file, setFile] = useState(null);
  const [password, setPassword] = useState("");
  const [lockedInfo, setLockedInfo] = useState(null);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected && selected.type === "application/pdf") {
      setFile(selected);
      setLockedInfo(null);
    }
  };

  const handleLock = async () => {
    if (!file || !password) {
      alert("Upload a PDF and enter a password.");
      return;
    }

    const formData = new FormData();
    formData.append("pdf", file);
    formData.append("password", password);

    try {
      const response = await fetch("http://localhost:5000/api/lock", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "protected.pdf";
        document.body.appendChild(a);
        a.click();
        URL.revokeObjectURL(url);
        document.body.removeChild(a);

        setLockedInfo({ name: "protected.pdf" });
      } else {
        const text = await response.text();
        alert(`Failed to lock PDF: ${text}`);
      }
    } catch (err) {
      alert("Network error: " + err.message);
    }
  };

  const removeFile = () => {
    setFile(null);
    setLockedInfo(null);
  };

  return (
    <div className="min-h-screen bg-white p-6">
      {/* Header */}
      <div className="flex w-full justify-between items-center px-4 font-bold text-xl mb-12">
        <a href="/" className="text-green-700">
          PDF Tool Kit
        </a>
        <a
          href="https://github.com/hemanthk04/"
          className="bg-green-700 rounded-full p-2 hover:scale-110 transition-all duration-300"
        >
          <GithubLogoIcon size={28} color="white" />
        </a>
      </div>

      {/* Input Files Box */}
      <div className="bg-gray-100 p-6 max-w-3xl mx-auto rounded-xl">
        <h2 className="text-md font-bold text-center mb-6">
        </h2>

        {file ? (
          <div className="flex justify-center">
            <div className="bg-lime-200 rounded-xl w-72 h-16 px-4 flex justify-center items-center relative overflow-hidden">
              <span className="text-sm font-semibold truncate w-full text-center">
                {file.name}
              </span>
              <button
                className="absolute top-2 right-2 text-black"
                onClick={removeFile}
              >
                <Trash size={16} />
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center font-medium text-gray-600">
            Click to upload PDF
          </div>
        )}

        {/* Upload Input */}
        <div className="text-center mt-4">
          <label className="cursor-pointer text-xs inline-flex items-center gap-1 text-white bg-[#222] py-2 px-4 rounded-full hover:bg-opacity-80">
            <Lock size={16} />
            Upload PDF
            <input
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        </div>

        {/* Password Input */}
        <div className="text-center mt-6">
          <input
            type="password"
            placeholder="Enter password to this PDF"
            className="border border-gray-400 bg-white text-center text-xs px-3 py-4 rounded  w-72 focus:outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </div>

      {/* Lock Action */}
      <div className="mt-10 text-center">
        <h2 className="text-md font-bold mb-4">Protected File</h2>

        {lockedInfo ? (
          <button
            className="bg-lime-200 rounded-xl w-72 h-16 mx-auto flex justify-center items-center hover:scale-105 transition"
            onClick={handleLock}
          >
            <span className="text-sm font-semibold">{lockedInfo.name}</span>
          </button>
        ) : (
          <button
            className="bg-lime-200 rounded-xl w-72 h-16 mx-auto font-semibold hover:scale-105 transition"
            onClick={handleLock}
          >
            Click to Lock PDF
          </button>
        )}
      </div>

      {/* Footer */}
      <div className="mt-16 text-center">
        <a
          className="text-sm bg-green-800 rounded-full font-medium px-4 py-2 text-white hover:scale-110 transition-all duration-300"
          href="https://github.com/hemanthk04"
        >
          Made by Hemanth
        </a>
      </div>
    </div>
  );
};

export default Locked;
