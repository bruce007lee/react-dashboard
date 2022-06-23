import React, {
  ForwardRefRenderFunction,
  forwardRef,
  useRef,
  useState,
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
  editable: boolean;
}

export type DashboardRef = {};

const Dashboard: ForwardRefRenderFunction<DashboardRef, DashboardProps> = (
  { data, components, style, editable, ...others },
  ref
) => {
  const [context] = useState<RenderContext>(() => new RenderContext());
  const [builder, setBuilder] = useState<ElementsBuilder>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  context.setConfig({
    editable,
  });

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
        style={{
          height: 100,
          overflow: 'hidden',
          ...style,
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
          }}
          ref={containerRef}
        >
          {builder ? builder.render() : null}
        </div>
      </div>
    </RenderContextProvider>
  );
};

export default forwardRef(Dashboard);
