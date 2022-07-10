import React, { ForwardRefRenderFunction, forwardRef, ReactNode, useMemo } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { IElementsProviderContext } from '../../types';
import { genId } from '../../utils';
import { ElementsProviderContext } from '../context-factory';

export type ElementsProviderProps = {
  accept?: string;
  children?: ReactNode;
};

export type ElementsProviderRef = {};

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
    <ElementsProviderContext.Provider value={context}>
      <DndProvider backend={HTML5Backend}>{children}</DndProvider>
    </ElementsProviderContext.Provider>
  );
};

export default forwardRef(ElementsProvider);
