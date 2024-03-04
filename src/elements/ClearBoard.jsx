import {
    Node

} from 'reactflow';
import BaseNode from './BaseNode';



export const initialNode: Node[] = [
    {
        id: 'Z1',
        style: {backgroundColor: '#5a4eab'},
        data: { label: 'Z1' , input: true},
        position: { x: 100, y: 50 },
        sourcePosition: 'right',
        targetPosition: 'left',
    },
];

export const noEdges: Edge[] = [

];

const clearData = {
    initialNode,
    noEdges,
};

export default clearData;