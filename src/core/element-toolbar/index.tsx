import { ForwardRefRenderFunction, forwardRef, useState } from 'react';
import ToolbarItem from '../../components/toolbar-item';
import { ActionMetadata, ActionProps } from '../../types';
import { sn } from '../../utils';
import { useElementController } from '../element-controller';
import { useRenderContext } from '../render-context';

import './index.scss';

export type ElementToolBarProps = {};

export type ElementToolBarRef = {};

const ElementToolBar: ForwardRefRenderFunction<
  ElementToolBarRef,
  ElementToolBarProps
> = ({}, ref) => {
  const ctx = useRenderContext();
  const controller = useElementController();
  const actionManager = ctx.getBuilder().getActionManager();
  const defaultActions = actionManager.getDefaultActions();
  const [newProps, setNewProps] = useState<ActionProps | void>();

  const createItem = (item: ActionMetadata) => {
    const { render, invoker, props } = item;
    const p = { ...props, ...newProps, ...(render ? render(controller) : null) };
    return (
      <ToolbarItem
        key={`element-toolbar-${item.actionName}`}
        {...p}
        onClick={() => setNewProps(invoker(controller))}
      />
    );
  };

  return (
    <div className={sn('element-toolbar')}>
      {defaultActions.map((item) => createItem(item))}
    </div>
  );
};

export default forwardRef(ElementToolBar);
