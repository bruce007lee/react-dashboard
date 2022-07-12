import { createContext, useContext } from 'react';
import { IElementController, IElementsProviderContext, IRenderContext } from '../../types';

export const ElementControllerContext = createContext<IElementController>(null);

/**
 * 获取当前对应的 ElementController 对象
 */
export const useElementController = (): IElementController => {
  return useContext(ElementControllerContext);
};

export const ElementsProviderContext = createContext<IElementsProviderContext>(null);

/**
 *  获取当前 ElementsProvider 对象
 */
export const useElementsProviderContext = (): IElementsProviderContext => {
  return useContext(ElementsProviderContext);
};

export const AppContext = createContext<IRenderContext>(null);

/**
 *  获取当前 RenderContext 对象
 */
export const useRenderContext = (): IRenderContext => {
  return useContext(AppContext);
};
