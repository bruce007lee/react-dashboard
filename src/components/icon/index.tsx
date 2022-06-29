import React, { CSSProperties, FC } from 'react';
import classNames from 'classnames';
import { sn } from '../../utils';
import './index.scss';

export type IconProps = {
  fontClass?: string;
  prefix?: string;
  type: string;
  className?: string;
  style?: CSSProperties;
};

const Icon: FC<IconProps> = ({
  className,
  style,
  fontClass = 'react-dashboard-icons',
  prefix = 'icon-react-dashboard-',
  type,
}) => {
  return <span className={classNames(sn('icon'), fontClass, prefix + type, className)} style={style} />;
};

export default Icon;
