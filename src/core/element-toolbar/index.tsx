import { ForwardRefRenderFunction, forwardRef, useState } from 'react';
import ToolbarItem from '../../components/toolbar-item';
import { ActionMetadata, ActionProps } from '../../types';
import { sn } from '../../utils';
import { useElementController, useRenderContext } from '../../hooks';

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

  const createItem = (item: ActionMetadata) => (
    <ToolbarItem
      key={`element-toolbar-${controller.getId()}-${item.actionName}`}
      actionMetadata={item}
      controller={controller}
    />
  );

  return (
    <div className={sn('element-toolbar')}>
      {defaultActions.map((item) => createItem(item))}
    </div>
  );
};

export default forwardRef(ElementToolBar);
