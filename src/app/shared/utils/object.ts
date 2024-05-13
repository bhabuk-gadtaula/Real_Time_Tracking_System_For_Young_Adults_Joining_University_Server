import { AnyObj } from '../types';
import { SOFT_DELETION_FIELD } from '../constants';
import { isEmpty as isEmptyLodash, isEqual, isUndefined } from 'lodash';

/**
 * Get the copy of object with only specified attributes.
 *
 * @param {any} obj
 * @param {any[]} attrs
 * @returns {T}
 */
export function withOnlyAttrs<T>(obj: any, attrs: any[]): T {
  const result: any = {};

  Object.keys(obj).forEach(key => {
    if (attrs.includes(key)) {
      result[key] = obj[key];
    }
  });

  return result;
}

/**
 * Get the copy of object without attributes.
 *
 * @param {any} obj
 * @param {any[]} attrsToExclude
 * @returns {T}
 */
export function withoutAttrs<T>(obj: any, attrsToExclude: any[]): T {
  if (Array.isArray(obj)) {
    // It is recommended to use listWithoutAttrs() function instead for arrays.
    throw new TypeError('withoutAttrs() expects first argument to be a plain object, array given.');
  }

  const result: any = {};

  Object.keys(obj).forEach((key: string) => {
    if (!attrsToExclude.includes(key)) {
      result[key] = obj[key];
    }
  });

  return result;
}

/**
 * Get the copy of list of objects without attributes.
 *
 * @param {object[]} obj
 * @param {any[]} attrsToExclude
 * @returns {T[]}
 */
export function listWithoutAttrs<T>(obj: object[], attrsToExclude: any[]): T[] {
  return obj.map(item => withoutAttrs<T>(item, attrsToExclude));
}

export function isJsonString(str: string) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }

  return true;
}

export function flattenObject(obj: Record<string, any>, prefix = ''): Record<string, any> {
  const flatObj: Record<string, any> = {};

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const prefixedKey = prefix ? `${prefix}.${key}` : key;

      if (typeof obj[key] === 'object' && !Array.isArray(obj[key]) && obj[key] !== null) {
        const nestedObj = flattenObject(obj[key], prefixedKey);
        Object.assign(flatObj, nestedObj);
      } else {
        flatObj[prefixedKey] = obj[key];
      }
    }
  }

  return flatObj;
}

export function withoutEmptyValues<T>(obj: AnyObj): T {
  const result: AnyObj = {};
  for (const key in obj) {
    if (!isEmpty(obj[key])) {
      result[key] = obj[key];
    }
  }

  return result as T;
}

export function isDefined(value: any) {
  return !isUndefined(value);
}

export function isEmpty(value: any) {
  return isEmptyLodash(value);
}

/**
 *
 * @param object
 * @param attributes
 * @returns
 */
export function deleteProperty<T, Key extends keyof T>(object: T, attributes: Key[]) {
  for (const key in object) {
    if (Object.prototype.hasOwnProperty.call(object, key) && attributes.includes(key as unknown as Key)) {
      delete object[key];
    }
  }

  return object;
}

export function instanceOfT<T>(object: any, attribute: keyof T): object is T {
  if (!object) return false;

  return attribute in object;
}

/**
 * Finds the different valued fields and collects them into array of strings
 * @param obj1 object | {a:5, b:'hello', c: true}
 * @param obj2 object | {a:5, b:'hell', c: false}
 * @param ignoreFields string[] | ['c']
 * @returns array of keys | ['b']
 */
export function findDissimilarFields(obj1: AnyObj, obj2: AnyObj, ignoreFields: string[] = []) {
  ignoreFields = [...ignoreFields, 'updated', SOFT_DELETION_FIELD];

  const obj1Keys = Object.keys(obj1);
  const obj2Keys = Object.keys(obj2);

  const objKeys = obj1Keys.length >= obj2Keys.length ? obj1Keys : obj2Keys;

  return objKeys.reduce<string[]>((diff, key) => {
    if (ignoreFields.includes(key)) return diff;
    if (obj1[key] && obj2[key] && !isEqual(obj1[key], obj2[key])) diff.push(key);

    return diff;
  }, []);
}
