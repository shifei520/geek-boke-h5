import Icon from '@/components/Icon'
import { RootState } from '@/store'
import { useDispatch, useSelector } from 'react-redux'
import styles from './index.module.scss'
import { likeArticle, collectArticle } from '@/store/actions/article'

type Props = {
  goComment?: () => void
  goShare?: () => void
  releaseComment?: () => void
  type?: string
}
const CommentFooter = ({
  goComment,
  goShare,
  releaseComment,
  type = 'normal'
}: Props) => {
  const dispatch = useDispatch()
  const detail = useSelector((state: RootState) => state.article.articleDetail)

  // 点赞与取消点赞
  const onThumbs = () => {
    dispatch(likeArticle(detail.art_id, detail.attitude))
  }

  // 收藏与取消搜藏
  const onCollect = () => {
    dispatch(collectArticle(detail.art_id, detail.is_collected))
  }
  return (
    <div className={styles.root}>
      <div className="input-btn" onClick={releaseComment}>
        <Icon type="iconbianji" />
        <span>去评论</span>
      </div>

      {type === 'reply' ? null : (
        <>
          <div className="action-item" onClick={goComment}>
            <Icon type="iconbtn_comment" />
            <p>评论</p>
            <span className="bage">{detail.comm_count}</span>
          </div>
          {/* 'iconbtn_like2' */}
          <div className="action-item" onClick={onThumbs}>
            <Icon
              type={
                detail.attitude === 1 ? 'iconbtn_like_sel' : 'iconbtn_like2'
              }
            />
            <p>点赞</p>
          </div>
        </>
      )}
      <div className="action-item" onClick={onCollect}>
        {/* 'iconbtn_collect' */}
        <Icon
          type={detail.is_collected ? 'iconbtn_collect_sel' : 'iconbtn_collect'}
        />
        <p>收藏</p>
      </div>
      <div className="action-item" onClick={goShare}>
        <Icon type="iconbtn_share" />
        <p>分享</p>
      </div>
    </div>
  )
}

export default CommentFooter
