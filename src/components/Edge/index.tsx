/**
 * @author ChicAboo
 * @date 2020/12/26 2:36 下午
 */
import React, { FC, memo } from 'react';
import { EdgeTypes } from '@/typings';
import { offsetFn, linePath } from '@/utils';
import { config } from '@/constants/config';
import Circle from './Circle';

interface EdgeProps {
  edge: EdgeTypes;
}

/**
 *  获取路径
 * */
function setPath(edge: EdgeTypes) {
  const offset = offsetFn(
    {
      x: edge.startPosition.x,
      y: edge.startPosition.y,
    },
    {
      x: edge.endPosition.x,
      y: edge.endPosition.y,
    },
    edge?.startDirection,
    edge?.endDirection,
  );

  const { pathData, middleX, middleY } = linePath(offset, edge.sourceId, edge.targetId);

  return { pathData, middleY, middleX };
}

const Edge: FC<EdgeProps> = ({ edge }) => {
  const { strokeWidth, strokeColor } = config.line;
  const { pathData, middleX, middleY } = setPath(edge);

  return (
    <g className="pathEdge" id={edge.id}>
      <path
        d={pathData}
        strokeWidth={strokeWidth}
        stroke={strokeColor}
        fill="none"
        markerEnd="url(#arrow)"
      />
      <Circle edge={edge} position={{ x: middleX, y: middleY }} />
    </g>
  );
};

export default memo(Edge);
