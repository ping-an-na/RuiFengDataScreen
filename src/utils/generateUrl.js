/**
 * @Description:
 * @Author: qiyongguo
 * @Date: 2022-02-24
 */
import { getToken } from './auth'

export function generateUrl(url) {
  if (url) {
    if (url.indexOf('?') > -1) {
      return url + `&token=${getToken()}&timer=${Date.now()}`
    } else {
      return url + `?token=${getToken()}&timer=${Date.now()}`
    }
  }
  return ''
}

export const findResOrigin = (origins, resOrigin) => {
  return origins.find(or => or === resOrigin)
}
