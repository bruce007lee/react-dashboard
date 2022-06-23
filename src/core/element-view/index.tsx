import classNames from 'classnames';
import React, {
  ForwardRefRenderFunction,
  forwardRef,
  CSSProperties,
  MutableRefObject,
  useState,
  useImperativeHandle,
} from 'react';
import { RndLayer } from '../layers';
import ElementToolbar from '../element-toolbar';
import { useRenderContext } from '../render-context';
import { useElementController } from '../element-controller';
import {
  Bounds,
  ElementSchema,
  ComponentMetadata,
  ElementStatus,
} from '../../types';
import { sn } from '../../utils';

import './index.scss';
import { useForceUpdate } from '../../hooks';

export interface ElementViewProps {
  containerRef: MutableRefObject<HTMLDivElement>;
  style?: CSSProperties;
  componentMetadata: ComponentMetadata;
  data: ElementSchema;
  onBoundsChange?: (bounds: Bounds) => void;
}

export type ElementViewRef = {
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

const ElementView: ForwardRefRenderFunction<
  ElementViewRef,
  ElementViewProps
> = (
  { containerRef, style = {}, data, componentMetadata, onBoundsChange },
  ref
) => {
  const {
    componentName,
    bounds: b = { x: 0, y: 0, width: 100, height: 100 },
    props: comProps,
  } = data;
  const controller = useElementController();
  const forceUpdate = useForceUpdate();
  let { width, height, x, y } = b;
  let { width: w, height: h, ...others } = style;
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
  const { hover, dragging, resizing, locked } = status;

  useImperativeHandle(ref, () => ({
    forceUpdate() {
      forceUpdate();
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
    <div
      className={classNames(
        sn('element-view'),
        editable ? sn('element-view-editable') : null,
        hover && !locked && !dragging && !resizing ? sn('element-view-hover') : null,
        dragging ? sn('element-view-dragging') : null,
        resizing ? sn('element-view-resizing') : null
      )}
      style={{
        position: 'absolute',
        width: bounds.width,
        height: bounds.height,
        left: bounds.x,
        top: bounds.y,
      }}
      onMouseEnter={() => {
        controller.setStatus({
          hover: true,
        });
      }}
      onMouseLeave={() => {
        controller.setStatus({
          hover: false,
        });
      }}
    >
      {Com ? (
        <Com props={comProps} />
      ) : (
        <div>{`组件类型 [${componentName}] 不存在`}</div>
      )}
      {editable ? (
        <>
          {status.locked ? null : (
            <RndLayer
              containerRef={containerRef}
              bounds={bounds}
              onBoundsChange={handleBoundsChange}
              onDragStart={() => setStatus({ dragging: true })}
              onDragStop={() => setStatus({ dragging: false })}
              onResizeStart={() => setStatus({ resizing: true })}
              onResizeStop={() => setStatus({ resizing: false })}
            />
          )}
          <ElementToolbar />
        </>
      ) : null}
    </div>
  );
};

export default forwardRef(ElementView);
