import { ElementType } from 'react';

/**
 * 上下文中的全局设置类参数
 */
export type DashBoardConfig = {
  /**
   * 是否可编辑
   */
  editable?: boolean;
  /**
   * 是否开启磁吸
   */
  enableMagnet?: boolean;
  /**
   * 触发吸附的距离阀值
   */
  magnetThreshold?: number;
  /**
   * 吸附时模块元素间距
   */
  magnetSpace?: number;
}

export type Bounds = {
  x: number;
  y: number;
  width: number;
  height: number;
};

/**
 * 元素展示状态
 */
export type ElementStatus = {
  dragging?: boolean;
  resizing?: boolean;
}

/**
 * 元素实体
 */
export type ElementEntity = {
  componentName: string;
  bounds: Bounds;
  props?: any;
  //@TODO: 目前不需要子节点处理
  children?: ElementEntity[];
  [key: string]: any;
};

/**
 * 物料元件的实体
 */
export type ComponentMetadata = {
  componentName: string;
  componentClass: ElementType;
  props?: { [key: string]: any };
};
