import React from 'react';

export default  () => {
    const onDragStart = (event, nodeType) => {
        event.dataTransfer.setData('application/reactflow', nodeType);
        event.dataTransfer.effectAllowed = 'move';
    };

    return (
        <aside className= "dndflow">
            <div className="SidebarDescription" >

                Mit Drag & Drop hinzufügen:

            </div>

            <div className="dndnode" onDragStart={(event) => onDragStart(event, 'input')} draggable>
                Startzustand
            </div>
            <div className="dndnode" onDragStart={(event) => onDragStart(event, 'default')} draggable>
                Zustand
            </div>
            <div className="dndnode" onDragStart={(event) => onDragStart(event, 'output')} draggable>
                Endzustand
            </div>

        </aside>
    );
};
