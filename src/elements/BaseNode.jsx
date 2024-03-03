import React, { memo } from 'react';
import ReactFlow, { useReactFlow,} from 'reactflow';

const BaseNode = ({ data }) => {
    const { setNodes } = useReactFlow();
    const className = data.output ? "outputNode" : "basenode";
    return(
        <>
        <div className = {className} >
            {data.label}
        </div>
        </>
    );
};
export default BaseNode;