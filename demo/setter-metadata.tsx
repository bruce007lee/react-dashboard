import { Input, Select } from 'antd';
import { ISetterProps, SetterMetadata, SetterRenderFunction } from '../src/index';

/**
 * string文本类型设置器
 */
const StringSetter: SetterRenderFunction = ({ fieldConfig, getValue, setValue }) => {
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
 * string选单类型设置器
 */
const SelectSetter: SetterRenderFunction<{ options: { label; value }[] } & ISetterProps> = ({
  fieldConfig,
  getValue,
  setValue,
  options,
}) => {
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
    componentName: 'SelectSetter',
    componentClass: SelectSetter,
  },
];

export default setterMetas;
