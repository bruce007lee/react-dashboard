import { FC, MutableRefObject } from 'react';
import type ActionManager from '../core/action-manager';
import type ElementManager from '../core/element-manager';
import type MaterialManager from '../core/material-manager';
import type SetterManager from '../core/setter-manager';
import type { ComponentMetadata, DashBoardConfig, ElementSchema, ElementStatus, FieldConfig } from './model';

export interface IDispatcher {
  updateView(): void;
}

/**
 * 添加元素时拖控的上下文
 */
export interface IElementsProviderContext {
  accept?: string;
  renderContext?: IRenderContext;
}

/**
 * dashboard渲染的上下文
 */
export interface IRenderContext {
  /**
   * 获取上下文配置
   */
  getConfig(): DashBoardConfig;
  /**
   * 获取元素构建器
   */
  getBuilder(): IElementsBuilder;
  /**
   * 获取编辑数据
   */
  getEditData(): ElementSchema[];
  /**
   * 获取所有元素
   */
  getElements(): IElementController[];
  /**
   * 获取当前是否是编辑状态
   */
  getEditable(): boolean;
  /**
   * 设置当前是否可编辑状态
   */
  setEditable(editable: boolean);
  /**
   * 强制刷新视图
   */
  updateView(): void;
  /**
   * 用于获取当前画布真实的缩放比例
   */
  getRealScaleRatio(): number;
  /**
   * 用于获取当前画布设置的缩放比例
   */
  getScaleRatio(): number;
}

/**
 * 元素控制器
 */
export interface IElementController {
  getId(): string;
  /**
   * 获取当前组件dom对象
   */
  getDom(): HTMLElement;
  /**
   * 获取当前组件描述元数据配置
   */
  getComponentMetadata(): ComponentMetadata;
  /**
   * 获取当前组件数据
   */
  getData(clone?: boolean): ElementSchema;
  /**
   * 设置当前组件数据
   */
  setData(data: ElementSchema): void;
  /**
   * 锁定当前组件
   */
  setLocked(locked: boolean): void;
  /**
   * 选中当前组件
   */
  setSelectd(selected: boolean): void;
  /**
   * 获取组件状态集合
   */
  getStatus(): ElementStatus;
  /**
   * 设置组件状态集合
   */
  setStatus(status: ElementStatus, options?: { replace?: boolean; updateView?: boolean }): void;
  /**
   * 获取渲染上下文
   */
  getContext(): IRenderContext;
  /**
   * 强制刷新组件视图
   */
  updateView(): void;
  /**
   * 删除组件
   */
  remove(): void;
  moveToPrev(): void;
  moveToNext(): void;
  moveToFirst(): void;
  moveToLast(): void;
  moveTo(index: number);
}

export interface IElementLifecycle {
  /**
   * 在添加组件前触发，返回false不添加
   */
  onBeforeSourceAdd?: (data: ElementSchema, ctx: IRenderContext) => boolean;
  /**
   * 在添加组件后触发
   */
  onSourceAdd?: (element: IElementController, data: ElementSchema, ctx: IRenderContext) => void;
  /**
   * 组件属性改变时触发
   */
  onChange?: (element: IElementController, propsType: string, ctx: IRenderContext) => void;
}

/**
 * 所有元素的渲染和控制器
 */
export interface IElementsBuilder {
  getCanvasContainerRef(): MutableRefObject<HTMLElement>;
  getMaterialManager(): MaterialManager;
  getActionManager(): ActionManager;
  getElementManager(): ElementManager;
  getSetterManager(): SetterManager;
  setData(data: ElementSchema[]): void;
  getData(clone?: boolean): ElementSchema[];
  getElements(): IElementController[];
  schemaToElement(element: ElementSchema): IElementController;
  removeElement(element: IElementController): void;
  removeElements(elements: IElementController[]): void;
  addElement(element: IElementController | ElementSchema): IElementController;
  addElements(elements: Array<IElementController | ElementSchema>): IElementController[];
  updateView(): void;
}

export interface ISetterProps {
  setValue(val: any): void;
  getValue(): any;
  getDefaultValue(): any;
  fieldConfig: FieldConfig;
}

export interface SetterRenderProps {
  setterProps: ISetterProps;
}

export interface SetterRenderFunction<T = {}> extends FC<T & SetterRenderProps> {}
