import styles from './index.module.scss'
import ArticleItem from '../ArticleItem'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getArticleList } from '@/store/actions/home'
import { PullToRefresh, Toast, InfiniteScroll } from 'antd-mobile'
import { RootState } from '@/store'

/**
 * 文章列表组件
 * @param {String} props.channelId 当前文章列表所对应的频道ID
 * @param {String} props.aid 当前 Tab 栏选中的频道ID
 */
type Props = {
  channelId: number
  activeId: number
}
const ArticleList = ({ channelId, activeId }: Props) => {
  const dispatch = useDispatch()
  const current = useSelector(
    (state: RootState) => state.home.articles[channelId]
  )
  useEffect(() => {
    // 如果有数据，重新进入该频道时就不发送请求
    if (current) return
    if (channelId === activeId) {
      dispatch(getArticleList(channelId, Date.now() + ''))
    }
  }, [channelId, activeId, dispatch, current])

  // 下拉刷新
  const onRefresh = async () => {
    setHasmore(true)
    await dispatch(getArticleList(channelId, Date.now() + ''))
    Toast.show('刷新成功')
  }

  // 上拉加载更多
  const [hasMore, setHasmore] = useState(true)
  const [loading, setLoading] = useState(false)
  const loadMore = async () => {
    if (loading) return
    if (channelId !== activeId) return
    setLoading(true)
    try {
      // 如果有timestamp表示还有数据，值为null则没有更多数据了
      if (current.timestamp) {
        await dispatch(getArticleList(channelId, current.timestamp, true))
      } else {
        setHasmore(false)
      }
    } finally {
      setLoading(false)
    }
  }

  if (!current) return null
  return (
    <div className={styles.root}>
      <div className="articles">
        <PullToRefresh onRefresh={onRefresh}>
          {current.list.map((item) => {
            return (
              <div className="article-item" key={item.art_id}>
                <ArticleItem
                  article={item}
                  curChannelId={channelId}
                ></ArticleItem>
              </div>
            )
          })}
        </PullToRefresh>
        <InfiniteScroll loadMore={loadMore} hasMore={hasMore}></InfiniteScroll>
      </div>
    </div>
  )
}

export default ArticleList
