import { ElementSchema, ComponentMetadata } from '../src/index';
import DemoChart from './chart';

const Item1 = ({ text = '测试拖控内容 测试拖控内容 测试拖控内容' }) => {
  return <div>{text}</div>;
};

const Item2 = () => {
  return (
    <div>
      <div style={{ backgroundColor: '#eee' }}>标题：</div>
      <div>测试拖控内容</div>
    </div>
  );
};

export const mockComMetas: ComponentMetadata[] = [
  {
    componentName: 'Item1',
    componentClass: Item1,
  },
  {
    componentName: 'Item2',
    componentClass: Item2,
  },
  {
    componentName: 'Chart',
    componentClass: DemoChart,
  },
];

export const mockData: ElementSchema[] = [
  {
    componentName: 'Item1',
    props: {},
    bounds: {
      x: 0,
      y: 0,
      width: 100,
      height: 100,
    },
  },

  {
    componentName: 'Item2',
    props: {
      text: '元素2',
    },
    bounds: {
      x: 120,
      y: 0,
      width: 100,
      height: 100,
    },
  },
  {
    componentName: 'Chart',
    props: {},
    bounds: {
      x: 220,
      y: 110,
      width: 400,
      height: 300,
    },
  },
];
