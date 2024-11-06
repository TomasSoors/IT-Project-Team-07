import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import sharedData from '../../../shared/data';

const MapView = () => {
    return (
        <MapContainer center={[50.95306, 5.352692]} zoom={13} style={{ height: "100vh", width: "100%" }}>
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
    );
};

export default MapView;
