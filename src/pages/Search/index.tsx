import Icon from '@/components/Icon'
import NavBar from '@/components/NavBar'
import classnames from 'classnames'
import { useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Dialog, Toast } from 'antd-mobile'
import { useHistory } from 'react-router-dom'
import styles from './index.module.scss'
import debounce from 'lodash/debounce'
import {
  getSuggestList,
  clearSuggestList,
  saveHistory,
  clearHistory
} from '@/store/actions/search'
import { RootState } from '@/store'

const Search = () => {
  const dispatch = useDispatch()
  const history = useHistory()
  // 搜索框
  const [keyword, setKeyword] = useState<string>('')
  // 控制搜索历史与搜索结果显示隐藏状态
  const [isSearching, setIsSearching] = useState<boolean>(false)
  // 发送请求的防抖函数
  const fnRef = useRef(
    debounce(function (text) {
      // 如果搜索关键字为空字符串，则不搜索，显示历史记录
      if (text) {
        setIsSearching(true)
        dispatch(getSuggestList(text))
      } else {
        setIsSearching(false)
      }
    }, 500)
  ).current
  const onKeywordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value.trim()
    setKeyword(text)
    fnRef(text)
  }
  // 渲染搜索推荐列表
  const { suggestionsList, historyList } = useSelector((state: RootState) => {
    return state.search
  })
  // 关键词高亮显示
  const highlight = (str: string, keyword: string): string => {
    return str.replace(new RegExp(keyword, 'gi'), function (match) {
      return `<span>${match}</span>`
    })
  }
  // 搜索框右侧的清空功能
  const onClearKeywords = () => {
    setKeyword('')
    setIsSearching(false)
    dispatch(clearSuggestList())
  }

  // 搜索框右侧的搜索功能
  const onSearch = (words: string) => {
    if (!words) return
    dispatch(saveHistory(words))
    history.push(`/search/result?key=${words}`)
  }

  // 清除全部历史记录
  const onClearAllHistory = () => {
    Dialog.confirm({
      content: '是否清除历史记录',
      onConfirm: async () => {
        await dispatch(clearHistory())
        Toast.show({
          icon: 'success',
          content: '清除成功',
          position: 'bottom'
        })
      }
    })
  }
  return (
    <div className={styles.root}>
      {/* 顶部导航栏 */}
      <NavBar
        className="navbar"
        extra={
          <span className="search-text" onClick={() => onSearch(keyword)}>
            搜索
          </span>
        }
      >
        <div className="navbar-search">
          <Icon type="iconbtn_search" className="icon-search" />

          <div className="input-wrapper">
            {/* 输入框 */}
            <input
              type="text"
              placeholder="请输入关键字搜索"
              value={keyword}
              onChange={onKeywordChange}
            />

            {/* 清空输入框按钮 */}
            <Icon
              type="iconbtn_tag_close"
              className="icon-close"
              onClick={onClearKeywords}
            />
          </div>
        </div>
      </NavBar>

      {/* 搜索历史 */}
      <div
        className="history"
        style={{ display: isSearching ? 'none' : 'block' }}
      >
        <div className="history-header">
          <span>搜索历史</span>
          <span onClick={onClearAllHistory}>
            <Icon type="iconbtn_del" />
            清除全部
          </span>
        </div>

        <div className="history-list">
          {historyList.map((item) => (
            <span
              className="history-item"
              key={item}
              onClick={() => onSearch(item)}
            >
              {item}
              <span className="divider"></span>
            </span>
          ))}
        </div>
      </div>

      {/* 搜素建议结果列表 */}
      <div
        className={classnames('search-result', {
          show: isSearching
        })}
      >
        {suggestionsList.map((item, index) => (
          <div
            className="result-item"
            key={index}
            onClick={() => onSearch(item)}
          >
            <Icon className="icon-search" type="iconbtn_search" />
            <div
              className="result-value"
              dangerouslySetInnerHTML={{
                __html: highlight(item, keyword)
              }}
            ></div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Search
