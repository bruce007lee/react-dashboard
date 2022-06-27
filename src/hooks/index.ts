import { useState } from 'react';

export { useRenderContext } from '../core/render-context';
export { useElementController } from '../core/element-controller';
export { useElementsProviderContext } from '../core/elements-provider';

export const useForceUpdate = () => {
  const [ticket, setTicket] = useState<any>();
  return () => {
    setTicket(Math.random());
  };
};
