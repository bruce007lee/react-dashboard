import { ComponentMetadata, Toast } from '../src/index';
import { BarChart, PieChart } from './chart';

const Item1 = ({ text = '内容', color, alignItems }) => {
  return (
    <div style={{ color, wordBreak: 'break-all', display: 'flex', alignItems, width: '100%', height: '100%' }}>
      {text}
    </div>
  );
};

const Item2 = ({ title = '标题', content = '内容' }) => {
  return (
    <div style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
      <div style={{ backgroundColor: '#eee' }}>{title}</div>
      <div style={{ whiteSpace: 'pre' }}>{content}</div>
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
        //位置
        {
          label: '竖直对齐',
          name: 'alignItems',
          setter: {
            componentName: 'SelectSetter',
            props: {
              options: [
                {
                  label: '顶部',
                  value: 'flex-start',
                },
                {
                  label: '中间',
                  value: 'center',
                },
                {
                  label: '底部',
                  value: 'flex-end',
                },
              ],
            },
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
      props: [
        {
          label: '标题',
          name: 'title',
          setter: {
            componentName: 'StringSetter',
          },
        },
        {
          label: '内容',
          name: 'content',
          setter: {
            componentName: 'TextAreaSetter',
          },
        },
      ],
    },
  },
  {
    componentName: 'BarChart',
    componentClass: BarChart,
  },
  {
    componentName: 'PieChart',
    componentClass: PieChart,
    configure: {
      props: [
        {
          label: '文本',
          name: 'title',
          setter: {
            componentName: 'StringSetter',
          },
        },
      ],
      lifecycle: {
        onBeforeSourceAdd: (data, ctx) => {
          // 这里限制只能加1个
          if (ctx.getElements().find((item) => item.getData(false).componentName === 'PieChart')) {
            Toast.show('环图最多只能添加一个');
            return false;
          }
          return true;
        },
      },
    },
  },
];

export default comMetas;
