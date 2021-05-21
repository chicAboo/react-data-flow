/**
 * @author ChicAboo
 * @date 2020/12/25 10:02 上午
 */
import {
  FlowElement,
  EdgeTypes,
  NodeTypes,
  XYPosition,
  IndexProps,
  Rect,
  Box,
  Dimensions,
} from '@/typings';
import { config } from '@/constants/config';

export const isEdge = (element: FlowElement): element is EdgeTypes =>
  'id' in element && 'source' in element && 'target' in element;

export const isNode = (element: FlowElement): element is NodeTypes =>
  'id' in element && !('source' in element) && !('target' in element);

export const parseElement = (element: NodeTypes | EdgeTypes): NodeTypes | EdgeTypes => {
  if (!element.id) {
    throw new Error('All nodes and edges need to have an id.');
  }

  if (isEdge(element)) {
    return {
      ...element,
      sourceId: element.sourceId.toString(),
      targetId: element.targetId.toString(),
      id: element.id.toString(),
    };
  }

  return {
    ...element,
    id: element.id.toString(),
  } as NodeTypes;
};

/**
 *  计算节点四个点的偏移坐标
 *  @param(x, y): 坐标
 *  @param(direction) 方向
 * */
export function _position(x: number, y: number, direction: string) {
  const { width, height } = config.rect;
  const point: XYPosition = {
    x: x,
    y: y,
  };
  switch (direction) {
    case 'left':
      point.x = x - width / 2;
      point.y = y;
      break;
    case 'right':
      point.x = x + width / 2;
      point.y = y;
      break;
    case 'top':
      point.x = x;
      point.y = y - height / 2;
      break;
    case 'bottom':
      point.x = x;
      point.y = y + height / 2;
      break;
  }

  return point;
}

/**
 *  检查拖动结束的点是否在node节点上
 *  @param(x, y) 拖动结束的点坐标
 *  @param(nodes) <Array> 节点信息
 * */
export function coverNode(x: number, y: number, nodes: NodeTypes[]) {
  const res: IndexProps = {};
  const { width, height, distance } = config.rect;
  const length = nodes.length;

  if (nodes && length === 0) {
    return {};
  }

  for (let i = 0; i < length; i++) {
    const item: NodeTypes = nodes[i];
    const position = item.position;
    if (
      x >= position.x - width / 2 - distance &&
      x <= position.x + width / 2 + distance &&
      y >= position.y - height / 2 - distance &&
      y <= position.y + height / 2 + distance
    ) {
      res.exists = true;
      res.x = position.x;
      res.y = position.y;
      res.targetId = item.id;
      res.direction = finishPosition(x, y, position.x, position.y);
    }
  }

  return res;
}

/**
 *  根据鼠标最后一次坐标，计算终点的位置，点与点的最短距离
 *  @param(x1,y1): 拖动的结束点坐标
 *  @param(x2, y2): 终点的中心点坐标
 *  @return 终点所在位置的方向
 * */
function finishPosition(x1: number, y1: number, x2: number, y2: number) {
  const { width, height } = config.rect;
  const disArr: number[] = [];
  const obj: IndexProps = {};
  const coordinate: IndexProps = {
    left: { x: x2 - width / 2, y: y2 },
    right: { x: x2 + width / 2, y: y2 },
    top: { x: x2, y: y2 - height / 2 },
    bottom: { x: x2, y: y2 + height / 2 },
  };

  Object.keys(coordinate).forEach((key: string) => {
    const powX = Math.pow(Math.abs(x1 - coordinate[key].x), 2);
    const powY = Math.pow(Math.abs(y1 - coordinate[key].y), 2);
    const distance = Math.sqrt(powX + powY);
    disArr.push(distance);
    obj[distance] = key;
  });

  return obj[Math.min(...disArr)];
}

/**
 * 通过起点、终点、节点类型计算偏移位置
 * @param startPoint 开始节点坐标
 * @param endPoint 结束节点坐标
 * @param startDirection 起点方向
 * @param endDirection 终点方向
 */
