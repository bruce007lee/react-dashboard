import React, { ReactNode, FC, useEffect, useState } from 'react';
import classNames from 'classnames';
import { render, unmountComponentAtNode } from 'react-dom';
import { domUtil, sn } from '../../utils';

import './index.scss';

export type ToastProps = {
  content?: ReactNode;
  during?: number;
  animDuring?: number;
  onHide?: () => void;
};

export type ToastFC<T> = {
  show: (msg: ReactNode) => void;
} & FC<T>;

const Toast: ToastFC<ToastProps> = ({ onHide, content, animDuring = 500, during = 2000 }) => {
  const [visible, setVisible] = useState<boolean>(true);
  const [startHide, setStartHide] = useState<boolean>(false);
  useEffect(() => {
    (async () => {
      await new Promise<void>((resolve) => {
        setTimeout(() => {
          setStartHide(true);
          resolve();
        }, during - animDuring);
      });

      await new Promise<void>((resolve) => {
        setTimeout(() => {
          setVisible(false);
          resolve();
        }, animDuring);
      });

      if (onHide) {
        onHide();
      }
    })();
  });
  if (!visible) {
    return null;
  }
  return (
    <div className={sn('toast')}>
      <div className={classNames('main', startHide ? 'hide' : null)}>{content}</div>
    </div>
  );
};

/**
 * 展示toast
 */
Toast.show = (props: ToastProps | string = {}) => {
  const root = domUtil.createNode();
  if (typeof props === 'string') {
    props = { content: props };
  }
  const { onHide, ...others } = props;
  const handleHide = () => {
    unmountComponentAtNode(root);
    domUtil.removeNode(root);
    if (onHide) {
      onHide();
    }
  };
  render(<Toast {...others} onHide={handleHide} />, root);
};

export default Toast;
