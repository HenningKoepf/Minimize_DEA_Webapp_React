import {
    Node, MarkerType

} from 'reactflow';
import BaseNode from './BaseNode';



export const initialNodes: Node[] = [
    {
        id: 'Z0',
        data: { label: 'Z0' },
        position: { x: 410, y: 30 },
        targetPosition: 'left',
        sourcePosition: 'right',
    },
    {
        id: 'Z1',
        style: {backgroundColor: '#5a4eab'},
        data: { label: 'Z1' , input: true},
        position: { x: 100, y: 50 },
        sourcePosition: 'right',
        targetPosition: 'left',
    },
    {
        id: 'Z2',
        data: { label: 'Z2' },
        position: { x: 300, y: 50 },
        targetPosition: 'left',
        sourcePosition: 'right',
    },
    {
        id: 'Z3',
        data: { label: 'Z3' },
        position: { x: 100, y: 250 },
        targetPosition: 'left',
        sourcePosition: 'right',
    },
    {
        id: 'Z4',
        data: { label: 'Z4' },
        position: { x: 300, y: 250 },
        targetPosition: 'left',
        sourcePosition: 'right',
    },
    {
        id: 'Endzustand',
        style: {
            backgroundColor: '#12e81d',
            border: "2px solid black" ,
            borderStyle: "double",},
        data: {label: 'Z5', output: true },
        position: { x: 500, y: 150 },
        targetPosition: 'left',
        sourcePosition: 'right'


    },
];

export const initialEdges: Edge[] = [
    {
        id: 'edge-1-2',
        source: 'Z1',
        target: 'Z2',

        label: 'a',
       
        markerEnd: { type: MarkerType.ArrowClosed },
    },
    {
        id: 'edge-2-3',
        source: 'Z2',
        target: 'Z3',
        label: 'a',
        markerEnd: { type: MarkerType.ArrowClosed },
    },
    {
        id: 'edge-3-4',
        source: 'Z3',
        target: 'Z4',
        label: 'a',
        markerEnd: { type: MarkerType.ArrowClosed },
    },
    {
        id: 'edge-4-5',
        source: 'Z4',
        target: 'Endzustand',
        label: 'b',
        markerEnd: { type: MarkerType.ArrowClosed },
    },

    {
        id: 'edge-self',
        label: 'a' ,
        source: 'Z4',
        target: 'Z4',
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