import store from '../store'

const numberFormat = (value) => {
  if (!value || isNaN(value)) {
    return 0
  }
  return value >= 10000 ? parseFloat(value.toString()) / 10000 : value
}

const phoneEye = (val) => {
  if (!val) return '-'
  const eyeFlag = store.getters['grid/eyeOpen']
  if (!eyeFlag && val.indexOf('*') === -1) {
    try {
      const reg = /^(.{3}).*(.{4})$/
      return val.replace(reg, '$1****$2')
    } catch (e) {
      return val
    }
  } else {
    return val
  }
}

const cardEye = (val) => {
  if (!val) return '-'
  const eyeFlag = store.getters['grid/eyeOpen']
  if (!eyeFlag && val.indexOf('*') === -1) {
    try {
      const reg = /^(.{3}).*(.{2})$/
      return val.replace(reg, '$1*************$2')
    } catch (e) {
      return val
    }
  } else {
    return val
  }
}

const numDott = (val) => {
  if (val === undefined || val === null) {
    return '-'
  } else {
    const useNum = Number(val)
    return useNum.toLocaleString()
  }
}

export {
  numberFormat,
  phoneEye,
  cardEye,
  numDott
}
