/* eslint-disable new-cap */
/**
 * @Description: 融合通信工具
 * @Author: qiyongguo
 * @Date: 2022-04-18
 */
import { Message } from 'cestc-ioc-ui'
// 服务地址和ws服务地址
const configServer = window.GLOBAL_CONFIG.rzt.server
const configWSServer = window.GLOBAL_CONFIG.rzt.wsServer
const configSipserver = window.GLOBAL_CONFIG.rzt.sipServer

const RZTTool = {
  websdk: null,
  _cb: null,
  // 登录
  login(loginName, loginPwd, cb, server = configServer, wsServer = configWSServer, sipServer = configSipserver) {
    if (loginName && loginPwd) {
      this.websdk = new WEBSDK.websdk(loginName, loginPwd, server, wsServer, sipServer)
      this._cb = cb
      this.listenWs()
      this.listenTongxin()
    } else {
      Message({
        message: '融合通信模块：用户名或密码不全',
        type: 'info',
        duration: 3 * 1000
      })
    }
  },
  // 退出ws监听
  quit() {
    this.websdk && this.websdk.event.ws.websocket.close()
    this._cb = null
    this.websdk = null
  },
  // ws的监听
  listenWs() {
    // Websocket 回调
    // this.websdk.event.ws.onLogin = (o) => {
    //   console.log('onLogin', o)
    // }
    this.websdk.event.ws.onMessage = function(o) {
      // console.log(o)
    }
    // 接收 IM 消息
    this.websdk.event.ws.onIm = (o) => {
      console.log('接收 IM 消息', o)
    }
    // ws关闭监听
    this.websdk.event.ws.onClose = (o) => {
      console.log('onClose', o)
      this._cb && this._cb('onClose')
    }
    // websocket 登录失败返回或者返回错误消息
    this.websdk.event.ws.onMsgError = (o) => {
      // 只toast登录失败信息
      console.log('融合通信模块', o)
      if (o.data.res_code === 'b0003') {
        Message({
          message: '融合通信模块:' + o.data.res_msg,
          type: 'error',
          duration: 3 * 1000
        })
        this._cb && this._cb('accountFail')
        return
      }
      if (o.data.res_code === 'b0001') {
        Message({
          message: '融合通信模块:' + o.data.res_msg,
          type: 'error',
          duration: 3 * 1000
        })
        this._cb && this._cb('accountFail')
        return
      // eslint-disable-next-line eqeqeq
      } else if (o.data.res_code != 0) {
        Message({
          message: '融合通信模块:' + o.data.res_msg,
          type: 'error',
          duration: 3 * 1000
        })
      }
    }
  },
  // 通信过程监听
  listenTongxin() {
    this.websdk.event.rtcsdk.eventHandler = (event, data) => {
      console.log('通信过程监听', event)
      console.log('通信用户的数据', data)
      // eslint-disable-next-line no-unused-vars
      const { remoteUser, remoteUserId, callType, statusCode } = data
      const { originator, cause } = data
      const { type, reason } = data
      let failStr = ''
      switch (event) {
        case 'registered':
          this._cb && this._cb('registered', data)
          // 注册成功处理
          console.log('登录注册成功')
          break
        case 'incomingCall':
          console.log('您有一个来自' + remoteUser + '的' + (callType === 'video' ? '视频' : '语音') + '通话，请接听！')
          break
        case 'remoteRingRing':
          console.log((callType === 'video' ? '视频' : '语音') + '呼叫' + remoteUser + '中，对方' + statusCode + '正在振铃。。。')
          break
        case 'remoteAnswerCall':
          console.log(remoteUser + '已接通与您的' + (callType === 'video' ? '视频' : '语音') + '通话。')
          this._cb && this._cb('remoteAnswerCall', data)
          break
        case 'remoteHangupCall':
          console.log(remoteUser + '已挂断与您的' + (callType === 'video' ? '视频' : '语音') + '通话。')
          this._cb && this._cb('remoteHangupCall', data)
          break
        case 'localAnswerCall':
          console.log('您已接通与' + remoteUser + '的' + (callType === 'video' ? '视频' : '语音') + '通话。')
          break
        case 'localHangupCall':
          console.log('您已挂断与' + remoteUser + '的' + (callType === 'video' ? '视频' : '语音') + '通话。')
          break
        case 'callEstablishFailed':
          if (cause !== 'Canceled') {
            Message({
              message: '呼叫建立失败，失败方为：' + originator + '，失败原因为：' + cause + '。',
              type: 'error',
              duration: 3 * 1000
            })
          }
          this._cb && this._cb('callEstablishFailed', data)
          break
        case 'missCall':
          console.log('您有一个来自' + remoteUser + '的' + (callType === 'video' ? '视频' : '语音') + '通话，由于线路繁忙已被挂断。')
          break
        case 'failed':
          failStr = '有错误发生，错误类型：' + type + '，错误原因：' + reason + '。'
          if (type === 'accountError') {
            failStr += '账号的用户名或密码错误，请联系管理员！'
          } else if (type === 'connectionError') {
            failStr += '连接服务器错误，请联系管理员！'
          }
          console.log(failStr)
          break
        case 'secondCall':
          console.log('您有一个来自' + remoteUser + '的' + (callType === 'video' ? '视频' : '语音') + '通话，请接听！（第二路）')
          break
        case 'remoteSecondCallHangup':
          console.log(remoteUser + '已挂断与您的' + (callType === 'video' ? '视频' : '语音') + '通话。（第二路）')
          break
        case 'localSecondCallHangup':
          console.log('您已挂断与' + remoteUser + '的' + (callType === 'video' ? '视频' : '语音') + '通话。（第二路）')
          break
        case 'secondCallEstablishFailed':
          console.log('呼叫建立失败，失败方为：' + originator + '，失败原因为：' + cause + '。（第二路）')
          break
      }
    }
  },
  // 拨语音电话
  callAudio(tag, phoneNum) {
    console.log(this.websdk)
    this.websdk.sip.setParams({ remoteTag: tag })
    this.websdk.event.JsSip.callAudio(phoneNum, function(res) {
      console.log(`拨语音电话callAudio`, res)
    })
  },
  // 拨视频电话
  callVideo(remoteTag, localVideoTag, phoneNum) {
    console.log(this.websdk)
    this.websdk.sip.setParams({ remoteTag: remoteTag, localVideoTag: localVideoTag, frameRate: 30 })
    this.websdk.event.JsSip.callVideo(phoneNum, function(res) {
      console.log(`拨视频通话callVideo`, res)
    })
  },
  // 挂断 取消通信
  hangupCall() {
    this.websdk.event.JsSip.callSingleHangup(function(res) {
      console.log(`挂断`, res)
    })
  }
}

export default RZTTool
