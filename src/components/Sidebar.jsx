import React from 'react';

export default () => {
    const onDragStart = (event, nodeType) => {
        event.dataTransfer.setData('application/reactflow', nodeType);
        event.dataTransfer.effectAllowed = 'move';
    };

    return (
        <aside className= "dndflow">
            <div className="SidebarDescription" >

                Zustände mit Drag & Drop hinzufügen:

            </div>

            <div className="dndnode" onDragStart={(event) => onDragStart(event, 'default')} draggable>
                Zustand
            </div>
            <div className="dndnode" onDragStart={(event) => onDragStart(event, 'input')} draggable>
                Input
            </div>
            <div className="dndnode" onDragStart={(event) => onDragStart(event, 'output')} draggable>
                Output
            </div>

        </aside>
    );
};
