/**
 * @author ChicAboo
 * @date 2020/12/24 5:56 下午
 */
import React, { memo, useCallback, useEffect } from 'react';
import { produce } from 'immer';
import { select, selectAll } from 'd3-selection';
import { drag } from 'd3-drag';
import { useStoreState, useStoreActions } from '@/store/hooks';
import Node from '@/components/Node';
import { NodeTypes, XYPosition } from '@/typings';
import { onMouseout, onMouseOver, onDelMouseOut, onDelMouseOver, dragRender } from './util';

let draggable = false;
const NodeRenderer = () => {
  const { nodes, edges, selectionNode } = useStoreState((state) => state);
  const { setNodes, setEdges, setSelectionNode } = useStoreActions((actions) => actions);

  /**
   *  Synchronize the coordinates of nodes and related edges when dragging node
   * */
  const syncNode = useCallback(
    (id: string, position: XYPosition, isDrag?: boolean) => {
      // 同步节点坐标
      const newNodes = produce(nodes, (draft) => {
        const node = draft.find((item) => item.id === id);
        if (node) {
          node.position = {
            x: position.x,
            y: position.y,
          };
        }
      });

      // 同步边的坐标
      const newEdges = produce(edges, (draft) => {
        draft.forEach((edge, index) => {
          if (edge.id.indexOf(id) !== -1) {
            if (edge.sourceId === id) {
              edge.startPosition = {
                x: position.x,
                y: position.y,
              };
            } else {
              edge.endPosition = {
                x: position.x,
                y: position.y,
              };
            }
            if (!isDrag) {
              select(`#${edge.id}`).attr('display', 'block');
            }
          }
        });
      });

      setEdges(newEdges);
      setNodes(newNodes);
    },
    [edges, nodes, setEdges, setNodes],
  );

  /**
   *  Synchronize the coordinates of nodes and related edges when delete node
   * */
  const syncDelNode = useCallback(
    (id: string) => {
      const newEdges = produce(edges, (draft) => {
        selectAll('.pathEdge').each(function () {
          const edgeIndex = draft.findIndex((item) => item.id.indexOf(id) !== -1);
          if (edgeIndex !== -1) {
            draft.splice(edgeIndex, 1);
          }
        });
      });

      const newNodes = produce(nodes, (draft) => {
        const nodeIndex = draft.findIndex((item) => item.id === id);
        draft.splice(nodeIndex, 1);
      });

      setNodes(newNodes);
      setEdges(newEdges);
    },
    [edges, nodes, setEdges, setNodes],
  );

  /**
   *  drag node dragging
   * */
  const onDrag = useCallback(function (this: SVGAElement, e: any) {
    dragRender.call(this, e);
    if (!draggable) {
      draggable = true;
    }
  }, []);

  /**
   *  drag node end
   * */
  const onDragEnd = useCallback(
    function (this: SVGAElement, e: any) {
      const id = select(this).attr('id');
      if (!draggable || !id) {
        return;
      }
      syncNode(id, { x: e.x, y: e.y });
      draggable = false;
    },
    [syncNode],
  );

  /**
   * node click event
   * */
  const onNodeClick = useCallback(
    function (this: SVGAElement, e) {
      e.stopPropagation();

      const nodeId = select(this).attr('id');
      setSelectionNode(nodeId);
    },
    [setSelectionNode],
  );

  /**
   *  delete node and associated edge
   * */
  const onDelClick = useCallback(
    function (this: SVGAElement, e) {
      e.stopPropagation();
      const nodeId = select(this).attr('id');
      syncDelNode(nodeId);
    },
    [syncDelNode],
  );

  /**
   *  move node (top、bottom、left、right)
   * */
  const moveNode = useCallback(
    (direction: string) => {
      const node = nodes.find((item) => item.id === selectionNode);
      if (node) {
        let x = node.position.x;
        let y = node.position.y;

        switch (direction) {
          case 'left':
            x = x - 1;
            break;
          case 'right':
            x = x + 1;
            break;
          case 'top':
            y = y - 1;
            break;
          case 'bottom':
            y = y + 1;
            break;
          default:
            break;
        }

        syncNode(selectionNode, { x, y }, true);
      }
    },
    [nodes, selectionNode, syncNode],
  );

  /**
   *  bind keyboard event
   * */
  const bindKeyboard = useCallback(
    function (e: KeyboardEvent) {
      if (selectionNode && selectionNode.length > 0) {
        const eventCodes = [37, 38, 39, 40, 46, 8];
        if (eventCodes.indexOf(e.keyCode) !== -1) {
          e.preventDefault();
        }
        // 上下左右
        switch (e.keyCode) {
          case 38:
            moveNode('top');
            break;
          case 40:
            moveNode('bottom');
            break;
          case 37:
            moveNode('left');
            break;
          case 39:
            moveNode('right');
            break;
          case 46:
          case 8:
            syncDelNode(selectionNode);
            break;
          default:
            break;
        }
      }
    },
    [moveNode, selectionNode, syncDelNode],
  );

  /**
   *  bind node drag event
   * */
  useEffect(() => {
    selectAll('.nodeDraggable')
      .on('click', onNodeClick)
      .on('mouseover', onMouseOver)
      .on('mouseout', onMouseout)
      .call(drag().on('drag', onDrag).on('end', onDragEnd));
  }, [nodes, onNodeClick, onDrag, onDragEnd]);

  /**
   *  bind delete node event
   * */
  useEffect(() => {
    selectAll('.delNode')
      .on('mouseover', onDelMouseOver)
      .on('mouseout', onDelMouseOut)
      .on('click', onDelClick);
  }, [nodes, onDelClick]);

  /**
   *  bind keyboard
   *    top、bottom、left、right、delete [37, 38, 39, 40, 46, 8]
   * */
  useEffect(() => {
    document.body.addEventListener('keydown', bindKeyboard);
    return () => {
      document.body.removeEventListener('keydown', bindKeyboard);
    };
  }, [bindKeyboard]);

  return (
    <g className="nodeBox">
      {nodes.length > 0 && nodes.map((item: NodeTypes) => <Node key={item.id} node={item} />)}
    </g>
  );
};

export default memo(NodeRenderer);
