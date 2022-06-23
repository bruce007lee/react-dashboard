import { FC, createContext, useContext } from 'react';
import ElementController from '../element-controller';
import ElementsBuilder from '../elements-builder';
import { ElementEntity, DashBoardConfig } from '../../types';

export type RenderContextProps = {
  builder?: ElementsBuilder;
  config?: DashBoardConfig;
};

export default class RenderContext {
  private builder: ElementsBuilder;
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

  setBuilder(builder: ElementsBuilder) {
    this.builder = builder;
  }

  getEditData(): ElementEntity[] {
    return this.builder?.getData() || [];
  }

  getElements(): ElementController[] {
    return this.builder?.getElements() || [];
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

const AppContext = createContext<RenderContext>(null);

export type RenderContextProviderProps = {
  value: RenderContext;
};

export const RenderContextProvider: FC<RenderContextProviderProps> = ({
  value,
  children,
}) => {
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useRenderContext = (): RenderContext => {
  return useContext(AppContext);
};
