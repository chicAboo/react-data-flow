/**
 * @author ChicAboo
 * @date 2020/12/29 10:50 上午
 */
import React, { memo, useState, useCallback } from 'react';
import useControlsHelper from '../../hooks/useControlsHelper';
import { useStoreState } from '@/store/hooks';
import { FitMap, MiniMap, ZoomIn, ZoomOut } from '@/assets/Icon';
import './index.scss';

const Controls = () => {
  const [percent, setPercent] = useState<number>(0);
  const { transform, minZoom, maxZoom } = useStoreState((state) => state);
  const { zoomIn, zoomOut, fitView, zoomTo } = useControlsHelper();

  /**
   *  center
   * */
  const onFitMap = useCallback(() => {
    fitView?.();
  }, [fitView]);

  /**
   *  zoom in
   * */
  const onZoomIn = useCallback(() => {
    zoomIn?.();
  }, [zoomIn]);

  /**
   *  zoom out
   * */
  const onZoomOut = useCallback(() => {
    zoomOut?.();
  }, [zoomOut]);

  /**
   *  zoom number change
   * */
  const onZoomTo = useCallback(
    (e) => {
      const zoomLevel = Number(e.target.value) / 100;
      if (zoomLevel >= minZoom && zoomLevel <= maxZoom) {
        zoomTo?.(zoomLevel);
        setPercent(0);
      } else {
        setPercent(zoomLevel * 100);
      }
    },
    [maxZoom, minZoom, zoomTo],
  );

  /**
   *  zoom number blur
   * */
  const onZoomInBlur = useCallback(
    (e) => {
      const zoomLevel = Number(e.target.value) / 100;
      if (zoomLevel < minZoom) {
        zoomTo?.(minZoom);
        setPercent(0);
      } else if (zoomLevel > maxZoom) {
        zoomTo?.(maxZoom);
        setPercent(0);
      }
    },
    [maxZoom, minZoom, zoomTo],
  );

  const zoomLevel = percent === 0 ? Number((transform.zoom * 100).toFixed(2)) : percent;

  return (
    <div className="rdf-tooltip">
      <span title="fitMap" onClick={onFitMap}>
        <FitMap />
      </span>
      <span title="miniMap">
        <MiniMap />
      </span>
      <span className="rdf-tooltip-split" />
      <span title="放大" onClick={onZoomIn}>
        <ZoomIn />
      </span>
      <span title="缩小" onClick={onZoomOut}>
        <ZoomOut />
      </span>
      <input
        className="rdf-tooltip-input"
        type="number"
        value={zoomLevel}
        onChange={onZoomTo}
        onBlur={onZoomInBlur}
      />
      <span className="percent">%</span>
    </div>
  );
};

export default memo(Controls);
