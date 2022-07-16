import classNames from 'classnames';
import React, { forwardRef, ForwardRefRenderFunction, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { DraggableData, Rnd } from 'react-rnd';
import { useElementController, useForceUpdate, useRenderContext } from '../../../hooks';
import { Bounds } from '../../../types';
import { elementUtil, sn } from '../../../utils';
import { BaseLayerProps } from '../base-layer';
import './index.scss';

export type RndLayerProps = BaseLayerProps & {
  scale?: number;
  onBoundsChange?: (bounds: Bounds) => void;
  onDragStart?: () => void;
  onDragStop?: () => void;
  onResizeStart?: () => void;
  onResizeStop?: () => void;
};

export type RndLayerRef = {};

const RndLayer: ForwardRefRenderFunction<RndLayerRef, RndLayerProps> = (
  {
    containerRef,
    bounds: b,
    style,
    className,
    scale = 1,
    onBoundsChange,
    onDragStart,
    onDragStop,
    onResizeStart,
    onResizeStop,
  },
  ref,
) => {
  const context = useRenderContext();
  const controller = useElementController();
  const forceUpdate = useForceUpdate();
  const [bounds, setBounds] = useState<Bounds>(b);
  const [curBounds, setCurBounds] = useState<Bounds>(b);
  const [ghostBounds, setGhostBounds] = useState<Bounds>(b);
  const canvasBoundsRef = useRef<Bounds>(b);
  const rndRef = useRef<Rnd>(null);
  const [dragging, setDragging] = useState<boolean>(false);
  const [resizing, setResizing] = useState<boolean>(false);
  const { limitBounds, enableMagnet, magnetSpace: SPACE, magnetThreshold: THRESHOLD } = context.getConfig();

  useEffect(() => {
    forceUpdate();
  }, [containerRef.current]);

  useEffect(() => {
    if (onBoundsChange) {
      onBoundsChange(bounds);
    }
  }, [bounds]);

  const updateCanvasBounds = () => {
    let dom = context.getBuilder().getCanvasContainerRef().current;
    if (dom) {
      canvasBoundsRef.current = {
        width: dom.offsetWidth,
        height: dom.offsetHeight,
        x: 0,
        y: 0,
      };
    }
    dom = null;
  };

  /**
   * 做吸附的相关处理
   */
  const updateBounds = (curBounds: Bounds, direction?: string) => {
    if (enableMagnet && (resizing || dragging) && context) {
      // 吸附的功能处理
      const elements = context.getElements();
      const newBounds = {
        ...curBounds,
      };

      let x_ruler = [];
      let y_ruler = [];

      elements.forEach((el, index) => {
        if (el !== controller) {
          const bounds = elementUtil.getBounds(el.getData());

          // 数组格式：拖控组件坐标_对比组件坐标_高度或宽度_元素index
          const d_l_l = [curBounds.x - bounds.x, bounds.x, curBounds.x + curBounds.width - bounds.x, index];
          const d_l_r = [
            curBounds.x - bounds.x - bounds.width,
            bounds.x + bounds.width,
            curBounds.x + curBounds.width - bounds.x - bounds.width,
            index,
          ];
          const d_t_t = [curBounds.y - bounds.y, bounds.y, curBounds.y + curBounds.height - bounds.y, index];
          const d_t_b = [
            curBounds.y - bounds.y - bounds.height,
            bounds.y + bounds.height,
            curBounds.y + curBounds.height - bounds.y - bounds.height,
            index,
          ];
          const d_r_l = [
            curBounds.x + curBounds.width - bounds.x,
            bounds.x - curBounds.width,
            bounds.x - curBounds.x,
            index,
          ];
          const d_r_r = [
            curBounds.x + curBounds.width - bounds.x - bounds.width,
            bounds.x + bounds.width - curBounds.width,
            bounds.x + bounds.width - curBounds.x,
            index,
          ];
          const d_b_t = [
            curBounds.y + curBounds.height - bounds.y,
            bounds.y - curBounds.height,
            bounds.y - curBounds.y,
            index,
          ];
          const d_b_b = [
            curBounds.y + curBounds.height - bounds.y - bounds.height,
            bounds.y + bounds.height - curBounds.height,
            bounds.y + bounds.height - curBounds.y,
            index,
          ];

          const d = direction?.toLowerCase();

          if (dragging) {
            x_ruler = x_ruler.concat([d_l_l, d_l_r, d_r_l, d_r_r]);
            y_ruler = y_ruler.concat([d_t_t, d_t_b, d_b_t, d_b_b]);
          } else if (resizing) {
            if (d.indexOf('left') >= 0) {
              x_ruler = x_ruler.concat([d_l_l, d_l_r]);
            }
            if (d.indexOf('right') >= 0) {
              x_ruler = x_ruler.concat([d_r_l, d_r_r]);
            }
            if (d.indexOf('top') >= 0) {
              y_ruler = y_ruler.concat([d_t_t, d_t_b]);
            }
            if (d.indexOf('bottom') >= 0) {
              y_ruler = y_ruler.concat([d_b_t, d_b_b]);
            }
          }

          // 固定间隔距离的吸附
          if (curBounds.x > bounds.x + bounds.width) {
            // 左面
            x_ruler.push([d_l_r[0] - SPACE, d_l_r[1] + SPACE, d_l_r[2] - SPACE, index]);

            if (d && d.indexOf('left') < 0) {
              x_ruler.pop();
            }
          }

          if (curBounds.x + curBounds.width < bounds.x) {
            // 右面
            x_ruler.push([d_r_l[0] + SPACE, d_r_l[1] - SPACE, d_r_l[2] - SPACE, index]);

            if (d && d.indexOf('right') < 0) {
              x_ruler.pop();
            }
          }

          if (curBounds.y > bounds.y + bounds.height) {
            // 上面
            y_ruler.push([d_t_b[0] - SPACE, d_t_b[1] + SPACE, d_t_b[2] - SPACE, index]);

            if (d && d.indexOf('top') < 0) {
              y_ruler.pop();
            }
          }

          if (curBounds.y + curBounds.height < bounds.y) {
            // 下面
            y_ruler.push([d_b_t[0] + SPACE, d_b_t[1] - SPACE, d_b_t[2] - SPACE, index]);

            if (d && d.indexOf('bottom') < 0) {
              y_ruler.pop();
            }
          }
        }
      });

      const canvasBounds = canvasBoundsRef.current;
      if (canvasBounds) {
        // 画布边缘
        const c_l_l = [curBounds.x, 0, curBounds.x + curBounds.width, -1];
        const c_r_r = [
          curBounds.x + curBounds.width - canvasBounds.width,
          canvasBounds.width - curBounds.width,
          canvasBounds.width - curBounds.x,
          -1,
        ];
        const c_t_t = [curBounds.y, 0, curBounds.y + curBounds.height, -1];
        const c_b_b = [
          curBounds.y + curBounds.height - canvasBounds.height,
          canvasBounds.height - curBounds.height,
          canvasBounds.height - curBounds.y,
          -1,
        ];

        x_ruler = x_ruler.concat([c_l_l, c_r_r]);
        y_ruler = y_ruler.concat([c_t_t, c_b_b]);
      }

      // 排序取最近的坐标
      const sort = (a, b) => {
        a = Math.abs(a[0]);
        b = Math.abs(b[0]);
        if (a === b) {
          if (a[1] === b[1]) {
            return a[3] - b[3];
          } else {
            return a[1] - b[1];
          }
        } else {
          return a - b;
        }
      };

      x_ruler.sort(sort);
      y_ruler.sort(sort);

      let d = x_ruler[0];
      if (d && Math.abs(d[0]) < THRESHOLD) {
        if (dragging) {
          newBounds.x = d[1];
        } else if (resizing) {
          if (['topLeft', 'left', 'bottomLeft'].includes(direction)) {
            newBounds.x = d[1];
          }
          newBounds.width = d[2];
        }
      }
      d = y_ruler[0];
      if (d && Math.abs(d[0]) < THRESHOLD) {
        if (dragging) {
          newBounds.y = d[1];
        } else if (resizing) {
          if (['topLeft', 'top', 'topRight'].includes(direction)) {
            newBounds.y = d[1];
          }
          newBounds.height = d[2];
        }
      }
      setGhostBounds(newBounds);
    } else {
      setGhostBounds(curBounds);
    }
  };

  const handleDrag = (e: MouseEvent, d: DraggableData) => {
    const b = {
      ...curBounds,
      x: Math.round(d.x),
      y: Math.round(d.y),
    };
    setCurBounds(b);
    updateBounds(b);
  };

  const handleSelected = () => {
    controller.setSelectd(true);
  };

  return containerRef.current
    ? createPortal(
        <>
          <div
            className={classNames(
              sn('rnd-layer'),
              className,
              dragging ? sn('rnd-layer-dragging') : null,
              resizing ? sn('rnd-layer-resizing') : null,
            )}
            style={{
              width: ghostBounds.width,
              height: ghostBounds.height,
              top: ghostBounds.y,
              left: ghostBounds.x,
            }}
          />
          <Rnd
            ref={rndRef}
            scale={scale}
            className={sn('rnd-layer-ghost')}
            bounds={limitBounds ? 'parent' : null}
            size={{
              width: curBounds.width,
              height: curBounds.height,
            }}
            position={{
              x: curBounds.x,
              y: curBounds.y,
            }}
            style={style}
            onDrag={handleDrag}
            onResize={(e, direction, ref, delta, position) => {
              const b = {
                width: ref.offsetWidth,
                height: ref.offsetHeight,
                x: Math.round(position.x),
                y: Math.round(position.y),
              };
              setCurBounds(b);
              updateBounds(b, direction);
            }}
            onDragStart={(e: MouseEvent, d) => {
              updateCanvasBounds();
              if (onDragStart) {
                onDragStart();
              }
              setDragging(true);
            }}
            onDragStop={(e, d) => {
              setDragging(false);
              setCurBounds({ ...ghostBounds });
              setBounds({ ...ghostBounds });
              if (onDragStop) {
                onDragStop();
              }
            }}
            onResizeStart={() => {
              updateCanvasBounds();
              if (onResizeStart) {
                onResizeStart();
              }
              setResizing(true);
            }}
            onResizeStop={(e, direction, ref, delta, position) => {
              setResizing(false);
              setCurBounds({ ...ghostBounds });
              setBounds({ ...ghostBounds });
              if (onResizeStop) {
                onResizeStop();
              }
            }}
            onClick={handleSelected}
          />
        </>,
        containerRef.current,
      )
    : null;
};

export default forwardRef(RndLayer);
