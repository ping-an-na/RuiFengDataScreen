import Cookies from 'js-cookie'

const TokenKey = 'abutmentToken'
const qs = require('qs')

export function getToken() {
    const url = window.location.href
    const params = qs.parse(url.split('?')[1])
    // console.log('params', params)
    return params.abutmentToken || localStorage.getItem(TokenKey)
    // return localStorage.getItem(TokenKey)?
}

export function setToken(token) {
    Cookies.set(TokenKey, token)
    localStorage.setItem(TokenKey, token)
}

export function removeToken() {
    Cookies.remove(TokenKey)
    localStorage.removeItem(TokenKey)
}
