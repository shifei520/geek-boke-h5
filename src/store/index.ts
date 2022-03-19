import { createStore, applyMiddleware } from 'redux'
import reducer from './reducer'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunk from 'redux-thunk'
import { getLocalHistories, getTokenInfo } from '@/utils/storage'
import { ThunkAction } from 'redux-thunk'

// 将所有模块的actionType引入
import { LoginAction } from './reducer/login'
import { HomeAction } from './reducer/home'
import { ProfileAction } from './reducer/profile'
import { SearchAction } from './reducer/search'
import { ArticleAction } from './reducer/article'

const store = createStore(
  reducer,
  {
    login: getTokenInfo(),
    search: {
      suggestionsList: [],
      searchResultList: {
        page: 0,
        list: []
      },
      historyList: getLocalHistories()
    }
  },
  composeWithDevTools(applyMiddleware(thunk))
)
export type RootState = ReturnType<typeof store.getState>

type RootAction =
  | LoginAction
  | HomeAction
  | ProfileAction
  | SearchAction
  | ArticleAction
export type RootThunkAction = ThunkAction<
  Promise<void>,
  RootState,
  unknown,
  RootAction
>

export default store
