export type Token = {
  token: string
  refresh_token: string
}

const initValue: Token = {
  token: '',
  refresh_token: ''
}

export type LoginAction = {
  type: 'login/add'
  payload: Token
}

export default function login(state = initValue, action: LoginAction) {
  const { type, payload } = action
  if (type === 'login/add') {
    return payload
  }
  return state
}
