/**
 * @author ChicAboo
 * @date 2021/1/6 9:58 下午
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { Layout, Menu } from 'antd';

const { Content, Header } = Layout;

const LayoutCms = ({ children }: any) => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ background: '#FAFAFA' }}>
        <div
          className="logo"
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            background: '#1890ff',
            float: 'left',
            margin: '10px 50px 0 0',
          }}
        />
        <Menu
          theme="light"
          mode="horizontal"
          defaultSelectedKeys={['1']}
          style={{ background: '#FAFAFA' }}>
          <Menu.Item key="1">
            <Link to="/basic">Basic</Link>
          </Menu.Item>
          <Menu.Item key="2">
            <Link to="/drag-node">Drag Node</Link>
          </Menu.Item>
        </Menu>
      </Header>
      <Layout className="site-layout">
        <Content>{children}</Content>
      </Layout>
    </Layout>
  );
};

export default LayoutCms;
