import React, {
  ForwardRefRenderFunction,
  forwardRef,
  useEffect,
  CSSProperties,
  MutableRefObject,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import { Rnd } from 'react-rnd';
import { Bounds } from '../../../types';

export interface RndLayerProps {
  containerRef: MutableRefObject<HTMLDivElement>;
  bounds?: Bounds;
  style?: CSSProperties;
  onBoundsChange?: (bounds: Bounds) => void;
}

export type RndLayerRef = {};

const RndLayer: ForwardRefRenderFunction<RndLayerRef, RndLayerProps> = (
  { containerRef, bounds: b, style, onBoundsChange},
  ref
) => {
  const [ticket, setTicket] = useState<any>();
  const [bounds, setBounds] = useState<Bounds>(b);
  const forceUpdate = () => {
    setTicket(Math.random());
  };

  useEffect(() => {
    forceUpdate();
  }, [containerRef.current]);

  useEffect(() => {
    if(onBoundsChange){
      onBoundsChange(bounds);
    }
  }, [bounds]);


  return containerRef.current
    ? createPortal(
        <Rnd
          size={{
            width: bounds.width,
            height: bounds.height,
          }}
          position={{
            x: bounds.x,
            y: bounds.y,
          }}
          style={{
            zIndex: 100,
            ...style,
            border: '1px dashed blue',
            position: 'absolute',
          }}
          onDragStop={(e, d) => {
            setBounds({
              ...bounds,
              x: d.x,
              y: d.y,
            });
          }}
          onResizeStop={(e, direction, ref, delta, position) => {
            setBounds({
              ...bounds,
              width: ref.offsetWidth,
              height: ref.offsetHeight,
              x: position.x,
              y: position.y,
            });
          }}
        />,
        containerRef.current
      )
    : null;
};

export default forwardRef(RndLayer);
