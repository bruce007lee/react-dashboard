import { CSSProperties, MutableRefObject, RefObject } from 'react';
import { Bounds } from '../../../types';

export type BaseLayerProps = {
  containerRef: MutableRefObject<HTMLElement> | RefObject<HTMLElement>;
  bounds: Bounds;
  style?: CSSProperties;
  className?: string;
};
