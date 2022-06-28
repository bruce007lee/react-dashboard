import classNames from 'classnames';
import { ForwardRefRenderFunction, forwardRef, ReactNode, HTMLAttributes } from 'react';
import { DropTargetMonitor, useDrop } from 'react-dnd';
import { sn } from '../../utils';

export type DropTargetWrapperProps = Omit<HTMLAttributes<HTMLDivElement>, 'onDrop'> & {
  accept?: string;
  children?: ReactNode;
  className?: string;
  canDrop?: (data: any, monitor: DropTargetMonitor) => boolean;
  onDrop?: (data: any, monitor: DropTargetMonitor) => void;
};

export type DropTargetWrapperRef = {};

const DropTargetWrapper: ForwardRefRenderFunction<DropTargetWrapperRef, DropTargetWrapperProps> = (
  { children, className, onDrop, canDrop, accept, ...others },
  ref,
) => {
  const [{ isCanDrop }, drop] = useDrop(() => ({
    accept,
    canDrop: (item, monitor) => {
      if (canDrop) {
        return canDrop(item, monitor);
      }
      return true;
    },
    drop: (item, monitor) => {
      if (onDrop) {
        onDrop(item, monitor);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      isCanDrop: monitor.canDrop(),
    }),
  }));

  return (
    <div
      {...others}
      className={classNames(
        sn('drop-target-wrapper'),
        isCanDrop ? sn('drop-target-wrapper-can-drop') : null,
        className,
      )}
      ref={drop}
    >
      {children}
    </div>
  );
};

export default forwardRef(DropTargetWrapper);
