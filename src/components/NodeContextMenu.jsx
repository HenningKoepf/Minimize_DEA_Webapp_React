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
  const { setNodes, setEdges } = useReactFlow();


  /**
   * Funktion um einen neuen Knoten mit eigenen Handlers für neue Edges zu erstellen.
   * Möglichkeit um neue Knoten auf dem Pane und dem DOM hinzuzufügen obsolete draganddrop
   * @type {(function(): void)|*}
   */
  /*
  const duplicateNode = useCallback(() => {
    const node = getNode(id);
    const position = {
      x: node.position.x + 50,
      y: node.position.y + 50,

    };
    const newNodeLabel = node.data.label.concat("0");

    addNodes({ ...node,id: newNodeLabel, position, data:{ label: newNodeLabel}, style: {}});
  }, [id, getNode, addNodes]);

   */

  /**
   * Knoten wird entfernt und jegliche damit zusammenhzängende Kanten werden aus dem DOM gelöscht
   * Wenn es nur einen inputKnoten oder nur einen Outputknoten gibt, kann der letzte nicht gelöscht werden
   * @type {(function(): void)|*}
   */


  const deleteNode = useCallback(() => {
    setNodes((nodes) => {


      const inputNodesCount = nodes.filter(node => node.data.input).length;

      const nodeToDelete = nodes.find(node => node.id === id);

      // Überprüfe, ob der zu löschende Knoten ein Input-Knoten ist
      const isInputNode = nodeToDelete?.data.input;

      // Verhindere das Löschen, wenn es der letzte Input-Knoten ist
      if  (isInputNode && inputNodesCount === 1) {
        console.error("Der einzige Input-Knoten kann nicht gelöscht werden.");
        alert("Der einzige Startzustand sollte nicht gelöscht werden.");
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
   * Funktion um einem Knoten den Zustand eines "Startzustandes" zu verpassen, inkl styling obsolet
   * @type {(function(): void)|*}
   */
  /*
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

   */

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
  }, [id, setNodes]);


  const defaultNode = useCallback(() => {
    setNodes((nodes) => {
      const inputNodesCount = nodes.filter(node => node.data.input).length;


      return nodes.map((node) => {
        if (node.id === id) {
          // Überprüfe, ob es sich um den letzten Input-Knoten handelt
          const isLastInputNode = node.data.input && inputNodesCount === 1;

          // Verhindere die Änderung, wenn es der letzte Knoten seiner Art ist
          if ( isLastInputNode) {
            alert("Die Standardisierung des Input-Knoten ist nicht vorgesehen.");
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
   * erzeugt beim umbenennen auch einen neuen hidden Knoten mit neuem edge
   * ein bisschen wonky denn die hiddenNodes werden nur üüber is postfix identifiziert
   * @type {(function(): void)|*}
   */
  const renameNode = useCallback(() => {
    const newLabel = window.prompt("Geben Sie den neuen Bezeichner für den Zustand ein:", "");
    if (newLabel && newLabel.trim() !== "") {
      // Map auf alle Knoten, einen neuen dann zurück
      setNodes((prevNodes) =>
          prevNodes.map((node) => {
            if (node.id === id) {
              const newNode = { ...node, id: newLabel, data: { ...node.data, label: newLabel } };

              // damit der versteckte knoten weiterhin mit dem gleichen handler arbeiten kann
              if (node.data.input) {
                const hiddenNode = prevNodes.find(n => n.id === `${id}-hidden`);
                if (hiddenNode) {
                  return [
                    { ...hiddenNode, id: `${newLabel}-hidden` },
                    newNode
                  ];
                }
              }
              return newNode;
            } else if (node.id === `${id}-hidden`) {
              return { ...node, id: `${newLabel}-hidden` };
            }
            return node;
          }).flat() // danke für .flat des gemappten arrays
      );

      //auch neue edges dafür schlauer schachteln geht irg wie nicht
      setEdges((prevEdges) =>
          prevEdges.map((edge) => {
            if (edge.source === id) {
              return { ...edge, source: newLabel };
            } else if (edge.target === id) {
              return { ...edge, target: newLabel };
            } else if (edge.source === `${id}-hidden`) {
              return { ...edge, source: `${newLabel}-hidden` };
            }
            return edge;
          })
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
        <small>Zustand: {id}</small>
      </p>

      <button onClick ={renameNode}>Zustand Umbenennen</button>
      <button onClick={defaultNode}>Standard Zustand</button>

      <button onClick = {changeToOutputNode}>Endzustand umschalten</button>
      <button onClick={deleteNode}>Zustand Löschen</button>
    </div>
  );
}
