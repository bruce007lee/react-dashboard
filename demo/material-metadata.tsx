import { ComponentMetadata } from '../src/index';

import DemoChart from './chart';

const Item1 = ({ text = '内容', color }) => {
  return <div style={{ color, wordBreak: 'break-all' }}>{text}</div>;
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
    configure: {
      props: [
        //对应设置Item1的text属性
        {
          label: '文本',
          name: 'text',
          setter: {
            componentName: 'StringSetter',
          },
        },
        //对应设置Item1的color属性
        {
          label: '颜色',
          name: 'color',
          setter: {
            componentName: 'SelectSetter',
            props: {
              options: [
                {
                  label: '黑色(black)',
                  value: '#000',
                },
                {
                  label: '红色(red)',
                  value: 'red',
                },
                {
                  label: '绿色(green)',
                  value: 'green',
                },
                {
                  label: '蓝色(blue)',
                  value: 'blue',
                },
              ],
            },
          },
        },
      ],
    },
  },
  {
    componentName: 'Item2',
    componentClass: Item2,
    configure: {
      extraToolbarActions: ['showInfo'],
    },
  },
  {
    componentName: 'Chart',
    componentClass: DemoChart,
  },
];

export default comMetas;
