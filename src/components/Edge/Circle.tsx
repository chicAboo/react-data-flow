/**
 * @author ChicAboo
 * @date 2020/12/28 10:36 上午
 */
import React, { FC, useCallback } from 'react';
import { EdgeTypes, XYPosition } from '@/typings';
import { config } from '@/constants/config';

interface CircleProps {
  edge: EdgeTypes;
  position: XYPosition;
  onCircleCallback?: (data: EdgeTypes) => void;
}
const Circle: FC<CircleProps> = ({ edge, position, onCircleCallback }) => {
  const { cbStyle, addStyle, marginTop } = config.lineCircle;
  const isAdd = edge.text && edge.text !== '+' && edge.text.toString().length > 0;
  const content = isAdd ? edge.text : '+';
  const attr = !isAdd ? addStyle : cbStyle;

  /**
   *  click event to circle
   * */
  const onCircleHandler = useCallback(
    (e) => {
      e.stopPropagation();
      onCircleCallback?.(edge);
    },
    [edge, onCircleCallback],
  );

  return (
    <g cursor="pointer" onClick={onCircleHandler}>
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
