import { Node, Edge, MarkerType } from 'reactflow';

export const initialNodes: Node[] = [

    {
        id: 'z1',
        style: { backgroundColor: '#007bff' },
        data: { label: 'z1', input: true },
        position: { x: 100, y: 100 },
        sourcePosition: 'right',
        targetPosition: 'left',
    },
    {
        id: 'z2',
        data: { label: 'z2' },
        position: { x: 250, y: 50 },
        targetPosition: 'left',
        sourcePosition: 'right',
    },
    {
        id: 'z3',
        data: { label: 'z3' },
        position: { x: 250, y: 150 },
        targetPosition: 'left',
        sourcePosition: 'right',
    },
    {
        id: 'z5',
        style: {
            border: "3px solid black",
            borderStyle: "double",
        },
        data: { label: 'z5', output: true },
        position: { x: 500, y: 150 },
        targetPosition: 'left',
        sourcePosition: 'right',
    },
    {
        id: 'z6',
        style: {
            border: "3px solid black",
            borderStyle: "double",
        },
        data: { label: 'z6', output: true },
        position: { x: 500, y: 50 },
        targetPosition: 'left',
        sourcePosition: 'right',
    },
];

export const initialEdges: Edge[] = [

    {
        id: 'edge-z1-z2',
        source: 'z1',
        target: 'z2',
        label: 'a',
        markerEnd: { type: MarkerType.ArrowClosed },
    },
    {
        id: 'edge-z1-z3',
        source: 'z1',
        target: 'z3',
        label: 'b',
        markerEnd: { type: MarkerType.ArrowClosed },
    },
    {
        id: 'edge-z3-z5',
        source: 'z3',
        target: 'z5',
        label: 'a, b',
        markerEnd: { type: MarkerType.ArrowClosed },
    },
    {
        id: 'edge-z2-z6',
        source: 'z2',
        target: 'z6',
        label: 'b',
        markerEnd: { type: MarkerType.ArrowClosed },
    },
    {
        id: 'edge-z2-z3',
        source: 'z2',
        target: 'z3',
        label: 'a',
        markerEnd: { type: MarkerType.ArrowClosed },
    },
    {
        id: 'edge-z5-z5',
        label: 'a, b',
        source: 'z5',
        target: 'z5',
        type: 'selfconnecting',
        markerEnd: { type: MarkerType.ArrowClosed },
    },
    {
        id: 'edge-z6-z6',
        label: 'a b',
        source: 'z6',
        target: 'z6',
        type: 'selfconnecting',
        markerEnd: { type: MarkerType.ArrowClosed },
    },
];
