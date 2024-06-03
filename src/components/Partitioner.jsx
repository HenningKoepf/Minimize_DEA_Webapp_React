import React, { useEffect, useState } from 'react';
import { useReactFlow } from 'reactflow';



export const initialPartition = (nodes) => {
    const endStates = nodes.filter(node => node.data.output);
    const nonEndStates = nodes.filter(node => !node.data.output);
    return [nonEndStates, endStates];
};

/**
 * Splitted das Label der Kante auf um einzelne übergänge zu betrachten
 * @param node
 * @param symbol
 * @param edges
 * @returns {*|null}
 */
export function findTargetState(node, symbol, edges) {
    // Diese Funktion sucht nach dem Zielzustand für einen gegebenen Knoten und ein Symbol
    const edge = edges.find(edge => {
        const symbols = edge.label.split(/[ ,]+/);
        return edge.source === node.id && symbols.includes(symbol);
    });
    return edge ? edge.target : null;
}


/**
 * Durchläuft alle Partitionen, um die Partition zu finden, die den Zielzustand der enthält
 * @param targetLabel
 * @param partitions
 * @returns {*}
 */

export function findPartitionForState(target, partitions) {
    // Diese Funktion findet die Partition, zu der ein Zustand gehört
    for (const partition of partitions) {
        if (partition.some(node => node.id === target)) {
            return partition;
        }
    }
    return null;
}

/**
 * Ausgabeformatierung der Partitionen
 * @param partitions
 * @returns {*}
 */
const formatPartitions = (partitions) => {
    return partitions.map(partition =>
        partition.map(node => node.data.label).join(' ')
    ).join(' | ');
};

/**
 * Hier findet die eigentliche Logik der Partitionstabelle statt
 * @param nodes
 * @param edges
 * @param alphabet
 * @returns {[*,*]}
 */

function refinePartitions(partitions, edges, symbol) {
    let newPartitions = [];

    // Loope jede Partition
    partitions.forEach(partition => {
        let partitionMap = new Map();

        // Durchlaufe jeden Zustand in der aktuellen Partition
        partition.forEach(node => {
            // Finde den Zielzustand für den aktuellen Knoten und das spezifische Symbol
            const target = findTargetState(node, symbol, edges);

            // Finde die Partition, zu der der Zielzustand gehört
            const targetPartition = target ? findPartitionForState(target, partitions) : null;

            // Schlüssel basierend auf dem Zielzustand und der Partition, Müllzustände sind wichtig und bekommen eigenen Key
            let key = targetPartition ? partitions.indexOf(targetPartition).toString() : 'none';

            // Gruppiere Knoten basierend auf ihrem Zielzustand
            if (!partitionMap.has(key)) {
                partitionMap.set(key, []);
            }
            partitionMap.get(key).push(node);
        });

        // Füge die neu gebildeten Partitionen der Liste der neuen Partitionen hinzu
        partitionMap.forEach(group => {
            if (group.length > 0) {
                newPartitions.push(group);
            }
        });
    });

    return newPartitions;
}




const Partitioner = ({ isDfaResult, nodes, edges, alphabet, partitions, setPartitions,triggerCalculation, setTriggerCalculation, setPartitionsHistory, partitionHistory }) => {

    let history = [{symbol: 'Start', partitions: partitions}];
    const handleCalculateClick = () => {
        setTriggerCalculation(true); // Setzt den Trigger für die Berechnung

    };

    useEffect(() => {
        if (triggerCalculation && isDfaResult) {


            const refineAllPartitions = async () => {
                let currentPartitions = partitions; // Start mit den initialen Partitionen


                for (const symbol of alphabet) {
                    //auf die neuen Partitions warten damit wir die schleife nicht übel oft durchlaufen müssen
                    const refinedPartitions = await refinePartitions(currentPartitions, edges, symbol);
                    //Historylogg
                    history.push({symbol: symbol, partitions: refinedPartitions});
                    // für nöchstes zeichen

                    currentPartitions = refinedPartitions;
                }

                setPartitions(currentPartitions);
                setPartitionsHistory(history);
                //console.log(history);
            };

            refineAllPartitions().catch(console.error);
            setTriggerCalculation(false); // Setz Trigger zurück
        }
    }, [triggerCalculation]);


    if (isDfaResult !== true) {
        <button onClick={handleCalculateClick}>Berechnung auslösen</button>

    } else {
        return (
            <>
                <button onClick={handleCalculateClick}> Berechnung automatisch durchführen</button>
                <h2> Zustandsklassen </h2>
            </>
        );
    }
};

export default Partitioner;

