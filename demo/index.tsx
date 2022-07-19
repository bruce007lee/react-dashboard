import { Button, Slider } from 'antd';
// antd依赖样式
import 'antd/dist/antd.css';
import React, { useRef, useState } from 'react';
import Dashboard, { DashboardRef, ElementSource, ElementsProvider, Toast } from '../src/index';
import actionMetas from './action-metadata';
import './index.scss';
import JSONDialog from './json-dialog';
import materialMetas from './material-metadata';
import { mockData, mockSourceData } from './mock';
import setterMetas from './setter-metadata';

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
  const [scale, setScale] = useState(1);
  const [editable, setEditable] = useState(true);
  const [limitBounds, setLimitBounds] = useState(false);
  const [magnet, setMagnet] = useState(true);
  const [data, setData] = useState(load() || mockData);
  const setterContainerRef = useRef<HTMLDivElement>(null);
  const dashboardRef = useRef<DashboardRef>(null);

  const extraContent = (
    <div
      style={{
        borderLeft: '1px dashed red',
        height: '100%',
        left: 600,
        top: 0,
        position: 'absolute',
      }}
    >
      <div
        style={{
          color: 'red',
          left: 10,
          top: 100,
          position: 'absolute',
        }}
      >
        辅助线
      </div>
    </div>
  );

  return (
    <div className="demo">
      <ElementsProvider>
        <div className="button-bar">
          <Button
            className="bar-item"
            onClick={() => {
              setEditable(!editable);
            }}
          >
            {editable ? '关闭编辑' : '开启编辑'}
          </Button>
          <Button
            className="bar-item"
            onClick={() => {
              setLimitBounds(!limitBounds);
            }}
          >
            {limitBounds ? '关闭限制移动区域' : '开启限制移动区域'}
          </Button>
          <Button
            className="bar-item"
            onClick={() => {
              setMagnet(!magnet);
            }}
          >
            {magnet ? '关闭磁吸' : '开启磁吸'}
          </Button>
          <Button
            className="bar-item"
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
            className="bar-item"
            onClick={() => {
              save(dashboardRef.current?.getEditData());
            }}
          >
            保存数据
          </Button>
          <Button
            className="bar-item"
            onClick={() => {
              setData(load() || []);
            }}
          >
            读取数据
          </Button>
          <div className="bar-item">
            <span>缩放：</span>
            <Slider
              style={{ width: 200 }}
              min={0}
              max={4}
              step={0.01}
              onChange={(val) => {
                setScale(typeof val === 'number' ? val : 1);
              }}
              value={typeof scale === 'number' ? scale : 1}
            />
          </div>
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
              scaleRatio={scale}
              ref={dashboardRef}
              canvasExtraContent={extraContent}
              setterContainerRef={setterContainerRef}
              setterContainerExtraRender={({ renderContext }) => {
                if (!renderContext.getElements().find((item) => item.getStatus().selected)) {
                  return <div>请先左边选择一个组件</div>;
                }
                return null;
              }}
              limitBounds={limitBounds}
              enableMagnet={magnet}
              editable={editable}
              data={data}
              actions={actionMetas}
              components={materialMetas}
              setters={setterMetas}
              eventsMonitor={{
                onElementChange: (controller, type) => {
                  console.log('[DEBUG]elementChange:', controller.getId(), '|', type);
                },
              }}
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
