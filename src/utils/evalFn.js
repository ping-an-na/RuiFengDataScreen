/**
 * @Description:
 * @Author: qiyongguo
 * @Date: 2022-02-23
 */
export const evalFn = fn => {
  var Fun = Function // 一个变量指向Function，防止有些前端编译工具报错
  return new Fun('return ' + fn)()
}
