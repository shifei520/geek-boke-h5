import { combineReducers } from 'redux'
import login from './login'
import profile from './profile'
import home from './home'
import search from './search'
import article from './article'

const reducer = combineReducers({
  login,
  profile,
  home,
  search,
  article
})

export default reducer
