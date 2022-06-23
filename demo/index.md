```jsx
import React, { useState, useRef } from 'react';
import { Button } from 'antd';
import Dashboard from '../src/index';
import { mockData, mockComMetas } from './mock';
import Toast from '../src/components/toast';
import './index.scss';

Toast.show('toast 测试');

const App = () => {
  const [editable, setEditable] = useState(true);
  const dashboardRef = useRef(null);

  return (
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
  );
};

export default App;
```
