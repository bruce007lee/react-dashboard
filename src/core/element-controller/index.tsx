import React, { MutableRefObject, ReactNode, createRef, RefObject } from 'react';
import { Bounds, ElementSchema, ComponentMetadata, ElementStatus, IElementController } from '../../types';
import { cloneDeep, elementUtil, genId } from '../../utils';
import { ElementControllerContext } from '../context-factory';
import ElementView, { ElementViewRef } from '../element-view';
import RenderContext from '../render-context';

export type ElementControllerProps = {
  canvasContainerRef: MutableRefObject<HTMLElement>;
  setterContainerRef: MutableRefObject<HTMLElement>;
  componentMetadata: ComponentMetadata;
  data: ElementSchema;
  context: RenderContext;
};
export default class ElementController implements IElementController {
  private props: ElementControllerProps;
  private data: ElementSchema;
  private status: ElementStatus;
  private viewRef: RefObject<ElementViewRef>;
  private context: RenderContext;
  private id = genId();
  constructor(props: ElementControllerProps) {
    this.props = props;
    this.data = { ...props.data };
    this.status = {
      dragging: false,
      resizing: false,
    };
    this.context = props.context;
    this.viewRef = createRef<ElementViewRef>();
  }

  getId = (): string => this.id;

  getContext(): RenderContext {
    return this.context;
  }

  getData(clone: boolean = true): ElementSchema {
    if (clone) {
      return cloneDeep(this.data);
    }
    return this.data;
  }

  setData(data: ElementSchema): void {
    this.data = data;
    this.updateView();
  }

  getStatus(): ElementStatus {
    return this.status;
  }

  setStatus(status: ElementStatus, options?: { replace: boolean; updateView: boolean }): void {
    options = {
      replace: false,
      updateView: true,
      ...options,
    };
    if (options.replace) {
      this.status = status;
    } else {
      this.status = { ...this.status, ...status };
    }
    if (options.updateView) {
      this.updateView();
    }
  }

  setLocked(locked: boolean): void {
    const status: ElementStatus = {
      locked,
    };
    if (locked) {
      status.selected = false;
    }
    this.setStatus(status);
  }

  setSelectd(selected: boolean): void {
    if (selected && !this.getStatus().selected) {
      // 先反选其他
      this.getContext()
        .getBuilder()
        .getElements()
        .forEach((item) => {
          item.setStatus({
            selected: false,
          });
        });
      this.setStatus({
        selected: true,
      });
    } else if (!selected && this.getStatus().selected) {
      this.setStatus({
        selected: false,
      });
    }
  }

  remove(): void {
    this.context.getBuilder()?.removeElement(this);
  }

  updateView(): void {
    // this.viewRef.current?.forceUpdate();
    this.context.getBuilder().updateView();
  }

  moveToPrev(): void {
    elementUtil.moveToPrev(this);
  }

  moveToNext(): void {
    elementUtil.moveToNext(this);
  }

  moveToFirst(): void {
    elementUtil.moveToFirst(this);
  }

  moveToLast(): void {
    elementUtil.moveToLast(this);
  }

  moveTo(index: number) {
    elementUtil.moveTo(this, index);
  }

  getComponentMetadata(): ComponentMetadata {
    return this.props.componentMetadata;
  }

  private handleBoundsChange = (bounds: Bounds): void => {
    elementUtil.setBounds(this.data, bounds);
    const lifecycle = elementUtil.getLifecycle(this.getComponentMetadata());
    if (lifecycle.onChange) {
      lifecycle.onChange(this, 'elementProps.bounds', this.context);
    }
  };

  render(): ReactNode {
    const { canvasContainerRef, setterContainerRef, data, componentMetadata } = this.props;
    return (
      <ElementControllerContext.Provider key={`element-${this.id}`} value={this}>
        <ElementView
          ref={this.viewRef}
          canvasContainerRef={canvasContainerRef}
          setterContainerRef={setterContainerRef}
          data={data}
          componentMetadata={componentMetadata}
          onBoundsChange={this.handleBoundsChange}
        />
      </ElementControllerContext.Provider>
    );
  }
}
