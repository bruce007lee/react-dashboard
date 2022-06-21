import { ElementType, MutableRefObject, ReactNode } from 'react';
import { Bounds, ElementEntity } from '../../types';
import ElementView from '../element-view';

export type ElementControllerProps = {
  index: number;
  containerRef: MutableRefObject<HTMLDivElement>;
  data: ElementEntity<ElementType>;
  onChange?: (data: ElementEntity<ElementType>) => void;
};

export default class ElementController {
  props: ElementControllerProps;
  data: ElementEntity<ElementType>;
  constructor(props: ElementControllerProps) {
    this.props = props;
    this.data = { ...props.data };
  }

  getData(): ElementEntity<ElementType> {
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
    const { index, containerRef, data } = this.props;
    return (
      <ElementView
        key={`element-${index}`}
        containerRef={containerRef}
        data={data}
        onBoundsChange={this.handleBoundsChange}
      />
    );
  }
}
