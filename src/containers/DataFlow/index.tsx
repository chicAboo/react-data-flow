/**
 * @author ChicAboo
 * @date 2020/12/23 4:56 下午
 */
import React, { HTMLAttributes } from 'react';
import FlowRenderer from '../FlowRenderer';
import Wrapper from './Wrapper';
import ElementUpdate from '@/components/ElementUpdate';
import { NodeTypes, EdgeTypes, DataFlowTypes } from '@/typings';
import '@/assets/style/index.scss';

export const prefixCls = 'rdf';

interface ReactDataFlowProps extends Omit<HTMLAttributes<HTMLDivElement>, ''> {
  nodes: NodeTypes[];
  edges?: EdgeTypes[];
  minZoom?: number;
  maxZoom?: number;
  flow?: any;
  isShowCircle?: boolean;
  isCircleMove?: boolean;
  onFinish?: (data: DataFlowTypes) => void;
  onCircleCallback?: (data: EdgeTypes) => void;
}

const ReactDataFlow = ({
  nodes,
  edges,
  minZoom,
  maxZoom,
  children,
  flow,
  isShowCircle = false,
  isCircleMove = false,
  onCircleCallback,
  onFinish,
  ...rest
}: ReactDataFlowProps) => {
  return (
    <div {...rest} className={prefixCls}>
      <Wrapper>
        <FlowRenderer
          onFinish={onFinish}
          flow={flow}
          isShowCircle={isShowCircle}
          isCircleMove={isCircleMove}
          onCircleCallback={onCircleCallback}
        />
        {children}
        <ElementUpdate nodes={nodes} edges={edges} />
      </Wrapper>
    </div>
  );
};

export default ReactDataFlow;
