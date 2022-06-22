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
import { ComponentMetadata, ElementEntity } from '../../types';
import ElementsBuilder from '../elements-builder';
import RenderContext, { RenderContextProvider } from '../render-context';
import MaterialManager from '../material-manager';
export interface DashboardProps extends HTMLAttributes<HTMLDivElement> {
  data: ElementEntity[];
  components: ComponentMetadata[];
}

export type DashboardRef = {};

const Dashboard: ForwardRefRenderFunction<DashboardRef, DashboardProps> = (
  { data, components, style, ...others },
  ref
) => {
  const [context] = useState<RenderContext>(() => new RenderContext());
  const [builder, setBuilder] = useState<ElementsBuilder>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const createBuilder = useCallback<(data: ElementEntity[]) => ElementsBuilder>(
    (data) => {
      const materialManager = new MaterialManager({
        components,
      });
      const b = new ElementsBuilder({
        data,
        materialManager,
        containerRef,
        context,
      });
      context.setBuilder(b);
      return b;
    },
    [containerRef, context]
  );

  useEffect(() => {
    setBuilder(createBuilder(data));
  }, [data]);

  return (
    <RenderContextProvider value={context}>
      <div
        {...others}
        style={{ ...style, height: 1000, position: 'relative' }}
        ref={containerRef}
      >
        {builder ? builder.render() : null}
      </div>
    </RenderContextProvider>
  );
};

export default forwardRef(Dashboard);
