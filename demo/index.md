```jsx
import React, { useState, useRef } from 'react';
import { Button } from 'antd';
import Dashboard from '../src/index';
import { mockData, mockComMetas, mockSourceData } from './mock';
import Toast from '../src/components/toast';
import ElementSource from '../src/core/element-source';
import ElementsProvider from '../src/core/elements-provider';
import './index.scss';

Toast.show('toast 测试');

const ComItem = ({ children, data }) => {
  return (
    <ElementSource data={data}>
      <div className="element-item">{children}</div>
    </ElementSource>
  );
};

const App = () => {
  const [editable, setEditable] = useState(true);
  const dashboardRef = useRef(null);

  return (
    <ElementsProvider>
      <div className="demo">
        <div className="button-bar">
          <Button
            onClick={() => {
              setEditable(!editable);
            }}
          >
            {editable ? '关闭编辑' : '开启编辑'}
          </Button>
          <Button
            onClick={() => {
              console.log('schema data:', dashboardRef.current.getEditData());
            }}
          >
            获取schema数据
          </Button>
        </div>
        <div className="main">
          <div className="element-box">
            {mockSourceData.map((source) => (
              <ComItem key={source.label} data={source.data}>{source.label}</ComItem>
            ))}
          </div>
          <Dashboard
            ref={dashboardRef}
            style={{
              height: 1000,
              width: 800,
              border: '1px solid green',
            }}
            editable={editable}
            data={mockData}
            components={mockComMetas}
          />
        </div>
      </div>
    </ElementsProvider>
  );
};

export default App;
```
