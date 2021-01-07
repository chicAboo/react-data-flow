/**
 * @author ChicAboo
 * @date 2020/12/30 4:36 下午
 */
import React, { useState } from 'react';
import { Button, Modal, Form, Input, InputNumber, message } from 'antd';
import ReactDataFlow, { Backgrounds, Controls, useDFSelector } from 'rdf-renderer';

const height = 600;
const nodes = [
  {
    id: 'id_001',
    title: 'test',
    position: { x: 185, y: 231 },
  },
  {
    id: 'id_002',
    title: 'test1',
    position: { x: 500, y: 231 },
  },
  {
    id: 'id_003',
    title: 'test1',
    position: { x: 185, y: 492 },
  },
];

const edges = [
  {
    endDirection: 'top',
    endPosition: { x: 185, y: 492 },
    id: 'id_001-id_003',
    sourceId: 'id_001',
    startDirection: 'bottom',
    startPosition: { x: 185, y: 231 },
    targetId: 'id_003',
    text: 10,
  },
  {
    endDirection: 'left',
    endPosition: { x: 498, y: 231 },
    id: 'id_001-id_002',
    sourceId: 'id_001',
    startDirection: 'right',
    startPosition: { x: 185, y: 231 },
    targetId: 'id_002',
  },
];

// 背景参数
/*const gridConfig = {
  strokeColor: '#ccc', // 边的颜色
  strokeWidth: 1, // 边的宽度
  isLineDash: false, // 是否虚线显示
};*/

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

const Demo = () => {
  const [form] = Form.useForm();
  const [dfInstance] = useDFSelector();
  const [visible, setVisible] = useState(false);

  function onFinish() {
    const values = form.getFieldsValue();
    dfInstance.setEdgeValues(values);
    setVisible(false);
  }

  return (
    <div style={{ margin: '0 30px' }}>
      <div style={{ textAlign: 'right' }}>
        <Button onClick={() => console.log('当前图谱的值', dfInstance.getDfValues())}>
          获取当前值
        </Button>
        <Button style={{ margin: '20px 20px' }} onClick={() => setVisible(true)}>
          设置边的值
        </Button>
        <Button type={'primary'} onClick={() => dfInstance.submit()}>
          提交
        </Button>
      </div>
      <div
        style={{
          // width,
          height,
          border: '1px solid #ccc',
        }}>
        <ReactDataFlow
          flow={dfInstance}
          nodes={nodes}
          edges={edges}
          isShowCircle={true}
          isCircleMove={true}
          onCircleCallback={(data) => {
            message.success('点击成功, 返回的数据信息看控制台');
            console.log('点击线上的圆的回调', data);
          }}
          onFinish={(data: any) => console.log('提交时触发的回调', data)}>
          <Backgrounds />
          <Controls />
        </ReactDataFlow>
      </div>
      <Modal
        title="设置回显值"
        visible={visible}
        onCancel={() => setVisible(false)}
        onOk={() => form.submit()}>
        <Form
          name="rdf"
          {...layout}
          form={form}
          onFinish={onFinish}
          initialValues={{ edgeId: 'id_001-id_002', text: 99 }}>
          <Form.Item
            label="边上的值"
            name="text"
            rules={[{ required: true, message: 'Please input count' }]}>
            <InputNumber />
          </Form.Item>
          <Form.Item
            label="边的ID"
            name="edgeId"
            rules={[{ required: true, message: 'Please input ID!' }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Demo;
