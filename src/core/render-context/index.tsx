import React, { FC, MouseEvent } from 'react';
import {
  DashBoardConfig,
  ElementSchema,
  IDashboardLifecycle,
  IElementController,
  IElementsBuilder,
  IRenderContext,
} from '../../types';
import { AppContext } from '../context-factory';
import type ElementController from '../element-controller';

export type RenderContextProps = {
  builder?: IElementsBuilder;
  config?: DashBoardConfig;
};

export default class RenderContext implements IRenderContext {
  private builder: IElementsBuilder;
  private config: DashBoardConfig;
  private realScaleRatio: number = 1;
  constructor(props?: RenderContextProps) {
    this.builder = props?.builder;
    this.config = props?.config || {};
  }

  setConfig(config: DashBoardConfig, replace?: boolean) {
    if (replace) {
      this.config = { ...config };
    } else {
      this.config = { ...this.config, ...config };
    }
  }

  getConfig(): DashBoardConfig {
    return this.config;
  }

  setBuilder(builder: IElementsBuilder) {
    this.builder = builder;
  }

  getBuilder(): IElementsBuilder {
    return this.builder;
  }

  getEditData(): ElementSchema[] {
    return this.builder?.getData(false) || [];
  }

  getElements(): IElementController[] {
    return this.builder?.getElements() || [];
  }

  updateView(): void {
    this.builder?.updateView();
  }

  getEditable(): boolean {
    return this.getConfig().editable;
  }

  setEditable(editable: boolean) {
    return this.setConfig({
      editable,
    });
  }

  setRealScaleRatio(scale: number): void {
    this.realScaleRatio = scale;
  }

  getRealScaleRatio(): number {
    return this.realScaleRatio;
  }

  getScaleRatio(): number {
    return this.getConfig().scaleRatio;
  }

  getLifecycle(): IDashboardLifecycle {
    return this.getConfig().eventsMonitor as IDashboardLifecycle;
  }

  /**
   * 处理文档点击事件
   */
  handleCanvasClick(e: MouseEvent): void {
    this.getElements().forEach((item: ElementController) => item.handleCanvasClick(e));
  }
}

export type RenderContextProviderProps = {
  value: RenderContext;
};

export const RenderContextProvider: FC<RenderContextProviderProps> = ({ value, children }) => {
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
