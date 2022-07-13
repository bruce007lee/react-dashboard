import React, { forwardRef, ForwardRefRenderFunction } from 'react';
import { useElementController, useRenderContext } from '../../hooks';
import { FieldConfig, ISetterProps } from '../../types';
import { elementUtil, get, set } from '../../utils';

export type SetterViewProps = {
  fieldConfig: FieldConfig;
};

export type SetterViewRef = {};

const SetterView: ForwardRefRenderFunction<SetterViewRef, SetterViewProps> = ({ fieldConfig }, ref) => {
  const ctx = useRenderContext();
  const controller = useElementController();
  if (!fieldConfig?.setter) {
    return null;
  }
  const { setter } = fieldConfig;
  const setterMetadata = ctx.getBuilder().getSetterManager().findByName(setter.componentName);

  if (!setterMetadata) {
    return null;
  }

  const { componentClass: Com } = setterMetadata;

  const setterProps: ISetterProps = {
    fieldConfig,
    setValue(val) {
      const fname = fieldConfig.name;
      if (fname) {
        const data = controller.getData(false);
        const path = `props.${fname}`;
        set(data, path, val);
        controller.setData(data);
        // handle lifecycle event
        const lifecycle = elementUtil.getLifecycle(controller.getComponentMetadata());
        if (lifecycle.onChange) {
          lifecycle.onChange(controller, path, ctx);
        }
        ctx.getLifecycle().onElementChange(controller, path, ctx);
      }
    },
    getValue() {
      const fname = fieldConfig.name;
      if (fname) {
        const data = controller.getData(false);
        return get(data, `props.${fname}`);
      }
    },
    getDefaultValue() {
      return fieldConfig?.setter?.defaultValue;
    },
  };

  return <Com {...setter.props} setterProps={setterProps} />;
};

export default forwardRef(SetterView);
