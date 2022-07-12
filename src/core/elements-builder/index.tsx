import React, { MutableRefObject, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { ElementSchema, IDispatcher, IElementController, IElementsBuilder, IRenderContext } from '../../types';
import { cloneDeep } from '../../utils';
import ActionManager from '../action-manager';
import ElementController from '../element-controller';
import ElementManager from '../element-manager';
import MaterialManager from '../material-manager';
import RenderContext from '../render-context';
import SetterManager from '../setter-manager';

export type ElementsBuilderProps = {
  data: ElementSchema[];
  materialManager?: MaterialManager;
  actionManager?: ActionManager;
  elementManager?: ElementManager;
  setterManager?: SetterManager;
  dispatcher?: IDispatcher;
  canvasContainerRef: MutableRefObject<HTMLElement>;
  setterContainerRef?: MutableRefObject<HTMLElement>;
  setterContainerExtraRender?: (props: { renderContext: IRenderContext; [key: string]: any }) => ReactNode;
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

  addElement(element: IElementController | ElementSchema): IElementController {
    return this.addElements([element])[0];
  }

  addElements(elements: Array<IElementController | ElementSchema>): IElementController[] {
    const rs = [];
    if (elements) {
      elements.forEach((el) => {
        if (el instanceof ElementController) {
          rs.push(el);
          this.elementManager.add(el);
        } else {
          const elc = this.schemaToElement(el as ElementSchema);
          rs.push(elc);
          this.elementManager.add(elc);
        }
      });
    }
    this.updateView();
    return rs;
  }

  createElementView = (element: IElementController): ReactNode => (element as ElementController).render();

  render = (): ReactNode => {
    const { setterContainerExtraRender, context, setterContainerRef } = this.props;
    return (
      <>
        {setterContainerRef?.current && setterContainerExtraRender
          ? createPortal(setterContainerExtraRender({ renderContext: context }), setterContainerRef.current)
          : null}
        {this.elementManager.getAll().map((item) => this.createElementView(item))}
      </>
    );
  };
}
