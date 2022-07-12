import classNames from 'classnames';
import React, { FC, useEffect, useRef } from 'react';
import { domUtil, sn } from '../../utils';
import './index.scss';

export type ScaleDetectorProps = {
  onChange?: (scale: number) => void;
};

const ScaleDetector: FC<ScaleDetectorProps> = ({ onChange }) => {
  const rootRef = useRef<HTMLDivElement>();
  useEffect(() => {
    if (onChange) {
      onChange(domUtil.getDomScaleRatio(rootRef.current));
    }
  });
  return <div ref={rootRef} className={classNames(sn('scale-detector'))} />;
};

export default ScaleDetector;
