import { ForwardRefRenderFunction, forwardRef, FC } from 'react';
import { ActionProps } from '../../types';
import { sn } from '../../utils';
import Icon from '../icon';

import './index.scss';

export type ToolbarItemProps = ActionProps & {
  onClick?: () => void;
};

export type ToolbarItemRef = {};

const DefaultItem: FC<ToolbarItemProps> = ({ iconType, tip }) => {
  return (
    <div className={sn('toolbar-item-default')} title={tip}>
      <Icon type={iconType} />
    </div>
  );
};

const ToolbarItem: ForwardRefRenderFunction<
  ToolbarItemRef,
  ToolbarItemProps
> = ({ toolbarItemClass: Com = DefaultItem, onClick, ...others }, ref) => {
  return (
    <div className={sn('toolbar-item')} onClick={onClick}>
      <Com {...others} />
    </div>
  );
};

export default forwardRef(ToolbarItem);
