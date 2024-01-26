import React, { useCallback } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
    Connection,
    Edge,
    EdgeTypes,
    Node,
} from 'reactflow';
import 'reactflow/dist/style.css';
import './updatenode.css';
import MenuContext from "./components/MenuContext";
import { data } from "./data/data";

import NewNodeButton from './buttonfunctions';

const initialNodes = [
  { id: '1', position: { x: 0, y: 0 }, data: { label: '1' } },
  { id: '2', position: { x: 30, y: 75 }, data: { label: '2' } },
  { id: '3', position: { x: 150, y: 150 }, data: { label: '3' } },
];

const initialEdges = [{ id: 'e1-2', source: '1', target: '2' },
    { id: 'e2-3', source: '2', target: '3' ,label: 'a'}];




function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);


  const onConnect = useCallback(
      (params) => setEdges((eds) => addEdge(params, eds)),
      [setEdges],
  );

  return (
      <div className="App"
          style={{ width: '100vw', height: '60vh' }}>


            <MenuContext data={data} />
        <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
        >
          <Controls />
          <MiniMap />
          <Background variant="dots" gap={15} size={1} />
        </ReactFlow>
        <NewNodeButton/>
      </div>
  );
}
export default App;