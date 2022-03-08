const initValue = {
  token: '',
  refresh_token: ''
}
export default function login(state = initValue, action) {
  const { type, payload } = action
  if (type === 'login/add') {
    return payload
  }
  return state
}
