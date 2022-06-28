import { ReactNode, MutableRefObject } from 'react';
import { ElementSchema, IDispatcher, IElementController, IElementsBuilder } from '../../types';
import MaterialManager from '../material-manager';
import RenderContext from '../render-context';
import ElementController from '../element-controller';
import ActionManager from '../action-manager';
import ElementManager from '../element-manager';
import SetterManager from '../setter-manager';
import { cloneDeep } from '../../utils';

export type ElementsBuilderProps = {
  data: ElementSchema[];
  materialManager?: MaterialManager;
  actionManager?: ActionManager;
  elementManager?: ElementManager;
  setterManager?: SetterManager;
  dispatcher?: IDispatcher;
  canvasContainerRef: MutableRefObject<HTMLElement>;
  setterContainerRef?: MutableRefObject<HTMLElement>;
  context: RenderContext;
};

export default class ElementsBuilder implements IElementsBuilder {
  private props: ElementsBuilderProps;
  private elementManager: ElementManager;
  private materialManager: MaterialManager;
  private actionManager: ActionManager;
  private setterManager: SetterManager;
  private dispatcher: IDispatcher;

  constructor(props: ElementsBuilderProps) {
    this.props = props;
    this.materialManager = this.props.materialManager || new MaterialManager();
    this.actionManager = this.props.actionManager || new ActionManager();
    this.elementManager = this.props.elementManager || new ElementManager();
    this.setterManager = this.props.setterManager || new SetterManager();
    this.dispatcher = this.props.dispatcher;
    this.setData(this.props.data);
  }

  /**
   * @TODO: support lifecycle
   */
  handleElementChange = (data: ElementSchema) => {
    // console.log('[DEBUG]element change:', data.bounds);
  };

  getCanvasContainerRef = (): MutableRefObject<HTMLElement> => this.props.canvasContainerRef;

  getMaterialManager(): MaterialManager {
    return this.materialManager;
  }

  getActionManager(): ActionManager {
    return this.actionManager;
  }

  getElementManager(): ElementManager {
    return this.elementManager;
  }

  getSetterManager(): SetterManager {
    return this.setterManager;
  }

  setDispatcher(dispacher: IDispatcher): void {
    this.dispatcher = dispacher;
  }

  getDispatcher(): IDispatcher {
    return this.dispatcher;
  }

  updateView(): void {
    this.dispatcher?.updateView();
  }

  setData(data: ElementSchema[]): void {
    this.elementManager.removeAll();
    if (data) {
      data.forEach((element) => {
        this.elementManager.add(this.schemaToElement(element));
      });
    }
  }

  getData = (clone: boolean = false): ElementSchema[] => this.elementManager.map((item) => item.getData(clone));

  getElements = (): IElementController[] => this.elementManager.getAll();

  schemaToElement = (element: ElementSchema): IElementController => {
    if (!element) {
      return null;
    }
    element = cloneDeep(element);
    return new ElementController({
      data: element,
      componentMetadata: this.materialManager.findByName(element.componentName),
      context: this.props.context,
      canvasContainerRef: this.props.canvasContainerRef,
      setterContainerRef: this.props.setterContainerRef,
      onChange: this.handleElementChange,
    });
  };

  removeElement(element: IElementController): void {
    this.removeElements([element]);
  }

  removeElements(elements: IElementController[]): void {
    if (elements) {
      elements.forEach((el) => this.elementManager.remove(el));
    }
    this.updateView();
  }

  addElement(element: IElementController | ElementSchema): void {
    this.addElements([element]);
  }

  addElements(elements: Array<IElementController | ElementSchema>): void {
    if (elements) {
      elements.forEach((el) => {
        if (el instanceof ElementController) {
          this.elementManager.add(el);
        } else {
          this.elementManager.add(this.schemaToElement(el as ElementSchema));
        }
      });
    }
    this.updateView();
  }

  createElementView = (element: IElementController): ReactNode => (element as ElementController).render();

  render = (): ReactNode => this.elementManager.getAll().map((item) => this.createElementView(item));
}
