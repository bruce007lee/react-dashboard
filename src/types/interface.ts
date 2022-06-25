import { MutableRefObject } from 'react';
import ActionManager from '../core/action-manager';
import ElementManager from '../core/element-manager';
import MaterialManager from '../core/material-manager';
import { DashBoardConfig, ElementSchema, ElementStatus } from './model';

export interface IDispatcher {
  updateView(): void;
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
  getData(): ElementSchema;
  getStatus(): ElementStatus;
  setStatus(
    status: ElementStatus,
    options?: { replace?: boolean; updateView? }
  ): void;
  getContext(): IRenderContext;
  updateView(): void;
  remove(): void;
}

/**
 * 所有元素的渲染和控制器
 */
export interface IElementsBuilder {
  getCanvasContainerRef(): MutableRefObject<HTMLDivElement>;
  getMaterialManager(): MaterialManager;
  getActionManager(): ActionManager;
  getElementManager(): ElementManager;
  setData(data: ElementSchema[]): void;
  getData(): ElementSchema[];
  getElements(): IElementController[];
  schemaToElement(element: ElementSchema):IElementController;
  removeElement(element: IElementController): void;
  removeElements(elements: IElementController[]): void;
  addElement(element: IElementController | ElementSchema): void;
  addElements(elements: Array<IElementController | ElementSchema>): void;
  updateView(): void;
}
