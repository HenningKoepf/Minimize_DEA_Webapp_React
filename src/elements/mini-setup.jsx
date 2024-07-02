import {
    Node, MarkerType

} from 'reactflow';


export const miniNodes: Node[] = [

    {
        id: 'z1',
        style: {backgroundColor: '#007bff' },
        data: { label: 'z1' , input: true},
        position: { x: 100, y: 100 },
        sourcePosition: 'right',
        targetPosition: 'left',
    },
    {
        id: 'z2',
        style: {
            border: "3px solid black" ,
            borderStyle: "double",
        },
        data: {label: 'z2', output: true },
        position: { x: 300, y: 100 },
        targetPosition: 'left',
        sourcePosition: 'right'
    },
];


export const miniEdges: Edge[] = [

    {
        id: 'edge-z1-z2',
        source: 'z1',
        target: 'z2',
        label: 'a',
        markerEnd: { type: MarkerType.ArrowClosed }
    },
    {
        id: 'edge-z2-z2',
        source: 'z2',
        target: 'z2',
        type: 'selfconnecting',
        label: 'a',
        markerEnd: { type: MarkerType.ArrowClosed }
    }

];
