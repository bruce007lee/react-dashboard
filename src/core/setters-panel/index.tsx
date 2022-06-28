import { ForwardRefRenderFunction, forwardRef, MutableRefObject, RefObject } from 'react';
import { createPortal } from 'react-dom';
import { ComponentMetadata, FieldConfig } from '../../types';
import { useElementController } from '../element-controller';
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
  const elementController = useElementController();

  const createSetterView = (fieldConfig: FieldConfig, idx: number) => {
    return <SetterView key={`setter-view-${elementController.getId()}-${idx}`} fieldConfig={fieldConfig} />;
  };

  if (!elementController.getStatus().selected) {
    return null;
  }

  return containerRef?.current
    ? createPortal(<div>{fieldsProps.map((f, idx) => createSetterView(f, idx))}</div>, containerRef.current)
    : null;
};

export default forwardRef(SettersPanel);
