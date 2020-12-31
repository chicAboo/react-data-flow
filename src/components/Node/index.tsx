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
}

const Node: FC<NodeProps> = ({ node }) => {
  const { position, title } = node;
  const { width, height, strokeColor, fill, radius } = config.rect;
  const rectText = config.rectText;

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
        fill={fill}
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
      <Points node={node} />
    </g>
  );
};

export default memo(Node);
