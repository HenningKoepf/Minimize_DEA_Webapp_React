import {
    Node, MarkerType

} from 'reactflow';


export const initialNodes3: Node[] = [

    {
        id: 'Z0',
        style: {backgroundColor: '#007bff' },
        data: { label: 'Z0' , input: true},
        position: { x: 100, y: 100 },
        sourcePosition: 'right',
        targetPosition: 'left',
    },
    {
        id: 'Z1',
        data: { label: 'Z1' },
        position: { x: 170, y: 20 },
        targetPosition: 'left',
        sourcePosition: 'right',
    },
    {
        id: 'Z2',
        data: { label: 'Z2' },
        position: { x: 200, y: 200 },
        targetPosition: 'left',
        sourcePosition: 'right',
    },
    {
        id: 'Z4',
        data: {label: 'Z4'},
        position: { x: 500, y: 150 },
        targetPosition: 'left',
        sourcePosition: 'right'
    },
    {
        id: 'Z3',
        style: {
            border: "3px solid black" ,
            borderStyle: "double",
        },
        data: {label: 'Z3', output: true },
        position: { x: 400, y: 50 },
        targetPosition: 'left',
        sourcePosition: 'right'
    },
    {
        id: 'Z5',
        style: {
            border: "3px solid black" ,
            borderStyle: "double",
        },
        data: {label: 'Z5', output: true },
        position: { x: 500, y: 50 },
        targetPosition: 'left',
        sourcePosition: 'right'
    },
];


export const initialEdges3: Edge[] = [

    {
        id: 'edge-Z0-Z1',
        source: 'Z0',
        target: 'Z1',
        label: 'a',
        markerEnd: { type: MarkerType.ArrowClosed },
    },
    {
        id: 'edge-Z0-Z3',
        source: 'Z0',
        target: 'Z3',
        label: 'b',
        markerEnd: { type: MarkerType.ArrowClosed },
    },
    {
        id: 'edge-Z1-Z5',
        source: 'Z1',
        target: 'Z5',
        label: 'b',
        markerEnd: { type: MarkerType.ArrowClosed },
    },
    {
        id: 'edge-Z1-Z2',
        source: 'Z1',
        target: 'Z2',
        label: 'a',
        markerEnd: { type: MarkerType.ArrowClosed },
    },
    {
        id: 'edge-Z2-Z1',
        source: 'Z2',
        target: 'Z1',
        label: 'a',
        markerEnd: { type: MarkerType.ArrowClosed },
    },
    {
        id: 'edge-Z2-Z3',
        label: 'b' ,
        source: 'Z2',
        target: 'Z3',
        markerEnd: { type: MarkerType.ArrowClosed },
    },
    {
        id: 'edge-Z3-Z1',
        label: 'a' ,
        source: 'Z3',
        target: 'Z1',
        markerEnd: { type: MarkerType.ArrowClosed },
    },
    {
        id: 'edge-Z3-Z2',
        label: 'b' ,
        source: 'Z3',
        target: 'Z2',
        markerEnd: { type: MarkerType.ArrowClosed },
    },
    {
        id: 'edge-Z4-Z3',
        label: 'b' ,
        source: 'Z4',
        target: 'Z3',
        markerEnd: { type: MarkerType.ArrowClosed },
    },
    {
        id: 'edge-Z4-Z1',
        label: 'a' ,
        source: 'Z4',
        target: 'Z1',
        markerEnd: { type: MarkerType.ArrowClosed },
    },
    {
        id: 'edge-Z5-Z4',
        label: 'a' ,
        source: 'Z5',
        target: 'Z4',
        markerEnd: { type: MarkerType.ArrowClosed },
    },
    {
        id: 'edge-Z5-Z5',
        label: 'b' ,
        source: 'Z5',
        target: 'Z5',
        type: 'selfconnecting',
        markerEnd: { type: MarkerType.ArrowClosed },
    },

];
