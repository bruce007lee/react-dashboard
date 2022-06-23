import { useState } from 'react';

export { useRenderContext } from '../core/render-context';
export { useElementController } from '../core/element-controller';

export const useForceUpdate = () => {
  const [ticket, setTicket] = useState<any>();
  return () => {
    setTicket(Math.random());
  };
};
