/**
 * @author ChicAboo
 * @date 2020/12/23 4:49 下午
 */
import React, { FC } from 'react';
import { StoreProvider } from 'easy-peasy';
import store from '@/store';

const Wrapper: FC = ({ children }) => {
  return <StoreProvider store={store}>{children}</StoreProvider>;
};

export default Wrapper;
