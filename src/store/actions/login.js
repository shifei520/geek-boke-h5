import request from '@/utils/request.js'
import { setTokenInfo, removeTokenInfo } from '@/utils/storage'

export const saveToken = (payload) => {
  return {
    type: 'login/add',
    payload
  }
}

export const sendCode = (mobile) => {
  return async () => {
    await request({
      url: `/sms/codes/${mobile}`,
      method: 'get'
    })
  }
}

export const login = (data) => {
  return async (dispatch) => {
    const res = await request({
      url: '/authorizations',
      method: 'post',
      data
    })
    dispatch(saveToken(res.data))
    setTokenInfo(res.data)
  }
}
/**
 * 退出登录
 * @returns
 */
export const logout = () => {
  return async (dispatch) => {
    dispatch(saveToken({}))
    removeTokenInfo()
  }
}
