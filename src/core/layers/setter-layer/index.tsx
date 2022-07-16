import classNames from 'classnames';
import React, { forwardRef, ForwardRefRenderFunction } from 'react';
import { createPortal } from 'react-dom';
import { useElementController, useRenderContext } from '../../../hooks';
import { FieldConfig } from '../../../types';
import { sn } from '../../../utils';
import SetterView from '../../setter-view';
import { BaseLayerProps } from '../base-layer';
import './index.scss';

export type ProxyLayerProps = BaseLayerProps & {};

export type ProxyLayerRef = {};

const ProxyLayer: ForwardRefRenderFunction<ProxyLayerRef, ProxyLayerProps> = (
  { containerRef, style, className, bounds },
  ref,
) => {
  const controller = useElementController();
  const ctx = useRenderContext();
  const fieldsProps = controller.getComponentMetadata()?.configure?.props || [];

  const createSetterView = (fieldConfig: FieldConfig, idx: number) => {
    return (
      <SetterView key={`setter-view-${controller.getId()}-${idx}`} setterKey="inlineSetter" fieldConfig={fieldConfig} />
    );
  };

  if (!controller.getStatus().selected || !ctx.getEditable()) {
    return null;
  }

  return containerRef.current
    ? createPortal(
        <div
          className={classNames(sn('setter-layer'), className)}
          style={{
            ...style,
            width: bounds.width,
            height: bounds.height,
            left: bounds.x,
            top: bounds.y,
          }}
        >
          {fieldsProps.map((f, idx) => createSetterView(f, idx))}
        </div>,
        containerRef.current,
      )
    : null;
};

export default forwardRef(ProxyLayer);
