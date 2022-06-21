import React, {
  ForwardRefRenderFunction,
  forwardRef,
  useRef,
  useState,
  ElementType,
  useEffect,
  useCallback,
  HTMLAttributes,
} from 'react';
import { ElementEntity } from '../../types';
import Elementsbuilder from '../elements-builder';
import { mockData } from '../../mock';

export interface DashboardProps extends HTMLAttributes<HTMLDivElement> {
  data: ElementEntity<ElementType>[];
}

export type DashboardRef = {};

const Dashboard: ForwardRefRenderFunction<DashboardRef, DashboardProps> = (
  { data = mockData, style, ...others },
  ref
) => {
  const [builder, setBuilder] = useState<Elementsbuilder>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const createBuilder = useCallback<
    (data: ElementEntity<ElementType>[]) => Elementsbuilder
  >((data) => {
    return new Elementsbuilder({
      data,
      containerRef,
    });
  }, []);

  useEffect(() => {
    setBuilder(createBuilder(data));
  }, [data]);

  return (
    <div
      {...others}
      style={{ ...style, height: 1000, position: 'relative' }}
      ref={containerRef}
    >
      {builder ? builder.render() : null}
    </div>
  );
};

export default forwardRef(Dashboard);
