import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/home';
import Merge from './pages/merge';
import Lock from './pages/locked';
import ImageToPDF from './pages/imagetopdf';
import PDFtoZIP from './pages/pdfcompressor';

import './App.css'

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/merge" element={<Merge />} />
        <Route path="/lock" element={<Lock />} />
        <Route path="/image-to-pdf" element={<ImageToPDF />} />
        <Route path="/pdf-to-zip" element={<PDFtoZIP />} />
      </Routes>
    </Router>
  );
}

export default App
