import {
  createContext,
  useContext,
  ElementType,
  MutableRefObject,
  ReactNode,
} from 'react';
import { Bounds, ElementEntity, ComponentMetadata } from '../../types';
import RenderContext from '../render-context';
import ElementView from '../element-view';

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
  constructor(props: ElementControllerProps) {
    this.props = props;
    this.data = { ...props.data };
  }

  getData(): ElementEntity {
    return this.data;
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
