```jsx
import React, { useState } from 'react';
import { Button } from 'antd';
import Dashboard from '../src/index';
import { mockData, mockComMetas } from './mock';
import Toast from '../src/components/toast';

const styles = {
  btnBar: {
    padding: '10px 0',
  },
};

Toast.show({
  content: 'testtesttesttesttesttest'
});

const App = () => {
  const [editable, setEditable] = useState(false);

  return (
    <div>
      <div style={styles.btnBar}>
        <Button
          onClick={() => {
            setEditable(!editable);
          }}
        >
          {editable ? '关闭编辑' : '开启编辑'}
        </Button>
      </div>
      <Dashboard
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
