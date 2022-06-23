import { ComponentMetadata } from '../../types';

export type MaterialManagerProps = {
  components?: ComponentMetadata[];
};

/**
 * 物料管理器，用于管理注册的组件描述配置
 */
export default class MaterialManager {
  private components: ComponentMetadata[] = [];

  constructor(props?: MaterialManagerProps) {
    if (props?.components) {
      this.components = this.components.concat(props.components);
    }
  }

  getComponents(): ComponentMetadata[] {
    return this.components;
  }

  addComponent(com: ComponentMetadata) {
    this.components.push(com);
  }

  removeComponent(com: string | ComponentMetadata): boolean {
    if (com != null) {
      const newComs = [];
      const coms = this.components;
      coms.forEach((item) => {
        if (!(item.componentName === com || item === com)) {
          newComs.push(item);
        }
      });
      this.components = newComs;
      return coms.length !== newComs.length;
    }
    return false;
  }

  removeAllComponents() {
    this.components.splice(0, this.components.length);
  }

  findComponent = (fn: (com: ComponentMetadata, index: number) => boolean) =>
    this.components.find(fn);

  findComponentByName = (componentName: string) =>
    this.findComponent(
      (com) => !!componentName && com.componentName === componentName
    );
}
