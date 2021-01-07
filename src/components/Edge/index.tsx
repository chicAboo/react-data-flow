/**
 * @author ChicAboo
 * @date 2020/12/26 2:36 下午
 */
import React, { FC, memo } from 'react';
import { EdgeTypes } from '@/typings';
import { offsetFn, linePath } from '@/utils';
import { config } from '@/constants/config';
import Circle from './Circle';
import AnimationCircle from './AnimationCircle';

interface EdgeProps {
  edge: EdgeTypes;
  selectionNode: string;
  isShowCircle?: boolean;
  isCircleMove?: boolean;
  onCircleCallback?: (data: EdgeTypes) => void;
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

  return linePath(offset, edge.sourceId, edge.targetId);
}

const Edge: FC<EdgeProps> = ({
  edge,
  isShowCircle,
  isCircleMove,
  selectionNode,
  onCircleCallback,
}) => {
  const { strokeWidth, strokeColor } = config.line;
  const { pathData, middleX, middleY } = setPath(edge);
  const isMove = isCircleMove && selectionNode === edge.sourceId;

  return (
    <g className="pathEdge" id={edge.id}>
      <path
        d={pathData}
        strokeWidth={strokeWidth}
        stroke={strokeColor}
        fill="none"
        markerEnd="url(#arrow)"
      />
      {isShowCircle && (
        <Circle
          edge={edge}
          position={{ x: middleX, y: middleY }}
          onCircleCallback={onCircleCallback}
        />
      )}
      {isMove && <AnimationCircle path={pathData} position={{ x: middleX, y: middleY }} />}
    </g>
  );
};

export default memo(Edge);
