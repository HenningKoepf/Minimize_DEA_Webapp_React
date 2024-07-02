import {
    Node, MarkerType

} from 'reactflow';


export const initialNodes3: Node[] = [

    {
        id: 'z0',
        style: {backgroundColor: '#007bff' },
        data: { label: 'z0' , input: true},
        position: { x: 100, y: 100 },
        sourcePosition: 'right',
        targetPosition: 'left',
    },
    {
        id: 'z1',
        data: { label: 'z1' },
        position: { x: 170, y: 20 },
        targetPosition: 'left',
        sourcePosition: 'right',
    },
    {
        id: 'z2',
        data: { label: 'z2' },
        position: { x: 200, y: 200 },
        targetPosition: 'left',
        sourcePosition: 'right',
    },
    {
        id: 'z4',
        data: {label: 'z4'},
        position: { x: 500, y: 150 },
        targetPosition: 'left',
        sourcePosition: 'right'
    },
    {
        id: 'z3',
        style: {
            border: "3px solid black" ,
            borderStyle: "double",
        },
        data: {label: 'z3', output: true },
        position: { x: 400, y: 50 },
        targetPosition: 'left',
        sourcePosition: 'right'
    },
    {
        id: 'z5',
        style: {
            border: "3px solid black" ,
            borderStyle: "double",
        },
        data: {label: 'z5', output: true },
        position: { x: 500, y: 50 },
        targetPosition: 'left',
        sourcePosition: 'right'
    },
];


export const initialEdges3: Edge[] = [

    {
        id: 'edge-z0-z1',
        source: 'z0',
        target: 'z1',
        label: 'a',
        markerEnd: { type: MarkerType.ArrowClosed },
    },
    {
        id: 'edge-z0-z3',
        source: 'z0',
        target: 'z3',
        label: 'b',
        markerEnd: { type: MarkerType.ArrowClosed },
    },
    {
        id: 'edge-z1-z5',
        source: 'z1',
        target: 'z5',
        label: 'b',
        markerEnd: { type: MarkerType.ArrowClosed },
    },
    {
        id: 'edge-z1-z2',
        source: 'z1',
        target: 'z2',
        label: 'a',
        markerEnd: { type: MarkerType.ArrowClosed },
    },
    {
        id: 'edge-z2-z1',
        source: 'z2',
        target: 'z1',
        label: 'a',
        markerEnd: { type: MarkerType.ArrowClosed },
    },
    {
        id: 'edge-z2-z3',
        label: 'b' ,
        source: 'z2',
        target: 'z3',
        markerEnd: { type: MarkerType.ArrowClosed },
    },
    {
        id: 'edge-z3-z1',
        label: 'a' ,
        source: 'z3',
        target: 'z1',
        markerEnd: { type: MarkerType.ArrowClosed },
    },
    {
        id: 'edge-z3-z2',
        label: 'b' ,
        source: 'z3',
        target: 'z2',
        markerEnd: { type: MarkerType.ArrowClosed },
    },
    {
        id: 'edge-z4-z3',
        label: 'b' ,
        source: 'z4',
        target: 'z3',
        markerEnd: { type: MarkerType.ArrowClosed },
    },
    {
        id: 'edge-z4-z1',
        label: 'a' ,
        source: 'z4',
        target: 'z1',
        markerEnd: { type: MarkerType.ArrowClosed },
    },
    {
        id: 'edge-z5-z4',
        label: 'a' ,
        source: 'z5',
        target: 'z4',
        markerEnd: { type: MarkerType.ArrowClosed },
    },
    {
        id: 'edge-z5-z5',
        label: 'b' ,
        source: 'z5',
        target: 'z5',
        type: 'selfconnecting',
        markerEnd: { type: MarkerType.ArrowClosed },
    },

];
