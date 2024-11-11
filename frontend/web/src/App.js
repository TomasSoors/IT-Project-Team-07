// web/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import WebMap from './components/MapView';
import Login from './components/LoginView';
import UploadView from './components/UploadView';


const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login/>}></Route>
                <Route path="/map" element={<WebMap/>}></Route>
                <Route path="/upload" element={<UploadView/>}></Route>
            </Routes>
        </Router>
    );
};

export default App;
