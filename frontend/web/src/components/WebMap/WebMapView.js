import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import sharedData from '../../../../shared/data';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import treeLogo from '../../../../shared/images/tree-icon.png';
import Navbar from '../Navbar/Navbar';

function getIconSize(zoom) {
    if (zoom >= 16) return [40, 40];
    if (zoom === 15 || zoom === 14) return [30, 30];
    if (zoom === 13) return [20, 20];
    return [0, 0];
}

function DynamicMarker({ tree, onTreeSelect }) {
    const map = useMap();
    const [iconSize, setIconSize] = useState(getIconSize(map.getZoom()));

    const treeIcon = L.icon({
        iconUrl: treeLogo,
        iconSize: iconSize,
        iconAnchor: [iconSize[0] / 2, iconSize[1]],
        popupAnchor: [0, -iconSize[1]],
    });

    useMapEvents({
        zoomend: () => {
            setIconSize(getIconSize(map.getZoom()));
        },
    });

    if (iconSize[0] === 0) return null;

    return (
        <Marker
            position={[tree.latitude, tree.longitude]}
            icon={treeIcon}
            eventHandlers={{
                click: () => {
                    map.flyTo([tree.latitude, tree.longitude], 16, { duration: 0.5 });
                    onTreeSelect(tree); // Boom wordt geselecteerd
                },
            }}
        >
            <Popup>
                <strong>{tree.title}</strong>
                <br />
                {tree.description}
                <br />
                {tree.longitude}
                <br />
                {tree.latitude}
            </Popup>
        </Marker>
    );
}

function TreeDetail({ selectedTree, onClose }) {
    return (
        <div style={{ width: '30%', padding: '10px', backgroundColor: '#F0EEE4' }}>
            <div style={{ border: '4px solid #b2adad', borderRadius: '20px', height:"85vh"}}>
                <div style={{margin: "20px"}}>
                <button onClick={onClose} style={{ float: 'right', margin: '10px' }}>Close</button>
                <img src="../../../../shared/images/tree-icon.png" alt="tree"></img>
                {selectedTree ? (
                    <div style={{justifyContent: "center", textAlign:"center", margin:"100px 10px"}}>
                        <h3>{selectedTree.title}</h3>
                        <div style={{width:"100%", backgroundColor: "white", borderRadius:"20px", boxShadow:"0px 0px 10px darkgrey", padding:"20% 0px"}}>
                            <p><strong>Species:</strong> {selectedTree.description}</p>
                            <p><strong>Height:</strong> {selectedTree.height}</p>
                            <p><strong>Coordinates:</strong> {selectedTree.latitude}, {selectedTree.longitude}</p>
                        </div>
                    </div>
                ) : (
                    <p>Select a tree to see details.</p>
                )}
                </div>

            </div>

        </div>
    );
}

const MapView = () => {
    const [center] = useState([50.95306, 5.352692]);
    const [zoom] = useState(16);
    const [selectedTree, setSelectedTree] = useState(null);

    const handleTreeSelect = (tree) => {
        setSelectedTree(tree);
    };

    const handleCloseDetail = () => {
        setSelectedTree(null);
    };

    return (
        <div className="layout" style={{ backgroundColor: "#F0EEE4", height: "100vh" }}>
            <Navbar />
            <div style={{ display: 'flex' }}>
                <div style={{ flex: selectedTree ? '70%' : '100%', transition: 'flex 0.3s' }}>
                    <MapContainer
                        center={center}
                        zoom={zoom}
                        style={{ height: '85vh', margin: '10px', border: '4px solid #b2adad', borderRadius: '20px', zIndex: '0' }}
                    >
                        <TileLayer url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png" />
                        {sharedData.map((tree) => (
                            <DynamicMarker key={tree.id} tree={tree} onTreeSelect={handleTreeSelect} />
                        ))}
                    </MapContainer>
                </div>
                {selectedTree && <TreeDetail selectedTree={selectedTree} onClose={handleCloseDetail} />}
            </div>
        </div>
    );
};


export default MapView;
