/**
 * @author ChicAboo
 * @date 2020/12/24 5:56 下午
 */
import React, { FC, memo, useEffect, useCallback, useRef } from 'react';
import { produce } from 'immer';
import { select, selectAll } from 'd3-selection';
import { drag } from 'd3-drag';
import { _position, coverNode } from '@/utils';
import { config } from '@/constants/config';
import { useStoreState, useStoreActions } from '@/store/hooks';
import Edge from '@/components/Edge';
import { EdgeTypes } from '@/typings';
import { lineHover } from './util';

interface EdgeRenderer {
  isShowCircle?: boolean;
  isCircleMove?: boolean;
  onCircleCallback?: (data: EdgeTypes) => void;
}

let tempId: any = null;
const EdgeRenderer: FC<EdgeRenderer> = ({ isShowCircle, isCircleMove, onCircleCallback }) => {
  const linesRef = useRef(null);
  const { nodes, edges, selectionNode } = useStoreState((state) => state);
  const setEdges = useStoreActions((actions) => actions.setEdges);

  /**
   *  draw dash line (temporary line)
   * */
  const onDrawDashLine = useCallback(
    function (this: SVGAElement, e: any) {
      const { strokeColor, strokeWidth } = config.line;
      const id = select(this).attr('id');
      const direction = select(this).attr('direction') || '';
      const node = nodes.find((item) => item.id === id);

      if (!tempId && node) {
        tempId = id;
        const { x, y } = node.position;
        const point = _position(x, y, direction);

        if (linesRef && linesRef.current) {
          select(linesRef.current)
            .append('line')
            .attr('id', `l_${id}`)
            .attr('x1', point.x)
            .attr('y1', point.y)
            .attr('x2', e.x)
            .attr('y2', e.y)
            .attr('stroke-width', strokeWidth)
            .attr('stroke', strokeColor)
            .attr('stroke-dasharray', '5,5')
            .attr('marker-end', 'url(#arrow)');
        }
      } else {
        select(`#l_${id}`).attr('x2', e.x).attr('y2', e.y);
      }
    },
    [nodes],
  );

  /**
   *  drag end draw line
   * */
  const onDrawLineEnd = useCallback(
    function (this: SVGAElement, e: any) {
      tempId = null;
      const id = select(this).attr('id');
      const direction = select(this).attr('direction');
      select(`#l_${id}`).remove();

      const node = nodes.find((item) => item.id === id);
      const cover = coverNode(e.x, e.y, nodes);

      if (node) {
        // 同节点同方向不能不能绘制
        if (cover.targetId === node.id && cover.direction === direction) {
          return;
        }

        const lineId = `${node.id}-${cover.targetId}`;
        const exists = edges.findIndex((item: EdgeTypes) => item.id === lineId);

        /**
         *  绘制折线的条件：
         *    1、拖拽的终点在节点上；
         *    2、源节点和目标节点只有一条线
         * */
        if (cover.exists && exists === -1) {
          const newEdges = produce(edges, (draft) => {
            const existLine = draft.findIndex((item) => item.id === lineId);
            if (existLine > 0) {
            } else {
              draft.push({
                id: lineId,
                sourceId: node.id,
                targetId: cover.targetId,
                startDirection: direction,
                endDirection: cover.direction,
                startPosition: {
                  x: node.position.x,
                  y: node.position.y,
                },
                endPosition: {
                  x: cover.x,
                  y: cover.y,
                },
                text: '+',
              });
            }
          });

          setEdges(newEdges);
        }
      }
    },
    [nodes, edges, setEdges],
  );

  /**
   *  line mouse over
   * */
  const onLineMouseOver = useCallback(function (this: SVGAElement) {
    const hover = config.line.hover;
    const edgeId = select(this).attr('id');
    lineHover.call(
      this,
      edgeId,
      {
        lineColor: hover.strokeColor,
        lineWidth: hover.strokeWidth,
        circleFill: hover.strokeColor,
        textFill: hover.textFill,
      },
      'arrow_hover',
    );
  }, []);

  /**
   *  line mouse out
   * */
  const onLineMouseOut = useCallback(
    function (this: SVGAElement) {
      const { strokeColor, strokeWidth } = config.line;
      const edgeId = select(this).attr('id');
      const { fill, addStyle, cbStyle } = config.lineCircle;
      const edge = edges.find((item) => item.id === edgeId);

      if (edge) {
        const style = edge.text ? cbStyle : addStyle;
        lineHover.call(
          this,
          edgeId,
          {
            lineColor: strokeColor,
            lineWidth: strokeWidth,
            circleFill: fill,
            textFill: style.textFill,
          },
          'arrow',
        );
      }
    },
    [edges],
  );

  /**
   *  bind drag point event
   * */
  useEffect(() => {
    selectAll('.dragPoint').call(drag().on('drag', onDrawDashLine).on('end', onDrawLineEnd));
  }, [nodes, edges, onDrawDashLine, onDrawLineEnd]);

  /**
   *  bind edge event
   * */
  useEffect(() => {
    selectAll('.pathEdge').on('mouseover', onLineMouseOver).on('mouseout', onLineMouseOut);
  }, [edges, onLineMouseOut, onLineMouseOver]);

  return (
    <g className="lineBox" ref={linesRef}>
      {edges.map((item) => (
        <Edge
          key={item.id}
          edge={item}
          isShowCircle={isShowCircle}
          isCircleMove={isCircleMove}
          selectionNode={selectionNode}
          onCircleCallback={onCircleCallback}
        />
      ))}
    </g>
  );
};

export default memo(EdgeRenderer);
