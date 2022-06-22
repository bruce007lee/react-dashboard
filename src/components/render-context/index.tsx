import { FC, createContext, useContext, ElementType } from 'react';
import ElementController from '../element-controller';
import ElementsBuilder from '../elements-builder';
import { ElementEntity } from '../../types';

export type RenderContextProps = {
  builder: ElementsBuilder;
};

export default class RenderContext {
  private builder: ElementsBuilder;
  constructor(props?: RenderContextProps) {
    this.builder = props?.builder;
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
