import { ActionMetadata } from '../types';

// 锁定
export const lockAction: ActionMetadata = {
  actionName: 'lock',
  props: {
    tip: '未锁定',
    iconType: 'unlock',
  },
  render: (controller) => {
    const { locked } = controller.getStatus();
    return locked ? { tip: '已锁定', iconType: 'lock_fill' } : { tip: '未锁定', iconType: 'unlock' };
  },
  invoker: (controller) => {
    const { locked } = controller.getStatus();
    controller.setLocked(!locked);
  },
};

// 删除
export const deleteAction: ActionMetadata = {
  actionName: 'delete',
  props: {
    tip: '删除',
    iconType: 'delete',
  },
  invoker: (controller) => {
    controller.remove();
  },
};

// 上移
export const moveUpAction: ActionMetadata = {
  actionName: 'moveUp',
  props: {
    tip: '上移',
    iconType: 'arrowtop',
  },
  invoker: (controller) => {
    controller.moveToNext();
  },
};

// 下移
export const moveDownAction: ActionMetadata = {
  actionName: 'moveDown',
  props: {
    tip: '下移',
    iconType: 'arrowdown',
  },
  invoker: (controller) => {
    controller.moveToPrev();
  },
};

// 移动到顶层
export const moveTopAction: ActionMetadata = {
  actionName: 'moveTop',
  props: {
    tip: '置顶',
    iconType: 'arrowtopl',
  },
  invoker: (controller) => {
    controller.moveToLast();
  },
};

// 移动到底层
export const moveBottomAction: ActionMetadata = {
  actionName: 'moveBottom',
  props: {
    tip: '置底',
    iconType: 'arrowbottoml',
  },
  invoker: (controller) => {
    controller.moveToFirst();
  },
};

export const DEFAULT_ACTION_NAMES: string[] = [
  // 'moveTop',
  // 'moveBottom',
  // 'moveUp',
  // 'moveDown',
  'lock',
  'delete',
];

export const ACTIONS: ActionMetadata[] = [
  lockAction,
  deleteAction,
  moveUpAction,
  moveDownAction,
  moveTopAction,
  moveBottomAction,
];
