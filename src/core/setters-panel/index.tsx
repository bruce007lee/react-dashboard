import React, { ForwardRefRenderFunction, forwardRef, MutableRefObject, RefObject } from 'react';
import { createPortal } from 'react-dom';
import { ComponentMetadata, FieldConfig } from '../../types';
import { useRenderContext, useElementController } from '../../hooks';
import SetterView from '../setter-view';

export type SettersPanelProps = {
  containerRef: MutableRefObject<HTMLElement> | RefObject<HTMLElement>;
  componentMetadata: ComponentMetadata;
};

export type SettersPanelRef = {};

const SettersPanel: ForwardRefRenderFunction<SettersPanelRef, SettersPanelProps> = (
  { containerRef, componentMetadata },
  ref,
) => {
  const fieldsProps = componentMetadata?.configure?.props || [];
  const ctx = useRenderContext();
  const controller = useElementController();

  const createSetterView = (fieldConfig: FieldConfig, idx: number) => {
    return <SetterView key={`setter-view-${controller.getId()}-${idx}`} fieldConfig={fieldConfig} />;
  };

  if (!controller.getStatus().selected || !ctx.getEditable()) {
    return null;
  }

  return containerRef?.current
    ? createPortal(<div>{fieldsProps.map((f, idx) => createSetterView(f, idx))}</div>, containerRef.current)
    : null;
};

export default forwardRef(SettersPanel);
