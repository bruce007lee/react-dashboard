```jsx
import React from 'react';
import Dashboard from '../src/index';
import { mockData, mockComMetas } from './mock';


const App = () => {
  return (
    <Dashboard data={mockData} components={mockComMetas}/>
  );
};

export default App;
```
