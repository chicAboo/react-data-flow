/**
 * @author ChicAboo
 * @date 2020/12/30 4:36 下午
 */
import React, { useState } from 'react';
import { Tree, Row, Col, message } from 'antd';
import { FileOutlined, FolderOpenOutlined } from '@ant-design/icons';
import ReactDataFlow, { Backgrounds, Controls, useDFSelector } from 'rdf-renderer';
import './index.scss';

// 左侧树
const treeData = [
  {
    title: '分类1',
    key: '0',
    children: [
      {
        title: '节点1',
        key: 'n001',
      },
      {
        title: '节点2',
        key: 'n002',
      },
      {
        title: '节点3',
        key: 'n003',
      },
      {
        title: '节点4',
        key: 'n004',
      },
    ],
  },
  {
    title: '分类2',
    key: '1',
    children: [
      {
        title: 'node1',
        key: 'nf001',
      },
      {
        title: 'node2',
        key: 'nf002',
      },
      {
        title: 'node3',
        key: 'nf003',
      },
      {
        title: 'node4',
        key: 'nf004',
      },
    ],
  },
];

const DragNode = () => {
  const prefixCls = 'drag-node';
  const [dfInstance] = useDFSelector();
  const [dfNodes, setNodes] = useState<any>([]);

  // @ts-ignore
  function drag({ event, node }: any) {
    const graphData = dfInstance.getDfValues();
    if (graphData) {
      const { nodes, transform } = graphData;
      const exists = nodes.findIndex((item: any) => item.id === node.key);
      if (exists !== -1) {
        return message.warning('图中已存在该节点！');
      }

      const position = {
        x: (event.pageX - transform.x - 250) / transform.zoom,
        y: (event.pageY - transform.y - 50) / transform.zoom,
      };
      const newNodes = [...nodes, { id: node.key, title: node.title, position }];
      setNodes(newNodes);
    }
  }

  return (
    <div className={prefixCls}>
      <div className={`${prefixCls}-left`}>
        <h3>节点列表</h3>
        <div className={`${prefixCls}-list`}>
          <Tree
            draggable
            showIcon
            blockNode
            defaultExpandAll
            treeData={treeData}
            onDragEnd={drag}
            titleRender={(node: any) => {
              const isFolder = node.key === '0' || node.key === '1';
              return (
                <Row>
                  <Col span={18}>
                    {isFolder ? <FolderOpenOutlined /> : <FileOutlined />}
                    <span className="tree-name">{node.title}</span>
                  </Col>
                  {!isFolder && (
                    <Col span={6} className="leaf-drag">
                      <span>....</span>
                      <span>....</span>
                    </Col>
                  )}
                </Row>
              );
            }}
          />
        </div>
      </div>
      <div className={`${prefixCls}-right`}>
        <ReactDataFlow
          flow={dfInstance}
          nodes={dfNodes}
          isShowCircle={true}
          isCircleMove={true}
          onCircleCallback={(data) => console.log('点击线上的圆的回调', data)}
          onFinish={(data: any) => console.log('提交时触发的回调', data)}>
          <Backgrounds />
          <Controls />
        </ReactDataFlow>
      </div>
    </div>
  );
};

export default DragNode;
