import { ForwardRefRenderFunction, forwardRef, ReactNode } from 'react';
import { useDrag } from 'react-dnd';

export type DragSourceWrapperProps = {
  children?: ReactNode;
  data?: any;
};

export type DragSourceWrapperRef = {};

const DragSourceWrapper: ForwardRefRenderFunction<
  DragSourceWrapperRef,
  DragSourceWrapperProps
> = ({ children, data }, ref) => {
  const [{ isDragging }, drag, dragPreview] = useDrag(() => ({
    type: 'BOX',
    item: data,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div ref={dragPreview} style={{ opacity: isDragging ? 0.5 : 1 }}>
      <div ref={drag}>{children}</div>
    </div>
  );
};

export default forwardRef(DragSourceWrapper);
