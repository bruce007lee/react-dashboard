import ElementController from '../core/element-controller';
import { Bounds, ComponentMetadata, ElementSchema, IElementLifecycle } from '../types';
import { set } from './misc';

export default {
  getBounds: (schema: ElementSchema): Bounds => schema?.elementProps?.bounds || { x: 0, y: 0, width: 100, height: 100 },

  setBounds: (schema: ElementSchema, bounds: Bounds): void => set(schema, 'elementProps.bounds', bounds),

  moveToPrev(controller: ElementController, updateView: boolean = true): void {
    const builder = controller.getContext().getBuilder();
    const manager = builder.getElementManager();
    const idx = manager.getIndex(controller);
    manager.remove(idx);
    manager.add(controller, idx - 1);
    if (updateView) {
      builder.updateView();
    }
  },

  moveToNext(controller: ElementController, updateView: boolean = true): void {
    const builder = controller.getContext().getBuilder();
    const manager = builder.getElementManager();
    const idx = manager.getIndex(controller);
    manager.remove(idx);
    manager.add(controller, idx + 1);
    if (updateView) {
      builder.updateView();
    }
  },

  moveTo(controller: ElementController, index: number, updateView: boolean = true): void {
    const builder = controller.getContext().getBuilder();
    const manager = builder.getElementManager();
    const idx = manager.getIndex(controller);
    manager.remove(idx);
    if (index > idx) {
      index -= 1;
    }
    manager.add(controller, index);
    if (updateView) {
      builder.updateView();
    }
  },

  moveToFirst(controller: ElementController, updateView: boolean = true): void {
    this.moveTo(controller, 0, updateView);
  },

  moveToLast(this, controller: ElementController, updateView: boolean = true): void {
    const builder = controller.getContext().getBuilder();
    const manager = builder.getElementManager();
    this.moveTo(controller, manager.getAll().length, updateView);
  },

  getLifecycle(componentMetadata: ComponentMetadata): IElementLifecycle {
    return componentMetadata?.configure?.lifecycle || {};
  },
};
