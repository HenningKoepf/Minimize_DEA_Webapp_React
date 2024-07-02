import {
    Node, MarkerType

} from 'reactflow';
import BaseNode from './BaseNode';



export const initialNodes: Node[] = [
    {
        id: 'z0',
        data: { label: 'z0' },
        position: { x: 410, y: 30 },
        targetPosition: 'left',
        sourcePosition: 'right',
    },
    {
        id: 'z1',
        style: {backgroundColor: '#007bff'},
        data: { label: 'z1' , input: true},
        position: { x: 100, y: 50 },
        sourcePosition: 'right',
        targetPosition: 'left',
    },
    {
        id: 'z2',
        data: { label: 'z2' },
        position: { x: 300, y: 50 },
        targetPosition: 'left',
        sourcePosition: 'right',
    },
    {
        id: 'z3',
        data: { label: 'z3' },
        position: { x: 100, y: 250 },
        targetPosition: 'left',
        sourcePosition: 'right',
    },
    {
        id: 'z4',
        data: { label: 'z4' },
        position: { x: 300, y: 250 },
        targetPosition: 'left',
        sourcePosition: 'right',
    },
    {
        id: 'Endzustand',
        style: {

            border: "3px solid black" ,
            borderStyle: "double",},
        data: {label: 'z5', output: true },
        position: { x: 500, y: 150 },
        targetPosition: 'left',
        sourcePosition: 'right'


    },
];

export const initialEdges: Edge[] = [
    {
        id: 'edge-1-2',
        source: 'z1',
        target: 'z2',

        label: 'a',
       
        markerEnd: { type: MarkerType.ArrowClosed },
    },
    {
        id: 'edge-2-3',
        source: 'z2',
        target: 'z3',
        label: 'a',
        markerEnd: { type: MarkerType.ArrowClosed },
    },
    {
        id: 'edge-3-4',
        source: 'z3',
        target: 'z4',
        label: 'a',
        markerEnd: { type: MarkerType.ArrowClosed },
    },
    {
        id: 'edge-4-5',
        source: 'z4',
        target: 'Endzustand',
        label: 'b',
        markerEnd: { type: MarkerType.ArrowClosed },
    },

    {
        id: 'edge-self',
        label: 'a' ,
        source: 'z4',
        target: 'z4',
        type: 'selfconnecting',
        markerEnd: { type: MarkerType.ArrowClosed },
    },
    /*

    {
        id: 'end-self-loop',
        source: 'Endzustand',
        target: 'Endzustand',
        label: 'b' ,
        type: 'selfconnecting',
        markerEnd: { type: MarkerType.ArrowClosed }
    },
     */
];

const initalData = {
    initialNodes,
    initialEdges,
};

export default initalData;