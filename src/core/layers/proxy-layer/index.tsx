import { ForwardRefRenderFunction, forwardRef, useState } from 'react';
import classNames from 'classnames';
import { createPortal } from 'react-dom';
import { BaseLayerProps } from '../base-layer';
import { sn } from '../../../utils';
import { useElementController, useRenderContext } from '../../../hooks';

import './index.scss';

export type ProxyLayerProps = BaseLayerProps & {};

export type ProxyLayerRef = {};

const ProxyLayer: ForwardRefRenderFunction<ProxyLayerRef, ProxyLayerProps> = (
  { containerRef, style, className, bounds },
  ref,
) => {
  const controller = useElementController();
  const status = controller.getStatus();
  const { hover, dragging, resizing, locked, selected } = status;

  return containerRef.current
    ? createPortal(
        <div
          className={classNames(
            sn('proxy-layer'),
            className,
            hover && !locked && !dragging && !resizing ? sn('proxy-layer-hover') : null,
            selected ? sn('proxy-layer-selected') : null,
          )}
          style={{
            ...style,
            width: bounds.width,
            height: bounds.height,
            left: bounds.x,
            top: bounds.y,
          }}
        />,
        containerRef.current,
      )
    : null;
};

export default forwardRef(ProxyLayer);
