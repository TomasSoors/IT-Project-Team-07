import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import sharedData from '../../../shared/data';
import 'leaflet/dist/leaflet.css';
import { useNavigate } from 'react-router-dom';


const MapView = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const verifyToken = async () => {
            const token = sessionStorage.getItem('token');
            if (!token) return;

            try {
                const response = await fetch(`http://localhost:8000/verify-token/${token}`, {
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
    const handleLogoutClick = async () => {
        console.log("Logging out...");
        try {
            const token = sessionStorage.getItem('token');
            await fetch(`http://localhost:8000/revoke-token/${token}`, {
                method: 'POST',
            });
            sessionStorage.removeItem('token');
            console.log("Token revoked successfully.");
        } catch (error) {
            console.error("Er is een fout opgetreden bij het revoken van de token:", error);
        }
    
        // Zet de authenticatiestatus naar false
        setIsAuthenticated(false);
    
        // Navigeren naar de homepagina (of loginpagina)
        navigate("/");
    };

    return (
        <div style={{ position: 'relative', height: '100vh', width: '100%' }}>
            <MapContainer center={[50.95306, 5.352692]} zoom={13} style={{ height: "100%", width: "100%" }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                />
                {sharedData.map(tree => (
                    <Marker key={tree.id} position={[tree.latitude, tree.longitude]}>
                        <Popup>
                            <strong>{tree.title}</strong><br />{tree.description}
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>

            {/* Uploadknop weergeven als de gebruiker ingelogd is */}
            {isAuthenticated && (
            <div style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                display: 'flex',
                gap: '10px',
                zIndex: 1000
            }}>
                <button
                    onClick={handleUploadClick}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontSize: '16px'
                    }}
                >
                    Upload Bestand
                </button>
                <button
                    onClick={handleLogoutClick}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#dc3545', // red color for logout
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontSize: '16px'
                    }}
                >
                    Logout
                </button>
            </div>
        )}
    </div>
);
};

export default MapView;
