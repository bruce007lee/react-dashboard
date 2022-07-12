import React, { forwardRef, ForwardRefRenderFunction } from 'react';
import ToolbarItem from '../../components/toolbar-item';
import { useElementController, useRenderContext } from '../../hooks';
import { ActionMetadata, ComponentMetadata } from '../../types';
import { sn } from '../../utils';
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
  const configure = componentMetadata?.configure || {};
  let { toolbarActions, extraToolbarActions } = configure;

  if (!toolbarActions) {
    toolbarActions = [].concat(extraToolbarActions || [], defaultToolbarActionNames);
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