export function offsetFn(
  startPoint: XYPosition,
  endPoint: XYPosition,
  startDirection: string,
  endDirection: string,
) {
  const positionStart: XYPosition = _position(startPoint.x, startPoint.y, startDirection);
  const positionEnd: XYPosition = _position(endPoint.x, endPoint.y, endDirection);

  return {
    x1: positionStart.x,
    y1: positionStart.y,
    x2: positionEnd.x,
    y2: positionEnd.y,
    startDirection: startDirection,
    endDirection: endDirection,
  };
}

/**
 * 通过起点终点计算path
 * @param {*} position 包含起点(x1,y1)、终点(x2,y2)
 * @param startId 开始节点id
 * @param endId 结束节点id
 */
export function linePath(position: IndexProps, startId: string, endId: string) {
  const { x1, y1, x2, y2, startDirection, endDirection } = position;
  const { width } = config.rect;

  const sourceMiddle: IndexProps = middlePath(x1, y1, startDirection);
  const middleX1 = sourceMiddle.x;
  const middleY1 = sourceMiddle.y;

  const targetMiddle: IndexProps = middlePath(x2, y2, endDirection);
  const middleX2 = targetMiddle.x;
  const middleY2 = targetMiddle.y;

  let middleX = (middleX1 + middleX2) / 2;
  let middleY = middleY1;

  // 自己连自己
  if (startId === endId) {
    if (startDirection === 'top' || startDirection === 'bottom') {
      middleX = middleX1 + width;
      if (endDirection === 'left') {
        middleX = middleX1 - width;
      }
    } else if (startDirection === 'left' || startDirection === 'right') {
      middleX = middleX1;
    }
  } else {
    if (
      (startDirection === 'left' && endDirection === 'left') ||
      (startDirection === 'right' && endDirection === 'right')
    ) {
      middleX = middleX1;
      middleY = middleY2;
    } else {
      // middleX = middleX2;
    }
  }

  return {
    middleX: middleX,
    middleY: (middleY1 + middleY2) / 2,
    pathData: `
      M ${x1}, ${y1}
      L ${middleX1}, ${middleY1}
      L ${middleX}, ${middleY}
      L ${middleX}, ${middleY2}
      L ${middleX2}, ${middleY2}
      L ${x2}, ${y2}
    `,
  };
}

/**
 * 根据方向计算path中间点
 * @param {*} x
 * @param {*} y
 * @param {*} direction
 */
function middlePath(x: number, y: number, direction: string) {
  const res: IndexProps = {};
  switch (direction) {
    case 'left':
      res.x = x - config.path.middleDistance;
      res.y = y;
      break;
    case 'top':
      res.x = x;
      res.y = y - config.path.middleDistance;
      break;
    case 'right':
      res.x = x + config.path.middleDistance;
      res.y = y;
      break;
    case 'bottom':
      res.x = x;
      res.y = y + config.path.middleDistance;
      break;
    default:
      res.x = x;
      res.y = y;
      break;
  }

  return res;
}

const getBoundsOfBoxes = (box1: Box, box2: Box): Box => ({
  x: Math.min(box1.x, box2.x),
  y: Math.min(box1.y, box2.y),
  x2: Math.max(box1.x2, box2.x2),
  y2: Math.max(box1.y2, box2.y2),
});

export const rectToBox = ({ x, y, width, height }: Rect): Box => ({
  x,
  y,
  x2: x + width,
  y2: y + height,
});

export const boxToRect = ({ x, y, x2, y2 }: Box): Rect => ({
  x,
  y,
  width: x2 - x,
  height: y2 - y,
});

/**
 *  获取图形的宽高
 * */
export const getRectOfNodes = (nodes: NodeTypes[]): Rect => {
  const { width, height } = config.rect;
  const box = nodes.reduce(
    (currBox, { position }) => {
      return getBoundsOfBoxes(currBox, rectToBox({ x: position.x, y: position.y, width, height }));
    },
    { x: Infinity, y: Infinity, x2: -Infinity, y2: -Infinity },
  );

  return boxToRect(box);
};

export const clamp = (val: number, min = 0, max = 1): number => Math.min(Math.max(val, min), max);

export const getDimensions = (node: HTMLDivElement): Dimensions => ({
  width: node.offsetWidth,
  height: node.offsetHeight,
});
