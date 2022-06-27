import {
  ForwardRefRenderFunction,
  forwardRef,
  ReactNode,
  CSSProperties,
  HTMLAttributes,
} from 'react';
import { useDrag } from 'react-dnd';

export type DragSourceWrapperProps = HTMLAttributes<HTMLDivElement> & {
  accept?: string;
  children?: ReactNode;
  data?: any;
  style?: CSSProperties;
};

export type DragSourceWrapperRef = {};

const DragSourceWrapper: ForwardRefRenderFunction<
  DragSourceWrapperRef,
  DragSourceWrapperProps
> = ({ children, style, data, accept, ...others }, ref) => {
  const [{ isDragging }, drag, dragPreview] = useDrag(() => ({
    type: accept,
    item: data,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      {...others}
      ref={dragPreview}
      style={{ ...style, opacity: isDragging ? 0.5 : 1 }}
    >
      <div ref={drag}>{children}</div>
    </div>
  );
};

export default forwardRef(DragSourceWrapper);
