import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function UploadView() {
  const [fileContent, setFileContent] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();


  useEffect(() => {
    const nav = navigate;

    const verifyToken = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            nav("/");
        }
    
        try {
            const response = await fetch(`http://localhost:8000/verify-token/${token}`, {
                method: "GET",
            });
    
            if (response.ok) {
                return;
            } else {
                nav("/");
            }
        } catch (error) {
            console.error("Er is een fout opgetreden bij het verifiëren van de token: ", error)
            nav("/");
        }
      };

    verifyToken();
  }, []);

  // Functie om bestand te verwerken wanneer het geselecteerd wordt
  const handleFile = (file) => {
    if (file && file.type === 'application/json') {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const content = JSON.parse(event.target.result);
          setFileContent(content);
          setError(null);
        } catch (err) {
          setError("Er is een fout opgetreden bij het lezen van het JSON-bestand.");
          setFileContent(null);
        }
      };
      reader.readAsText(file);
    } else {
      setError("Selecteer een geldig JSON-bestand.");
      setFileContent(null);
    }
  };



  // Functie voor bestand uit de verkenner
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    handleFile(file);
  };

  // Functie voor bestand drag-and-drop
  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    handleFile(file);
  };

  return (
    <div 
      onDrop={handleDrop}
      onDragOver={(event) => event.preventDefault()}
      style={{
        border: '2px dashed #cccccc',
        padding: '50px',
        textAlign: 'center',
        borderRadius: '8px',
        marginBottom: '20px',
        color: '#777',
        margin: "20px",
      }}
    >
      <p>Sleep je JSON-bestand hierheen of</p>
      <label style={{ cursor: 'pointer', color: '#007bff' }}>
        <input 
          type="file" 
          accept=".json" 
          onChange={handleFileSelect} 
          style={{ display: 'none' }} 
        />
        klik om een bestand te selecteren
      </label>
      
      {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}

      {fileContent && (
        <pre style={{
          background: '#f8f8f8', 
          padding: '20px', 
          borderRadius: '5px', 
          textAlign: 'left', 
          marginTop: '20px'
        }}>
          {JSON.stringify(fileContent, null, 2)}
        </pre>
      )}
    </div>
  );
}

export default UploadView;
