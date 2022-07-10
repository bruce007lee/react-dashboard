import React, { FC } from 'react';
import { ElementSchema, DashBoardConfig, IElementsBuilder, IElementController, IRenderContext } from '../../types';
import { AppContext } from '../context-factory';

export type RenderContextProps = {
  builder?: IElementsBuilder;
  config?: DashBoardConfig;
};

export default class RenderContext implements IRenderContext {
  private builder: IElementsBuilder;
  private config: DashBoardConfig;
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
}

export type RenderContextProviderProps = {
  value: RenderContext;
};

export const RenderContextProvider: FC<RenderContextProviderProps> = ({ value, children }) => {
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
