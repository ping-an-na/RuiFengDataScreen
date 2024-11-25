/**
 * @Description:类型判断
 * @Author: zhangsen
 * @Date: 2020-12-10
 */

const judgment = {
  run: function(item) {
    return this.toString.call(item).replace(/(\[|object|(^\s+)|(\s+$)|\s+|])/g, '')
  }
}

export function isNumber(item) {
  return judgment.run(item) === 'Number'
}

export function isNull(item) {
  return judgment.run(item) === 'Null'
}

export function isUndefined(item) {
  return judgment.run(item) === 'Undefined'
}

export function isString(item) {
  return judgment.run(item) === 'String'
}

export function isBoolean(item) {
  return judgment.run(item) === 'Boolean'
}

export function isSymbol(item) {
  return judgment.run(item) === 'Symbol'
}

export function isObject(item) {
  return judgment.run(item) === 'Object'
}

export function isFunction(item) {
  return judgment.run(item) === 'Function'
}

export function isRegExp(item) {
  return judgment.run(item) === 'RegExp'
}

export function isDate(item) {
  return judgment.run(item) === 'Date'
}

export function isArray(item) {
  return judgment.run(item) === 'Array'
}
