import React, {
  ForwardRefRenderFunction,
  forwardRef,
  useEffect,
  CSSProperties,
  MutableRefObject,
  useState,
  useRef,
  useCallback,
} from 'react';
import { Rnd, DraggableData } from 'react-rnd';
import { useRenderContext } from '../../render-context';
import { useElementController } from '../../element-controller';
import { Bounds } from '../../../types';
import { createPortal } from 'react-dom';
export interface RndLayerProps {
  containerRef: MutableRefObject<HTMLDivElement>;
  bounds?: Bounds;
  style?: CSSProperties;
  onBoundsChange?: (bounds: Bounds) => void;
  onDragStart?: () => void;
  onDragStop?: () => void;
  onResizeStart?: () => void;
  onResizeStop?: () => void;
}

export type RndLayerRef = {};

const RndLayer: ForwardRefRenderFunction<RndLayerRef, RndLayerProps> = (
  {
    containerRef,
    bounds: b,
    style,
    onBoundsChange,
    onDragStart,
    onDragStop,
    onResizeStart,
    onResizeStop,
  },
  ref
) => {
  const context = useRenderContext();
  const controller = useElementController();
  const [ticket, setTicket] = useState<any>();
  const [bounds, setBounds] = useState<Bounds>(b);
  const rndRef = useRef<Rnd>(null);
  const [dragging, setDragging] = useState<boolean>(false);
  const [resizing, setResizing] = useState<boolean>(false);
  const [curBounds, setCurBounds] = useState<Bounds>(b);
  const [mouseOffset, setMouseOffset] = useState<{ x: number; y: number }>(b);
  const [magnetic, setMagnetic] = useState<{ x: boolean; y: boolean }>({
    x: false,
    y: false,
  });
  const [curMouseOffset, setCurMouseOffset] = useState<{
    x: number;
    y: number;
  }>(b);
  const forceUpdate = () => {
    setTicket(Math.random());
  };
  const config = context.getConfig();
  const enableManget = config.enableMagnet;
  const SPACE = config.magnetSpace;
  const THRESHOLD = config.magnetThreshold;

  const getOffset = useCallback((e: MouseEvent, bounds: Bounds) => {
    const { clientX, clientY } = e;
    const { x, y } = bounds;
    return {
      x: clientX - x,
      y: clientY - y,
    };
  }, []);

  useEffect(() => {
    forceUpdate();
  }, [containerRef.current]);

  useEffect(() => {
    if (onBoundsChange) {
      onBoundsChange(bounds);
    }
  }, [bounds]);

  useEffect(() => {
    if (enableManget && dragging && context && curMouseOffset && mouseOffset) {
      // 吸附的功能处理
      const elements = context.getElements();
      const newBounds = {
        ...curBounds,
      };
      let needX = false;
      let needY = false;
      const offsetX = curMouseOffset.x - mouseOffset.x;
      const offsetY = curMouseOffset.y - mouseOffset.y;
      /*
      console.log(
        '[DEBUG]offsetX:',
        offsetX,
        'offsetY:',
        offsetY,
        JSON.stringify(curMouseOffset),
        JSON.stringify(mouseOffset)
      );
      */
      let x_ruler = [];
      let y_ruler = [];
      elements.forEach((el, index) => {
        if (el !== controller) {
          const { bounds } = el.getData();

          //格式：d_拖控组件_对比组件
          const d_l_l = [curBounds.x - bounds.x, bounds.x, index];
          const d_l_r = [
            curBounds.x - bounds.x - bounds.width,
            bounds.x + bounds.width,
            index,
          ];
          const d_t_t = [curBounds.y - bounds.y, bounds.y, index];
          const d_t_b = [
            curBounds.y - bounds.y - bounds.height,
            bounds.y + bounds.height,
            index,
          ];
          const d_r_l = [
            curBounds.x + curBounds.width - bounds.x,
            bounds.x - curBounds.width,
            index,
          ];
          const d_r_r = [
            curBounds.x + curBounds.width - bounds.x - bounds.width,
            bounds.x + bounds.width - curBounds.width,
            index,
          ];
          const d_b_t = [
            curBounds.y + curBounds.height - bounds.y,
            bounds.y - curBounds.height,
            index,
          ];
          const d_b_b = [
            curBounds.y + curBounds.height - bounds.y - bounds.height,
            bounds.y + bounds.height - curBounds.height,
            index,
          ];

          x_ruler = x_ruler.concat([d_l_l, d_l_r, d_r_l, d_r_r]);
          y_ruler = y_ruler.concat([d_t_t, d_t_b, d_b_t, d_b_b]);

          //固定间隔距离的吸附
          if (curBounds.x > bounds.x + bounds.width) {
            // 左面
            x_ruler.push([d_l_r[0] - SPACE, d_l_r[1] + SPACE, d_l_r[2]]);
          }

          if (curBounds.x + curBounds.width < bounds.x) {
            // 右面
            x_ruler.push([d_r_l[0] + SPACE, d_r_l[1] - SPACE, d_r_l[2]]);
          }

          if (curBounds.y > bounds.y + bounds.height) {
            // 上面
            y_ruler.push([d_t_b[0] - SPACE, d_t_b[1] + SPACE, d_t_b[2]]);
          }

          if (curBounds.y + curBounds.height < bounds.y) {
            // 下面
            y_ruler.push([d_b_t[0] + SPACE, d_b_t[1] - SPACE, d_b_t[2]]);
          }
        }
      });

      //排序取最近的坐标
      const sort = (a, b) => {
        a = Math.abs(a[0]);
        b = Math.abs(b[0]);
        if (a === b) {
          if (a[1] === b[1]) {
            return a[2] - b[2];
          } else {
            return a[1] - b[1];
          }
        } else {
          return a - b;
        }
      };

      x_ruler.sort(sort);
      y_ruler.sort(sort);

      if (Math.abs(offsetX) < THRESHOLD) {
        x_ruler.some((d) => {
          if (Math.abs(d[0]) < THRESHOLD) {
            needX = true;
            newBounds.x = d[1];
            return true;
          }
          return false;
        });
      }
      if (Math.abs(offsetY) < THRESHOLD) {
        y_ruler.some((d) => {
          if (Math.abs(d[0]) < THRESHOLD) {
            needY = true;
            newBounds.y = d[1];
            return true;
          }
          return false;
        });
      }

      if (!needX && magnetic.x) {
        newBounds.x += magnetic.x ? offsetX : 0;
      }
      if (!needY && magnetic.y) {
        newBounds.y += magnetic.y ? offsetY : 0;
      }
      rndRef.current.updatePosition(newBounds);
      setMagnetic({
        x: needX,
        y: needY,
      });
    }
  }, [curBounds.x, curBounds.y]);

  const handleDrag = (e: MouseEvent, d: DraggableData) => {
    //console.log('[DEBUG]drag', e);
    const b = {
      ...curBounds,
      x: d.x,
      y: d.y,
    };
    setCurMouseOffset(getOffset(e, b));
    setCurBounds(b);
  };

  return containerRef.current
    ? createPortal(
        <Rnd
          ref={rndRef}
          bounds="parent"
          size={{
            width: curBounds.width,
            height: curBounds.height,
          }}
          position={{
            x: curBounds.x,
            y: curBounds.y,
          }}
          style={{
            zIndex: 100,
            ...style,
            border: '1px dashed blue',
            position: 'absolute',
          }}
          onDrag={handleDrag}
          onResize={(e, direction, ref, delta, position) => {
            /*
            setCurBounds({
              ...curBounds,
              width: ref.offsetWidth,
              height: ref.offsetHeight,
              x: position.x,
              y: position.y,
            });
            setBounds({
              ...bounds,
              width: ref.offsetWidth,
              height: ref.offsetHeight,
              x: position.x,
              y: position.y,
            });
             */
          }}
          onDragStart={(e: MouseEvent, d) => {
            if (onDragStart) {
              onDragStart();
            }
            setDragging(true);
            setMouseOffset(getOffset(e, curBounds));
          }}
          onDragStop={(e, d) => {
            setDragging(false);
            setCurBounds({
              ...curBounds,
              x: d.x,
              y: d.y,
            });
            setBounds({
              ...bounds,
              x: d.x,
              y: d.y,
            });
            if (onDragStop) {
              onDragStop();
            }
          }}
          onResizeStart={() => {
            if (onResizeStart) {
              onResizeStart();
            }
            setResizing(true);
          }}
          onResizeStop={(e, direction, ref, delta, position) => {
            setResizing(false);
            setCurBounds({
              ...curBounds,
              width: ref.offsetWidth,
              height: ref.offsetHeight,
              x: position.x,
              y: position.y,
            });
            setBounds({
              ...bounds,
              width: ref.offsetWidth,
              height: ref.offsetHeight,
              x: position.x,
              y: position.y,
            });
            if (onResizeStop) {
              onResizeStop();
            }
          }}
        />,
        containerRef.current
      )
    : null;
};

export default forwardRef(RndLayer);
