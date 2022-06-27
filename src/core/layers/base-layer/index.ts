import { CSSProperties, MutableRefObject } from 'react';
import { Bounds } from '../../../types';

export type BaseLayerProps = {
  containerRef: MutableRefObject<HTMLDivElement>;
  bounds: Bounds;
  style?: CSSProperties;
  className?: string;
};
