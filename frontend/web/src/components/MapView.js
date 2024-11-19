import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import sharedData from '../../../shared/data';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import treeLogo from '../../../shared/images/tree-icon.png'
import Navbar from './Navbar/Navbar';

const treeIcon = L.icon({
    iconUrl: treeLogo,
    iconSize: [40, 40],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
});

const MapView = () => {
    return (
        <div style={{ height: '100vh', width: '100%', backgroundColor: "#f0eee4" }}>
            <Navbar style={{}} />
            <MapContainer center={[50.95306, 5.352692]} zoom={16} style={{ height: "85vh", margin: "10px", border: "4px solid #b2adad", borderRadius: "20px", zIndex: "0" }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
                    
                />
                {sharedData.map(tree => (
                    <Marker key={tree.id} position={[tree.latitude, tree.longitude]} icon={treeIcon}>
                        <Popup>
                            <strong>{tree.title}</strong><br />{tree.description}
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
};

export default MapView;