/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

// 检查非特殊符号
export function checkNoSpecialCode(val) {
  return /^[\w\u4e00-\u9fa5-]*$/.test(val)
}

// 检查长度
export function checkLength(val, leng) {
  return val && val.length === leng
}

// 检查中文
export function checkChineseName(chineseName) {
  var reg = /^[\u4e00-\u9fa5]+$/
  return chineseName && reg.test(chineseName)
}

// 检查中文 可以为空
export function checkChineseNameMaybeNull(chineseName) {
  var reg = /^[\u4e00-\u9fa5]*$/
  return reg.test(chineseName)
}

// 检查中英文
export function checkName(name) {
  var reg = /^[\u4e00-\u9fa5a-zA-Z()]+$/
  return name && reg.test(name)
}

// 检查数字和字母
export function checkNumAndLetter(numAndletter) {
  var reg = /^[a-zA-Z0-9]*$/
  return reg.test(numAndletter)
}
// 检查IP地址
export function _checkHost(host) {
  var reg = /^[0-9a-zA-Z.]{1,20}$/
  return reg.test(host)
}

// 检查数字
export function _checkNum(num) {
  var reg = /^(\d{1,10})*$/
  return reg.test(num)
}
// 只能输入整数或小数的正则表达式
export function checkNumAndDecimal(num) {
  var reg = /^[0-9]+([.]{1}[0-9]+){0,1}$/
  return reg.test(num)
}
// 检查身份证号
export function checkIdcard(Idcard) {
  var reg = /^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X|x)$/
  return Idcard && reg.test(Idcard)
}

// 检查身份证号 可以为空
export function checkIdcardMaybeNull(Idcard) {
  var reg = /^((\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X|x))*$/
  return reg.test(Idcard)
}

// 检查手机号码
export function checkTel(tel) {
  var reg = /^[1][0-9]{10}$/
  return tel && reg.test(tel)
}

// 检查手机号码 可以为空
export function checkTelMaybeNull(tel) {
  var reg = /^([1][0-9]{10})*$/
  return reg.test(tel)
}

// 检查银行卡号
export function checkBankCard(bankcard) {
  var reg = /^(\d{1,30})$/
  return bankcard && reg.test(bankcard)
}

// 检查邮箱
export function checkEmail(email) {
  var reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-]{2,4})+/
  return email && reg.test(email)
}

// 检查邮箱 可以为空
export function checkEmailMaybeNull(email) {
  var reg = /^(([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-]{2,4})+)*$/
  return reg.test(email)
}

// 检查第一位非0数字
export function positiveInteger(verifyCode) {
  var reg = /^[1-9]+[0-9]*$/
  return verifyCode && reg.test(verifyCode)
}

// 检查小数
export function decimal(verifyCode) {
  var reg = /^(([1-9]\d*\.?\d*)|(\d*\.\d+))$/
  return verifyCode && reg.test(verifyCode)
}

// 检查小数 只能是两位小数
export function decimalRate(verifyCode) {
  var reg = /^[0-9]+\.\d{2}$|^[1-9]\d*$/
  return verifyCode && reg.test(verifyCode)
}

// 检查英文数字
export function EnglshDagital(verifyCode) {
  var reg = /^[a-zA-Z0-9]+$/
  return verifyCode && reg.test(verifyCode)
}

// 检查是否是正常版本
export function checkVersion(version) {
  var reg = /^[0-9]{1,2}\.[0-9]{1,2}\.[0-9]{1,2}$/ // 版本的正则表达式;
  return version && reg.test(version)
}

/**
 * @param {String} str
 * @returns {Boolean}
 * 校验是否包含事件流程提交过程中不能识别的特殊字符
 */
export function validCommitStr(str) {
  const pattern = new RegExp('[`~#$^&|{}\[\\]<>/~#&*]')
  return pattern.test(str)
}
