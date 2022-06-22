import React, {
  ForwardRefRenderFunction,
  forwardRef,
  CSSProperties,
  MutableRefObject,
  useState,
  useImperativeHandle,
} from 'react';
import { Bounds, ElementEntity, ComponentMetadata } from '../../types';
import { RndLayer } from '../layers';

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
  let { width, height, x, y } = b;
  let { width: w, height: h, ...others } = style;
  w = (w || width) as number;
  h = (h || height) as number;
  const [bounds, setBounds] = useState<Bounds>({ width: w, height: h, x, y });
  const [dragging, setDragging] = useState<boolean>(false);
  const [resizing, setResizing] = useState<boolean>(false);
  const Com = componentMetadata?.componentClass;

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
      style={{
        border: '1px solid red',
        position: 'absolute',
        width: bounds.width,
        height: bounds.height,
        left: bounds.x,
        top: bounds.y,
        opacity: dragging ? 0.5 : 1,
      }}
    >
      {Com ? (
        <Com props={comProps} />
      ) : (
        <div>{`组件类型 [${componentName}] 不存在`}</div>
      )}
      <RndLayer
        containerRef={containerRef}
        bounds={bounds}
        onBoundsChange={handleBoundsChange}
        onDragStart={() => setDragging(true)}
        onDragStop={() => setDragging(false)}
        onResizeStart={() => setResizing(true)}
        onResizeStop={() => setResizing(false)}
      />
    </div>
  );
};

export default forwardRef(ElementView);
