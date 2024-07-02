import React from 'react';

/**
 * Kleine Toolbar Komponente, die es erlaubt neue Zustände per drag and Drop auf den Reactflow wan
 * @returns {JSX.Element}
 * @constructor
 */
const Sidebar = () => {
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
export default Sidebar;
