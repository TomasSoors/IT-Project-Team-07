import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Slider } from '@mui/material';
import "./TreeList.css";

const TreeList = ({ treeList, onClose, radius, onRadiusChange, selectedTreeFromList, onTreeListSelect, onTreeDetailSelect }) => {
    const [selectedTree, setSelectedTree] = useState(selectedTreeFromList);
    const [selectedTreeObject, setSelectedTreeObject] = useState(null);

    const handleTreeClick = (tree) => {
        const newSelectedTree = selectedTree === tree.id ? null : tree.id;
        setSelectedTree(newSelectedTree);
        setSelectedTreeObject(newSelectedTree ? tree : null);
        onTreeListSelect(newSelectedTree);
    };

    const handleTreeDetailClick = (event) => {
        event.stopPropagation();
        onTreeDetailSelect(selectedTreeObject);
    }

    return (
        <div className="container">
            <div className="card">
                <div className="list-content">
                    <button onClick={onClose} className="close-button">
                        <img style={{ width: "30px", height: "30px" }} src="close.png" alt="Close" />
                    </button>
                    <Slider
                        value={radius}
                        onChange={onRadiusChange}
                        min={100}
                        max={500}
                        step={10}
                        valueLabelDisplay="auto"
                        aria-labelledby="radius-slider"
                    />
                    <div className='total-info'>
                        {treeList.length === 0 && (<p><strong>Geen bomen in dit gebied</strong></p>)}
                        {treeList.length > 0 && (<p><strong>Bomen in radius: {treeList.length}</strong></p>)}
                    </div>
                    <div className="tree-list-scroll">
                        {treeList.map(tree => (
                            <div
                                key={tree.id}
                                className={`tree-object ${selectedTree === tree.id ? 'selected' : ''}`}
                                role="button"
                                tabIndex={0}
                                onClick={() => handleTreeClick(tree)}
                            >
                                <img src='tree-icon.png' alt="boom" style={{ height: "40px", margin: "10px" }} />
                                <p>Boom #{tree.id}</p>
                                {selectedTree === tree.id && (
                                    <button onClick={(event) => handleTreeDetailClick(event)}>
                                        <img src='info-icon.png' alt="info" className="info-icon" />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

TreeList.propTypes = {
    treeList: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        })
    ).isRequired,
    onClose: PropTypes.func.isRequired,
    radius: PropTypes.number.isRequired,
    onRadiusChange: PropTypes.func.isRequired,
    selectedTreeFromList: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onTreeListSelect: PropTypes.func.isRequired,
    onTreeDetailSelect: PropTypes.func.isRequired,
};

export default TreeList;

