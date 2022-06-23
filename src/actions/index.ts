import { ActionMetadata } from '../types';

export const DEFAULT_ACTION_NAMES: string[] = ['lock', 'delete'];

export const ACTIONS: ActionMetadata[] = [
  //锁定
  {
    actionName: 'lock',
    props: {
      tip: '未锁定',
      iconType: 'unlock',
    },
    invoker: (controller) => {
      const locked = controller.getStatus().locked;
      controller.setStatus({
        locked: !locked,
      });
      return locked
        ? {
            tip: '未锁定',
            iconType: 'unlock',
          }
        : {
            tip: '已锁定',
            iconType: 'lock_fill',
          };
    },
  },

  //删除
  {
    actionName: 'delete',
    props: {
      tip: '删除',
      iconType: 'unlock',
    },
    invoker: (controller) => {
      controller.remove();
    },
  },
];
