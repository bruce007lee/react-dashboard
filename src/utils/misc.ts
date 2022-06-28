import _cloneDeep from 'lodash/cloneDeep';
import _set from 'lodash/set';
import _get from 'lodash/get';
import { prefix } from './variables';

export const sn = (styleName) => `${prefix}-${styleName}`;

/**
 * 生成随机id
 */
export const genId = () =>
  Math.floor((1 + Math.random()) * 0x10000000)
    .toString(16)
    .substring(1);

export const cloneDeep = _cloneDeep;
export const set = _set;
export const get = _get;

/**
 *  比较2个对象指定的key值是否相同
 * @param obj1
 * @param obj2
 * @param keys
 */
export const equals = (obj1: { [key: string]: any }, obj2: { [key: string]: any }, keys?: string[]) => {
  if (keys == null) {
    keys = Object.keys(obj1 || {});
  }
  return !keys.some((k) => obj1?.[k] !== obj2?.[k]);
};
