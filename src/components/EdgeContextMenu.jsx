import React, {useCallback} from 'react';
import { useReactFlow } from 'reactflow';


export default function EdgeContextMenu({
                                            id,
                                            top,
                                            left,
                                            right,
                                            bottom,
                                            partitionDFAWithEdge,
                                            partitions,
                                            edges,
                                            setPartitions,
                                            ...props
                                        }) {
    const { getEdge, setEdges } = useReactFlow();


    const edge = getEdge(id);
    const symbols = edge.label.split(/[,;\s]+/);

    const deleteEdge = useCallback(() => {
        setEdges((edges) => edges.filter((edge) => edge.id !== id));
    }, [id, setEdges]);

    const renameEdge = useCallback((edgeId) => {
        /*
        TODO: Inputform statt window.prompt
        */
        const newLabel = window.prompt("Geben Sie den neuen Namen für die Kante ein:", "");

        if (newLabel !== null) {
            setEdges((edges) =>
                edges.map((edge) => {
                    if (edge.id === id) {
                        return {
                            ...edge,
                                label: newLabel,
                        };
                    }
                    return edge;
                })
            );
        }
    }, [id,setEdges]);

    const initiatePartitioning = useCallback((selectedSymbol) => {
        const selectedEdge = getEdge(id);  // Assume getEdge is a method to get edge details
        if (selectedEdge) {

            partitionDFAWithEdge(partitions, edges, selectedEdge, selectedSymbol);

        }
    }, [id, getEdge, partitionDFAWithEdge, partitions, edges]);




    return (
        <div
            style={{ top, left, right, bottom }}
            className="context-menu"
            {...props}
        >
            <p style={{ margin: '0.5em' }}>
                <small>Edge: {id}</small>
            </p>

            {symbols.map((symbol, index) => (
                <button key={index} onClick={() => initiatePartitioning(symbol)}>
                    Prüfe Zeichen: {symbol}
                </button>
            ))}

            <button onClick ={deleteEdge}>Kante Löschen</button>
            <button onClick ={renameEdge}>Umbenennen</button>


        </div>
    );
}
