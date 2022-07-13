import { ElementSchema, IDashboardLifecycle, IElementController, IRenderContext } from '../../types';

export type LifecycleAdapterProps = {
  lifecycle: Partial<IDashboardLifecycle>;
};

export default class LifecycleAdapter implements IDashboardLifecycle {
  private lifecycle: Partial<IDashboardLifecycle>;

  constructor(props: LifecycleAdapterProps) {
    this.lifecycle = props.lifecycle;
  }

  onBeforeSourceAdd(data: ElementSchema, ctx: IRenderContext) {
    if (this.lifecycle?.onBeforeSourceAdd) {
      return this.lifecycle.onBeforeSourceAdd(data, ctx);
    }
    return true;
  }

  onSourceAdd(element: IElementController, data: ElementSchema, ctx: IRenderContext) {
    if (this.lifecycle?.onSourceAdd) {
      return this.lifecycle.onSourceAdd(element, data, ctx);
    }
    return true;
  }

  onElementChange(element: IElementController, propsType: string, ctx: IRenderContext) {
    if (this.lifecycle?.onElementChange) {
      this.lifecycle.onElementChange(element, propsType, ctx);
    }
  }
}
