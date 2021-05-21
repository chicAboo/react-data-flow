/**
 * @author ChicAboo
 * @date 2020/12/23 5:06 下午
 */
import React, { useEffect, useRef, useMemo, memo, HTMLAttributes, useCallback } from 'react';
import { zoom, zoomIdentity } from 'd3-zoom';
import { select } from 'd3-selection';
import { useStoreActions, useStoreState } from '@/store/hooks';
import { FlowTransform } from '@/typings';
import { prefixCls } from '@/containers/DataFlow';
import useResizeHandler from '@/hooks/useResizeHandler';
import '@/assets/style/index.scss';

interface ZoomPaneProps extends Omit<HTMLAttributes<HTMLDivElement>, ''> {
  transform?: FlowTransform;
}

const ZoomPane = ({ children }: ZoomPaneProps) => {
  const zoomPane = useRef<HTMLDivElement>(null);

  const { initD3Zoom, setTransform, setSelectionNode } = useStoreActions((actions) => actions);
  const { d3Zoom, transform, minZoom, maxZoom } = useStoreState((state) => state);

  // resize
  useResizeHandler(zoomPane);

  // translate scale
  const transformStyle = useMemo(
    () => ({
      transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.zoom})`,
    }),
    [transform.x, transform.y, transform.zoom],
  );

  /**
   *  cancel circle move
   * */
  const onCancelCircleMove = useCallback(
    (e) => {
      e.stopPropagation();
      setSelectionNode('');
    },
    [setSelectionNode],
  );

  /**
   *  初始化
   * */
  useEffect(() => {
    if (zoomPane.current) {
      const d3ZoomInstance = zoom().scaleExtent([minZoom, maxZoom]);
      const selection = select(zoomPane.current as Element).call(d3ZoomInstance);

      const updatedTransform = zoomIdentity
        .translate(transform.x, transform.y)
        .scale(transform.zoom);
      d3ZoomInstance.transform(selection, updatedTransform);

      initD3Zoom({
        d3Zoom: d3ZoomInstance,
        d3Selection: selection,
        d3ZoomHandler: selection.on('wheel.on'),
        transform: transform,
      });
    }
  }, [initD3Zoom, transform, maxZoom, minZoom]);

  useEffect(() => {
    if (d3Zoom) {
      d3Zoom.on('zoom', (event: any) => {
        setTransform({
          x: event.transform.x,
          y: event.transform.y,
          zoom: event.transform.k,
        });
      });
    }
  }, [d3Zoom, maxZoom, minZoom, setTransform, transform.x, transform.y, transform.zoom]);

  return (
    <div className={`${prefixCls}-renderer`} ref={zoomPane} onClick={onCancelCircleMove}>
      <svg width="100%" height="100%">
        <g className="warp" style={transformStyle}>
          {children}
        </g>
      </svg>
    </div>
  );
};

export default memo(ZoomPane);
