import Icon from '@/components/Icon'
import { CommentType } from '@/store/reducer/article'
import styles from './index.module.scss'
import dayjs from 'dayjs'

type Props = {
  comment: CommentType
  onClick?: (comment: CommentType) => void
  type?: string
}
const CommentItem = ({ comment, onClick, type = 'normal' }: Props) => {
  return (
    <div className={styles.root}>
      {/* 评论者头像 */}
      <div className="avatar">
        <img src={comment.aut_photo} alt="" />
      </div>

      <div className="comment-info">
        {/* 评论者名字 */}
        <div className="comment-info-header">
          <span className="name">{comment.aut_name}</span>

          {/* 关注或点赞按钮 */}
          <span className="thumbs-up">
            {comment.like_count}
            <Icon
              type={comment.is_liking ? 'iconbtn_like_sel' : 'iconbtn_like2'}
            />
          </span>
        </div>

        {/* 评论内容 */}
        <div className="comment-content">{comment.content}</div>

        <div className="comment-footer">
          {/* 回复按钮 */}

          {type === 'reply' ? null : (
            <span
              className="replay"
              onClick={(e) => onClick && onClick(comment)}
            >
              {comment.reply_count}回复 <Icon type="iconbtn_right" />
            </span>
          )}

          {/* 评论日期 */}
          <span className="comment-time">
            {dayjs(comment.pubdate).fromNow()}
          </span>
        </div>
      </div>
    </div>
  )
}

export default CommentItem
