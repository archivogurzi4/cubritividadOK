import React, { useState } from 'react';
import axios from 'axios';

export default function Uploader({ onAnalysisComplete }) {
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type !== "application/pdf") {
        alert("Solo archivos PDF");
        return;
      }
      uploadFile(file);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      uploadFile(file);
    }
  };

  const uploadFile = async (file) => {
    setLoading(true);
    setSelectedFile(file);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const { data } = await axios.post("/analyze", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onAnalysisComplete(data);
    } catch (error) {
      console.error(error);
      alert("Error al procesar el archivo en el backend.");
      setLoading(false);
    }
  };

  return (
    <div className="uploader-container">
      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Analizando cubritividad (procesando capas)...</p>
          <p className="upload-text" style={{marginTop: '0.5rem', fontSize:'0.8rem'}}>{selectedFile?.name}</p>
        </div>
      ) : (
        <div 
          className={`dropzone ${dragActive ? "active" : ""}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => document.getElementById('file-input').click()}
        >
          <svg className="upload-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="17 8 12 3 7 8"></polyline>
            <line x1="12" y1="3" x2="12" y2="15"></line>
          </svg>
          <p>Arrastra tu archivo PDF pesado aquí</p>
          <p className="upload-text">o haz click para buscar</p>
          <input 
            id="file-input"
            type="file" 
            accept="application/pdf"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
        </div>
      )}
    </div>
  );
}
