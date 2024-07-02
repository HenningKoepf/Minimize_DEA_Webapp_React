import React from 'react';
import { BaseEdge, BaseEdgeProps, EdgeLabelRenderer,  } from 'reactflow';

/**
 * Für Übergänge von einem Zustand in sich selbst, wird die Kante als halbkreis über dem Zustand gerendert.
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
export default function SelfConnecting(props: BaseEdgeProps){


  const { sourceX, sourceY, targetX, targetY, markerEnd, label,style } = props;
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