import React from 'react';
import { BaseEdge, BaseEdgeProps, EdgeLabelRenderer,  } from 'reactflow';

export default function SelfConnecting(props: BaseEdgeProps){

  // we are using the default bezier edge when source and target ids are different
  // wird schon in der App abgefangen.

  const { sourceX, sourceY, targetX, targetY, id, markerEnd, label,style } = props;
  const radiusX = (sourceX - targetX) * 0.5;
  const radiusY = 40;
  const edgePath = `M ${sourceX - 5} ${sourceY} A ${radiusX} ${radiusY} 0 1 0 ${
    targetX + 2
  } ${targetY}`;

  const labelX = (sourceX + targetX) / 2;
  const labelY = (sourceY + targetY) / 2 - 65; // Etwas oberhalb der Mitte der Kante


  return(
  <>
    <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />;
    <EdgeLabelRenderer>
      <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            fontSize: 12,
            // everything inside EdgeLabelRenderer has no pointer events by default
            // if you have an interactive element, set pointer-events: all
            pointerEvents: 'all',
          }}
          className="nodrag nopan"
      >
        {label}
      </div>
    </EdgeLabelRenderer>

  </>
  )

}