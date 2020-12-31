/**
 * @author ChicAboo
 * @date 2020/12/24 7:54 下午
 */
import React, { memo } from 'react';
import { config } from '@/constants/config';

const MarkerDefinitions = () => (
  <defs>
    <marker
      id="arrow"
      markerUnits="strokeWidth"
      markerWidth="10"
      markerHeight="10"
      refX="10"
      refY="5"
      orient="auto">
      <path id="markerId" d="M0,0 L0,10 L10,5 z" fill={config.arrow.strokeColor} />
    </marker>
    <marker
      id="arrow_hover"
      markerUnits="strokeWidth"
      markerWidth="10"
      markerHeight="10"
      refX="10"
      refY="5"
      orient="auto">
      <path d="M0,0 L0,10 L10,5 z" fill={config.arrow.strokeColorHover} />
    </marker>
  </defs>
);

export default memo(MarkerDefinitions);
