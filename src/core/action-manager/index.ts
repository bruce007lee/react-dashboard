import BaseManager from '../../components/base-manager';
import { ACTIONS, DEFAULT_ACTION_NAMES } from '../../actions';
import { ActionMetadata } from '../../types';

export type ActionManagerProps = {
  actions?: ActionMetadata[];
  defaultToolbarActionNames?: string[];
};

/**
 * 元素上快捷操作配置的管理器
 */
export default class ActionManager extends BaseManager<
  ActionManagerProps,
  ActionMetadata
> {
  protected defaultToolbarActionNames: string[] = [...DEFAULT_ACTION_NAMES];

  constructor(props?: ActionManagerProps) {
    super(props);
    this.addActions(ACTIONS);//添加默认的
    this.addActions(props?.actions);
    if (props?.defaultToolbarActionNames) {
      this.defaultToolbarActionNames = this.defaultToolbarActionNames.concat(
        props.defaultToolbarActionNames
      );
    }
  }

  addActions(actions: ActionMetadata[]) {
    if (actions && actions.length > 0) {
      this.store = [].concat(
        this.store.filter((item) =>
        actions.some(
            (newItem) => item.actionName !== newItem.actionName
          )
        ),
        actions
      );
    }
  }

  getActionsByNames(names: string[]): ActionMetadata[] {
    const rs = [];
    let action = null;
    names.forEach((name) => {
      action = this.findByName(name);
      if (action) {
        rs.push(action);
      }
    });
    return rs;
  }

  getDefaultToolbarActionNames = (): string[] => this.defaultToolbarActionNames;

  getDefaultToolbarActions = (): ActionMetadata[] =>
    this.getActionsByNames(this.defaultToolbarActionNames);

  protected getNameKey = (): string => 'actionName';
}
