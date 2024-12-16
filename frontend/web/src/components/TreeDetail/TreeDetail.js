import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './TreeDetail.css';

const TreeDetail = ({ selectedTree, onClose, onDelete }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [editableTree, setEditableTree] = useState(null);

    const BASE_URL = process.env.REACT_APP_EXTERNAL_IP || 'http://localhost:8000';

    useEffect(() => {
        const verifyToken = async () => {
            const token = sessionStorage.getItem('token');
            if (!token) return;
            try {
                const response = await fetch(`${BASE_URL}/verify-token/${token}`, {
                    method: 'GET',
                });

                if (response.ok) {
                    setIsAuthenticated(true);
                } else {
                    setIsAuthenticated(false);
                }
            } catch (error) {
                console.error("Error verifying token:", error);
                setIsAuthenticated(false);
            }
        };

        verifyToken();
    }, [BASE_URL]);

    useEffect(() => {
        if (selectedTree) {
            setEditableTree({ ...selectedTree });
        }
    }, [selectedTree]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditableTree((prevTree) => ({
            ...prevTree,
            [name]: name === 'height' ? parseFloat(value) : value, 
        }));
    };

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
                    {isAuthenticated && (
                        <button onClick={onDelete} className="delete-button">
                            <img
                                style={{ width: "40px", height: "40px" }}
                                src="delete.png"
                                alt="Delete"
                            />
                        </button>
                    )}
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
                                {isAuthenticated ? (
                                    <>
                                        <p>
                                            <strong>Beschrijving:</strong>
                                            <input
                                                type="text"
                                                name="description"
                                                value={editableTree?.description || ''}
                                                onChange={handleInputChange}
                                            />
                                        </p>
                                        <p>
                                            <strong>Hoogte:</strong>
                                            <input
                                                type="number"
                                                name="height"
                                                value={editableTree?.height || ''}
                                                onChange={handleInputChange}
                                            />{" "}
                                            meter
                                        </p>
                                        <p>
                                            <strong>Coördinaten:</strong>
                                            <input
                                                type="number"
                                                name="latitude"
                                                value={editableTree?.latitude || ''}
                                                onChange={handleInputChange}
                                            />{" "}
                                            ,{" "}
                                            <input
                                                type="number"
                                                name="longitude"
                                                value={editableTree?.longitude || ''}
                                                onChange={handleInputChange}
                                            />
                                        </p>
                                    </>
                                ) : (
                                    <>
                                        <p><strong>Beschrijving:</strong> {selectedTree.description}</p>
                                        <p><strong>Hoogte:</strong> {selectedTree.height} meter</p>
                                        <p><strong>Coördinaten:</strong> {selectedTree.latitude}, {selectedTree.longitude}</p>
                                    </>
                                )}
                            </div>
                        </div>
                    ) : (
                        <p>Selecteer een boom om de details te bekijken.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

TreeDetail.propTypes = {
    selectedTree: PropTypes.shape({
        id: PropTypes.number.isRequired,
        description: PropTypes.string,
        height: PropTypes.number.isRequired,
        latitude: PropTypes.number.isRequired,
        longitude: PropTypes.number.isRequired,
    }),
    onClose: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
};

TreeDetail.defaultProps = {
    selectedTree: null,
};

export default TreeDetail;
