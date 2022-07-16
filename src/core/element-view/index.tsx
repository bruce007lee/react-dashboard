import classNames from 'classnames';
import React, {
  CSSProperties,
  forwardRef,
  ForwardRefRenderFunction,
  MutableRefObject,
  RefObject,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { useElementController, useForceUpdate, useRenderContext } from '../../hooks';
import { Bounds, ComponentMetadata, ElementSchema, ElementStatus } from '../../types';
import { elementUtil, sn } from '../../utils';
import ElementToolbar from '../element-toolbar';
import { ProxyLayer, RndLayer, SetterLayer } from '../layers';
import SettersPanel from '../setters-panel';
import './index.scss';

export interface ElementViewProps {
  canvasContainerRef: MutableRefObject<HTMLElement> | RefObject<HTMLElement>;
  setterContainerRef?: MutableRefObject<HTMLElement> | RefObject<HTMLElement>;
  style?: CSSProperties;
  componentMetadata: ComponentMetadata;
  data: ElementSchema;
  onBoundsChange?: (bounds: Bounds) => void;
}

export type ElementViewRef = {
  /**
   * 获取dom节点
   */
  getDom(): HTMLElement;

  /**
   * 获取当前编辑的元素数据
   */
  getData(): ElementSchema;

  /**
   * 获取当前的尺寸信息
   */
  getBounds(): Bounds;

  /**
   * 强制刷新
   */
  forceUpdate(): void;
};

const ElementView: ForwardRefRenderFunction<ElementViewRef, ElementViewProps> = (
  { canvasContainerRef, setterContainerRef, style = {}, data, componentMetadata, onBoundsChange },
  ref,
) => {
  const { componentName, props: comProps } = data;
  const domRef = useRef<HTMLDivElement>();
  const b = elementUtil.getBounds(data);
  const controller = useElementController();
  const forceUpdate = useForceUpdate();
  const { width, height, x, y } = b;
  let { width: w, height: h, ...othersStyle } = style;
  w = (w || width) as number;
  h = (h || height) as number;
  const [bounds, setBounds] = useState<Bounds>({ width: w, height: h, x, y });
  const status = controller.getStatus();
  const setStatus = (status: ElementStatus) => {
    controller.setStatus(status);
  };
  const Com = componentMetadata?.componentClass;
  const ctx = useRenderContext();
  const editable = ctx.getEditable();
  const { hover, dragging, resizing, locked, editing } = status;
  const [scale, setScale] = useState<number>(() => ctx.getRealScaleRatio());

  useEffect(() => {
    setScale(ctx.getRealScaleRatio());
  });

  useImperativeHandle(ref, () => ({
    forceUpdate() {
      forceUpdate();
    },

    getDom() {
      return domRef.current;
    },

    getData() {
      return { ...data, bounds };
    },

    getBounds() {
      return bounds;
    },
  }));

  const handleBoundsChange = (bounds: Bounds) => {
    setBounds(bounds);
    if (onBoundsChange) {
      onBoundsChange(bounds);
    }
  };

  return (
    <>
      <div
        ref={domRef}
        className={classNames(
          sn('element-view'),
          editable ? sn('element-view-editable') : null,
          hover && editable && !locked && !dragging && !resizing ? sn('element-view-hover') : null,
          dragging ? sn('element-view-dragging') : null,
          resizing ? sn('element-view-resizing') : null,
        )}
        style={{
          ...othersStyle,
          width: bounds.width,
          height: bounds.height,
          left: bounds.x,
          top: bounds.y,
        }}
        onMouseEnter={() => editable && setStatus({ hover: true })}
        onMouseLeave={() => editable && setStatus({ hover: false })}
        onDoubleClick={() => editable && setStatus({ editing: true })}
      >
        {Com ? <Com {...comProps} /> : <div>{`组件类型 [${componentName}] 不存在`}</div>}
        {editable ? (
          <>
            <ProxyLayer containerRef={canvasContainerRef} bounds={bounds} />
            {status.locked ? null : (
              <RndLayer
                containerRef={canvasContainerRef}
                scale={scale}
                bounds={bounds}
                onBoundsChange={handleBoundsChange}
                onDragStart={() => setStatus({ dragging: true })}
                onDragStop={() => setStatus({ dragging: false })}
                onResizeStart={() => setStatus({ resizing: true })}
                onResizeStop={() => setStatus({ resizing: false })}
              />
            )}
            {editing ? <SetterLayer containerRef={canvasContainerRef} bounds={bounds} /> : null}
            {status.hover ? <ElementToolbar componentMetadata={componentMetadata} /> : null}
          </>
        ) : null}
      </div>
      <SettersPanel containerRef={setterContainerRef} componentMetadata={componentMetadata} />
    </>
  );
};

export default forwardRef(ElementView);
