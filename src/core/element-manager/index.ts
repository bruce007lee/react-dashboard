import BaseManager from '../../components/base-manager';
import ElementController from '../element-controller';

export type ElementManagerProps = {
  elements?: ElementController[];
};

/**
 * 物料管理器，用于管理注册的组件描述配置
 */
export default class ElementManager extends BaseManager<
  ElementManagerProps,
  ElementController
> {
  constructor(props?: ElementManagerProps) {
    super(props);
    if (props?.elements) {
      this.store = this.store.concat(props.elements);
    }
  }

  findById = (id: string) => this.findByName(id);

  protected getNameKey = (): string => 'id';
}
