import React, { useCallback, useRef, useState, useEffect } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,

  addEdge,
    BaseEdge,
    Connection,
    ConnectionMode,
    Node, MarkerType
} from 'reactflow';
import { ReactFlowProvider } from 'react-flow-renderer'
import 'reactflow/dist/style.css';
import './styles/styles.css'
import './updatenode.css';

import NodeContextMenu from './components/NodeContextMenu';
import EdgeContextMenu from './components/EdgeContextMenu';
import SelfConnectingEdge from './elements/SelfConnectingEdge';
import BaseNode from './elements/BaseNode';


import {initialNodes, initialEdges} from './elements/initial-setup2';
import {initialNode, noEdges} from './elements/ClearBoard';
import {exampleNodes, exampleEdges} from './elements/exampleDFA';
import Partitioner from './components/Partitioner';
import {findPartitionForState, findTargetState} from './components/Partitioner';

import NodeLabelList from './components/NodeLabelList';

const EdgeTypes = {
    //buttonedge: ButtonEdge,
    selfconnecting: SelfConnectingEdge,
};

const NodeTypes = {
    basenode: BaseNode,
};


function App() {


    //State Listener
    const [edgemenu, setEdgeMenu] = useState(null);
    const [menu, setMenu] = useState(null);
    //const [nodeBg, setNodeBg] = useState('#eee');
    const [isDfaResult, setIsDfaResult, onChange] = useState(null);

    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);


    const [alphabet, setAlphabet] = useState(['a', 'b']);

    const [implyTrashStates, setImplyTrashStates] = useState(false);

    //umschalten ob Müllzustände impliziert werden "true" oder nicht "false"
    const toggleImplyTrashStates = () => {
        setImplyTrashStates(!implyTrashStates);
    };

    const plainField = () => {
        setNodes(exampleNodes);
        setEdges(exampleEdges);
        setAlphabet(['a', 'b', 'c']);
    }

    //Erzeut die Startpartitionen mit Endzuständen und restlichen Zuständen
    const initialPartition = (nodes) => {
        const endStates = nodes.filter(node => node.data.output);
        const nonEndStates = nodes.filter(node => !node.data.output);
        return [nonEndStates, endStates];
    };

    const [partitions, setPartitions] = useState(initialPartition(nodes));
    const [partitionsHistory, setPartitionsHistory] = useState([]);
    //States für die Ausgabe des Äquivalenzautomaten
    const [finalnodes, setfinalNodes, onfinalNodesChange] = useNodesState([]);
    const [finaledges, setfinalEdges, onfinalEdgesChange] = useEdgesState([]);

    //Wenn der Automat geändert wird, werden die Partitionen und Auswertungen  initialisiert.
    useEffect(() => {
        const updatedPartitions = initialPartition(nodes);
        setPartitions(updatedPartitions);
        setPartitionsHistory([]);
        setIsDfaResult(null);

    }, [nodes, alphabet, edges, implyTrashStates]);

    /**
     * Refs für die einzelnen Komponenten, damit kan nich dynamisch auf die Größenänderungen reagieren
     * @type {{current: (unknown|null)}}
     */
    const ref = useRef(null);
    const refFinal = useRef(null);
    const kontrollContainerRef = useRef(null);
    const topTextRef = useRef(null);

    /**
     * Beim Klick auf das Canvas sollen alle Menüs geschlossen werden
     * @type {(function(): void)|*}
     */
    const onPaneClick = useCallback(() => {
        setMenu(null); // Set das Menu zurück
        setEdgeMenu(null); // Setz das edgeMenu zurück
    }, [setMenu, setEdgeMenu]);


    /**
     * Erzeugt das Kontextmenü für Kanten
     * @type {(function(*, *): void)|*}
     */

    //Kante umbenennen und löschen
    const onEdgeContextMenu = useCallback((event,edge) => {
        // Kein normales Kontextmenü
        event.preventDefault();
                //Koordinaten de clicks
                const clickX = event.clientX;
                const clickY = event.clientY;

                //Größe des Kontainers daneben
                const kontrollContainer = kontrollContainerRef.current.getBoundingClientRect();
                const kontrollContainerWidth = kontrollContainer.width;
                const pane = ref.current.getBoundingClientRect();

                const topText = topTextRef.current.getBoundingClientRect();
                const topTextHeight = topText.height;

                const left = Math.min(clickX- kontrollContainerWidth , pane.width - kontrollContainerWidth - 200);
                // limit die linke Position mit Breite des Kontrollcontainer
                const top = Math.min(clickY -topTextHeight, pane.height -topTextHeight - 200);

            setEdgeMenu({
                id: edge.id,
                top: top,
                left: left,
                right: event.clientX >= pane.width - 200 && pane.width - event.clientX,
                bottom:
                    event.clientY >= pane.height - 200 && pane.height - event.clientY,
            });
        },
        [setEdgeMenu],
    );

    /**
     * Erzeugen einer Kante, wenn von einer Source Handle per DragnDrop zu einer TargetHandle gezogen wurde
     * Erzeugt
     * @type {(function(*): void)|*}
     */

    const onConnect = useCallback(
        (params) => {
            if ( params.source === params.target){
                const newEdge = {
                    id: `edge-${params.source}-${params.target}`,
                    source: params.source,
                    target: params.target,
                    label: "a",
                    type: "selfconnecting",
                    markerEnd: { type: MarkerType.ArrowClosed },
                };
                setEdges((edges) => [...edges, newEdge]);
            }
            else{

                const newEdge = {
                    id: `edge-${params.source}-${params.target}`,
                    source: params.source,
                    target: params.target,
                    label:  "a",
                    type: "default",
                    markerEnd: { type: MarkerType.ArrowClosed },
                };

                // Aktualisiere die Edge-Liste mit der zusätzlichen Kante
                setEdges((edges) => [...edges, newEdge]);
             }
            },
        [setEdges]
    );

    /**
     * Öffnet das Kontextmenü der Knoten
     * @type {(function(*, *): void)|*}
     */


    const onNodeContextMenu = useCallback(
        (event, node) => {
            // Kein normales Kontextmenü
            event.preventDefault();

            //Koordinaten de clicks
            const clickX = event.clientX;
            const clickY = event.clientY;

            const pane = ref.current.getBoundingClientRect();

            //Größe des Kontainers daneben
            const kontrollContainer = kontrollContainerRef.current.getBoundingClientRect();
            const kontrollContainerWidth = kontrollContainer.width;

            const topText = topTextRef.current.getBoundingClientRect();
            const topTextHeight = topText.height;

            // Sicherstellen, dass das Menü nicht neben dem Fenster gerendert wrid
            const left = Math.min(clickX- kontrollContainerWidth , pane.width - kontrollContainerWidth - 100);
            // Begrenze die linke Position entsprechend der Breite des .Kontrollcontainer
            // Grenze auch nach oben aber amnn kanns auh übertreiben
            const top = Math.min(clickY -topTextHeight, pane.height -topTextHeight - 100);

            setMenu({
                id: node.id,
                left,
                top,
            });
        },
        [setMenu],
    );

    /**
     * Der Klick auf den Prüfbutton erzeugt eine Prüfinstanz auf DFA Konformitat und setzt den Wert, so das neu gerendert wird
     */

    const checkIsDFA = () => {
        setIsDfaResult((prev) => null);
        let result = isDFA(nodes, edges, alphabet);
        setIsDfaResult(result);

    };


    /**
     * Genau ein Startzustand: Es wird sichergestellt, dass genau ein Startzustand vorhanden ist.
     * Validität der Kantenlabels: Es wird überprüft, ob alle Kantenlabels gültige Symbole des Alphabets enthalten.
     * Eindeutigkeit der Übergänge: Für jedes Symbol in jedem Zustand darf es höchstens einen Übergang geben.
     * Erreichbarkeit aller Zustände: Alle Zustände müssen vom Startzustand aus erreichbar sein.
     *
     * TODO Endzustandbehandlung
     *
     * Hat jetzt einen Schalter um TrashStates zu implizieren oder nur vollständige Dfas zu akzeptieren
     *
     * @param nodes
     * @param edges
     * @param alphabet
     * @returns {boolean}
     */

    function isDFA(nodes, edges, alphabet) {

        if (!nodes || !edges || !alphabet) {
            console.error('Einer der Inputs (nodes, edges, alphabet) ist nicht richtig definiert.');
            return false;
        }

        // Überprüfung auf genau einen Startzustand
        const startStates = nodes.filter(node => node.data.input == true);
        if (startStates.length !== 1) {
            console.error("Es muss genau einen Startzustand geben.");
            alert("Es muss genau einen Startzustand geben.")
            return false;
        }
        const startStateId = startStates[0].id;
        const transitions = new Map();

        // Initialisieren der Transitions Map mit leeren Sets
        nodes.forEach(node => {
            alphabet.forEach(symbol => {
                const key = `${node.id}-${symbol}`;
                transitions.set(key, null); //null für evtl. Müllzustände
            });
        });

        // Verarbeiten der Kanten
        for (const edge of edges) {
            const symbols = edge.label.split(/[,;\s]\s*/).map(symbol => symbol.trim());
            for (const symbol of symbols) {

                if (!alphabet.includes(symbol)) {
                    console.error(`Ungültiges Symbol '${symbol}' in Kante '${edge.id}' gefunden.`);
                    alert(`Ungültiges Symbol '${symbol}' in Kante '${edge.id}' gefunden.`);
                    return false;
                }
                const key = `${edge.source}-${symbol}`;
                if (transitions.get(key) !== null) {
                    console.error(`Mehr als ein Übergang für das Symbol '${symbol}' beim Zustand '${edge.source}' definiert.`);
                    alert(`Mehr als ein Übergang für das Symbol '${symbol}' beim Zustand '${edge.source}' definiert.`);
                    return false;
                }
                transitions.set(key, edge.target); // Setzt den Zielzustand für den Übergang
            };
        }

        // Überprüfung auf Vollständigkeit des DFA
        let isComplete = true;
        transitions.forEach((targetState, key) => {
            if (targetState === null && !implyTrashStates) {
                // Wenn implyTrashStates false ist und ein Übergang fehlt, ist der DFA nicht vollständig
                alert("DFA ist nicht vollständig. Es fehlt der Übergang:" + key);
                isComplete = false;
            }
        });

        if (!isComplete) {
            console.error("DFA ist nicht vollständig. Es fehlen Übergänge für mindestens ein Symbol in mindestens einem Zustand.");

            return false;
        }

        // Überprüfung der Erreichbarkeit aller Zustände
        let visited = new Set();
        let queue = [startStateId];
        while (queue.length > 0) {
            const currentState = queue.shift();
            if (!visited.has(currentState)) {
                visited.add(currentState);
                nodes.forEach(node => {
                    alphabet.forEach(symbol => {
                        const key = `${currentState}-${symbol}`;
                        const targetState = transitions.get(key);
                        if (targetState && !visited.has(targetState)) {
                            queue.push(targetState);
                        }
                    });
                });
            }
        }

        if (visited.size !== nodes.length) {
            console.error("Nicht alle Zustände sind erreichbar.");
            return false;
        }

        return true; // Der Automat ist ein vollständiger DFA
    }


    /**
     * Erstmal die partitionierung mit einem einzigen Symbol
     * @param partitions
     * @param edges
     * @param selectedEdge
     * @returns {{partitions: *[], changed: boolean}}
     */
    function partitionDFAWithEdge(partitions, edges, selectedEdge) {
        let newPartitions = [];
        let changed = false;

        // Finde das Übergangssymbol der ausgewählten Kante
        const selectedSymbol = selectedEdge.label;

        partitions.forEach(partition => {
            let targetPartitionMap = new Map();

            partition.forEach(node => {
                // Prüfe, ob der aktuelle Knoten der Quellknoten der ausgewählten Kante ist
                if (node.id === selectedEdge.source) {
                    const target = findTargetState(node, selectedSymbol, edges);

                    if (target !== null) { // Ignoriere Müllzustände
                        const targetPartition = findPartitionForState(target, partitions);
                        if (targetPartition) {
                            let nodes = targetPartitionMap.get(targetPartition) || [];
                            nodes.push(node);
                            targetPartitionMap.set(targetPartition, nodes);
                        }
                    } else {
                        // Behandle Knoten ohne gültigen Übergang für das Symbol separat
                        let nodes = targetPartitionMap.get(null) || [];
                        nodes.push(node);
                        targetPartitionMap.set(null, nodes);
                    }
                } else {
                    // Knoten, die nicht Quellknoten der ausgewählten Kante sind, bleiben unverändert
                    let nodes = targetPartitionMap.get(partition) || [];
                    nodes.push(node);
                    targetPartitionMap.set(partition, nodes);
                }
            });

            // Erstelle neue Partitionen basierend auf der Gruppierung
            targetPartitionMap.forEach((nodes, _) => {
                if (nodes.length < partition.length) {
                    changed = true; // Die Partition wurde geändert
                }
                newPartitions.push(nodes);
            });
        });

        // Gib die neuen Partitionen und das Änderungsflag zurück
        return { partitions: newPartitions, changed };
    }

    /**
     * Aktualisieren des aktuell akzeptiereten Alphabets
     * @param newAlphabet
     */
    const [inputAlphabet, setInputAlphabet] = useState(alphabet.join(', '));
    const handleAlphabetInput = (e) => {
        setInputAlphabet(e.target.value);
        updateAlphabet(e.target.value);
    }
    /**
     * Inputbox und alphabet stimmen immer überein
     * @param inputValue
     */
    const updateAlphabet = (inputValue) => {
        const newAlphabet = inputValue.split(/[;,]\s*|\s+/).map(symbol => symbol.trim()).filter((symbol, index, array) => array.indexOf(symbol) === index);
        setAlphabet(newAlphabet);
    };


    /**
     * neue partitioneung erzeugen
     */
    const [triggerCalculation, setTriggerCalculation] = useState(false);


    const handlePartitionerClick = () => {
        setTriggerCalculation(true);  // Dies löst die Berechnung aus
    };

    /**
     * Button zum Neuladen der Website
     */
    const resetPage = () =>{
        window.location.reload();
    }

    /**
     * Anzeige Rendering der neuen Partitionen mit Übergangssysmbol
     * @param historyEntry
     * @returns {JSX.Element}
     */
    function renderPartitionWithSymbol(historyEntry) {
        if (!historyEntry || !historyEntry.partitions) {
            return <div>Partitionsgeschichte ist nicht verfügbar.</div>;
        }

        return (
            <div className="partition-with-symbol">
                {historyEntry.partitions.map((partition, partitionIndex) => (
                    <span key={partitionIndex}>
                    {partition.map(node => node.id).join(" ")} {partitionIndex < historyEntry.partitions.length - 1 ? "| " : ""}
                </span>
                ))}
                {historyEntry.symbol && <span className="symbol"> mit "{historyEntry.symbol}"</span>}
            </div>
        );
    }

    /**
     * Kreation des Äquivalenzautomaten basierend auf den aktuellen Partitionen
     * @param partitions
     * @returns {{newEdges: *[], newNodes: *[]}}
     */
    useEffect(() => {
        createMinimizedGraph();
    }, [partitions]); // Abhängigkeit von der existenz der Partitionen

    const createMinimizedGraph = () => {
        const newNodes = [];
        const newEdges = [];
        const partitionMap = {}; // Mapt die alten Knoten-IDs auf neue Knoten-IDs
        const edgeLabelsMap = {}; // Mapts Labels für Kanten zwischen Partitionen

        // Schritt 1: Neue Knoten erstellen
        partitions.forEach((partition, index) => {
            if (partition.length === 0) {
                //edge case wenn input= output und keine anderen Knoten verfügbar
                console.error("Leere Partition entdeckt, überspringe diese Partition.");
                return; //die partition wird übersprungen, da sie leer ist
            }

            const isOutput = partition.some(node => node?.data?.output);
            const isInput = partition.some(node => node?.data?.input);

            let style = {};
            if (isInput) {
                style.backgroundColor = '#786bd3';
            }
            if (isOutput) {
                style.border = "3px solid black";
                style.borderStyle = "double";
            }
            if (isInput && isOutput) {
                // Kombiniere das Styling für Knoten, die sowohl Input als auch Output sind
                style = {
                    border: "3px solid black" ,
                    borderStyle: "double",
                    backgroundColor: '#786bd3',
                };
            }
            const newNode = {

                id: `P${index}`, // Eindeutige ID für den neuen Knoten
                data: { ...partition[0].data, label: "{" + partition.map(node => node.data.label).join(", ") +"}" },
                position: calculateAveragePosition(partition, nodes),
                targetPosition: 'left',
                sourcePosition: 'right',
                style: Object.keys(style).length > 0 ? style : undefined //entweder Style schon vorhanden, oder default node
            };

            newNodes.push(newNode);

            // Aktualisiere die Partitionen
            partition.forEach(node => {
                partitionMap[node.id] = newNode.id;
            });
        });

        // Schritt 2: Neue Kanten und deren Labels erstellen, einschließlich Selbstkanten
        edges.forEach(edge => {
            const sourcePartition = partitionMap[edge.source];
            const targetPartition = partitionMap[edge.target];

            // Generiere einen einzigartigen Schlüssel für jede Kantenverbindung zwischen Partitionen
            const edgeKey = `${sourcePartition}->${targetPartition}`;
            // Initialisiere das Label für die Kante, falls noch nicht geschehen
            if (!edgeLabelsMap[edgeKey]) {
                edgeLabelsMap[edgeKey] = { labels: new Set(), type: null };
            }
            // Überprüfe, ob die Kante eine Selbstkante ist
            if (sourcePartition === targetPartition) {
                edgeLabelsMap[edgeKey].type = 'selfconnecting';
            }

            const normalizedLabel = edge.label.replace(/,\s*/g, " "); // Ersetzt Kommas und darauf folgende Leerzeichen durch ein Leerzeichen
            normalizedLabel.split(" ").forEach(label => edgeLabelsMap[edgeKey].labels.add(label)); //keine dupletten
            //
        });

        //  neue Kanten basierend auf edgeLabelsMap, einschließlich Selbstkanten
        Object.keys(edgeLabelsMap).forEach((key, index) => {
            const [source, target] = key.split('->');
            // Konvertiere das Set von Labels zurück in einen String, getrennt durch Leerzeichen
            const labelsString = Array.from(edgeLabelsMap[key].labels).join(" ");
            const newEdge = {
                id: `e${index}`,
                source: source,
                target: target,
                label: labelsString,
                type: edgeLabelsMap[key].type
            };
            newEdges.push(newEdge);
        });

        setfinalNodes(newNodes);
        setfinalEdges(newEdges);
    };


    //VErsuch automatisch neue Graphen zu positionierne

    function calculateAveragePosition(partition, originalNodes) {
        const positions = partition.map(node => {
            const originalNode = originalNodes.find(n => n.id === node.id);
            return originalNode.position;
        });
        const averagePosition = {
            x: positions.reduce((acc, pos) => acc + pos.x, 0) / positions.length,
            y: positions.reduce((acc, pos) => acc + pos.y, 0) / positions.length
        };
        return averagePosition;
    }




    return (
      <>
     <div className="toptext" ref={topTextRef} >D F A ---  M I N I M I E R E R ! </div>

          <div className="App">
              <div className="Kontrollcontainer" ref={kontrollContainerRef}>
                  <legend><strong>Eingabe: </strong></legend>
                  <div>
                      <label>Alphabet bearbeiten:</label>
                      <input
                          type="text"
                          value={inputAlphabet}
                          onInput={(e) => {handleAlphabetInput(e)}}
                      />
                  </div>
                      <div>Aktuelle Konfiguration:</div>
                      <div className="alphabet">{`Σ = {${alphabet.join(', ')}}`}</div>
                      <div className="zustände">{`Z = {${nodes.map((node) => node.data.label).join(",  ")}}`}</div>
                          <div className="zustände">
                              {`E = {${nodes.filter((node) => node.data.output).map((node) => node.data.label).join(", ")}}`}
                          </div>

                      <NodeLabelList nodes={nodes} edges = {edges}/>
                  <div>
                  <button onClick={resetPage} style={{ marginRight: '20px' }}> Reload</button>
                      <button onClick={plainField}> Beispiel </button>
                      <div>
                      <label className={implyTrashStates}>
                          Müllzustand implizieren: <input type="checkbox" checked={implyTrashStates} onChange={toggleImplyTrashStates}/>
                      </label>
                  </div>
              </div>
                  <div className="DFAContainer">
                      <button onClick={checkIsDFA}>Ist das ein DFA?</button>
                      <div className={`DFAAnzeige ${isDfaResult !== null ? (isDfaResult ? 'true' : 'false') : ''}`}>
                          {isDfaResult !== null && (<div>{isDfaResult ? 'Ja' : 'Nein'}</div>)}
                      </div>
                  </div>

                      <Partitioner
                          isDfaResult={isDfaResult}
                          nodes={nodes}
                          edges={edges}
                          alphabet={alphabet}
                          partitions={partitions}
                          setPartitions={setPartitions}
                          triggerCalculation={triggerCalculation}
                          setTriggerCalculation={setTriggerCalculation}
                          partitionsHistory={partitionsHistory}
                          setPartitionsHistory={setPartitionsHistory}
                      />
                  <div className="partitionen">
                      {partitions.map((partition, index) =>
                          partition.map(node => node.data.label).join("  ") + (index < partitions.length - 1 ? " | " : "")
                      )}
                  </div>
                  <div className="partition-history">
                      {partitionsHistory.map((historyEntry, index) => (
                          <div key={index} className="history-entry">
                              <div className="step-number">{index+1}.Step</div>
                              {renderPartitionWithSymbol(historyEntry)}
                          </div>
                      ))}
                  </div>
          </div>
              <div className="reactFlowsContainer" style={{ height: '140vh', width: '90%', marginBottom: '20px' }}>

        <ReactFlow
            ref={ref}
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onPaneClick={onPaneClick}
            onConnect={onConnect}
            edgeTypes={EdgeTypes}
            nodeTypes={NodeTypes}
            onNodeContextMenu = {onNodeContextMenu}
            onEdgeContextMenu = {onEdgeContextMenu}
            fitView //Für den automatischen Fullscreen
        >
          <Controls />
          <MiniMap pannable />
          <Background variant="dots" gap={15} size={1} />
            {menu && <NodeContextMenu onClick={onPaneClick} {...menu} />}
            {edgemenu && <EdgeContextMenu onClick={onPaneClick} {...edgemenu} />}
        </ReactFlow>

                  <div className="finalFlowrenderer" style={{ height: '65vh', width: '43%' }}>
                  {partitions && isDfaResult &&(
                  <ReactFlow
                      ref={refFinal}
                      nodes={finalnodes}
                      edges={finaledges}
                      onNodesChange={onfinalNodesChange}
                      onEdgesChange={onfinalEdgesChange}
                      edgeTypes={EdgeTypes}
                      nodeTypes={NodeTypes}
                      fitView
                      nodesDraggable={false}
                      nodesConnectable={false}
                      elementsSelectable={false}
                      paneMoveable={false}
                      zoomOnScroll={false}
                      zoomOnDoubleClick={false}
                  >
                      <Controls
                          showZoom = {false}
                          showInteractive ={false}/>
                  </ReactFlow>
                  )}
                 </div>
              </div>
          </div>

          <footer className="footer">
              <p><strong>&copy; 2024 Henning Köpf</strong> - <strong>Kontakt:</strong> ************@gmx.de</p>
          </footer>


          </>

  );
}
export default App;




