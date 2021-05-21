/**
 * @author ChicAboo
 * @date 2020/12/30 1:56 下午
 */
import { useMemo } from 'react';
import { ControlsHelperFunctions } from '@/typings';
import { zoomIdentity } from 'd3-zoom';
import { useStoreState, useStore } from '@/store/hooks';
import { getRectOfNodes, clamp } from '@/utils';

const initialZoomPanHelper: ControlsHelperFunctions = {
  zoomIn: () => {},
  zoomOut: () => {},
  zoomTo: (_: number) => {},
  fitView: () => {},
};

const useControlsHelper = (): ControlsHelperFunctions => {
  const store = useStore();
  const { nodes, width, height, minZoom } = store.getState();

  const d3Zoom = useStoreState((s) => s.d3Zoom);
  const d3Selection = useStoreState((s) => s.d3Selection);
  const transform = useStoreState((s) => s.transform);

  return useMemo<ControlsHelperFunctions>(() => {
    if (d3Selection && d3Zoom) {
      return {
        zoomIn: () => d3Zoom.scaleBy(d3Selection, 1.2),
        zoomOut: () => d3Zoom.scaleBy(d3Selection, 1 / 1.2),
        zoomTo: (zoomLevel: number) => d3Zoom.scaleTo(d3Selection, zoomLevel),
        fitView: () => {
          if (!nodes.length) {
            return;
          }

          const bounds = getRectOfNodes(nodes);
          const xZoom = width / bounds.width;
          const yZoom = height / bounds.height;
          const zoom = Math.min(xZoom, yZoom);
          const clampedZoom = clamp(zoom, minZoom, transform.zoom);
          const boundsCenterX = bounds.x + bounds.width / 2;
          const boundsCenterY = bounds.y + bounds.height / 2;
          const x = width / 2 - boundsCenterX * clampedZoom;
          const y = height / 2 - boundsCenterY * clampedZoom;
          const currTransform = zoomIdentity.translate(x, y).scale(clampedZoom);

          d3Zoom.transform(d3Selection, currTransform);
        },
      };
    }

    return initialZoomPanHelper;
  }, [d3Selection, d3Zoom, height, minZoom, nodes, transform.zoom, width]);
};

export default useControlsHelper;
