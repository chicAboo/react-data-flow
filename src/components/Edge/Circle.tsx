/**
 * @author ChicAboo
 * @date 2020/12/28 10:36 上午
 */
import React, { FC } from 'react';
import { EdgeTypes, XYPosition } from '@/typings';
import { config } from '@/constants/config';

interface CircleProps {
  edge: EdgeTypes;
  position: XYPosition;
}
const Circle: FC<CircleProps> = ({ edge, position }) => {
  const { cbStyle, addStyle, marginTop } = config.lineCircle;
  const isAdd = edge.text && edge.text !== '+' && edge.text.toString().length > 0;
  const content = isAdd ? edge.text : '+';
  const attr = !isAdd ? addStyle : cbStyle;
  return (
    <g cursor="pointer">
      <circle
        cx={position.x}
        cy={position.y}
        r={attr.radius}
        fill={attr.fill}
        stroke={attr.stroke}
      />
      <text
        x={position.x}
        y={position.y + marginTop}
        fill={attr.textFill}
        textAnchor={attr.textAnchor}
        fontSize={attr.fontSize}>
        {content}
      </text>
    </g>
  );
};

export default Circle;
