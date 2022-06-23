import {
  createContext,
  useContext,
  MutableRefObject,
  ReactNode,
  createRef,
  RefObject,
} from 'react';
import {
  Bounds,
  ElementSchema,
  ComponentMetadata,
  ElementStatus,
  IElementController,
} from '../../types';
import { genId } from '../../utils';
import ElementView, { ElementViewRef } from '../element-view';
import RenderContext from '../render-context';

export type ElementControllerProps = {
  index: number;
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
  public id = genId();
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

  getId = () => this.id;

  getData(): ElementSchema {
    return this.data;
  }

  getStatus(): ElementStatus {
    return this.status;
  }

  setStatus(
    status: ElementStatus,
    options?: { replace: boolean; updateView: boolean }
  ): void {
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
    this.context
  }

  updateView(): void {
    this.viewRef.current?.forceUpdate();
  }

  private handleBoundsChange = (bounds: Bounds): void => {
    const { onChange } = this.props;
    this.data.bounds = bounds;
    if (onChange) {
      onChange(this.getData());
    }
  };

  render(): ReactNode {
    const { index, containerRef, data, componentMetadata } = this.props;
    return (
      <ElementContext.Provider key={`element-${index}`} value={this}>
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
