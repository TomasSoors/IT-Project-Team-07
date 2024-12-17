import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import data from '../../../shared/data';
import Navbar from './Navbar/Navbar';

function UploadView() {
  const [errors, setErrors] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyToken = async () => {
      const token = sessionStorage.getItem("token");
      if (!token) {
        return navigate("/");
      }
      const baseUrl = process.env.REACT_APP_EXTERNAL_IP || 'http://localhost:8000';
      const response = await fetch(`${baseUrl}/verify-token/${token}`, {
        method: "GET",
      });

      if (!response.ok) {
        navigate("/");
      }
    };

    verifyToken();
  }, [navigate]);

  const handleFile = (file) => {
    setErrors([]);
  
    if (file && file.name.toLowerCase().endsWith('.geojson')) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const geojson = JSON.parse(event.target.result);
          const token = sessionStorage.getItem("token");
  
          if (!token) {
            setErrors(["Authenticatie vereist. Log opnieuw in."]);
            navigate("/");
            return;
          }
  
          if (geojson.type !== "FeatureCollection" || !Array.isArray(geojson.features)) {
            setErrors(["Ongeldig GeoJSON-bestand. Verwachte 'FeatureCollection'."]);
            return;
          }
  
          const newErrors = [];
          const validTrees = [];
  
          geojson.features.forEach((feature, index) => {
            const treeErrors = [];
  
            const { geometry, properties } = feature;
  
            if (!geometry || geometry.type !== "Point" || !Array.isArray(geometry.coordinates) || geometry.coordinates.length !== 2) {
              treeErrors.push(`Feature ${index}: Ongeldige geometrie. Verwachte type 'Point'.`);
            }
  
            const [latitude, longitude] = geometry.coordinates;
            if (typeof latitude !== 'number' || typeof longitude !== 'number') {
              treeErrors.push(`Feature ${index}: Coördinaten zijn ongeldig.`);
            }
  
            const treeName = properties?.tree_id;
            if (!treeName) {
              treeErrors.push(`Feature ${index}: 'tree_id' ontbreekt in properties.`);
            }
  
            if (treeErrors.length > 0) {
              newErrors.push(...treeErrors);
            } else {
              validTrees.push({
                name: `Tree ${treeName}`,
                description: `N.v.t`,
                latitude,
                longitude,
              });
            }
          });
  
          setErrors(newErrors);
  
          if (newErrors.length === 0 && validTrees.length > 0) {
            try {
              for (const tree of validTrees) {
                await data.addTree(tree, token);
              }
              console.log("Alle bomen succesvol toegevoegd vanuit GeoJSON.");
              navigate('/map');
            } catch (apiError) {
              console.error("Fout bij het toevoegen van bomen:", apiError);
              setErrors(["Er is een fout opgetreden bij het toevoegen van bomen."]);
            }
          }
        } catch (err) {
          console.error("GeoJSON parsing error:", err);
          setErrors(["Fout bij het verwerken van het GeoJSON-bestand."]);
        }
      };
      reader.readAsText(file);
    } else {
      setErrors(['Selecteer een geldig GeoJSON-bestand.']);
    }
  };  

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    handleFile(file);
  };

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
      flexDirection: 'column',
    }}>
      <Navbar />
      <div style={{
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
        overflow: 'hidden'
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
            alignItems: 'center',
          }}
        >
          <p>Sleep je GeoJSON-bestand hierheen of</p>
          <label style={{ cursor: 'pointer', color: '#007bff' }}>
            <input
              type="file"
              accept=".geojson"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />
            klik om een bestand te selecteren
          </label>

          {errors.length > 0 && (
            <ul style={{ color: 'red', textAlign: 'left', overflowX: 'auto' }}>
              {errors.map((error) => (
                <li key={error}>{error}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default UploadView;
