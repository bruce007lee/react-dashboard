import { ElementType } from 'react';
import { ElementEntity } from '../types';

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

export const mockData: ElementEntity<ElementType>[] = [
  {
    component: Item1,
    props: {},
    bounds: {
      x: 0,
      y: 0,
      width: 100,
      height: 100,
    },
  },

  {
    component: Item1,
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
    component: Item2,
    props: {},
    bounds: {
      x: 220,
      y: 110,
      width: 100,
      height: 100,
    },
  },
];
