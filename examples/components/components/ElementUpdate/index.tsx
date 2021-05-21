/**
 * @author ChicAboo
 * @date 2020/12/24 6:58 下午
 */
import { useEffect } from 'react';
import { NodeTypes, EdgeTypes } from '@/typings';
import { useStoreActions } from '@/store/hooks';

interface ElementUpdateProps {
  nodes: NodeTypes[];
  edges?: EdgeTypes[];
}

const ElementUpdate = ({ nodes, edges }: ElementUpdateProps) => {
  const { setEdges, setNodes } = useStoreActions((actions) => actions);

  useEffect(() => {
    if (nodes && nodes.length > 0) {
      setNodes(nodes);
    }
    if (edges && edges.length > 0) {
      setEdges(edges);
    }
  }, [nodes, edges, setEdges, setNodes]);
  return null;
};

export default ElementUpdate;
