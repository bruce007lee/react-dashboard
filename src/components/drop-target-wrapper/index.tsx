import { ForwardRefRenderFunction, forwardRef, ReactNode } from 'react';
import { useDrop } from 'react-dnd';

export type DropTargetWrapperProps = {
  children?: ReactNode;
  onDrop?: (data: any) => void;
};

export type DropTargetWrapperRef = {};

const DropTargetWrapper: ForwardRefRenderFunction<
  DropTargetWrapperRef,
  DropTargetWrapperProps
> = ({ children, onDrop }, ref) => {
  const [{ canDrop, isOver }, drop] = useDrop(() => ({
    accept: 'BOX',
    drop: (item) => {
      if (onDrop) {
        onDrop(item);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));

  return <div ref={drop}>{children}</div>;
};

export default forwardRef(DropTargetWrapper);
