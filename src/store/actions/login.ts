import request from '@/utils/request'
import { Dispatch } from 'redux'
import { setTokenInfo } from '@/utils/storage'
import { LoginAction } from '../reducer/login'

type Token = {
  token: string
  refresh_token: string
}

export const saveToken = (payload: Token): LoginAction => {
  return {
    type: 'login/add',
    payload
  }
}

export const sendCode = (mobile: string) => {
  return async () => {
    await request({
      url: `/sms/codes/${mobile}`,
      method: 'get'
    })
  }
}

type TLogin = {
  mobile: string
  code: string
}

export const login = (data: TLogin) => {
  return async (dispatch: Dispatch) => {
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
// export const logout = () => {
//   // return (dispatch: Dispatch) => {
//   //   dispatch(saveToken({ token: '', refresh_token: '' }))
//   //   removeTokenInfo()
//   // }
//   return {

//   }
// }
