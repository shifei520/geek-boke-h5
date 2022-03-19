import request from '@/utils/request'
// import { SAVE_USER, SAVE_PROFILE } from '../action_types/profile'
import { User, Profile, ProfileAction } from '../reducer/profile'
import { Dispatch } from 'redux'

export const saveUser = (payload: User): ProfileAction => {
  return {
    type: 'profile/saveUser',
    payload
  }
}

export const saveProfile = (payload: Profile): ProfileAction => {
  return {
    type: 'profile/saveProfile',
    payload
  }
}

/**
 * 获取用户基本信息
 * @returns
 */
export const getUserInfo = () => {
  return async (dispatch: Dispatch) => {
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
  return async (dispatch: Dispatch) => {
    const res = await request({
      url: '/user/profile'
    })
    dispatch(saveProfile(res.data))
  }
}

/**
 * 修改用户信息
 */
type PartialProfile = Partial<Profile>

export const updateProfile = (data: PartialProfile) => {
  return async (dispatch: any) => {
    await request({
      url: '/user/profile',
      method: 'patch',
      data
    })
    dispatch(getProfileInfo())
  }
}
// 修改用户头像
export const updatePhoto = (formData: FormData) => {
  return async (dispatch: any) => {
    await request({
      url: '/user/photo',
      method: 'patch',
      data: formData
    })
    dispatch(getProfileInfo())
  }
}
