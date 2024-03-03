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

/*

function refinePartitions(nodes, edges, alphabet, partitions, setPartitions) {
    // Initialisiere Partitionen mit Endzuständen und Nicht-Endzuständen
    //let partitions = initialPartition(nodes);

    let changed = true;
    while (changed) {
        //erst wenn sich noch etwas verändert hat,changed => true, wird weitergearbeitet.
        changed = false;
        //initalisieurng für diese Schleife
        let newPartitions = [];

        //For-Schleife über alle Partitionen
        partitions.forEach(partition => {
            let partitionMap = new Map();
            //For-Schleife über alle Knoten dieser Partition
            partition.forEach(node => {
                // Sammle alle Übergänge für die aktuelle Node
                let symbolsForNode = new Set();
                //For- Schleife für alle Kanten dieses Knotens
                edges.forEach(edge => {
                    if (edge.source === node.id) {
                        edge.label.split(/[\s,;]+/).forEach(symbol => symbolsForNode.add(symbol));
                    }
                });
                console.log("Node ID: " + node.id + " mit Label: " + node.data.label);
                console.log(symbolsForNode);

                //For-Schleife für alle Übergangssymbole dieser Kante
                symbolsForNode.forEach(symbol => {

                    const target = findTargetState(node, symbol, edges);
                    console.log('Knoten ' + node.data.label + ' mit Übergang: ' + symbol + "zu: " + target );
                    const targetPartition = findPartitionForState(target, partitions);
                    const partitionKey = targetPartition
                        ? targetPartition.map(n => n.label).sort().join(',')
                        : 'Müllzustand';

                    if (!partitionMap.has(partitionKey)) {
                        partitionMap.set(partitionKey, new Set ());
                    }
                    //evtl direkt bei den nodes partitionieren, benefit für späteres ansteuern bei GUI
                    partitionMap.get(partitionKey).add(node);
                });
            });

            partitionMap.forEach(subPartition => {
                newPartitions.push(subPartition);
            });
        });
        //Vorherige größe der Partitionen speichern
        const prevPartitionsLength = partitions.length;
        console.log(partitions);
        console.log(newPartitions);
        setPartitions(newPartitions);
        // Überprüfen, ob sich die Anzahl der Partitionen geändert hat

            console.log("Else bereich hat changed auf: ")
            // Zusätzlich überprüfen, ob die Inhalte der Partitionen sich geändert haben
            changed = partitions.every((partition, index) => {
                return partition.length === newPartitions[index].length &&
                    partition.every((node, nodeIndex) => { return node === newPartitions[index][nodeIndex];
                });
            });
            console.log(changed + " gesetz.")

    }
    return partitions;
}
 */
function refinePartitions(partitions, edges, symbol) {
    let newPartitions = [];

    // Durchlaufe jede Partition
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

    // Rückgabe der neu gebildeten Partitionen
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
                    // Warten Sie, bis die refinePartitions-Funktion die Partitionen für das aktuelle Symbol verfeinert hat
                    const refinedPartitions = await refinePartitions(currentPartitions, edges, symbol);
                    //Historylogg
                    history.push({symbol: symbol, partitions: refinedPartitions});
                    // Setzen Sie die Partitionen auf die verfeinerten Partitionen für das nächste Symbol

                    currentPartitions = refinedPartitions;
                }
                // Aktualisieren Sie die Partitionen im Zustand nur einmal, nachdem alle Verfeinerungen abgeschlossen sind
                setPartitions(currentPartitions);
                setPartitionsHistory(history);
                console.log(history);
            };

            refineAllPartitions().catch(console.error);
            setTriggerCalculation(false); // Setzen Sie den TriggerCalculation-Zustand zurück
        }
    }, [triggerCalculation]);


    if (isDfaResult !== true) {
        <button onClick={handleCalculateClick}>Berechnung auslösen</button>

    } else {
        return (
            <>
                <button onClick={handleCalculateClick}>Berechnung lösen</button>
                <h2>Partitionen</h2>
            </>
        );
    }
};

export default Partitioner;

