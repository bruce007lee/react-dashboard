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
  getConfig(): DashBoardConfig;
  getBuilder(): IElementsBuilder;
  getEditData(): ElementSchema[];
  getElements(): IElementController[];
  getEditable(): boolean;
  setEditable(editable: boolean);
  updateView(): void;
}

/**
 * 元素控制器
 */
export interface IElementController {
  getId(): string;
  getComponentMetadata(): ComponentMetadata;
  getData(clone?: boolean): ElementSchema;
  setData(data: ElementSchema): void;
  setLocked(locked: boolean): void;
  setSelectd(selected: boolean): void;
  getStatus(): ElementStatus;
  setStatus(status: ElementStatus, options?: { replace?: boolean; updateView?: boolean }): void;
  getContext(): IRenderContext;
  updateView(): void;
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
