/**
 * @author ChicAboo
 * @date 2020/12/24 3:50 下午
 */
import React, { FC, useEffect, useRef, useCallback, memo, HTMLAttributes } from 'react';
import { prefixCls } from '@/containers/DataFlow';
import { config, canvasHeight, canvasWidth } from '@/constants/config';
import { GridTypes } from '@/typings';
import '@/assets/style/index.scss';

interface BackgroundProps extends HTMLAttributes<HTMLDivElement> {
  gridConfig?: GridTypes;
}

const Background: FC<BackgroundProps> = ({ gridConfig, style }) => {
  const girdRef = useRef<HTMLCanvasElement>(null);
  const currentGridConfig = { ...config.grid, ...gridConfig };

  /**
   *  draw grid lines
   * */
  const drawGridLine = useCallback(
    (x1: number, y1: number, x2: number, y2: number) => {
      if (girdRef && girdRef.current) {
        const gridCanvas: any = girdRef.current.getContext('2d');
        const { strokeWidth, strokeColor, isLineDash, lineDash } = currentGridConfig;

        gridCanvas.beginPath();
        gridCanvas.moveTo(x1, y1);
        gridCanvas.lineTo(x2, y2);

        if (isLineDash) {
          gridCanvas.setLineDash(lineDash);
        }

        gridCanvas.lineWidth = strokeWidth;
        gridCanvas.strokeStyle = strokeColor;
        gridCanvas.stroke();
      }
    },
    [currentGridConfig],
  );

  /**
   * draw grid
   * */
  const drawGrid = useCallback(() => {
    const distance = currentGridConfig.distance;
    const rowNumber = Math.ceil(canvasHeight / distance);
    const colNumber = Math.ceil(canvasWidth / distance);

    for (let i = 0; i < rowNumber; i++) {
      drawGridLine(0, i * distance, canvasWidth, i * distance);
    }

    for (let j = 0; j < colNumber; j++) {
      drawGridLine(j * distance, 0, j * distance, canvasHeight);
    }
  }, [currentGridConfig.distance, drawGridLine]);

  useEffect(() => {
    drawGrid();
  }, [drawGrid]);

  return (
    <div className={`${prefixCls}-background`} style={{ ...style }}>
      <canvas width={canvasWidth} height={canvasHeight} ref={girdRef} />
    </div>
  );
};

export default memo(Background);
