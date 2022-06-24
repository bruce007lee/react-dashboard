import { ActionMetadata } from '../types';

//锁定
export const lockAction = {
  actionName: 'lock',
  props: {
    tip: '未锁定',
    iconType: 'unlock',
  },
  render: (controller) => {
    const locked = controller.getStatus().locked;
    return locked
      ? {
          tip: '已锁定',
          iconType: 'lock_fill',
        }
      : {
          tip: '未锁定',
          iconType: 'unlock',
        };
  },
  invoker: (controller) => {
    const locked = controller.getStatus().locked;
    controller.setStatus({
      locked: !locked,
    });
  },
};

//删除
export const deleteAction = {
  actionName: 'delete',
  props: {
    tip: '删除',
    iconType: 'delete',
  },
  invoker: (controller) => {
    controller.remove();
  },
};

export const DEFAULT_ACTION_NAMES: string[] = ['lock', 'delete'];

export const ACTIONS: ActionMetadata[] = [lockAction, deleteAction];
