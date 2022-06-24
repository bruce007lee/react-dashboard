import { FC } from 'react';
import DragSourceWrapper from '../../components/drag-source-wrapper';
import { ElementSchema } from '../../types';

export type ElementSourceProps = {
  data: ElementSchema;
};

const ElementSource: FC<ElementSourceProps> = ({ children, data }) => {
  return <DragSourceWrapper data={data}>{children}</DragSourceWrapper>;
};

export default ElementSource;
