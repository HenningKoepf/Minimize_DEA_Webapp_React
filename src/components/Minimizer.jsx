import React, { useEffect, useState } from 'react';


// Initialisiere die Partitionen
const initialPartitions = (nodes) => {
    const endStates = nodes.filter(node => node.data.output);
    const nonEndStates = nodes.filter(node => !node.data.output);
    return [nonEndStates, endStates];
};


// Finde die Klasse, zu der der Zielzustand eines gegebenen Zustands unter einem Symbol aus dem Alphabet gehört
const findClassForState = (state, symbol, partitions, edges) => {
    const edge = edges.find(edge => edge.source === state.data.label && edge.label === symbol);
    if (!edge) return null;
    return partitions.find(partition => partition.some(node => node.data.label === edge.target));
};



// Verfeinere die Partitionen
const refinePartitions = (partitions, symbols, edges) => {
    //es soll nur weitergeamcht werden, wenn eine Änderung vorlag
    let changed = true;
    while (changed) {
        changed = false;
        let newPartitions = [];

        partitions.forEach((partition) => {
            if (partition.length < 2) {
                newPartitions.push(partition);
                return;
            }

            let subPartitions = {};
            symbols.forEach((symbol) => {
                partition.forEach((node) => {
                    const targetClass = findClassForState(node, symbol, partitions, edges);
                    if (targetClass) {
                        const key = targetClass.map(n => n.data.label).sort().join('-');
                        subPartitions[key] = subPartitions[key] || [];
                        subPartitions[key].push(node);
                    }
                });
            });

            if (Object.keys(subPartitions).length === 1) {
                newPartitions.push(partition);
            } else {
                changed = true;
                Object.values(subPartitions).forEach(subPartition => newPartitions.push(subPartition));
            }
        });

        partitions = newPartitions;
    }

    return partitions;
};

// Start der ganzen Logik




const DfaMinimizerComponent = ({ isDfaResult, nodes, edges, symbols }) => {
    const [step, setStep] = useState(0); // Schrittzähler für vor und zruück
    const [partitions, setPartitions] = useState(initialPartitions(nodes));

    // wenn der DFA kein DFA ist, dann wird auch nix minimiert, State kommt direkt aus der App.jsx
    if (isDfaResult != true){
        return <p>Der Automat ist kein DFA und kann nicht minimiert werden. </p>;
    }

    const finalPartitions = refinePartitions(partitions, symbols, edges);
    //bringt die Zustände in Formatierung

    const formatPartitions = (partitions) => {
        return partitions.map(partition =>
            partition.map(node => node.data.label).join(' ')
        ).join(' | ');
    };

    const formattedPartitions = formatPartitions(finalPartitions);


    // Rendern der finalPartitions
    return (
        <>
            <h2>DFA Partitionen</h2>
            <p>{formattedPartitions}</p>
        </>
    );
};

export default DfaMinimizerComponent;