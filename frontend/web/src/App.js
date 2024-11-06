// web/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import WebMapView from './components/MapView';

const App = () => {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<WebMapView />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
