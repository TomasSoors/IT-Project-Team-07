import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import WebMap from './components/WebMap/WebMapView';
import Login from './components/Login/LoginView';
import UploadView from './components/UploadView';
import "@fontsource/jost";

const App = () => {
    const [refresh, setRefresh] = useState(false);

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/map" element={<WebMap refresh={refresh} />} />
                <Route path="/upload" element={<UploadView setRefresh={setRefresh} />} />
            </Routes>
        </Router>
    );
};

export default App;
