import React, {
  ForwardRefRenderFunction,
  forwardRef,
  useRef,
  useState,
  useEffect,
  useCallback,
  HTMLAttributes,
  useImperativeHandle,
  MutableRefObject,
  CSSProperties,
} from 'react';
import classNames from 'classnames';
import {
  ComponentMetadata,
  ElementSchema,
  DashBoardConfig,
  ActionMetadata,
  IDispatcher,
} from '../../types';
import ElementsBuilder from '../elements-builder';
import RenderContext, { RenderContextProvider } from '../render-context';
import MaterialManager from '../material-manager';
import ActionManager from '../action-manager';
import { useForceUpdate } from '../../hooks';
import ElementTarget from '../element-target';
import { sn } from '../../utils';

export interface DashboardProps
  extends HTMLAttributes<HTMLDivElement>,
    DashBoardConfig {
  /**
   * 显示数据的schema
   */
  data?: ElementSchema[];
  /**
   * 组件的物料配置
   */
  components?: ComponentMetadata[];
  /**
   * 组件的toolbar功能配置
   */
  actions?: ActionMetadata[];
  /**
   * 默认显示的组件的toolbar功能
   */
  defaultToolbarActionNames?: string[];
  /**
   * 组件属性设置的面板容器
   */
  setterContainerRef?: MutableRefObject<HTMLDivElement>;
}

export type DashboardRef = {
  /**
   * 获取编辑的数据
   */
  getEditData: () => ElementSchema[];
  /**
   * 获取渲染的上下文
   */
  getRenderContext: () => RenderContext;
};

const Dashboard: ForwardRefRenderFunction<DashboardRef, DashboardProps> = (
  {
    data,
    components,
    actions,
    defaultToolbarActionNames,
    style,
    editable,
    enableMagnet = true,
    magnetSpace = 16,
    magnetThreshold = 10,
    dndAccept,
    className,
    ...others
  },
  ref
) => {
  const forceUpdate = useForceUpdate();
  const [context] = useState<RenderContext>(() => new RenderContext());
  const [builder, setBuilder] = useState<ElementsBuilder>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  context.setConfig({
    editable,
    enableMagnet,
    magnetSpace,
    magnetThreshold,
    dndAccept,
  });

  const dispatcher: IDispatcher = {
    updateView: () => forceUpdate(),
  };

  const createBuilder = useCallback<(data: ElementSchema[]) => ElementsBuilder>(
    (data) => {
      const materialManager = new MaterialManager({
        components,
      });
      const actionManager = new ActionManager({
        actions,
        defaultToolbarActionNames,
      });
      const b = new ElementsBuilder({
        data,
        materialManager,
        actionManager,
        dispatcher,
        containerRef,
        context,
      });
      context.setBuilder(b);
      return b;
    },
    [containerRef, context]
  );

  useEffect(() => {
    builder?.setDispatcher(dispatcher);
  });

  useEffect(() => {
    setBuilder(createBuilder(data));
  }, [data]);

  useImperativeHandle(ref, () => ({
    getEditData: () => context.getEditData(),
    getRenderContext: () => context,
  }));

  const innerStyle: CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  };

  return (
    <RenderContextProvider value={context}>
      <div
        {...others}
        className={classNames(sn('canvas'), className)}
        style={{
          height: 100,
          overflow: 'hidden',
          ...style,
          position: 'relative',
        }}
      >
        <ElementTarget style={innerStyle}>
          <div style={innerStyle} ref={containerRef}>
            {builder ? builder.render() : null}
          </div>
        </ElementTarget>
      </div>
    </RenderContextProvider>
  );
};

export default forwardRef(Dashboard);
