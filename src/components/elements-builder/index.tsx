import { ReactNode, ElementType, MutableRefObject } from 'react';
import { ElementEntity } from 'src/types';
import ElementController from '../element-controller';

export type ElementsBuilderProps = {
  data: ElementEntity<ElementType>[];
  containerRef: MutableRefObject<HTMLDivElement>;
};

export default class ElementsRender {
  props: ElementsBuilderProps;
  elements: ElementController[] = [];
  constructor(props: ElementsBuilderProps) {
    this.props = props;
    this.setData(this.props.data);
  }

  handleElementChange = (data: ElementEntity<ElementType>) => {
    console.log('[DEBUG]element change:', data.bounds)
  }

  setData(data: ElementEntity<ElementType>[]): void {
    this.elements.splice(0, this.elements.length);
    if (data) {
      data.forEach((element, index) => {
        this.elements.push(
          new ElementController({
            index,
            data: element,
            containerRef: this.props.containerRef,
            onChange: this.handleElementChange
          })
        );
      });
    }
  }

  getData(): ElementEntity<ElementType>[] {
    const elements = this.elements;
    const data = [];
    elements.forEach((item) => {
      data.push(item.getData());
    });
    return data;
  }

  createElementView(element: ElementController): ReactNode {
    return element.render();
  }

  render(): ReactNode {
    const elements = this.elements;
    if (elements) {
      return elements.map((item) => this.createElementView(item));
    }
    return null;
  }
}
