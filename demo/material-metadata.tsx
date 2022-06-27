import { ComponentMetadata } from '../src/index';

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

/*
 * toolbar设置
 */
const comMetas: ComponentMetadata[] = [
  {
    componentName: 'Item1',
    componentClass: Item1,
  },
  {
    componentName: 'Item2',
    componentClass: Item2,
    extraToolbarActions: ['showInfo'],
  },
  {
    componentName: 'Chart',
    componentClass: DemoChart,
  },
];

export default comMetas;
