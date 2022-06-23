import { ElementType } from 'react';
import { IElementController } from './interface';

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
};

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
  locked?: boolean;
  hover?: boolean;
};

/**
 * 元素实体json描述
 */
export type ElementSchema = {
  componentName: string;
  bounds: Bounds;
  props?: any;
  //@TODO: 目前不需要子节点处理
  children?: ElementSchema[];
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

export type ActionProps = {
  toolbarItemClass?: ElementType;
  label?: string;
  tip?: string;
  iconType?: string;
};

/**
 * toolbar上编辑按钮的配置定义
 */
export type ActionMetadata = {
  actionName: string;
  props?: ActionProps;
  render?: (controller: IElementController) => ActionProps | void;
  invoker?: (controller: IElementController) => void;
};
