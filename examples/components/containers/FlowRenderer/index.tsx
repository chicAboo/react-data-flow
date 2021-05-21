/**
 * @author ChicAboo
 * @date 2020/12/24 5:32 下午
 */
import React, { FC, useEffect } from 'react';
import { produce } from 'immer';
import ZoomPane from '../ZoomPane';
import NodeRenderer from '../NodeRenderer';
import EdgeRenderer from '../EdgeRenderer';
import MarkerDefinitions from '@/components/MarkerDefinitions';
import { DataFlowTypes, EdgeTypes } from '@/typings';
import { useStoreState, useStoreActions } from '@/store/hooks';
import useDFSelector from '@/hooks/useDFSelector';

interface FlowRendererProps {
  onFinish?: (data: DataFlowTypes) => void;
  flow?: any;
  isShowCircle?: boolean;
  isCircleMove?: boolean;
  onCircleCallback?: (data: EdgeTypes) => void;
}

const FlowRenderer: FC<FlowRendererProps> = ({
  isShowCircle,
  flow,
  isCircleMove,
  onFinish,
  onCircleCallback,
}) => {
  const { nodes, edges, transform } = useStoreState((state) => state);
  const { setEdges } = useStoreActions((actions) => actions);

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
      setEdgeCallback: (data: any) => {
        const newEdges = produce(edges, (draft) => {
          const edge = draft.find((item) => item.id === data.edgeId);
          if (edge) {
            edge.text = data.text;
          }
        });

        setEdges(newEdges);
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
        <EdgeRenderer
          isShowCircle={isShowCircle}
          isCircleMove={isCircleMove}
          onCircleCallback={onCircleCallback}
        />
        <NodeRenderer />
      </g>
      <MarkerDefinitions />
    </ZoomPane>
  );
};

export default FlowRenderer;
