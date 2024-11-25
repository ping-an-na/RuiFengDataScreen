import axios from 'axios'
import {Message} from 'cestc-ioc-ui'
import store from '@/store'
import {getToken} from '@/utils/auth'
import settings from '@/settings'

const service = axios.create({
    // baseURL: process.env.VUE_APP_BASE_API,
    // withCredentials: true, // send cookies when cross-domain requests
    timeout: 300000
})

const testToken =
    "Auth eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJCQUNLU1RBR0VfTUFOQUdFTUVOVF9ZWkdMWSIsInN5c1JvbGVMaXN0IjpbeyJkaXN0cmljdERpdmlzaW9uSWQiOjE3NDAyMDQ1MzEzODk4MjA5MzAsImNpdHkiOjE3NDAyMDQ1MzEzODk4MjA5MzAsImRlc2NyaXB0aW9uIjoiIiwidXBkYXRlQXQiOjE3MjQ3MjM2MjAxMTAsInNvcnQiOjAsImRlbEZsYWciOjAsImNyZWF0ZUF0IjoxNzE3NDY4NTQyODcwLCJwbGF0Zm9ybSI6IkJBQ0tTVEFHRV9NQU5BR0VNRU5UIiwiY3JlYXRlQnkiOjE3NzQ3MTg4MjIzOTgyOTYwNjYsInByb3ZpbmNlIjoxNzQwMjA0MzM4MTExOTc1NDI0LCJ1cGRhdGVCeSI6MTc3NDcxODgyMjM5ODI5NjA2Niwicm9sZUNvZGUiOiIyMDI0MDYwNFZoVDN2eSIsInJvbGVOYW1lIjoi5oms5bee566h55CG5ZGYIiwiaWQiOjE3OTc4MTk0ODk3NDQ2Nzg5MTR9XSwic3lzVXNlciI6eyJkaXN0cmljdERpdmlzaW9uSWQiOjE3NDAyMDQ1MzEzODk4MjA5MzAsImxhc3RMb2dpbiI6IjIwMjQtMTEtMjAgMTA6MzI6MDAiLCJzYWx0IjoiNlQydXlJN1giLCJjaXR5IjoiMTc0MDIwNDUzMTM4OTgyMDkzMCIsIm5pY2tOYW1lIjoi55So5oi3Xzk5ODIiLCJpcCI6IjU4LjIxMy4xOTkuNDkiLCJhdmF0YXIiOiIiLCJ1c2VySWRlbnRpdHkiOiIwIiwiZGVsRmxhZyI6MCwidXNlck5hbWUiOiJZWkdMWSIsImNyZWF0ZUF0IjoxNzE3NDY4NTY4ODUyLCJwbGF0Zm9ybSI6IkJBQ0tTVEFHRV9NQU5BR0VNRU5UIiwicmVhbE5hbWUiOiLmiazlt57nrqHnkIblkZgiLCJwYXNzd29yZCI6IjlmZDEyOTJlMGY1YTUzYTBjZjNhM2M5NTEyMTAxYTk1IiwicHJvdmluY2UiOiIxNzQwMjA0MzM4MTExOTc1NDI0IiwicGhvbmUiOiIxMzM5OTk4OTk4MiIsImlkIjoxNzk3ODE5NTk4NzIxMDg1NDQxLCJzdGF0dXMiOjF9LCJleHAiOjE3MzI2NzQ3MzAsImlhdCI6MTczMjA2OTkzMH0.8bFQLJ6qD6zPm3eKX8fOnmFy_4B_89VqXrHNFKyIhjxODRxwoCJUnw7bbbe04RQ2fIoduJp9u6CJS_LOlSgNXw"
service.interceptors.request.use(
    config => {
        // config.headers['Authorization'] = testToken
        config.headers['Authorization'] = window.sessionStorage.getItem("toktn")
        // config.headers['Authorization'] = getToken()

        return config
    },
    error => {
        return Promise.reject(error)
    }
)

service.interceptors.response.use(
    response => {
        const res = response.data
        if (settings.resSuccessCode.indexOf(res.code) === -1) {
            // https://dev.jsntjg.cn/
            if (res.code == '401001') {
                // return window.location.assign('https://dev.jsntjg.cn/');
                // return window.location.assign('https://grayscale.jsntjg.cn/');
                return window.location.assign('https://test.jsntjg.cn/'); //2024-08-27 加
            }
            if (res.code === 41) {
                return res
            }
            Message({
                message: res.message || res.msg || res.desc || '服务端错误',
                type: 'error',
                duration: 5 * 1000
            })
            if (res.code === settings.resTokenErrorCode || res.code === settings.resTokenErrorCode1) {
                store.dispatch('user/resetToken')
            }
            return Promise.reject(new Error(res.message || res.msg || res.desc || '服务端错误'))
        } else {
            return res
        }
    },
    error => {
        Message({
            message: error.message,
            type: 'error',
            duration: 5 * 1000
        })
        return Promise.reject(error)
    }
)
export default {
    // 通用方法
    post: (url, params, config = {}) => {
        return service.post(url, params, config).then(res => res)
    },
    postForm: (url, params) => {
        return service({
            url: `${url}?timer=${new Date().getTime()}`,
            data: params,
            method: 'post',
            transformRequest: [
                function (data) {
                    let ret = ''
                    // eslint-disable-next-line no-unused-vars
                    for (const it in data) {
                        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
                    }
                    return ret
                }
            ],
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(res => res)
    },
    get: (url, params) => {
        params = params || {}
        params['timer'] = new Date().getTime()
        return service
            .get(`${url}`, {
                params
            })
            .then(res => res)
    },

    put: (url, params) => {
        return service.put(`${url}`, params).then(res => res)
    },

    delete: (url, params) => {
        return service
            .delete(`${url}`, {
                params: params
            })
            .then(res => res)
    },

    patch: (url, params) => {
        return service.patch(`${url}`, params).then(res => res)
    }
}
