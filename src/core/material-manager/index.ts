import BaseManager from '../../components/base-manager';
import { ComponentMetadata } from '../../types';

export type MaterialManagerProps = {
  components?: ComponentMetadata[];
};

/**
 * 物料管理器，用于管理注册的组件描述配置
 */
export default class MaterialManager extends BaseManager<
  MaterialManagerProps,
  ComponentMetadata
> {
  constructor(props?: MaterialManagerProps) {
    super(props);
    if (props?.components) {
      this.store = this.store.concat(props.components);
    }
  }

  protected getNameKey = (): string => 'componentName';
}
