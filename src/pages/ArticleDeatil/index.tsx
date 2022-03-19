import Icon from '@/components/Icon'
import NavBar from '@/components/NavBar'
import Sticky from '@/components/Sticky'
import { useParams } from 'react-router-dom'
import { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  getArticleDetail,
  getCommentList,
  getMoreCommentList
} from '@/store/actions/article'
import styles from './index.module.scss'
import { RootState } from '@/store'
import { InfiniteScroll, Popup } from 'antd-mobile'
import classNames from 'classnames'
import dayjs from 'dayjs'
// 防止xss攻击
import DOMPurify from 'dompurify'
// 代码高亮显示
import hljs from 'highlight.js'
import 'highlight.js/styles/vs2015.css'
// 滚动节流
import throttle from 'lodash/throttle'
import NoComment from './components/NoComment'
import CommentItem from './components/CommentItem'
import CommentFooter from './components/CommentFooter'
import Share from './components/Share'
import CommentRelease from './components/CommentRelease'
import CommentReply from './components/CommentReply'

import { CommentType } from '@/store/reducer/article'

type Params = {
  id: string
}
const Article = () => {
  const dispatch = useDispatch()
  const { id } = useParams<Params>()
  useEffect(() => {
    dispatch(getArticleDetail(id))
  }, [dispatch, id])

  useEffect(() => {
    document.querySelectorAll('.dg-html code').forEach((el) => {
      hljs.highlightElement(el as HTMLElement)
    })
  }, [])
  const { articleDetail: detail, articleComment } = useSelector(
    (state: RootState) => state.article
  )

  // 滚动时是否显示navbar信息
  const [isShowAuthor, setIsShowAuthor] = useState(false)
  const authorRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const onScroll = throttle(function () {
      const { top } = authorRef.current?.getBoundingClientRect()!
      if (top <= 0) {
        setIsShowAuthor(true)
      } else {
        setIsShowAuthor(false)
      }
    }, 300)
    document.addEventListener('scroll', onScroll)
    return () => {
      document.removeEventListener('scroll', onScroll)
    }
  }, [])

  // 获取评论列表
  useEffect(() => {
    dispatch(getCommentList(id))
  }, [dispatch, id])

  // 加载更多评论
  const hasMore = articleComment.end_id !== articleComment.last_id
  const loadMore = async () => {
    await dispatch(getMoreCommentList(id, articleComment.last_id))
  }

  // 点击底部footer去看评论
  const commentHeadRef = useRef<HTMLDivElement>(null)
  const [showComment, setShowComment] = useState(false)
  const goComment = () => {
    if (showComment) {
      window.scrollTo(0, 0)
    } else {
      window.scrollTo(0, commentHeadRef.current?.offsetTop!)
    }
    setShowComment(!showComment)
  }

  // 控制分享抽屉的显示与隐藏
  const [visible, setVisible] = useState<boolean>(false)
  const onShareClose = () => {
    setVisible(false)
  }
  const onShareShow = () => {
    setVisible(true)
  }

  // 控制发表评论的显示与隐藏
  const [commentVisible, setCommentVisible] = useState<boolean>(false)

  // 控制回复评论显示隐藏
  type ReplyType = {
    visible: boolean
    originComment: CommentType
  }
  const [replyVisible, setReplyVisible] = useState<ReplyType>({
    visible: false,
    originComment: {} as CommentType
  })
  const onShowReply = (comment: CommentType) => {
    setReplyVisible({
      visible: true,
      originComment: comment
    })
  }
  return (
    <div className={styles.root}>
      <div className="root-wrapper">
        {/* 顶部导航栏 */}
        <NavBar
          className="atticle-detail-navbar"
          extra={
            <span>
              <Icon type="icongengduo" />
            </span>
          }
        >
          {isShowAuthor ? (
            <div className="nav-author">
              <img src={detail.aut_photo} alt="" />
              <span className="name">{detail.aut_name}</span>
              <span
                className={classNames(
                  'follow',
                  detail.is_followed ? 'followed' : ''
                )}
              >
                {detail.is_followed ? '已关注' : '关注'}
              </span>
            </div>
          ) : (
            ''
          )}
        </NavBar>
        <>
          <div className="wrapper">
            <div className="article-wrapper">
              {/* 文章描述信息栏 */}
              <div className="header">
                <h1 className="title">{detail.title}</h1>

                <div className="info">
                  <span>{dayjs(detail.pubdate).format('YYYY-MM-DD')}</span>
                  <span>{detail.read_count} 阅读</span>
                  <span>{detail.comm_count} 评论</span>
                </div>

                <div className="author" ref={authorRef}>
                  <img src={detail.aut_photo} alt="" />
                  <span className="name">{detail.aut_name}</span>
                  <span
                    className={classNames('follow', {
                      followed: detail.is_followed
                    })}
                  >
                    {detail.is_followed ? '已关注' : '关注'}
                  </span>
                </div>
              </div>

              {/* 文章正文内容区域 */}
              <div className="content">
                <div
                  className="content-html dg-html"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(detail.content)
                  }}
                ></div>
                <div className="date">
                  发布文章时间：{dayjs(detail.pubdate).format('YYYY-MM-DD')}
                </div>
              </div>
            </div>
            <div className="comment">
              {/* 评论总览信息 */}
              <Sticky top={46}>
                <div className="comment-header" ref={commentHeadRef}>
                  <span>全部评论（{detail.comm_count}）</span>
                  <span>{detail.like_count} 点赞</span>
                </div>
              </Sticky>
              {/* 评论列表 */}
              {detail.comm_count === 0 ? (
                <NoComment></NoComment>
              ) : (
                articleComment.results?.map((item) => (
                  <CommentItem
                    key={item.com_id}
                    comment={item}
                    onClick={onShowReply}
                  ></CommentItem>
                ))
              )}
              <InfiniteScroll
                loadMore={loadMore}
                hasMore={hasMore}
                threshold={0}
              />
            </div>
          </div>
        </>
        <CommentFooter
          goComment={goComment}
          goShare={onShareShow}
          releaseComment={() => setCommentVisible(true)}
        ></CommentFooter>
      </div>
      {/* 分享弹出层 */}
      <Popup
        visible={visible}
        onMaskClick={() => {
          setVisible(false)
        }}
        bodyStyle={{
          borderTopLeftRadius: '8px',
          borderTopRightRadius: '8px'
        }}
      >
        {<Share onClose={onShareClose} />}
      </Popup>
      {/* 发表评论弹出层 */}
      <Popup
        visible={commentVisible}
        bodyStyle={{
          height: '100vh'
        }}
      >
        {
          <CommentRelease
            articleId={id}
            onClose={() => setCommentVisible(false)}
          />
        }
      </Popup>

      {/* 回复评论 */}
      <Popup
        position="right"
        visible={replyVisible.visible}
        bodyStyle={{
          height: '100vh',
          width: '100vw'
        }}
      >
        {replyVisible.originComment.com_id && (
          <CommentReply
            originComment={replyVisible.originComment}
            articleId={id}
            onClose={() =>
              setReplyVisible({
                visible: false,
                originComment: {} as CommentType
              })
            }
          />
        )}
      </Popup>
    </div>
  )
}

export default Article
