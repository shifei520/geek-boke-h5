import { Article } from './home'

type SearchInitValue = {
  suggestionsList: string[]
  historyList: string[]
  searchResultList: {
    page: number
    list: Article[]
  }
}
const initValue: SearchInitValue = {
  suggestionsList: [],
  historyList: [],
  searchResultList: {
    page: 0,
    list: []
  }
}

export type SearchAction =
  | {
      type: 'search/saveSuggestionsList'
      payload: string[]
    }
  | {
      type: 'search/clearSuggestionsList'
    }
  | {
      type: 'search/saveHistoryList'
      payload: string[]
    }
  | {
      type: 'search/clearHistoryList'
    }
  | {
      type: 'search/saveResultList'
      payload: {
        page: number
        list: Article[]
      }
    }
export default function reducer(state = initValue, action: SearchAction) {
  switch (action.type) {
    case 'search/saveSuggestionsList':
      return {
        ...state,
        suggestionsList: action.payload
      }
    case 'search/clearSuggestionsList':
      return {
        ...state,
        suggestionsList: []
      }
    case 'search/saveHistoryList':
      return {
        ...state,
        historyList: action.payload
      }
    case 'search/clearHistoryList':
      return {
        ...state,
        historyList: []
      }
    case 'search/saveResultList':
      return {
        ...state,
        searchResultList: {
          page: action.payload.page,
          list: [...state.searchResultList.list, ...action.payload.list]
        }
      }
    default:
      return state
  }
}
