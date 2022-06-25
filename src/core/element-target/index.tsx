import { FC } from 'react';
import DropTargetWrapper from '../../components/drop-target-wrapper';
import { ElementSchema } from '../../types';
import { cloneDeep, elementUtil } from '../../utils';
import { useRenderContext } from '../render-context';

export type ElementTargetProps = {};

const ElementTarget: FC<ElementTargetProps> = ({ children }) => {
  const context = useRenderContext();
  return (
    <DropTargetWrapper
      onDrop={(data: ElementSchema, monitor) => {
        data = cloneDeep(data);
        const builder = context.getBuilder();
        const offset = monitor.getClientOffset();
        const ct = builder.getCanvasContainerRef().current;
        const rect = ct.getBoundingClientRect();
        elementUtil.setBounds(data, {
          ...elementUtil.getBounds(data),
          x: Math.round(offset.x - rect.left),
          y: Math.round(offset.y - rect.top),
        });
        builder.addElement(data);
      }}
    >
      {children}
    </DropTargetWrapper>
  );
};

export default ElementTarget;
