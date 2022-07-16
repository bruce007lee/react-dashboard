import classNames from 'classnames';
import React, {
  CSSProperties,
  forwardRef,
  ForwardRefRenderFunction,
  HTMLAttributes,
  MouseEvent,
  MutableRefObject,
  ReactNode,
  RefObject,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import LifecycleAdapter from '../../components/lifecycle-adapter';
import ScaleDetector from '../../components/scale-detector';
import { useElementsProviderContext, useForceUpdate } from '../../hooks';
import {
  ActionMetadata,
  ComponentMetadata,
  DashBoardConfig,
  ElementSchema,
  IDispatcher,
  IRenderContext,
  SetterMetadata,
} from '../../types';
import { sn } from '../../utils';
import ActionManager from '../action-manager';
import ElementTarget from '../element-target';
import ElementsBuilder from '../elements-builder';
import MaterialManager from '../material-manager';
import RenderContext, { RenderContextProvider } from '../render-context';
import SetterManager from '../setter-manager';
import './index.scss';

export interface DashboardProps extends HTMLAttributes<HTMLDivElement>, DashBoardConfig {
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
   * 组件属性setter配置
   */
  setters?: SetterMetadata[];
  /**
   * 默认显示的组件的toolbar功能
   */
  defaultToolbarActionNames?: string[];
  /**
   * 组件属性设置的面板容器
   */
  setterContainerRef?: MutableRefObject<HTMLElement> | RefObject<HTMLElement>;
  /**
   * 组件属性设置的面板附加的渲染器
   */
  setterContainerExtraRender?: (props: { renderContext: IRenderContext; [key: string]: any }) => ReactNode;
}

export type DashboardRef = {
  /**
   * 获取编辑的数据
   */
  getEditData: () => ElementSchema[];
  /**
   * 获取渲染的上下文
   */
  getRenderContext: () => IRenderContext;
};

const Dashboard: ForwardRefRenderFunction<DashboardRef, DashboardProps> = (
  {
    data,
    components,
    actions,
    setters,
    defaultToolbarActionNames,
    style,
    editable,
    limitBounds,
    enableMagnet = true,
    magnetSpace = 16,
    magnetThreshold = 10,
    dndAccept,
    scaleRatio = 1,
    className,
    setterContainerRef,
    setterContainerExtraRender,
    eventsMonitor,
    ...others
  },
  ref,
) => {
  const forceUpdate = useForceUpdate();
  const [context] = useState<RenderContext>(() => new RenderContext());
  const [builder, setBuilder] = useState<ElementsBuilder>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const elementsProviderCtx = useElementsProviderContext();
  context.setConfig({
    limitBounds,
    editable,
    enableMagnet,
    magnetSpace,
    magnetThreshold,
    dndAccept,
    scaleRatio,
    eventsMonitor: new LifecycleAdapter({ lifecycle: eventsMonitor }),
  });

  if (elementsProviderCtx) {
    // 为拖控源添加渲染上下文
    elementsProviderCtx.renderContext = context;
  }

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
      const setterManager = new SetterManager({
        setters,
      });
      const b = new ElementsBuilder({
        data,
        materialManager,
        actionManager,
        setterManager,
        dispatcher,
        canvasContainerRef,
        setterContainerRef,
        setterContainerExtraRender,
        context,
      });
      context.setBuilder(b);
      return b;
    },
    [canvasContainerRef, setterContainerRef, context],
  );

  useEffect(() => {
    builder?.setDispatcher(dispatcher);
  });

  useEffect(() => {
    setBuilder(createBuilder(data));
  }, [data]);

  const handleCanvasClick = (e: MouseEvent) => {
    const { clientX, clientY } = e;
    if (canvasContainerRef.current) {
      let dom = canvasContainerRef.current;
      if (dom) {
        const { left, top, width, height } = dom.getBoundingClientRect();
        if (clientX > left && clientX < left + width && clientY > top && clientY < top + height) {
          context.handleCanvasClick(e);
        }
      }
      dom = null;
    }
  };

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

  const scaleStyle: CSSProperties = {};
  if (scaleRatio && scaleRatio !== 1) {
    // 缩放的处理
    scaleStyle.transform = `scale(${scaleRatio})`;
    scaleStyle.transformOrigin = 'left top';
  }

  return (
    <RenderContextProvider value={context}>
      <div
        {...others}
        className={classNames(sn('canvas'), className)}
        style={{
          ...style,
          position: 'relative',
        }}
      >
        <ElementTarget style={innerStyle}>
          <div className={classNames(sn('canvas-wrapper'))} style={innerStyle} onClick={handleCanvasClick}>
            {/* 附加的帮助工具容器，比如标尺等 */}
            <div className={classNames(sn('canvas-extra'))} style={{ ...innerStyle, ...scaleStyle }}>
              <ScaleDetector onChange={(scale) => context.setRealScaleRatio(scale)} />
            </div>
            {/* 元素容器 */}
            <div
              className={classNames(sn('canvas-container'))}
              ref={canvasContainerRef}
              style={{ ...innerStyle, ...scaleStyle }}
            >
              {builder ? builder.render() : null}
            </div>
          </div>
        </ElementTarget>
      </div>
    </RenderContextProvider>
  );
};

export default forwardRef(Dashboard);
