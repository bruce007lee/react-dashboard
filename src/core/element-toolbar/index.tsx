import { ForwardRefRenderFunction, forwardRef, useState } from 'react';
import ToolbarItem from '../../components/toolbar-item';
import { ActionMetadata, ComponentMetadata } from '../../types';
import { sn } from '../../utils';
import { useElementController, useRenderContext } from '../../hooks';

import './index.scss';

export type ElementToolBarProps = {
  componentMetadata: ComponentMetadata;
};

export type ElementToolBarRef = {};

const ElementToolBar: ForwardRefRenderFunction<ElementToolBarRef, ElementToolBarProps> = (
  { componentMetadata },
  ref,
) => {
  const ctx = useRenderContext();
  const controller = useElementController();
  const actionManager = ctx.getBuilder().getActionManager();
  const defaultToolbarActionNames = actionManager.getDefaultToolbarActionNames();
  const extraToolbarActions = componentMetadata.extraToolbarActions || [];
  let { toolbarActions } = componentMetadata;

  if (!toolbarActions) {
    toolbarActions = [].concat(extraToolbarActions, defaultToolbarActionNames);
  }

  const createItem = (item: ActionMetadata) => (
    <ToolbarItem
      key={`element-toolbar-${controller.getId()}-${item.actionName}`}
      actionMetadata={item}
      controller={controller}
    />
  );

  return (
    <div className={sn('element-toolbar')}>
      {actionManager.getActionsByNames(toolbarActions).map((item) => createItem(item))}
    </div>
  );
};

export default forwardRef(ElementToolBar);
