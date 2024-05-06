import React, {useCallback} from 'react';
import { useReactFlow } from 'reactflow';


/**
 * Öffnet ein Kontextmenü bei Rechtsklick auf einen Knoten um diesen zu
 * einem Endzustand zu machen
 * einem Startzustand zu machen
 * zu löschen
 * einen neuen Knoten zu erzeugen
 * @param id
 * @param top
 * @param left
 * @param right
 * @param bottom
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
export default function NodeContextMenu({
  id,
  top,
  left,
  right,
  bottom,
  ...props
}) {
  const { getNode, setNodes, addNodes, setEdges } = useReactFlow();
  const newHandlerId = Math.random();

  /**
   * Funktion um einen neuen Knoten mit eigenen Handlers für neue Edges zu erstellen.
   * Einzige möglichkeit um neue Knoten auf dem Pane und dem DOM hinzuzufügen
   * @type {(function(): void)|*}
   */
  const duplicateNode = useCallback(() => {
    const node = getNode(id);
    const position = {
      x: node.position.x + 50,
      y: node.position.y + 50,

    };
    const newNodeLabel = node.data.label.concat("0");

    addNodes({ ...node,id: newNodeLabel, position, data:{ label: newNodeLabel}, style: {}});
  }, [id, getNode, addNodes]);

  /**
   * Knoten wird entfernt und jegliche damit zusammenhzängende Kanten werden aus dem DOM gelöscht
   * Wenn es nur einen inputKnoten oder nur einen Outputknoten gibt, kann der letzte nicht gelöscht werden
   * @type {(function(): void)|*}
   */


  const deleteNode = useCallback(() => {
    setNodes((nodes) => {

      const outputNodesCount = nodes.filter(node => node.data.output).length;
      const inputNodesCount = nodes.filter(node => node.data.input).length;

      const nodeToDelete = nodes.find(node => node.id === id);

      // Überprüfe, ob der zu löschende Knoten ein Output- oder Input-Knoten ist
      const isOutputNode = nodeToDelete?.data.output;
      const isInputNode = nodeToDelete?.data.input;

      // Verhindere das Löschen, wenn es der letzte Output- oder Input-Knoten ist
      if ((isOutputNode && outputNodesCount === 1) || (isInputNode && inputNodesCount === 1)) {
        console.error("Der letzte Output- oder Input-Knoten kann nicht gelöscht werden.");
        alert("Der letzte Output- oder Input-Knoten kann nicht gelöscht werden.");
        return nodes;

      }
      else{

      // Sonst lösche alle übergänge aus dem state und den Knoten
        const newNodes = nodes.filter((node) => node.id !== id);
        setEdges((edges) => edges.filter((edge) => edge.source !== id && edge.target !== id));  // Kombiniere beide Filteroperationen für react states
        return newNodes;

      }
    });
  }, [id, setNodes, setEdges]);




  /**
   * Funktion um einem Knoten den Zustand eines "Startzustandes" zu verpassen, inkl styling
   * @type {(function(): void)|*}
   */
  const changeToInputNode = useCallback(() => {
    setNodes((nodes) =>

        nodes.map((node) => {

          if (node.id === id){
            const currentlyInput = node.data.input;
            const newInputState = !currentlyInput;

            const newStyle = newInputState ? {
              ...node.style, backgroundColor: '#a4d36b'}
                : {
              ...node.style,
              backgroundColor: undefined,
            };

            return {...node,  data: {...node.data, input: newInputState} ,style: {...newStyle},}
          }
          return node;
        })
    );
  }, [id, setNodes]);

  /**
   * Funktion um einem Knoten den Zustand eines "Endzustandes" zu verpassen, inkl styling
   * Wenn der aktuelle Knoten ein Inputknoten ist, werden dessen props erweitert aber nicht überschrieben
   * @type {(function(): void)|*}
   */

  const changeToOutputNode = useCallback(() => {
    setNodes((nodes) =>
        nodes.map((node) => {
          if (node.id === id){
            const currentlyOutput = node.data.output;
            const newOutputState = !currentlyOutput;

            let text = node.data.label;

            const newStyle = newOutputState ? {
              ...node.style,
              border: "3px solid black",
              borderStyle: "double",
            } : {
              ...node.style,
              border: undefined,
              borderStyle: undefined,
            };

            return {...node ,targetPosition: 'left',
              style: { ...newStyle},
              sourcePosition: 'right',
              data: { ...node.data,label: text, output: newOutputState }}
          }
          return node;
        })
    );
  }, [id, setNodes, getNode, addNodes]);


  const defaultNode = useCallback(() => {
    setNodes((nodes) => {

      const outputNodesCount = nodes.filter(node => node.data.output).length;
      const inputNodesCount = nodes.filter(node => node.data.input).length;


      return nodes.map((node) => {
        if (node.id === id) {
          // Überprüfe, ob es sich um den letzten Output- oder Input-Knoten handelt
          const isLastOutputNode = node.data.output && outputNodesCount === 1;
          const isLastInputNode = node.data.input && inputNodesCount === 1;

          // Verhindere die Änderung, wenn es der letzte Knoten seiner Art ist
          if (isLastOutputNode || isLastInputNode) {
            alert("Die Standardisierung des letzten Output- oder Input-Knotens ist nicht erlaubt.");
            return node;
          }

        //Text übernehmen aber input/output initalisierren
          let text = node.data.label;
          return { ...node, data: { label: text }, style: undefined };
        }

        return node;
      });
    });
  }, [id, setNodes]);


  /**
   * Funktion um einen Knoten umzubenennen, autom. rerendering über Callback
   * @type {(function(): void)|*}
   */
  const renameNode = useCallback(() => {
    const newLabel = window.prompt("Geben Sie den neuen Namen für den Knoten ein:", "");
    if (newLabel && newLabel.trim() !== "") {
      // Map auf alle knoten, einen neuen zrück
      setNodes((prevNodes) =>
          prevNodes.map((node) => node.id === id ? { ...node, id: newLabel, data: { ...node.data, label: newLabel } } : node)
      );

      // Aktualisiere die Kanten, um die neue Knoten-ID zu reffen
      setEdges((prevEdges) =>
          prevEdges.map((edge) => ({
            ...edge,
            source: edge.source === id ? newLabel : edge.source,
            target: edge.target === id ? newLabel : edge.target,
          }))
      );
    }
  }, [id, setNodes, setEdges]);


  return (
    <div
      style={{ top, left, right, bottom }}
      className="context-menu"
      {...props}
    >
      <p style={{ margin: '0.5em' }}>
        <small>node: {id}</small>
      </p>
      <button onClick={duplicateNode}>Neuer Zustand </button>
      <button onClick={deleteNode}>Zustand Löschen</button>
      <button onClick ={renameNode}>Zustand Umbenennen</button>
      <button onClick={defaultNode}>Standard Zustand</button>
      <button onClick = {changeToInputNode}>Startzustand umschalten</button>
      <button onClick = {changeToOutputNode}>Endzustand umschalten</button>
    </div>
  );
}
