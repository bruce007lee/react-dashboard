import { ForwardRefRenderFunction, forwardRef, ReactNode, createContext, useContext, useMemo } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { IElementsProviderContext } from '../../types';
import { genId } from '../../utils';

export type ElementsProviderProps = {
  accept?: string;
  children?: ReactNode;
};

export type ElementsProviderRef = {};

const Contxt = createContext<IElementsProviderContext>(null);

const ElementsProvider: ForwardRefRenderFunction<ElementsProviderRef, ElementsProviderProps> = (
  { children, accept },
  ref,
) => {
  const context = useMemo<IElementsProviderContext>(
    () => ({
      accept: accept || `dashboard-${genId()}`,
    }),
    [accept],
  );
  return (
    <Contxt.Provider value={context}>
      <DndProvider backend={HTML5Backend}>{children}</DndProvider>
    </Contxt.Provider>
  );
};

export default forwardRef(ElementsProvider);

export const useElementsProviderContext = (): IElementsProviderContext => {
  return useContext(Contxt);
};
