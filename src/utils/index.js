import Vue from 'vue'
import { formatTime, parseTime, setDefaultTimeRange } from './helper/time'
import { getUrlSearch, param2Obj } from './helper/url'
import { deepClone, easyClone, debounce, throttle } from './helper/tool'
import axios from 'axios'

const bus = new Vue()
/**
 * @param {}
 * @returns uuid
 * 创建 uuid
 */
const createUUID = () => {
  const s = []
  const hexDigits = '0123456789abcdef'
  for (let i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
  }
  s[14] = '4' // bits 12-15 of the time_hi_and_version field to 0010
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1) // bits 6-7 of the clock_seq_hi_and_reserved to 01
  s[8] = s[13] = s[18] = s[23] = '-'

  return s.join('')
}

const ceilNum = (num, byte) => {
  const n = Math.pow(10, byte || 2)
  return Math.ceil(num * n) / n
}
/*
 * @param
 * @returns {Object}
 * 判断浏览器环境是什么系统
 */
function getPosType() {
  const agent = navigator.userAgent.toLowerCase()
  const isMac = /macintosh|mac os x/i.test(agent)
  if (agent.indexOf('win32') >= 0 || agent.indexOf('wow32') >= 0) {
    return 'win32'
  }
  if (agent.indexOf('win64') >= 0 || agent.indexOf('wow64') >= 0) {
    return 'win64'
  }
  if (isMac) {
    return 'mac'
  }
}
export function keepDecimals(val, places, type) {
  let num = val + ''
  const numStart = num.split('.')[0]
  const numEnd = num.split('.')[1]
  const powVal = Math.pow(10, places)
  if (numEnd) {
    num = Math.round(num * powVal) / powVal + ''
    if (num.split('.')[1] && num.split('.')[1].length < places) {
      for (let n = 0; n < places - num.split('.')[1].length; n++) {
        num += '0'
      }
    }
  } else {
    num = numStart + '.'
    for (let n = 0; n < places; n++) {
      num += '0'
    }
  }
  return type === 1 ? num * 1 : num + ''
}

function per_arry(arry) {
  var lenders_age_arry = arry
  var lenders_tol = 0

  var gt_zero = 0 // 判断几个值大于0
  var res_arry = [] // 最终结果

  var last_gt_index = 0 // 存放最后一个大于0的值所在的索引
  var befor_num_sum = 0 // 除最后一个，将之前大于0的百分值相加
  lenders_age_arry.forEach((value, index) => {
    if (value > 0) {
      gt_zero++
      last_gt_index = index
      lenders_tol = lenders_tol + parseFloat(value)
    }
  })

  if (gt_zero === 0 || gt_zero === 1) { // 全值都是0 或者 只有一个值时
    res_arry = lenders_age_arry
  }

  if (gt_zero > 1) {
    lenders_age_arry.forEach((value, index) => {
      if (value > 0) {
        if (last_gt_index === index) {
          res_arry.push((Math.round((100 - befor_num_sum) * 100)) / 100)
        } else {
          res_arry.push(Math.round(parseFloat((value / lenders_tol) * 10000)) / 100)
          befor_num_sum = befor_num_sum + (Math.round(parseFloat((value / lenders_tol) * 10000)) / 100)
        }
      } else {
        res_arry.push(0)
      }
    })
  }

  return res_arry
}

/**
 * 转换成二维数组
 * @param list
 * @param len 一维数组个数
 * @returns {*[]}
 */
const getTwoDimensionArr = (list = [], len = 2) => {
  const tempList = [[]]
  for (let index = 0; index < list.length; index++) {
    const i = Math.floor(index / len)
    const j = index % len
    if (!tempList[i]) tempList[i] = []
    tempList[i][j] = { ...list[index] }
  }
  return tempList
}

/**
 * @param {Array, String} tree,
 * @returns []
 * 把树形结构的空 children 给删除
 */
export function removeEmptyChildren(tree) {
  const revfn = (subTree) => {
    for (let i = 0; i < subTree.length; i++) {
      const node = subTree[i]
      if (node.children && node.children.length) { // 有子节点，且长度不为空
        revfn(node.children)
      } else {
        delete node.children
      }
    }
  }
  revfn(tree)
  return tree
}

/**
 * @param Arraya, Arrayb(扁平的对象，不进行递归), idkey(两个数组比较的key), rec
 * @returns Array
 * 从数组 a 中排除 b 的元素，取差集，支持递归
 */
