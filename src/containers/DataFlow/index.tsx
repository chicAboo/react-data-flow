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
  onFinish?: (data: DataFlowTypes) => void;
  flow?: any;
}

const ReactDataFlow = ({
  nodes,
  edges,
  minZoom,
  maxZoom,
  children,
  onFinish,
  flow,
  ...rest
}: ReactDataFlowProps) => {
  return (
    <div {...rest} className={prefixCls}>
      <Wrapper>
        <FlowRenderer onFinish={onFinish} flow={flow} />
        {children}
        <ElementUpdate nodes={nodes} edges={edges} />
      </Wrapper>
    </div>
  );
};

export default ReactDataFlow;
