import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar/Navbar';

function UploadView() {
  const [fileContent, setFileContent] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();


  useEffect(() => {
    const verifyToken = async () => {
      const token = sessionStorage.getItem("token");
      if (!token) {
        navigate("/");
      }

      try {
        const baseUrl = process.env.REACT_APP_EXTERNAL_IP || 'http://localhost:8000';
        const response = await fetch(`${baseUrl}/verify-token/${token}`, {
          method: "GET",
        });

        if (response.ok) {
          return;
        } else {
          navigate("/");
        }
      } catch (error) {
        console.error("Er is een fout opgetreden bij het verifiëren van de token: ", error)
        navigate("/");
      }
    };

    verifyToken();
  }, [navigate]);

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
    <div style={{
      backgroundColor: "#f0eee4", 
      height: "100vh",
      display: 'flex',
      flexDirection: 'column'
    }}>
      <Navbar />
      <div style={{
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px'
      }}>
        <div
          onDrop={handleDrop}
          onDragOver={(event) => event.preventDefault()}
          style={{
            border: '10px dashed #cccccc',
            padding: '50px',
            textAlign: 'center',
            borderRadius: '8px',
            color: '#777',
            width: "50%",
            height: "50%",
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
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
              marginTop: '20px',
              maxWidth: '100%',
              overflowX: 'auto'
            }}>
              {JSON.stringify(fileContent, null, 2)}
            </pre>
          )}
        </div>
      </div>
    </div>
  );

}

export default UploadView;
