/**
 * @author ChicAboo
 * @date 2020/12/30 4:36 下午
 */
import React from 'react';
import ReactDataFlow, { Backgrounds, Controls, useDFSelector } from 'rdf-renderer';

const width = document.body.clientWidth;
const height = 500;
const nodes = [
  {
    id: 'id_001',
    title: 'test',
    position: { x: 300, y: 100 },
  },
  {
    id: 'id_002',
    title: 'test1',
    position: { x: 500, y: 200 },
  },
  {
    id: 'id_003',
    title: 'test1',
    position: { x: 700, y: 300 },
  },
];

const Demo = () => {
  const [dfInstance] = useDFSelector();

  return (
    <div
      style={{
        width,
        height,
        border: '1px solid #ccc',
      }}>
      <button onClick={() => console.log(dfInstance.getDfValues())}>获取当前值</button>
      <button onClick={() => dfInstance.submit()}>提交</button>
      <ReactDataFlow
        flow={dfInstance}
        nodes={nodes}
        onFinish={(data: any) => console.log('tst', data)}>
        <Backgrounds />
        <Controls />
      </ReactDataFlow>
    </div>
  );
};

export default Demo;
