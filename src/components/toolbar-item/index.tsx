import React, { ForwardRefRenderFunction, forwardRef, FC } from 'react';
import { useForceUpdate } from '../../hooks';
import { ActionMetadata, ActionProps, IElementController } from '../../types';
import { sn } from '../../utils';
import Icon from '../icon';

import './index.scss';

export type ToolbarItemProps = ActionProps & {
  actionMetadata: ActionMetadata;
  controller: IElementController;
};

export type ToolbarItemRef = {};

const DefaultItem: FC<ToolbarItemProps> = ({ iconType, tip, label }) => {
  return (
    <div className={sn('toolbar-item-default')} title={tip}>
      <Icon type={iconType} className="toolbar-item-icon" />
      {label ? <span className="toolbar-item-label">{label}</span> : null}
    </div>
  );
};

const ToolbarItem: ForwardRefRenderFunction<ToolbarItemRef, ToolbarItemProps> = (
  { actionMetadata, controller },
  ref,
) => {
  const forceUpdate = useForceUpdate();
  const { props, invoker, render } = actionMetadata;
  const overwrite = render ? render(controller) : null;
  const { toolbarItemClass: Com = DefaultItem, ...others } = {
    ...props,
    ...overwrite,
  };

  const handleClick = () => {
    if (invoker) {
      invoker(controller);
      forceUpdate();
    }
  };

  return (
    <div className={sn('toolbar-item')} onClick={handleClick}>
      <Com {...others} {...overwrite} />
    </div>
  );
};

export default forwardRef(ToolbarItem);
