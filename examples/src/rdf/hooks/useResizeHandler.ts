/**
 * @author ChicAboo
 * @date 2020/12/30 2:54 下午
 */
import { useEffect, MutableRefObject } from 'react';
import { useStoreActions } from '@/store/hooks';
import { getDimensions } from '@/utils';

export default (rendererNode: MutableRefObject<HTMLDivElement | null>) => {
  const updateSize = useStoreActions((actions) => actions.updateSize);

  useEffect(() => {
    const updateDimensions = () => {
      if (!rendererNode.current) {
        return;
      }

      const size = getDimensions(rendererNode.current);

      if (size.width > 0 && size.height > 0) {
        updateSize(size);
      }
    };

    updateDimensions();
    window.onresize = updateDimensions;
  }, [rendererNode, updateSize]);
};
