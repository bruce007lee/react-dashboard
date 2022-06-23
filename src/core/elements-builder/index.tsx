import { ReactNode, MutableRefObject } from 'react';
import {
  ElementSchema,
  IDispatcher,
  IElementController,
  IElementsBuilder,
} from '../../types';
import MaterialManager from '../material-manager';
import RenderContext from '../render-context';
import ElementController from '../element-controller';
import ActionManager from '../action-manager';
import ElementManager from '../element-manager';

export type ElementsBuilderProps = {
  data: ElementSchema[];
  materialManager?: MaterialManager;
  actionManager?: ActionManager;
  elementManager?: ElementManager;
  containerRef: MutableRefObject<HTMLDivElement>;
  context: RenderContext;
};

export default class ElementsBuilder implements IElementsBuilder {
  private props: ElementsBuilderProps;
  private elementManager: ElementManager;
  private materialManager: MaterialManager;
  private actionManager: ActionManager;
  private dispacher: IDispatcher;

  constructor(props: ElementsBuilderProps) {
    this.props = props;
    this.materialManager = this.props.materialManager || new MaterialManager();
    this.actionManager = this.props.actionManager || new ActionManager();
    this.elementManager = this.props.elementManager || new ElementManager();
    this.setData(this.props.data);
  }

  handleElementChange = (data: ElementSchema) => {
    console.log('[DEBUG]element change:', data.bounds);
  };

  getMaterialManager(): MaterialManager {
    return this.materialManager;
  }

  getActionManager(): ActionManager {
    return this.actionManager;
  }

  getElementManager(): ElementManager {
    return this.elementManager;
  }

  setDispatcher(dispacher: IDispatcher): void {
    this.dispacher = dispacher;
  }

  getDispatcher(): IDispatcher {
    return this.dispacher;
  }

  updateView(): void {
    this.dispacher?.updateView();
  }

  setData(data: ElementSchema[]): void {
    this.elementManager.removeAll();
    if (data) {
      data.forEach((element, index) => {
        this.elementManager.add(
          new ElementController({
            index,
            data: element,
            componentMetadata: this.materialManager.findByName(
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

  getData = (): ElementSchema[] =>
    this.elementManager.map((item) => item.getData());

  getElements = (): IElementController[] => this.elementManager.getAll();

  removeElement(element: IElementController): void {
    this.removeElements([element]);
  }

  removeElements(elements: IElementController[]): void {
    if (elements) {
      elements.forEach((el) => this.elementManager.remove(el));
    }
    this.updateView();
  }

  addElement(element: IElementController): void {
    this.removeElements([element]);
  }

  addElements(elements: IElementController[]): void {
    if (elements) {
      elements.forEach((el) => this.elementManager.add(el));
    }
    this.updateView();
  }

  createElementView = (element: IElementController): ReactNode =>
    (element as ElementController).render();

  render = (): ReactNode =>
    this.elementManager.getAll().map((item) => this.createElementView(item));
}
