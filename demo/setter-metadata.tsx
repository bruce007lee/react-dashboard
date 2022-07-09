import { Input, Select } from 'antd';
import { SetterRenderProps, SetterMetadata, SetterRenderFunction } from '../src/index';

/**
 * string文本类型设置器
 */
const StringSetter: SetterRenderFunction = ({ setterProps }) => {
  const { fieldConfig, getValue, setValue } = setterProps;
  const value = getValue();
  return (
    <div className="setter-field">
      <span className="label">{fieldConfig.label}</span>
      <span className="detail">
        <Input value={value} onChange={(e) => setValue(e.target.value)} />
      </span>
    </div>
  );
};

/**
 * string textarea类型设置器
 */
const TextAreaSetter: SetterRenderFunction = ({ setterProps }) => {
  const { fieldConfig, getValue, setValue } = setterProps;
  const value = getValue();
  return (
    <div className="setter-field">
      <span className="label">{fieldConfig.label}</span>
      <span className="detail">
        <Input.TextArea value={value} onChange={(e) => setValue(e.target.value)} />
      </span>
    </div>
  );
};

/**
 * string选单类型设置器
 */
const SelectSetter: SetterRenderFunction<{ options: { label; value }[] }> = ({ setterProps, options }) => {
  const { fieldConfig, getValue, setValue } = setterProps;
  const value = getValue();
  return (
    <div className="setter-field">
      <span className="label">{fieldConfig.label}</span>
      <span className="detail">
        <Select className="fill" value={value} options={options} onChange={(val) => setValue(val)}></Select>
      </span>
    </div>
  );
};

/*
 * setter设置
 */
const setterMetas: SetterMetadata[] = [
  {
    componentName: 'StringSetter',
    componentClass: StringSetter,
  },
  {
    componentName: 'TextAreaSetter',
    componentClass: TextAreaSetter,
  },
  {
    componentName: 'SelectSetter',
    componentClass: SelectSetter,
  },
];

export default setterMetas;
