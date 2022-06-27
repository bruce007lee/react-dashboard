import { FC, HTMLAttributes } from 'react';
import classNames from 'classnames';
import DragSourceWrapper from '../../components/drag-source-wrapper';
import { useElementsProviderContext } from '../../hooks';
import { ElementSchema } from '../../types';
import { sn } from '../../utils';

export type ElementSourceProps = HTMLAttributes<HTMLDivElement> & {
  accept?: string;
  data: ElementSchema;
};

const ElementSource: FC<ElementSourceProps> = ({ children, accept, data, className, ...others }) => {
  const providerCtx = useElementsProviderContext();
  if (!accept && providerCtx) {
    accept = providerCtx.accept;
  }

  if (!accept) {
    return <div {...others}>{children}</div>;
  }

  return (
    <DragSourceWrapper {...others} className={classNames(sn('dnd-source'), className)} accept={accept} data={data}>
      {children}
    </DragSourceWrapper>
  );
};

export default ElementSource;
