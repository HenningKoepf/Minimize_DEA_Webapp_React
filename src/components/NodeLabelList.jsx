import React from 'react';

/**
 * Exportiere die Labels der Knoten in einer anzeigbaren Komponente
 * @param nodes
 * @returns {JSX.Element}
 * @constructor
 */


const NodeLabelList = ({ nodes, edges }) => {
    //pro Knoten die ausgehenden Edges, deren Labels und die Labels der jeweiligen Zielknoten sammeln

    const findEdgesAndTargetNodeLabels = (nodeId) => {
        return edges
            .filter(edge => edge.source === nodeId)
            .map(edge => {
                // Label des Zielknotens
                const targetNodeLabel = nodes.find(node => node.id === edge.target)?.data.label || 'Unbekannt';
                // Gibt Label der Edge und das Label des Zielknotens zurück
                return { edgeLabel: edge.label, targetNodeLabel };
            });
    };

    return (
        <div>
            <h3 className="header">Zustände und Übergänge:</h3>
            <ul className="nodeList">
                {nodes.map((node, index) => (
                    <li key={index} className="nodeItem">
                        {node.data.label}

                        <ul className="edgeList">
                            {findEdgesAndTargetNodeLabels(node.id).map((edgeInfo, edgeIndex) => (
                                <li key={edgeIndex} className="edgeItem">
                                             {edgeInfo.edgeLabel} --> {edgeInfo.targetNodeLabel}
                                </li>
                            ))}
                        </ul>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default NodeLabelList;
