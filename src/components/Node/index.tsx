/**
 * @author ChicAboo
 * @date 2020/12/24 8:43 下午
 */
import React, { FC, memo } from 'react';
import { NodeTypes } from '@/typings';
import { config } from '@/constants/config';
import '@/assets/style/index.scss';
import Points from './Points';

interface NodeProps {
  node: NodeTypes;
  selectionNode: string;
}

const Node: FC<NodeProps> = ({ node, selectionNode }) => {
  const { position, title } = node;
  const { width, height, strokeColor, fill, radius, hover } = config.rect;
  const rectText = config.rectText;
  const rectFill = node.id === selectionNode ? hover.fill : fill;

  return (
    <g className="node nodeDraggable" id={node.id}>
      <rect
        className="rectNode"
        x={position.x - width / 2}
        y={position.y - height / 2}
        rx={radius}
        ry={radius}
        width={width}
        height={height}
        stroke={strokeColor}
        fill={rectFill}
      />
      <text
        className="rectTextNode"
        id={`text_id_${node.id}`}
        x={position.x}
        y={position.y + rectText.marginTop}
        fill={rectText.fill}
        style={{ textAnchor: 'middle', fontSize: rectText.fontSize, userSelect: 'none' }}>
        {title}
      </text>
      <Points node={node} selectionNode={selectionNode} />
    </g>
  );
};

export default memo(Node);
