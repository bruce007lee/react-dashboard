import { FC } from 'react';
import DropTargetWrapper from '../../components/drop-target-wrapper';
import { useRenderContext } from '../render-context';

export type ElementTargetProps = {};

const ElementTarget: FC<ElementTargetProps> = ({ children }) => {
  const context = useRenderContext();
  return <DropTargetWrapper onDrop={(data) => context.getBuilder().addElement(data)}>{children}</DropTargetWrapper>;
};

export default ElementTarget;
