import classNames from 'classnames';
import React, { forwardRef, ForwardRefRenderFunction, HTMLAttributes, MouseEvent, useImperativeHandle } from 'react';
import DragSourceWrapper from '../../components/drag-source-wrapper';
import { useElementsProviderContext } from '../../hooks';
import { ElementSchema } from '../../types';
import { cloneDeep, elementUtil, sn } from '../../utils';

export type AddEventType = 'drag' | 'doubleClick';

export type ElementSourceProps = HTMLAttributes<HTMLDivElement> & {
  /**
   * 拖控dnd的accept
   */
  accept?: string;
  /**
   * 触发添加的事件
   * 默认是['drag', 'doubleClick']
   */
  addEvents?: AddEventType[];
  /**
   * 添加的元素schema数据
   */
  data: ElementSchema;
};

export type ElementSourceRef = {
  /**
   * 手工触发添加到dashboard
   */
  add: () => void;
};

const ElementSource: ForwardRefRenderFunction<ElementSourceRef, ElementSourceProps> = (
  { children, accept, data, className, onDoubleClick, addEvents = ['drag', 'doubleClick'], ...others },
  ref,
) => {
  const providerCtx = useElementsProviderContext();
  if (!accept && providerCtx) {
    accept = providerCtx.accept;
  }

  const add = () => {
    const context = providerCtx.renderContext;
    if (context) {
      const builder = context.getBuilder();

      // handle beforeAdd lifecycle event
      const meta = builder.getMaterialManager().findByName(data.componentName);
      const lifecycle = elementUtil.getLifecycle(meta);

      if (lifecycle.onBeforeSourceAdd && lifecycle.onBeforeSourceAdd(data, context) === false) {
        return;
      }

      if (context.getLifecycle().onBeforeSourceAdd(data, context) === false) {
        return;
      }

      data = cloneDeep(data);
      const elc = builder.addElement(data);

      // handle add lifecycle event
      if (lifecycle.onSourceAdd) {
        lifecycle.onSourceAdd(elc, data, context);
      }
    }
  };

  const handleDblClick = (e: MouseEvent<HTMLDivElement>) => {
    add();
    if (onDoubleClick) {
      onDoubleClick(e);
    }
  };

  useImperativeHandle(ref, () => ({
    add: () => add(),
  }));

  if (accept && addEvents?.includes('drag')) {
    return (
      <DragSourceWrapper
        {...others}
        className={classNames(sn('element-source'), className)}
        onDoubleClick={handleDblClick}
        accept={accept}
        data={data}
      >
        {children}
      </DragSourceWrapper>
    );
  }

  return (
    <div {...others} className={classNames(sn('element-source'), className)} onDoubleClick={handleDblClick}>
      {children}
    </div>
  );
};

export default forwardRef(ElementSource);
