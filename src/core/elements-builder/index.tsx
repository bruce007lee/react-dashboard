import { ReactNode, MutableRefObject } from 'react';
import { ElementEntity } from '../../types';
import MaterialManager from '../material-manager';
import RenderContext from '../render-context';
import ElementController from '../element-controller';

export type ElementsBuilderProps = {
  data: ElementEntity[];
  materialManager: MaterialManager;
  containerRef: MutableRefObject<HTMLDivElement>;
  context: RenderContext;
};

export default class ElementsBuilder {
  private props: ElementsBuilderProps;
  private elements: ElementController[] = [];
  private materialManager: MaterialManager;

  constructor(props: ElementsBuilderProps) {
    this.props = props;
    this.materialManager = this.props.materialManager || new MaterialManager();
    this.setData(this.props.data);
  }

  handleElementChange = (data: ElementEntity) => {
    console.log('[DEBUG]element change:', data.bounds);
  };

  setData(data: ElementEntity[]): void {
    this.elements.splice(0, this.elements.length);
    if (data) {
      data.forEach((element, index) => {
        this.elements.push(
          new ElementController({
            index,
            data: element,
            componentMetadata: this.materialManager.findComponentByName(
              element.componentName
            ),
            context: this.props.context,
            containerRef: this.props.containerRef,
            onChange: this.handleElementChange,
          })
        );
      });
    }
  }

  getData(): ElementEntity[] {
    const elements = this.elements;
    const data = [];
    elements.forEach((item) => {
      data.push(item.getData());
    });
    return data;
  }

  getElements(): ElementController[] {
    return this.elements;
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
