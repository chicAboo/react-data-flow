/**
 * @author ChicAboo
 * @date 2020/12/25 10:43 上午
 */
import React, { FC, Fragment } from 'react';
import { NodeTypes } from '@/typings';
import { controls, config } from '@/constants/config';
import { _position } from '@/utils';

interface NodeProps {
  node: NodeTypes;
  selectionNode: string;
}
const Points: FC<NodeProps> = ({ node, selectionNode }) => {
  const { point, rect, rectText } = config;
  const { position } = node;
  const isShow = node.id === selectionNode ? 'block' : 'none';

  return (
    <Fragment>
      <g className="points" style={{ display: isShow }}>
        {controls.map((direction: string) => {
          const pos = _position(position.x, position.y, direction);
          return (
            <circle
              key={`${direction}_${node.id}`}
              className="dragPoint"
              // @ts-ignore
              id={node.id}
              direction={direction}
              cx={pos.x}
              cy={pos.y}
              r={point.radius}
              fill={point.fill}
              stroke={point.stroke}
              style={{ cursor: 'crosshair' }}
            />
          );
        })}
        <g className="delNode" id={node.id}>
          <circle
            cx={position.x + rect.width / 2}
            cy={position.y - rect.height / 2}
            r={rect.delRadius}
            fill={rect.fill}
            stroke={rect.strokeColor}
          />
          <text
            x={position.x + rect.width / 2}
            y={position.y - rect.height / 2 + 4}
            fill={rect.strokeColor}
            style={{ textAnchor: 'middle', fontSize: rectText.fontSize, userSelect: 'none' }}>
            x
          </text>
        </g>
      </g>
    </Fragment>
  );
};

export default Points;
