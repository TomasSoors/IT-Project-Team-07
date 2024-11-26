import React, { useState } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import sharedData from '../../../../shared/data';
import 'leaflet/dist/leaflet.css';
import Navbar from '../Navbar/Navbar';
import "./WebMapView.css";
import TreeDetail from '../TreeDetail/TreeDetail';
import DynamicMarker from '../DynamicMarker/DynamicMarker';

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
        <div className="layout">
            <Navbar />
            <div className={`map-container ${selectedTree ? 'map-container-selected' : ''}`}>
                <div className="map-area">
                    <MapContainer
                        center={center}
                        zoom={zoom}
                        className="leaflet-map"
                    >
                        <TileLayer url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png" />
                        {sharedData.map((tree) => (
                            <DynamicMarker
                                key={tree.id}
                                tree={tree}
                                isSelected={selectedTree?.id === tree.id}
                                onTreeSelect={handleTreeSelect}
                            />
                        ))}
                    </MapContainer>
                </div>
                {selectedTree && <TreeDetail selectedTree={selectedTree} onClose={handleCloseDetail} />}
            </div>
        </div>
    );
};

export default MapView;
