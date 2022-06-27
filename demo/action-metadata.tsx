import { ActionMetadata } from '../src/index';

/*
 * toolbar设置
 */
const actions: ActionMetadata[] = [
    {
      actionName: 'showInfo',
      props: {
        label: '定制显示'
      },
      invoker: (controller) => {
        alert(JSON.stringify(controller.getData()));
      }
    }
];

export default actions;