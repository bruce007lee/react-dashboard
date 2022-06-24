import { ForwardRefRenderFunction, forwardRef } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

export type ElementsProviderProps = {};

export type ElementsProviderRef = {};

const ElementsProvider: ForwardRefRenderFunction<
  ElementsProviderRef,
  ElementsProviderProps
> = ({ children }, ref) => {
  return <DndProvider backend={HTML5Backend}>{children}</DndProvider>;
};

export default forwardRef(ElementsProvider);
