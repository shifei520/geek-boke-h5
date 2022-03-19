import NavBar from '@/components/NavBar'
import { useLocation } from 'react-router-dom'
import { useState } from 'react'
import styles from './index.module.scss'
import { useDispatch, useSelector } from 'react-redux'
import { getSearchResult } from '@/store/actions/search'
import { RootState } from '@/store'
import { InfiniteScroll } from 'antd-mobile'
import ArticleItem from '@/pages/Home/components/ArticleItem'

const SearchResult = () => {
  const dispatch = useDispatch()
  // 获取地址栏关键字
  const location = useLocation()
  const search = new URLSearchParams(location.search)
  const key = search.get('key')!
  // useEffect(() => {
  //   dispatch(getSearchResult(key, 1))
  // }, [dispatch, key])

  // 获取搜索结果列表
  const { list: resultList, page } = useSelector(
    (state: RootState) => state.search.searchResultList
  )

  // 上啦加载状态和函数
  const [hasMore, setHasMore] = useState<boolean>(true)
  // 是否处于加载状态
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const loadMore = async () => {
    if (isLoading) return
    setIsLoading(true)
    await dispatch(getSearchResult(key, page + 1))
    setIsLoading(false)
    if (page > 5) {
      setHasMore(false)
    }
  }
  return (
    <div className={styles.root}>
      {/* 顶部导航栏 */}
      <NavBar>搜索结果</NavBar>

      <div className="article-list">
        {resultList.map((item) => (
          <ArticleItem
            key={item.art_id}
            article={item}
            curChannelId={-1}
          ></ArticleItem>
        ))}
        <InfiniteScroll loadMore={loadMore} hasMore={hasMore} />
      </div>
    </div>
  )
}

export default SearchResult
