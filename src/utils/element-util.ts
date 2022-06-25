import { Bounds, ElementSchema } from '../types';
import { set } from './misc';

export default {
  getBounds: (schema: ElementSchema): Bounds =>
    schema?.elementProps?.bounds || { x: 0, y: 0, width: 100, height: 100 },

  setBounds: (schema: ElementSchema, bounds: Bounds): void =>
    set(schema, 'elementProps.bounds', bounds),
};
