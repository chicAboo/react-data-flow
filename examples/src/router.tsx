/**
 * @author ChicAboo
 * @date 2021/1/6 9:52 下午
 */
import React from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import LayoutCms from './components/Layout';
import Basic from './pages/basic';
import DragNode from './pages/drag-node';

const Router = () => (
  <BrowserRouter>
    <LayoutCms>
      <Switch>
        <Route exact path="/" render={() => <Redirect to="/basic" />} />
        <Route path="/basic" component={Basic} />
        <Route path="/drag-node" component={DragNode} />
      </Switch>
    </LayoutCms>
  </BrowserRouter>
);

export default Router;
