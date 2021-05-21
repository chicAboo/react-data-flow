/**
 * @author ChicAboo
 * @date 2020/12/23 2:09 下午
 */
import { action, Action, createStore } from 'easy-peasy';
import { FlowTransform } from '@/typings';
import { Selection as D3Selection, ZoomBehavior } from 'd3';
import { TranslateExtent, NodeTypes, EdgeTypes, Elements, Dimensions } from '@/typings';

type InitD3Zoom = {
  d3Zoom: ZoomBehavior<Element, unknown>;
  d3Selection: D3Selection<Element, unknown, null, undefined>;
  d3ZoomHandler: ((this: Element, event: any, d: unknown) => void) | undefined;
  transform: FlowTransform;
};

export interface StoreModel {
  width: number;
  height: number;
  transform: FlowTransform;
  elements: Elements;
  nodes: NodeTypes[];
  edges: EdgeTypes[];
  selectionNode: string;

  d3Zoom: ZoomBehavior<Element, unknown> | null;
  d3Selection: D3Selection<Element, unknown, null, undefined> | null;
  d3ZoomHandler: ((this: Element, event: any, d: unknown) => void) | undefined;
  minZoom: number;
  maxZoom: number;
  translateExtent: TranslateExtent;

  updateSize: Action<StoreModel, Dimensions>;

  initD3Zoom: Action<StoreModel, InitD3Zoom>;
  setMinZoom: Action<StoreModel, number>;
  setMaxZoom: Action<StoreModel, number>;
  setTransform: Action<StoreModel, FlowTransform>;
  setTranslateExtent: Action<StoreModel, TranslateExtent>;
  setEdges: Action<StoreModel, EdgeTypes[]>;
  setNodes: Action<StoreModel, NodeTypes[]>;
  setSelectionNode: Action<StoreModel, string>;
}

const storeModel: StoreModel = {
  width: 500,
  height: 500,
  transform: {
    x: 0,
    y: 0,
    zoom: 1,
  },
  elements: [],
  nodes: [],
  edges: [],
  selectionNode: '',

  d3Zoom: null,
  d3Selection: null,
  d3ZoomHandler: undefined,
  minZoom: 0.5,
  maxZoom: 2,
  translateExtent: [
    [Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY],
    [Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY],
  ],
  /**
   *  初始化
   * */
  initD3Zoom: action((state, { d3Zoom, d3Selection, d3ZoomHandler, transform }) => {
    state.d3Zoom = d3Zoom;
    state.d3Selection = d3Selection;
    state.d3ZoomHandler = d3ZoomHandler;
    state.transform = transform;
  }),
  /**
   *  设置zoom范围的最小下限
   * */
  setMinZoom: action((state, minZoom: number) => {
    state.minZoom = minZoom;

    if (state.d3Zoom) {
      state.d3Zoom.scaleExtent([minZoom, state.maxZoom]);
    }
  }),
  /**
   *  设置zoom范围的最大上限
   * */
  setMaxZoom: action((state, maxZoom: number) => {
    state.maxZoom = maxZoom;

    if (state.d3Zoom) {
      state.d3Zoom.scaleExtent([state.minZoom, maxZoom]);
    }
  }),
  /**
   *  设置平移
   * */
  setTranslateExtent: action((state, translateExtent) => {
    state.translateExtent = translateExtent;

    if (state.d3Zoom) {
      state.d3Zoom.translateExtent(translateExtent);
    }
  }),
  /**
   *  设置平移
   * */
  setTransform: action((state, transform) => {
    state.transform = transform;
  }),
  /**
   *  设置节点
   * */
  setNodes: action((state, nodes) => {
    state.nodes = nodes;
  }),
  /**
   *  设置边
   * */
  setEdges: action((state, edges: EdgeTypes[]) => {
    state.edges = edges;
  }),
  /**
   *  设置选中节点
   * */
  setSelectionNode: action((state, nodeId: string) => {
    state.selectionNode = nodeId;
  }),
  /**
   * 更新尺寸
   * */
  updateSize: action((state, size: Dimensions) => {
    state.width = size.width || 500;
    state.height = size.height || 500;
  }),
};

export default createStore(storeModel);
