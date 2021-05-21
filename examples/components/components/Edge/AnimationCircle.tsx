/**
 * @author ChicAboo
 * @date 2021/1/4 6:27 下午
 */
import React, { FC, memo } from 'react';
import { config } from '@/constants/config';
import { XYPosition } from '@/typings';

interface AnimationCircleProps {
  path: string;
  position: XYPosition;
}

const AnimationCircle: FC<AnimationCircleProps> = ({ path, position }) => {
  const { strokeColor } = config.rect;

  return (
    <circle cx="0" cy="0" r="3" fill={strokeColor} stroke={strokeColor}>
      <animateMotion path={path} dur="2s" repeatCount="indefinite" rotate="auto" />
    </circle>
  );
};

export default memo(AnimationCircle);
