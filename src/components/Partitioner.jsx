
import React, { useEffect } from 'react';

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
 * Hier findet die eigentliche Logik der Partitionstabelle statt
 * @param nodes
 * @param edges
 * @param alphabet
 * @returns {[*,*]}
 */

function refinePartitions(partitions, edges, alphabet) {
    let currentPartitions = partitions;
    let history = [];

    alphabet.forEach(symbol => {
        let newPartitions = [];
        let changed = false; // Flag, um zu überprüfen, ob sich eine Partition geändert hat
        let changes = []; // Liste der Änderungen

        currentPartitions.forEach(partition => {
            let partitionMap = new Map();

            // Durchlaufe jeden Zustand in der aktuellen Partition
            partition.forEach(node => {
                // Finde den Zielzustand für den aktuellen Knoten und das spezifische Symbol
                const target = findTargetState(node, symbol, edges);

                // Finde die Partition, zu der der Zielzustand gehört
                const targetPartition = target ? findPartitionForState(target, currentPartitions) : null;

                // Key für als Zielzustand und die Partition, Müllzustände sind wichtig und bekommen eigenen Key
                let key = targetPartition ? currentPartitions.indexOf(targetPartition).toString() : 'none';

                // Gruppiere Knoten basierend auf ihrem Zielzustand
                if (!partitionMap.has(key)) {
                    partitionMap.set(key, []);
                }
                partitionMap.get(key).push(node);
            });

            // Füge die neu gebildeten Partitionen der Liste der neuen Partitionen hinzu
            partitionMap.forEach((group, key) => {
                if (group.length > 0) {
                    const targetPartition = key !== 'none' ? currentPartitions[key] : null;
                    newPartitions.push(group);

                    if (partitionMap.size > 1) {
                        changes.push({
                            symbol,
                            sourcePartition: partition,
                            group,
                            targetPartition: targetPartition || 'Müllzustand'
                        });
                    }
                }
            });

            // Überprüfen, ob die aktuelle Partition aufgeteilt wurde
            if (partitionMap.size > 1) {
                changed = true;
            }
        });

        // Füge die aktuelle Verfeinerung zu den History-Einträgen hinzu
        history.push({ symbol, partitions: newPartitions, changed, changes });

        // Aktualisiere die aktuellen Partitionen für das nächste Symbol
        currentPartitions = newPartitions;
    });

    // Gebe die neuen Partitionen und die History zurück
    return { newPartitions: currentPartitions, history };
}



const Partitioner = ({ isDfaResult, nodes, edges, alphabet, partitions, setPartitions, triggerCalculation, setTriggerCalculation, setPartitionsHistory, partitionHistory, setIsDFAMinimized }) => {
    const handleCalculateClick = () => {
        setTriggerCalculation(true); // löst den Trigger für die Berechnung
    };

    useEffect(() => {
        if (triggerCalculation && isDfaResult) {
            const refineAllPartitions = async () => {
                let currentPartitions = partitions; // Start mit den initialen Partitionen
                let history = [{ symbol: 'Start', partitions: partitions, changed: false }]; // Initialer History-Eintrag

                let changed;
                do {
                    changed = false;
                    for (const symbol of alphabet) {
                        // Verfeinere die Partitionen mit dem aktuellen Symbol
                        const { newPartitions, history: newHistory } = refinePartitions(currentPartitions, edges, [symbol]);
                        history.push(...newHistory);

                        // Wenn sich eine Partition geändert hat, setzen wir das Flag auf true
                        if (newHistory.some(entry => entry.changed)) {
                            changed = true;
                        }

                        // Aktualisiere die aktuellen Partitionen
                        currentPartitions = newPartitions;
                    }
                } while (changed); // Wiederhole den Vorgang, wenn sich eine Partition geändert hat

                setPartitions(currentPartitions);
                setPartitionsHistory(history);
                setIsDFAMinimized(true);
            };

            refineAllPartitions().catch(console.error);
            setTriggerCalculation(false); // Setz Trigger zurück
        }
    }, [triggerCalculation, isDfaResult, partitions, edges, alphabet, setPartitions, setPartitionsHistory, setIsDFAMinimized]);

    return (
        <div>
            {isDfaResult !== true ? (
                <></>
            ) : (
                <>
                    <button onClick={handleCalculateClick} style={{ width: "250px" }}>Minimierung automatisch durchführen</button>
                    <h3>Zustandsklassen</h3>
                </>
            )}
        </div>
    );
};


export default Partitioner;

