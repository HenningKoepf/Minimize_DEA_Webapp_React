import React from 'react';

export default () => {
    const onDragStart = (event, nodeType) => {
        event.dataTransfer.setData('application/reactflow', nodeType);
        event.dataTransfer.effectAllowed = 'move';
    };

    return (
        <aside className= "dndflow">
            <div className="description">Zustände mit Drag&Drop hinzufügen: </div>

            <div className="dndnode" onDragStart={(event) => onDragStart(event, 'default')} draggable>
                Neuer Zustand
            </div>
            <div className="dndnode" onDragStart={(event) => onDragStart(event, 'input')} draggable>
                Neuer Input
            </div>
            <div className="dndnode" onDragStart={(event) => onDragStart(event, 'output')} draggable>
                Neuer Output
            </div>

        </aside>
    );
};
