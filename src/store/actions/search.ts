import request from '@/utils/request'
import { setLocalHistories, removeLocalHistories } from '@/utils/storage'
import { RootThunkAction } from '..'
import { SearchAction } from '../reducer/search'

export function saveSuggestList(payload: string[]): SearchAction {
  return {
    type: 'search/saveSuggestionsList',
    payload
  }
}
/**
 * 获取关键词搜素推荐列表
 * @param keyword
 * @returns
 */
export function getSuggestList(keyword: string): RootThunkAction {
  return async (dispatch) => {
    const res = await request({
      url: '/suggestion',
      method: 'get',
      params: {
        q: keyword
      }
    })
    let options = res.data.options
    if (!options[0]) options = []
    dispatch(saveSuggestList(options))
  }
}

/**
 * 清空suggestionsList数组
 */
export function clearSuggestList(): SearchAction {
  return {
    type: 'search/clearSuggestionsList'
  }
}

export function saveHistory(keywords: string): RootThunkAction {
  return async (dispatch, getState) => {
    let histories = getState().search.historyList
    histories = histories.filter((item) => item !== keywords)
    histories = [keywords, ...histories].slice(0, 10)
    dispatch({
      type: 'search/saveHistoryList',
      payload: histories
    })
    setLocalHistories(histories)
  }
}

export function clearHistory(): RootThunkAction {
  return async (dispatch) => {
    removeLocalHistories()
    dispatch({
      type: 'search/clearHistoryList'
    })
  }
}

/**
 * 获取文章搜索结果
 */
export function getSearchResult(key: string, page: number): RootThunkAction {
  return async (dispatch) => {
    const res = await request({
      url: '/search',
      method: 'get',
      params: {
        q: key,
        page,
        per_page: 10
      }
    })
    dispatch({
      type: 'search/saveResultList',
      payload: {
        page,
        list: res.data.results
      }
    })
  }
}
