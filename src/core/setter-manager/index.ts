import BaseManager from '../../components/base-manager';
import { SetterMetadata } from '../../types';

export type SetterManagerProps = {
  setters?: SetterMetadata[];
};

/**
 * 组件元素属性的设置器管理器
 */
export default class SetterManager extends BaseManager<SetterManagerProps, SetterMetadata> {
  constructor(props?: SetterManagerProps) {
    super(props);
    if (props?.setters) {
      this.store = this.store.concat(props.setters);
    }
  }

  protected getNameKey = (): string => 'componentName';
}
