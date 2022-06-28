import { FC, MutableRefObject } from 'react';
import type ActionManager from '../core/action-manager';
import type ElementManager from '../core/element-manager';
import type MaterialManager from '../core/material-manager';
import type SetterManager from '../core/setter-manager';
import type { DashBoardConfig, ElementSchema, ElementStatus, FieldConfig } from './model';

export interface IDispatcher {
  updateView(): void;
}

/**
 * 添加元素时拖控的上下文
 */
export interface IElementsProviderContext {
  accept: string;
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
  getData(clone?: boolean): ElementSchema;
  setData(data: ElementSchema): void;
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
  addElement(element: IElementController | ElementSchema): void;
  addElements(elements: Array<IElementController | ElementSchema>): void;
  updateView(): void;
}

export interface ISetterProps {
  setValue(val: any): void;
  getValue(): any;
  getDefaultValue(): any;
  fieldConfig: FieldConfig;
}

export interface SetterRenderFunction<T extends ISetterProps = ISetterProps> extends FC<T> {}
