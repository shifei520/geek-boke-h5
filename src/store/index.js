import { createStore, applyMiddleware } from 'redux'
import reducer from './reducer'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunk from 'redux-thunk'
import { getTokenInfo } from '@/utils/storage'

export default createStore(
  reducer,
  {
    login: getTokenInfo()
  },
  composeWithDevTools(applyMiddleware(thunk))
)
