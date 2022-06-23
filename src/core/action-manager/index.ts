import BaseManager from '../../components/base-manager';
import { ActionMetadata } from '../../types';

export type ActionManagerProps = {
  actions?: ActionMetadata[];
  defaultActionNames?: string[];
};

/**
 * 元素上快捷操作配置的管理器
 */
export default class ActionManager extends BaseManager<
  ActionManagerProps,
  ActionMetadata
> {
  protected defaultActionNames: string[] = [];

  constructor(props?: ActionManagerProps) {
    super(props);
    if (props?.actions) {
      this.store = this.store.concat(props.actions);
    }
    if (props?.defaultActionNames) {
      this.defaultActionNames = this.defaultActionNames.concat(
        props.defaultActionNames
      );
    }
  }

  getDefaultActions(): ActionMetadata[] {
    const rs = [];
    const names = this.defaultActionNames;
    let action = null;
    names.forEach((name) => {
      action = this.findByName(name);
      if (action) {
        rs.push(action);
      }
    });
    return rs;
  }

  protected getNameKey = (): string => 'actionName';
}
