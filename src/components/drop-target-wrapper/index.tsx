import { ForwardRefRenderFunction, forwardRef, ReactNode } from 'react';
import { DropTargetMonitor, useDrop } from 'react-dnd';

export type DropTargetWrapperProps = {
  children?: ReactNode;
  onDrop?: (data: any, monitor: DropTargetMonitor ) => void;
};

export type DropTargetWrapperRef = {};

const DropTargetWrapper: ForwardRefRenderFunction<
  DropTargetWrapperRef,
  DropTargetWrapperProps
> = ({ children, onDrop }, ref) => {
  const [{ monitor }, drop] = useDrop(() => ({
    accept: 'BOX',
    drop: (item) => {
      if (onDrop) {
        onDrop(item, monitor);
      }
    },
    collect: (monitor) => ({
      monitor,
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));

  return <div ref={drop}>{children}</div>;
};

export default forwardRef(DropTargetWrapper);
