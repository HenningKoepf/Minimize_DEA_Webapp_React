import { Node, Edge, MarkerType } from 'react-flow-renderer';

export const exampleNodes: Node[] = [
    {
        id: 'Z0',
        data: { label: 'Z0', input: true },
        position: { x: 50, y: 120 },
        style: {backgroundColor: '#a4d36b'},
        targetPosition: 'left',
        sourcePosition: 'right',
    },
    {
        id: 'Z1',
        data: { label: 'Z1' },
        position: { x: 250, y: 10 },
        targetPosition: 'left',
        sourcePosition: 'right',
    },
    {
        id: 'Z2',
        data: { label: 'Z2' },
        position: { x: 180, y: 130 },
        targetPosition: 'left',
        sourcePosition: 'right',
    },
    {
        id: 'Z3',
        data: { label: 'Z3' },
        position: { x: 180, y: 230 },
        targetPosition: 'left',
        sourcePosition: 'right',
    },
    {
        id: 'Z4',
        data: { label: 'Z4', output: true },
        position: { x: 350, y: 70 },
        style: {

            border: "3px solid black" ,
            borderStyle: "double",},
        targetPosition: 'left',
        sourcePosition: 'right',
    },
    {
        id: 'Z5',
        data: { label: 'Z5' , output: true},
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
        id: 'e-Z0-Z1-a',
        source: 'Z0',
        target: 'Z1',
        label: 'a',
        markerEnd: { type: MarkerType.ArrowClosed },
    },
    {
        id: 'e-Z0-Z2-b',
        source: 'Z0',
        target: 'Z2',
        label: 'b',
        markerEnd: { type: MarkerType.ArrowClosed },
    },
    {
        id: 'e-Z0-Z3-c',
        source: 'Z0',
        target: 'Z3',
        label: 'c',
        markerEnd: { type: MarkerType.ArrowClosed },
    },
    {
        id: 'e-Z2-Z4-c',
        source: 'Z2',
        target: 'Z4',
        label: 'c',
        markerEnd: { type: MarkerType.ArrowClosed },
    },
    {
        id: 'e-Z1-Z4-bc',
        source: 'Z1',
        target: 'Z4',
        label: 'b, c',
        markerEnd: { type: MarkerType.ArrowClosed },
    },
    {
        id: 'e-Z3-Z5-c',
        source: 'Z3',
        target: 'Z5',
        label: 'c',
        markerEnd: { type: MarkerType.ArrowClosed },
    },
    {
        id: 'e-Z2-self-ab',
        source: 'Z2',
        target: 'Z2',
        type: 'selfconnecting',
        label: 'a b',
        markerEnd: { type: MarkerType.ArrowClosed },
    },
    {
        id: 'e-Z3-self-ab',
        source: 'Z3',
        target: 'Z3',
        type: 'selfconnecting',
        label: 'a b',
        markerEnd: { type: MarkerType.ArrowClosed },
    },
    {
        id: 'e-Z1-self-a',
        source: 'Z1',
        target: 'Z1',
        type: 'selfconnecting',
        label: 'a',
        markerEnd: { type: MarkerType.ArrowClosed },
    },

    {
        id: 'e-Z4-Z5-abc',
        source: 'Z4',
        target: 'Z5',

        label: 'a, b, c',
        markerEnd: { type: MarkerType.ArrowClosed },
    },

    {
        id: 'e-Z5-Z4-abc',
        source: 'Z5',
        target: 'Z4',

        label: 'a, b, c',
        markerEnd: { type: MarkerType.ArrowClosed },
    },

];
