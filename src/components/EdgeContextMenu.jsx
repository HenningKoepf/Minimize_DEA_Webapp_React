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
                                            highlightHoverSymbol,
                                            setHighlightHoverSymbol,
                                            highlightedPartition,
                                            setHighlightedPartition,
                                            isDfaResult,
                                            isDFAMinimized,
                                            ...props
                                        }) {
    const { getEdge, setEdges } = useReactFlow();

    const edge = getEdge(id);
    const symbols = edge.label.split(/[,;\s]+/);

    const deleteEdge = useCallback(() => {
        setEdges((edges) => edges.filter((edge) => edge.id !== id));
    }, [id, setEdges]);

    const renameEdge = useCallback((edgeId) => {
        //prompt als Eingabeaufforderung
        const newLabel = window.prompt("Geben Sie neue Übergangssymbole ein:", "");

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
        const selectedEdge = getEdge(id);
        if (selectedEdge) {
            partitionDFAWithEdge(partitions, edges, selectedEdge, selectedSymbol);
        }
    }, [id, getEdge, partitionDFAWithEdge, partitions, edges]);

    const handleMouseEnter = useCallback((symbol) => {

        setHighlightedPartition(prev => edge.source); // Bestimme die Partition basierend auf der Quelle der Kante
        setHighlightHoverSymbol(prev => symbol);  // Setze das hervorzuhebende Symbol fest
    }, [ edge, setHighlightedPartition, setHighlightHoverSymbol]);

    //Anzeige modifikationen, alles wieder auf 0
    const handleMouseLeave = useCallback(() => {
        setHighlightedPartition(prev => null);
        setHighlightHoverSymbol( prev => null);
    }, [setHighlightedPartition, setHighlightHoverSymbol]);




    return (
        <div
            style={{ top, left, right, bottom }}
            className="context-menu"
            {...props}
        >
            <p style={{ margin: '0.5em' }}>
                <small>Kante: {id}</small>
            </p>

            {isDfaResult && !isDFAMinimized &&(
                <div>
                    {symbols.map((symbol, index) => (
                        <button
                            key={index}
                            onClick={() => initiatePartitioning(symbol)}
                            onMouseEnter={() => handleMouseEnter(symbol)}
                            onMouseLeave={handleMouseLeave}
                        >
                            Prüfe auf Symbol: {symbol}
                        </button>
                    ))}
                </div>
            )}

            <button onClick ={renameEdge}>Übergang ändern</button>
            <button onClick ={deleteEdge}>Übergang Löschen</button>


        </div>
    );
}
