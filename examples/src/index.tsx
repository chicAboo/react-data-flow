/**
 * @author ChicAboo
 * @date 2020/12/30 4:36 下午
 */
import React from 'react';
import { render } from 'react-dom';
import Router from './router';

const renderHtml = () => {
  render(<Router />, document.getElementById('root'));
};

renderHtml();
if ((module as any).hot) {
  (module as any).hot.accept(() => {
    renderHtml();
  });
}
