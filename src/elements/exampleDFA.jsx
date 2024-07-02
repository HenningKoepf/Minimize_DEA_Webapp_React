import { Node, Edge, MarkerType } from 'react-flow-renderer';

export const exampleNodes: Node[] = [
    {
        id: 'z0',
        data: { label: 'z0', input: true },
        position: { x: 50, y: 120 },
        style: {backgroundColor: '#007bff'},
        targetPosition: 'left',
        sourcePosition: 'right',
    },
    {
        id: 'z1',
        data: { label: 'z1' },
        position: { x: 250, y: 10 },
        targetPosition: 'left',
        sourcePosition: 'right',
    },
    {
        id: 'z2',
        data: { label: 'z2' },
        position: { x: 180, y: 130 },
        targetPosition: 'left',
        sourcePosition: 'right',
    },
    {
        id: 'z3',
        data: { label: 'z3' },
        position: { x: 180, y: 230 },
        targetPosition: 'left',
        sourcePosition: 'right',
    },
    {
        id: 'z4',
        data: { label: 'z4', output: true },
        position: { x: 350, y: 70 },
        style: {

            border: "3px solid black" ,
            borderStyle: "double",},
        targetPosition: 'left',
        sourcePosition: 'right',
    },
    {
        id: 'z5',
        data: { label: 'z5' , output: true},
        position: { x: 350, y: 170 },
        style: {

            border: "3px solid black" ,
            borderStyle: "double",},
        targetPosition: 'left',
        sourcePosition: 'right',
    },
];

export const exampleEdges: Edge[] = [
    {
        id: 'e-z0-z1-a',
        source: 'z0',
        target: 'z1',
        label: 'a',
        markerEnd: { type: MarkerType.ArrowClosed },
    },
    {
        id: 'e-z0-z2-b',
        source: 'z0',
        target: 'z2',
        label: 'b',
        markerEnd: { type: MarkerType.ArrowClosed },
    },
    {
        id: 'e-z0-z3-c',
        source: 'z0',
        target: 'z3',
        label: 'c',
        markerEnd: { type: MarkerType.ArrowClosed },
    },
    {
        id: 'e-z2-z4-c',
        source: 'z2',
        target: 'z4',
        label: 'c',
        markerEnd: { type: MarkerType.ArrowClosed },
    },
    {
        id: 'e-z1-z4-bc',
        source: 'z1',
        target: 'z4',
        label: 'b, c',
        markerEnd: { type: MarkerType.ArrowClosed },
    },
    {
        id: 'e-z3-z5-c',
        source: 'z3',
        target: 'z5',
        label: 'c',
        markerEnd: { type: MarkerType.ArrowClosed },
    },
    {
        id: 'e-z2-self-ab',
        source: 'z2',
        target: 'z2',
        type: 'selfconnecting',
        label: 'a b',
        markerEnd: { type: MarkerType.ArrowClosed },
    },
    {
        id: 'e-z3-self-ab',
        source: 'z3',
        target: 'z3',
        type: 'selfconnecting',
        label: 'a b',
        markerEnd: { type: MarkerType.ArrowClosed },
    },
    {
        id: 'e-z1-self-a',
        source: 'z1',
        target: 'z1',
        type: 'selfconnecting',
        label: 'a',
        markerEnd: { type: MarkerType.ArrowClosed },
    },

    {
        id: 'e-z4-z5-abc',
        source: 'z4',
        target: 'z5',

        label: 'a, b, c',
        markerEnd: { type: MarkerType.ArrowClosed },
    },

    {
        id: 'e-z5-z4-abc',
        source: 'z5',
        target: 'z4',

        label: 'a, b, c',
        markerEnd: { type: MarkerType.ArrowClosed },
    },

];
