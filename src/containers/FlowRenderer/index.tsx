/**
 * @author ChicAboo
 * @date 2020/12/24 5:32 下午
 */
import React, { FC, useEffect } from 'react';
import ZoomPane from '../ZoomPane';
import NodeRenderer from '../NodeRenderer';
import EdgeRenderer from '../EdgeRenderer';
import MarkerDefinitions from '@/components/MarkerDefinitions';
import { DataFlowTypes } from '@/typings';
import { useStoreState } from '@/store/hooks';
import useDFSelector from '@/hooks/useDFSelector';

interface FlowRendererProps {
  onFinish?: (data: DataFlowTypes) => void;
  flow?: any;
}

const FlowRenderer: FC<FlowRendererProps> = ({ flow, onFinish }) => {
  const { nodes, edges, transform } = useStoreState((state) => state);

  const [dfInstance] = useDFSelector(flow);

  // set callback functions
  if (dfInstance) {
    const { setCallbacks } = dfInstance;

    setCallbacks({
      onFinish: (values: any) => {
        if (onFinish) {
          onFinish(values);
        }
      },
    });
  }

  // set values
  useEffect(() => {
    if (dfInstance) {
      const setField = dfInstance.setFields;

      setField({ nodes, edges, transform });
    }
  }, [dfInstance, edges, nodes, transform]);

  return (
    <ZoomPane>
      <g className="tempLine">
        <EdgeRenderer />
        <NodeRenderer />
      </g>
      <MarkerDefinitions />
    </ZoomPane>
  );
};

export default FlowRenderer;
