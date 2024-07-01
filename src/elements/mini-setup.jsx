import {
    Node, MarkerType

} from 'reactflow';


export const miniNodes: Node[] = [

    {
        id: 'Z1',
        style: {backgroundColor: '#007bff' },
        data: { label: 'Z1' , input: true},
        position: { x: 100, y: 100 },
        sourcePosition: 'right',
        targetPosition: 'left',
    },
    {
        id: 'Z2',
        style: {
            border: "3px solid black" ,
            borderStyle: "double",
        },
        data: {label: 'Z2', output: true },
        position: { x: 300, y: 100 },
        targetPosition: 'left',
        sourcePosition: 'right'
    },
];


export const miniEdges: Edge[] = [

    {
        id: 'edge-Z1-Z2',
        source: 'Z1',
        target: 'Z2',
        label: 'a',
        markerEnd: { type: MarkerType.ArrowClosed }
    },
    {
        id: 'edge-Z2-Z2',
        source: 'Z2',
        target: 'Z2',
        type: 'selfconnecting',
        label: 'a',
        markerEnd: { type: MarkerType.ArrowClosed }
    }

];
