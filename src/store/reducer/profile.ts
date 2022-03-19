// import { SAVE_USER, SAVE_PROFILE } from '../action_types/profile'
export type User = {
  id: string
  name: string
  photo: string
  art_count: number
  follow_count: number
  fans_count: number
  like_count: number
}
export type Profile = {
  id: string
  name: string
  photo: string
  mobile: string
  gender: number
  birthday: string
  intro?: string
}
type InitValue = {
  user: User
  profile: Profile
}
const initValue: InitValue = {
  user: {},
  profile: {}
} as InitValue

export type ProfileAction =
  | {
      type: 'profile/saveUser'
      payload: User
    }
  | {
      type: 'profile/saveProfile'
      payload: Profile
    }

export default function profile(state = initValue, action: ProfileAction) {
  // const { type, payload } = action
  if (action.type === 'profile/saveUser') {
    return {
      ...state,
      user: action.payload
    }
  }
  if (action.type === 'profile/saveProfile') {
    return {
      ...state,
      profile: action.payload
    }
  }
  return state
}
