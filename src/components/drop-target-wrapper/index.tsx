import { ForwardRefRenderFunction, forwardRef, ReactNode, HTMLAttributes } from 'react';
import { DropTargetMonitor, useDrop } from 'react-dnd';

export type DropTargetWrapperProps = Omit<HTMLAttributes<HTMLDivElement>, 'onDrop'> & {
  accept?: string;
  children?: ReactNode;
  onDrop?: (data: any, monitor: DropTargetMonitor) => void;
};

export type DropTargetWrapperRef = {};

const DropTargetWrapper: ForwardRefRenderFunction<DropTargetWrapperRef, DropTargetWrapperProps> = (
  { children, onDrop, accept, ...others },
  ref,
) => {
  const [
    {
      /*isOver, canDrop*/
    },
    drop,
  ] = useDrop(() => ({
    accept: accept,
    drop: (item, monitor) => {
      if (onDrop) {
        onDrop(item, monitor);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));

  return (
    <div {...others} ref={drop}>
      {children}
    </div>
  );
};

export default forwardRef(DropTargetWrapper);
