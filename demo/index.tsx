import React, { useState, useRef } from 'react';
import { Button } from 'antd';
import Dashboard, { Toast, DashboardRef, ElementsProvider, ElementSource } from '../src/index';
import actionMetas from './action-metadata';
import materialMetas from './material-metadata';
import { mockData, mockSourceData } from './mock';
import setterMetas from './setter-metadata';
import JSONDialog from './json-dialog';

// antd依赖样式
import 'antd/dist/antd.css';
import './index.scss';

const SAVE_KEY = '_demo_data_';
const save = (data) => {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(data));
  } catch (e) {
    Toast.show('保存数据失败：' + e.message);
  }
};
const load = () => {
  try {
    const schema = localStorage.getItem(SAVE_KEY);
    if (!schema) {
      return null;
    }
    return JSON.parse(localStorage.getItem(SAVE_KEY) || '[]');
  } catch (e) {
    Toast.show('读取数据失败：' + e.message);
    return null;
  }
};

const ComItem = ({ children, data }) => {
  return (
    <ElementSource data={data}>
      <div className="element-item">{children}</div>
    </ElementSource>
  );
};

const App = () => {
  const [editable, setEditable] = useState(true);
  const [magnet, setMagnet] = useState(true);
  const [data, setData] = useState(load() || mockData);
  const setterContainerRef = useRef<HTMLDivElement>(null);
  const dashboardRef = useRef<DashboardRef>(null);

  return (
    <div className="demo">
      <ElementsProvider>
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
              setMagnet(!magnet);
            }}
          >
            {magnet ? '关闭磁吸' : '开启磁吸'}
          </Button>
          <Button
            onClick={() => {
              const json = dashboardRef.current?.getEditData();
              console.log('schema data:', json);
              JSONDialog.show({
                jsonString: JSON.stringify(json, null, 2),
                onOk: (val) => {
                  let rs = null;
                  try {
                    rs = JSON.parse(val);
                  } catch (e) {
                    Toast.show('应用数据错误：' + e.message);
                  }
                  if (Array.isArray(rs)) {
                    setData(rs);
                  }
                },
              });
            }}
          >
            设置schema数据
          </Button>
          <Button
            onClick={() => {
              save(dashboardRef.current?.getEditData());
            }}
          >
            保存数据
          </Button>
          <Button
            onClick={() => {
              setData(load() || []);
            }}
          >
            读取数据
          </Button>
        </div>
        <div className="main">
          <div className="element-box">
            {mockSourceData.map((source) => (
              <ComItem key={source.label} data={source.data}>
                {source.label}
              </ComItem>
            ))}
          </div>
          <div className="dashboard-box">
            <Dashboard
              className="dashboard"
              ref={dashboardRef}
              setterContainerRef={setterContainerRef}
              enableMagnet={magnet}
              editable={editable}
              data={data}
              actions={actionMetas}
              components={materialMetas}
              setters={setterMetas}
            />
          </div>
          <div className="setter-box">
            <div className="box-section-title">属性设置</div>
            <div className="setter-panel" ref={setterContainerRef} />
          </div>
        </div>
      </ElementsProvider>
    </div>
  );
};

export default App;
