import ActionManager from '../core/action-manager';
import ElementManager from '../core/element-manager';
import MaterialManager from '../core/material-manager';
import { DashBoardConfig, ElementSchema, ElementStatus } from './model';

export interface IDispatcher{
  updateView(): void;
}

export interface IRenderContext {
  getConfig(): DashBoardConfig;
  getBuilder(): IElementsBuilder;
  getEditData(): ElementSchema[];
  getElements(): IElementController[];
  getEditable(): boolean;
  setEditable(editable: boolean);
  updateView(): void;
}

export interface IElementController {
  getId(): string;
  getData(): ElementSchema;
  getStatus(): ElementStatus;
  setStatus(status: ElementStatus, options?: {replace?: boolean, updateView?}): void;
  updateView(): void;
  remove():void;
}

export interface IElementsBuilder {
  getMaterialManager(): MaterialManager;
  getActionManager(): ActionManager;
  getElementManager(): ElementManager
  setData(data: ElementSchema[]): void;
  getData(): ElementSchema[];
  getElements(): IElementController[];
  removeElement(element: IElementController): void;
  removeElements(element: IElementController[]): void;
  addElement(element: IElementController): void;
  addElements(element: IElementController[]): void;
  updateView(): void;
}
