import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './TreeDetail.css';

const TreeDetail = ({ selectedTree, onClose, onDelete }) => {

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    useEffect(() => {
        const verifyToken = async () => {
            const token = sessionStorage.getItem('token');
            if (!token) return;
            try {
                const baseUrl = process.env.REACT_APP_EXTERNAL_IP || 'http://localhost:8000';
                const response = await fetch(`${baseUrl}/verify-token/${token}`, {
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
    return (
        <div className="container">
            <div className="card">
                <div className="content">
                    <button onClick={onClose} className="close-button">
                        <img
                            style={{ width: "30px", height: "30px" }}
                            src="close.png"
                            alt="Close"
                        />
                    </button>
                    {isAuthenticated &&
                        <button onClick={onDelete} className="delete-button">
                            <img
                                style={{ width: "40px", height: "40px" }}
                                src="delete.png"
                                alt="Delete"
                            />
                        </button>
                    }
                    <img
                        src="tree-icon.png"
                        alt="tree"
                        className="tree-image"
                    />
                    {selectedTree ? (
                        <div className="tree-info">
                            <div className="tree-title">
                                <h2>Boom #{selectedTree.id}</h2>
                            </div>
                            <div className="details">
                                <h3>Data:</h3>
                                <p><strong>Beschrijving:</strong> {selectedTree.description}</p>
                                <p><strong>Hoogte:</strong> {selectedTree.height} meter</p>
                                <p><strong>Coördinaten:</strong> {selectedTree.latitude}, {selectedTree.longitude}</p>
                            </div>
                        </div>
                    ) : (
                        <p>Selecteer een boom om de details te bekijken.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

TreeDetail.propTypes = {
    selectedTree: PropTypes.shape({
        id: PropTypes.number.isRequired,
        description: PropTypes.string,
        height: PropTypes.number.isRequired,
        latitude: PropTypes.number.isRequired,
        longitude: PropTypes.number.isRequired,
    }),
    onClose: PropTypes.func.isRequired,
};

TreeDetail.defaultProps = {
    selectedTree: null,
};

export default TreeDetail;

