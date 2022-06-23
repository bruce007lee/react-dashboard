import { createContext, useContext, MutableRefObject, ReactNode } from 'react';
import {
  Bounds,
  ElementEntity,
  ComponentMetadata,
  ElementStatus,
} from '../../types';
import ElementView from '../element-view';
import RenderContext from '../render-context';

export type ElementControllerProps = {
  index: number;
  containerRef: MutableRefObject<HTMLDivElement>;
  componentMetadata: ComponentMetadata;
  data: ElementEntity;
  onChange?: (data: ElementEntity) => void;
  context: RenderContext;
};

const ElementContext = createContext<ElementController>(null);

export type ElementContextProps = {
  value: ElementController;
};

/**
 * 获取当前对应的 ElementController对象
 */
export const useElementController = (): ElementController => {
  return useContext(ElementContext);
};
export default class ElementController {
  private props: ElementControllerProps;
  private data: ElementEntity;
  private status: ElementStatus;
  constructor(props: ElementControllerProps) {
    this.props = props;
    this.data = { ...props.data };
    this.status = {
      dragging: false,
      resizing: false,
    };
  }

  getData(): ElementEntity {
    return this.data;
  }

  getStatus(): ElementStatus {
    return this.status;
  }

  setStatus(status: ElementStatus, replace: boolean = false): void {
    if (replace) {
      this.status = status;
    } else {
      this.status = { ...this.status, ...status };
    }
  }

  handleBoundsChange = (bounds: Bounds): void => {
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
          containerRef={containerRef}
          data={data}
          componentMetadata={componentMetadata}
          onBoundsChange={this.handleBoundsChange}
        />
      </ElementContext.Provider>
    );
  }
}
