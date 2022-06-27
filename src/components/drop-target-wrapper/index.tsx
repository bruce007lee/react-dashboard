import classNames from 'classnames';
import { ForwardRefRenderFunction, forwardRef, ReactNode, HTMLAttributes } from 'react';
import { DropTargetMonitor, useDrop } from 'react-dnd';
import { sn } from '../../utils';

export type DropTargetWrapperProps = Omit<HTMLAttributes<HTMLDivElement>, 'onDrop'> & {
  accept?: string;
  children?: ReactNode;
  className?: string;
  onDrop?: (data: any, monitor: DropTargetMonitor) => void;
};

export type DropTargetWrapperRef = {};

const DropTargetWrapper: ForwardRefRenderFunction<DropTargetWrapperRef, DropTargetWrapperProps> = (
  { children, className, onDrop, accept, ...others },
  ref,
) => {
  const [{ canDrop }, drop] = useDrop(() => ({
    accept,
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
    <div
      {...others}
      className={classNames(sn('drop-target-wrapper'), canDrop ? sn('drop-target-wrapper-can-drop') : null, className)}
      ref={drop}
    >
      {children}
    </div>
  );
};

export default forwardRef(DropTargetWrapper);
