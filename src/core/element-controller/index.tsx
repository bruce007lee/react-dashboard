import { createContext, useContext, MutableRefObject, ReactNode, createRef, RefObject } from 'react';
import { Bounds, ElementSchema, ComponentMetadata, ElementStatus, IElementController } from '../../types';
import { cloneDeep, elementUtil, genId } from '../../utils';
import ElementView, { ElementViewRef } from '../element-view';
import RenderContext from '../render-context';

export type ElementControllerProps = {
  containerRef: MutableRefObject<HTMLDivElement>;
  componentMetadata: ComponentMetadata;
  data: ElementSchema;
  onChange?: (data: ElementSchema) => void;
  context: RenderContext;
};

const ElementContext = createContext<IElementController>(null);

export type ElementContextProps = {
  value: ElementController;
};

/**
 * 获取当前对应的 ElementController对象
 */
export const useElementController = (): IElementController => {
  return useContext(ElementContext);
};
export default class ElementController implements IElementController {
  private props: ElementControllerProps;
  private data: ElementSchema;
  private status: ElementStatus;
  private viewRef: RefObject<ElementViewRef>;
  private context: RenderContext;
  id = genId();
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
    return cloneDeep(this.data);
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

  remove(): void {
    this.context.getBuilder()?.removeElement(this);
  }

  updateView(): void {
    this.viewRef.current?.forceUpdate();
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

  private handleBoundsChange = (bounds: Bounds): void => {
    const { onChange } = this.props;
    elementUtil.setBounds(this.data, bounds);
    if (onChange) {
      onChange(this.getData());
    }
  };

  render(): ReactNode {
    const { containerRef, data, componentMetadata } = this.props;
    return (
      <ElementContext.Provider key={`element-${this.id}`} value={this}>
        <ElementView
          ref={this.viewRef}
          containerRef={containerRef}
          data={data}
          componentMetadata={componentMetadata}
          onBoundsChange={this.handleBoundsChange}
        />
      </ElementContext.Provider>
    );
  }
}
