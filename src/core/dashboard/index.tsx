import React, {
  ForwardRefRenderFunction,
  forwardRef,
  useRef,
  useState,
  useEffect,
  useCallback,
  HTMLAttributes,
  useImperativeHandle,
} from 'react';
import {
  ComponentMetadata,
  ElementSchema,
  DashBoardConfig,
  ActionMetadata,
  IDispatcher,
} from '../../types';
import ElementsBuilder from '../elements-builder';
import RenderContext, { RenderContextProvider } from '../render-context';
import MaterialManager from '../material-manager';
import ActionManager from '../action-manager';
import { ACTIONS, DEFAULT_ACTION_NAMES } from '../../actions';
import { useForceUpdate } from '../../hooks';
import ElementTarget from '../element-target';
export interface DashboardProps
  extends HTMLAttributes<HTMLDivElement>,
    DashBoardConfig {
  data: ElementSchema[];
  components: ComponentMetadata[];
  actions?: ActionMetadata[];
  defaultActionNames?: string[];
}

export type DashboardRef = {
  /**
   * 获取编辑的数据
   */
  getEditData: () => ElementSchema[];
};

const Dashboard: ForwardRefRenderFunction<DashboardRef, DashboardProps> = (
  {
    data,
    components,
    actions = ACTIONS,
    defaultActionNames = DEFAULT_ACTION_NAMES,
    style,
    editable,
    enableMagnet = true,
    magnetSpace = 16,
    magnetThreshold = 10,
    ...others
  },
  ref
) => {
  const forceUpdate = useForceUpdate();
  const [context] = useState<RenderContext>(() => new RenderContext());
  const [builder, setBuilder] = useState<ElementsBuilder>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  context.setConfig({
    editable,
    enableMagnet,
    magnetSpace,
    magnetThreshold,
  });

  const dispatcher: IDispatcher = {
    updateView: () => forceUpdate(),
  };

  const createBuilder = useCallback<(data: ElementSchema[]) => ElementsBuilder>(
    (data) => {
      const materialManager = new MaterialManager({
        components,
      });
      const actionManager = new ActionManager({
        actions,
        defaultActionNames,
      });
      const b = new ElementsBuilder({
        data,
        materialManager,
        actionManager,
        dispatcher,
        containerRef,
        context,
      });
      context.setBuilder(b);
      return b;
    },
    [containerRef, context]
  );

  useEffect(() => {
    builder?.setDispatcher(dispatcher);
  });

  useEffect(() => {
    setBuilder(createBuilder(data));
  }, [data]);

  useImperativeHandle(ref, () => ({
    getEditData: () => context.getEditData(),
  }));

  return (
    <RenderContextProvider value={context}>
      <ElementTarget>
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
      </ElementTarget>
    </RenderContextProvider>
  );
};

export default forwardRef(Dashboard);
