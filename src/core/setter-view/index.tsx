import { ForwardRefRenderFunction, forwardRef } from 'react';
import { useElementController, useForceUpdate, useRenderContext } from '../../hooks';
import { FieldConfig, ISetterProps } from '../../types';
import { set, get } from '../../utils';

export type SetterViewProps = {
  fieldConfig: FieldConfig;
};

export type SetterViewRef = {};

const SetterView: ForwardRefRenderFunction<SetterViewRef, SetterViewProps> = ({ fieldConfig }, ref) => {
  const ctx = useRenderContext();
  const elementController = useElementController();
  const forceUpdate = useForceUpdate();
  if (!fieldConfig?.setter) {
    return null;
  }
  const { setter } = fieldConfig;
  const setterMetadata = ctx.getBuilder().getSetterManager().findByName(setter.componentName);

  if (!setterMetadata) {
    return null;
  }

  const { componentClass: Com } = setterMetadata;

  const setProps: ISetterProps = {
    fieldConfig,
    setValue(val) {
      const fname = fieldConfig.name;
      if (fname) {
        const data = elementController.getData(false);
        set(data, `props.${fname}`, val);
        elementController.setData(data);
      }
    },
    getValue() {
      const fname = fieldConfig.name;
      if (fname) {
        const data = elementController.getData(false);
        return get(data, `props.${fname}`);
      }
    },
    getDefaultValue() {
      // @TODO
      return null;
    },
  };

  return <Com {...setter.props} {...setProps} />;
};

export default forwardRef(SetterView);
