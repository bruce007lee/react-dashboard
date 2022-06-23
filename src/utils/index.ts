import { prefix } from './variables';
import domUtil from './dom';

export const sn = (styleName) => `${prefix}-${styleName}`;

export const genId = () => Math.floor((1 + Math.random()) * 0x10000000)
  .toString(16)
  .substring(1);

export { domUtil };

const util = {
  /**
   *  比较2个对象指定的key值是否相同
   * @param obj1
   * @param obj2
   * @param keys
   */
  equals(
    obj1: { [key: string]: any },
    obj2: { [key: string]: any },
    keys?: string[]
  ) {
    if (keys == null) {
      keys = Object.keys(obj1 || {});
    }
    return !keys.some((k) => obj1?.[k] !== obj2?.[k]);
  },
};

export default util;
