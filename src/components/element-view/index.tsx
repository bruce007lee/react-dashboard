import React, {
  ForwardRefRenderFunction,
  forwardRef,
  CSSProperties,
  MutableRefObject,
  useState,
  ElementType,
  useImperativeHandle,
} from 'react';
import { Bounds, ElementEntity } from '../../types';
import { RndLayer } from '../layers';

export interface ElementViewProps {
  containerRef: MutableRefObject<HTMLDivElement>;
  style?: CSSProperties;
  data: ElementEntity<ElementType>;
  onBoundsChange?: (bounds: Bounds) => void;
}

export type ElementViewRef = {
  /**
   * 获取当前编辑的元素数据
   */
  getData(): ElementEntity<ElementType>;
};

const ElementView: ForwardRefRenderFunction<
  ElementViewRef,
  ElementViewProps
> = ({ containerRef, style = {}, data, onBoundsChange }, ref) => {
  const {
    bounds: b = { x: 0, y: 0, width: 100, height: 100 },
    component: Com,
    props: comProps,
  } = data;
  let { width, height, x, y } = b;
  let { width: w, height: h, ...others } = style;
  w = (w || width) as number;
  h = (h || height) as number;
  const [bounds, setBounds] = useState<Bounds>({ width: w, height: h, x, y });

  useImperativeHandle(ref, () => ({
    getData: () => {
      return { ...data, bounds };
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
      }}
    >
      <Com props={comProps} />
      <RndLayer
        containerRef={containerRef}
        bounds={bounds}
        onBoundsChange={handleBoundsChange}
      />
    </div>
  );
};

export default forwardRef(ElementView);
