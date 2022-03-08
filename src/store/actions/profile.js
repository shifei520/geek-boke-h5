import request from '@/utils/request.js'
import { SAVE_USER, SAVE_PROFILE } from '../action_types/profile'

export const saveUser = (payload) => {
  return {
    type: SAVE_USER,
    payload
  }
}

export const saveProfile = (payload) => {
  return {
    type: SAVE_PROFILE,
    payload
  }
}

/**
 * 获取用户基本信息
 * @returns
 */
export const getUserInfo = () => {
  return async (dispatch) => {
    const res = await request({
      url: '/user'
    })
    dispatch(saveUser(res.data))
  }
}

/**
 * 获取个人资料
 * @returns
 */
export const getProfileInfo = () => {
  return async (dispatch) => {
    const res = await request({
      url: '/user/profile'
    })
    dispatch(saveProfile(res.data))
  }
}

/**
 * 修改用户信息
 */
export const updateProfile = (data) => {
  return async (dispatch) => {
    await request({
      url: '/user/profile',
      method: 'patch',
      data
    })
    dispatch(getProfileInfo())
  }
}
// 修改用户头像
export const updatePhoto = (formData) => {
  return async (dispatch) => {
    await request({
      url: '/user/photo',
      method: 'patch',
      data: formData
    })
    dispatch(getProfileInfo())
  }
}
