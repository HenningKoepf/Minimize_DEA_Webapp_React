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
import 'reactflow/dist/style.css';
import './styles/styles.css'
import './updatenode.css';

import NodeContextMenu from './components/NodeContextMenu';
import EdgeContextMenu from './components/EdgeContextMenu';
import SelfConnectingEdge from './elements/SelfConnectingEdge';
import BaseNode from './elements/BaseNode';

//import { initialNodes, initialEdges } from './elements/initial-setup';
import { initialNodes, initialEdges } from './elements/initial-setup2';
import Partitioner from './components/Partitioner';
import {findPartitionForState, findTargetState} from './components/Partitioner';
import { data } from "./data/data";
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

    const [alphabet, setAlphabet] = useState(['a', 'b', 'c']);



    const initialPartition = (nodes) => {
        const endStates = nodes.filter(node => node.data.output);
        const nonEndStates = nodes.filter(node => !node.data.output);
        return [nonEndStates, endStates];
    };
    const [partitions, setPartitions] = useState(initialPartition(nodes));
    const [partitionsHistory, setPartitionsHistory] = useState([]);

    //Wenn der Automat geändert wird, werden die Partitionen initialisiert.
    useEffect(() => {
        const updatedPartitions = initialPartition(nodes);
        setPartitions(updatedPartitions);
        setPartitionsHistory([]);
        setIsDfaResult(null);
    }, [nodes, alphabet, edges]);

    /**
     * Refs für die einzelnen Komponenten, damit kan nich dynamisch auf die Größenänderungen reagieren
     * @type {{current: (unknown|null)}}
     */
    const ref = useRef(null);
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

                // Erstelle das Edge-Objekt mit dem Label

                // Aktualisiere die Edge-Liste
                setEdges((edges) => [...edges, newEdge]);
             }
            },
// Zwei Knoten werden per Drag and Drop verbunden
        [setEdges]
    );
    /**
     * Öffnet das Kontextmenü der Knoten
     * @type {(function(*, *): void)|*}
     */
//Kontextmenü der Knoten


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
            const left = Math.min(clickX- kontrollContainerWidth , pane.width - kontrollContainerWidth - 100); // Begrenze die linke Position entsprechend der Breite des .Kontrollcontainer
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
        const result = isDFA(nodes, edges, alphabet);
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

        // Gibt es genau einen Startzustand
        const startStates = nodes.filter(node => node.data.input == true);
        if (startStates.length !== 1) {
            console.error("Es muss genau einen Startzustand geben.");
            alert("Startzustand ist nicht eindeutig");
            return false;
        }
        const startStateId = startStates[0].id; //Breitensuche aufsetzpunkt
        const transitions = new Map();

        // Initialisieren der Transitions Map mit leeren Sets
        nodes.forEach(node => {
            alphabet.forEach(symbol => {
                const key = `${node.id}-${symbol}`;
                transitions.set(key, new Set());
            });
        });
        const stateLabels = new Set();

        for (const node of nodes) {
            if (stateLabels.has(node.data.label)) {
                // Wenn das Label bereits im Set ist, gibt es ein Duplikat
                console.error(`Mehrere Zustände mit dem Label '${node.data.label}' gefunden.`);
                alert(`Es ist kein DFA. Mehrere Zustände mit dem Label '${node.data.label}' gefunden.`);
                return false;
            }
            stateLabels.add(node.data.label);
        }

        // Verarbeiten der Kanten und Überprüfen der Symbole gegen das Alphabet
        for (const edge of edges) {

            const symbols = edge.label.split(/[,;\s]\s*/).map(symbol => symbol.trim());
                /*
                Ünterstützt mehrere Symbole pro Kante, Trennung mit , oder ; oder Leerzeichen möglich
                 */

            for (const symbol of symbols) {
                if (!alphabet.includes(symbol)) {
                    // Symbol nicht im Alphabet, daher kein gültiger DFA
                    console.error(`Ungültiges Symbol '${symbol}' in Kante '${edge.id}' gefunden.`);
                    alert(`Es ist kein DFA. Ungültiges Symbol '${symbol}' in Kante '${edge.id}' gefunden.`);

                    return false;
                }
                const key = `${edge.source}-${symbol}`;
                if (transitions.has(key)) {
                    transitions.get(key).add(edge.target);
                } else {
                    // Initialisiert einen neuen Set, falls noch nicht vorhanden
                    transitions.set(key, new Set([edge.target]));
                }
            }
        }

        // Überprüfen, ob es für jedes Symbol in jedem Zustand höchstens einen Übergang gibt
        for (let [key, targetStates] of transitions) {
            if (targetStates.size > 1) {
                alert(`Es ist kein DFA. Ungültiges Symbol beim Knoten '${key}' `);
                console.error(`Ungültiges Symbol beim Knoten '${key}' gefunden.`);
                // Mehr als ein Übergang für ein Symbol in einem Zustand gefunden das wid kein DFA sein

                return false;
            }
        }

        //Sind alle Zustände vom Startzustand erreichbar
        let visited = new Set();
        let queue = [startStateId];
        while (queue.length > 0) {
            const currentState = queue.shift();
            if (!visited.has(currentState)) {
                visited.add(currentState);
                edges.forEach(edge => {
                    if (edge.source === currentState && !visited.has(edge.target)) {
                        queue.push(edge.target);
                    }
                });
            }
        }

        if (visited.size !== nodes.length) {
            alert("Nicht alle Zustände sind erreichbar.");
            return false;
        }
        return true; // Der Automat ist ein DFA (wir implizieren Müllzustände))
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


    const resetPage = () =>{
        window.location.reload();
    }

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



    return (
      <>
     <div className="toptext" ref={topTextRef} >D F A ---  M I N I M I E R E R ! </div>

          <div className="App"
          style={{ width: '100vw', height: '60vw' }}>

              <div className="Kontrollcontainer" ref={kontrollContainerRef}>

                  <button onClick={resetPage}> Reset </button>
                  <div className="DFAContainer">
                  <button onClick={checkIsDFA}>Ist das ein DFA?</button>
                  <div className={`DFAAnzeige ${isDfaResult !== null ? (isDfaResult ? 'true' : 'false') : ''}`}>
                      {isDfaResult !== null && (<div>{isDfaResult ? 'Ja' : 'Nein'}</div>)}
                  </div>
              </div>
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

          </div>

          <footer>
              <p><strong>&copy; 2024 Henning Köpf</strong> - <strong>Kontakt:</strong> ************@gmx.de</p>
          </footer>
          </>

  );
}
export default App;




