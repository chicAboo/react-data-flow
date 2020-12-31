/**
 * @author ChicAboo
 * @date 2020/12/23 2:18 下午
 */
// id
export type ElementId = string;

// transform
export type Transform = [number, number, number];

// line dash
export type LineDash = [number, number];

// extend
export type TranslateExtent = [[number, number], [number, number]];

export type FlowTransform = {
  x: number;
  y: number;
  zoom: number;
};

export interface IndexProps {
  [index: string]: any;
}

export interface XYPosition {
  x: number;
  y: number;
}

export interface Dimensions {
  width: number;
  height: number;
}

export interface Rect extends Dimensions, XYPosition {}

export interface Box extends XYPosition {
  x2: number;
  y2: number;
}

export interface NodeTypes {
  /**
   *  节点id
   * */
  id: ElementId;
  /**
   *  节点中心中标
   * */
  position: XYPosition;
  /**
   *  节点名称
   * */
  title: string;
  /**
   *  节点额外属性
   * */
  extraNode?: any;
}

export interface EdgeTypes {
  /**
   *  边的id
   * */
  id: ElementId;
  /**
   *  边的起点坐标
   * */
  startPosition: XYPosition;
  /**
   *  边的终点坐标
   * */
  endPosition: XYPosition;
  /**
   *  开始节点id
   * */
  sourceId: ElementId;
  /**
   *  结束节点id
   * */
  targetId: ElementId;
  /**
   *  开始节点的方向
   * */
  startDirection: '';
  /**
   *  结束节点的方向
   * */
  endDirection: '';
  /**
   *  线上文本
   * */
  text: string | number;
}

export interface ControlsHelperFunctions {
  /**
   *  放大
   * */
  zoomIn: () => void;
  /**
   *  缩小
   * */
  zoomOut: () => void;
  /**
   *  指定缩放
   * */
  zoomTo: (zoomLevel: number) => void;
  /**
   *  居中
   * */
  fitView: () => void;
}

/**
 *  grid 配置项
 * */
export interface GridTypes {
  /**
   *  边的颜色
   * */
  strokeColor?: string;
  /**
   *  边的宽度
   * */
  strokeWidth?: number;
  /**
   *  间距
   * */
  distance?: number;
  /**
   * 是否以点线方式绘制
   * */
  isLineDash?: boolean;
  /**
   * 点线的线段和间距
   * */
  lineDash?: LineDash;
}

export type FlowElement = NodeTypes | EdgeTypes;

export type Elements = Array<FlowElement>;

export interface DataFlowTypes {
  nodes: NodeTypes[];
  edges: EdgeTypes[];
  transform: FlowTransform;
}