export function ArrayMinusB(arrA, arrB, idkey, rec) {
  if (!arrA.length) return []
  let result = []
  const revfn = (subArrA, arrB, idkey, rec) => {
    for (let i = 0, length = subArrA.length; i < length; i++) {
      const item = subArrA[i]
      // 如果 item 在arrB 存在，则从arrA 中剔除
      if (arrB.some(b => b[idkey] === item[idkey])) {
        subArrA.splice(i, 1)
      } else {
        if (Array.isArray(item.children) && item.children.length) {
          revfn(item.children, arrB, idkey, rec)
        }
      }
      result = subArrA
    }
  }
  if (rec) {
    revfn(arrA, arrB, idkey, rec)
  } else {
    result = arrA.filter(s => !arrB.some(b => b[idkey] === s[idkey]))
  }
  return result
}

/**
 * @param arr<Array>
 * @param key<String> 对象唯一值
 * @param subkey<Array> 其他参照值, 最多三级
 * @returns 去重后的数组
 * 数组对象去重
 */
export function singleArray(arr, key, subkey) {
  if (!key) {
    key = 'id'
  }
  const map = new Map()
  for (const item of arr) {
    if (subkey.length) {
      let _key = ''
      switch (subkey.length) {
        case 1:
          _key = item[subkey[0]]
          break
        case 2:
          _key = item[subkey[0]][subkey[1]]
          break
        case 3:
          _key = item[subkey[0]][subkey[1]][subkey[2]]
          break

        default:
          break
      }
      map.set(item[key] + _key, item)
    } else {
      map.set(item[key], item)
    }
  }
  return [...map.values()]
}

const number2text = (number, type = 'lower') => {
  // 配置
  const confs = {
    lower: {
      num: ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'],
      unit: ['', '十', '百', '千', '万'],
      level: ['', '万', '亿']
    },
    upper: {
      num: ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'],
      unit: ['', '拾', '佰', '仟'],
      level: ['', '万', '亿']
    },

    maxNumber: 999999999999.99
  }

  // 过滤不合法参数
  if (Number(number) > confs.maxNumber) {
    console.error(
      `The maxNumber is ${confs.maxNumber}. ${number} is bigger than it!`
    )
    return false
  }

  const conf = confs[type]
  const numbers = String(Number(number).toFixed(2)).split('.')
  const integer = numbers[0].split('')

  // 四位分级
  const levels = integer.reverse().reduce((pre, item, idx) => {
    const level = pre[0] && pre[0].length < 4 ? pre[0] : []
    const value =
      item === '0' ? conf.num[item] : conf.num[item] + conf.unit[idx % 4]
    level.unshift(value)

    if (level.length === 1) {
      pre.unshift(level)
    } else {
      pre[0] = level
    }

    return pre
  }, [])

  // 整数部分
  const _integer = levels.reduce((pre, item, idx) => {
    let _level = conf.level[levels.length - idx - 1]
    let _item = item.join('').replace(/(零)\1+/g, '$1') // 连续多个零字的部分设置为单个零字
    // 如果这一级只有一个零字，则去掉这级
    if (_item === '零') {
      _item = ''
      _level = ''

      // 否则如果末尾为零字，则去掉这个零字
    } else if (_item[_item.length - 1] === '零') {
      _item = _item.slice(0, _item.length - 1)
    }
    // 去除多余的一
    if ((_item.length === 2 || _item.length === 3) && _item[0] === '一') {
      _item = _item.slice(1, _item.length)
    }

    return pre + _item + _level
  }, '')

  return `${_integer}`
}

/**
 * 下载文件  不支持跨域
 * **/
export const downloadOssFile = (url) => {
  const splitArr = url.split('/')
  axios({
    method: 'get',
    responseType: 'blob',
    url: url
  }).then(({ data }) => {
    const blob = new Blob([data])
    var a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = splitArr[splitArr.length - 1] // 设置文件名
    a.style.display = 'none'
    document.body.appendChild(a)
    a.click()
    a.remove()
  })
}

export const getBeforeMonth = (n) => {
  const yearCount = Math.floor(n / 12)
  const modMonth = n % 12
  const nowdays = new Date()
  let year = nowdays.getFullYear()
  year = year - yearCount
  const month = nowdays.getMonth() + 1
  let _month = month - modMonth
  if (_month <= 0) {
    _month = 12 + _month
    year = year - 1
  }

  if (_month < 10) {
    _month = '0' + _month
  }

  const startTime = year + '-' + _month + '-' + '01'

  const myDate = new Date(year, _month, 0)

  const endTime = year + '-' + _month + '-' + myDate.getDate()
  return { startTime, endTime }
}

export {
  bus,
  formatTime,
  parseTime,
  getUrlSearch,
  param2Obj,
  deepClone,
  easyClone,
  debounce,
  throttle,
  createUUID,
  ceilNum,
  setDefaultTimeRange,
  getPosType,
  per_arry,
  getTwoDimensionArr,
  number2text
}
