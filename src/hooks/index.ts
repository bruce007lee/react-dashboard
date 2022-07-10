import { useState } from 'react';

export { useRenderContext, useElementController, useElementsProviderContext } from '../core/context-factory';

/**
 * 强制刷新当前fc组件，效果同HOC的forceUpdate
 */
export const useForceUpdate = () => {
  const [ticket, setTicket] = useState<any>();
  return () => {
    setTicket(Math.random());
  };
};
