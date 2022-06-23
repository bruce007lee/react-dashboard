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
import { useRenderContext } from '../render-context';
import { Bounds, ElementEntity, ComponentMetadata, ElementStatus } from '../../types';
import { sn } from '../../utils';

import './index.scss';
import { useElementController } from '../element-controller';

export interface ElementViewProps {
  containerRef: MutableRefObject<HTMLDivElement>;
  style?: CSSProperties;
  componentMetadata: ComponentMetadata;
  data: ElementEntity;
  onBoundsChange?: (bounds: Bounds) => void;
}

export type ElementViewRef = {
  /**
   * 获取当前编辑的元素数据
   */
  getData(): ElementEntity;
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
  let { width, height, x, y } = b;
  let { width: w, height: h, ...others } = style;
  w = (w || width) as number;
  h = (h || height) as number;
  const [bounds, setBounds] = useState<Bounds>({ width: w, height: h, x, y });
  const [status, setOriStatus] = useState<ElementStatus>(() => controller.getStatus());
  const setStatus = (status: ElementStatus) => {
    setOriStatus(status);
    controller.setStatus(status);
  }
  const Com = componentMetadata?.componentClass;
  const ctx = useRenderContext();

  useImperativeHandle(ref, () => ({
    getData: () => {
      return { ...data, bounds };
    },

    getBounds: () => {
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
        status.dragging ? sn('element-view-dragging') : null,
        status.resizing ? sn('element-view-resizing') : null
      )}
      style={{
        position: 'absolute',
        width: bounds.width,
        height: bounds.height,
        left: bounds.x,
        top: bounds.y,
      }}
    >
      {Com ? (
        <Com props={comProps} />
      ) : (
        <div>{`组件类型 [${componentName}] 不存在`}</div>
      )}
      {ctx.getEditable() ? (
        <RndLayer
          containerRef={containerRef}
          bounds={bounds}
          onBoundsChange={handleBoundsChange}
          onDragStart={() => setStatus({dragging: true})}
          onDragStop={() => setStatus({dragging: false})}
          onResizeStart={() => setStatus({resizing: true})}
          onResizeStop={() => setStatus({resizing: false})}
        />
      ) : null}
    </div>
  );
};

export default forwardRef(ElementView);
