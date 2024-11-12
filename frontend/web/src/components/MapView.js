import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import sharedData from '../../../shared/data';
import 'leaflet/dist/leaflet.css';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import treeLogo from '../../../shared/images/tree-icon.png'

const treeIcon = L.icon({
    iconUrl: treeLogo,  // URL van de afbeelding die je wilt gebruiken
    iconSize: [40, 40],      // Afmetingen van het icoon (aanpassen indien gewenst)
    iconAnchor: [16, 32],    // Punt waarop het icoon verankerd is (meestal het midden-onder
    popupAnchor: [0, -32]    
});


const MapView = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const verifyToken = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;

            try {
                const baseUrl = process.env.REACT_APP_EXTERNAL_IP || 'localhost';
                const response = await fetch(`http://${baseUrl}:8000/verify-token/${token}`, {
                    method: 'GET',
                });

                if (response.ok) {
                    setIsAuthenticated(true);
                } else {
                    setIsAuthenticated(false);
                }
            } catch (error) {
                console.error("Er is een fout opgetreden bij het verifiëren van de token:", error);
                setIsAuthenticated(false);
            }
        };

        verifyToken();
    }, []);

    // Navigeren naar de uploadpagina
    const handleUploadClick = () => {
        navigate("/upload");
    };

    return (
        <div style={{ position: 'relative', height: '100vh', width: '100%' }}>
            <MapContainer center={[50.95306, 5.352692]} zoom={13} style={{ height: "100%", width: "100%" }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                />
                {sharedData.map(tree => (
                    <Marker key={tree.id} position={[tree.latitude, tree.longitude]} icon={treeIcon}>
                        <Popup>
                            <strong>{tree.title}</strong><br />{tree.description}
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>

            {/* Uploadknop weergeven als de gebruiker ingelogd is */}
            {isAuthenticated && (
                <button
                    onClick={handleUploadClick}
                    style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        padding: '10px 20px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontSize: '16px',
                        zIndex: 1000
                    }}
                >
                    Upload Bestand
                </button>
            )}
        </div>
    );
};

export default MapView;
