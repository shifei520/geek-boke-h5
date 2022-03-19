import NavBar from '@/components/NavBar'
import NoComment from '../NoComment'
import styles from './index.module.scss'
import CommentItem from '../CommentItem'
import request from '@/utils/request'
import { CommentType } from '@/store/reducer/article'
import { useEffect, useState } from 'react'
import CommentFooter from '../CommentFooter'
import CommentRelease from '../CommentRelease'
import { InfiniteScroll, Popup } from 'antd-mobile'
import { useDispatch } from 'react-redux'
import { updateReplyCount } from '@/store/actions/article'

type Props = {
  onClose?: () => void
  originComment: CommentType
  articleId: string
}
const CommentReply = ({ onClose, originComment, articleId }: Props) => {
  const dispatch = useDispatch()
  // 回复列表
  type ReplyStype = {
    end_id: string
    last_id: string
    results: CommentType[]
    total_count: number
  }
  const [replyList, setReplyList] = useState<ReplyStype>({
    end_id: '',
    last_id: '',
    results: [] as CommentType[],
    total_count: 0
  } as ReplyStype)

  useEffect(() => {
    const getReplyList = async () => {
      const res = await request.get('/comments', {
        params: {
          type: 'c',
          source: originComment.com_id
        }
      })

      setReplyList(res.data)
    }
    getReplyList()
  }, [originComment])

  // 下拉加载更多
  const hasMore = replyList.end_id !== replyList.last_id
  const loadMore = async () => {
    const res = await request.get('/comments', {
      params: {
        type: 'c',
        source: originComment.com_id,
        offset: replyList.last_id
      }
    })
    setReplyList({
      ...res.data,
      results: [...replyList.results, ...res.data.results]
    })
  }

  // 回复评论的回复弹出框
  const [replyVisible, setReplyVisible] = useState(false)

  const onAddReply = async (replyValue: string) => {
    const res = await request.post('/comments', {
      target: originComment.com_id,
      content: replyValue,
      art_id: articleId
    })
    setReplyList({
      ...replyList,
      total_count: replyList.total_count + 1,
      results: [res.data.new_obj, ...replyList.results]
    })
    dispatch(
      updateReplyCount(originComment.reply_count + 1, originComment.com_id)
    )
  }
  return (
    <div className={styles.root}>
      <div className="reply-wrapper">
        {/* 顶部导航栏 */}
        <NavBar className="transparent-navbar" onLeftClick={onClose}>
          <div>{replyList.total_count}条回复</div>
        </NavBar>

        {/* 原评论信息 */}
        <div className="origin-comment">
          <CommentItem comment={originComment} type="reply"></CommentItem>
        </div>

        {/* 回复评论的列表 */}
        <div className="reply-list">
          <div className="reply-header">全部回复</div>
          {originComment.reply_count === 0 ? (
            <NoComment />
          ) : (
            replyList.results.map((item) => (
              <CommentItem comment={item} key={item.com_id}></CommentItem>
            ))
          )}
          <InfiniteScroll
            loadMore={loadMore}
            hasMore={hasMore}
          ></InfiniteScroll>
        </div>

        {/* 评论工具栏，设置 type="reply" 不显示评论和点赞按钮 */}
        <CommentFooter
          type="reply"
          releaseComment={() => setReplyVisible(true)}
        ></CommentFooter>
      </div>

      {/* 评论表单抽屉 */}
      <Popup
        visible={replyVisible}
        bodyStyle={{
          height: '100vh'
        }}
      >
        {
          <CommentRelease
            onAddReply={onAddReply}
            articleId={articleId}
            onClose={() => setReplyVisible(false)}
            name={originComment.aut_name}
          />
        }
      </Popup>
    </div>
  )
}

export default CommentReply
