import NavBar from '@/components/NavBar'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import styles from './index.module.scss'
import { releaseComment } from '@/store/actions/article'

type Props = {
  onClose: () => void
  articleId: string
  name?: string
  onAddReply?: (value: string) => void
}
const CommentInput = ({ onClose, articleId, name, onAddReply }: Props) => {
  const dispatch = useDispatch()
  const [value, setValue] = useState('')

  // 点击发表按钮发表
  const onSendComment = () => {
    if (!value) return
    if (name) {
      onAddReply && onAddReply(value)
      onClose()
    } else {
      dispatch(releaseComment(articleId, value))
      onClose()
    }
  }
  return (
    <div className={styles.root}>
      {/* 顶部导航栏 */}
      <NavBar
        onLeftClick={onClose}
        extra={
          <span className="publish" onClick={onSendComment}>
            发表
          </span>
        }
      >
        {name ? '回复评论' : '评论文章'}
      </NavBar>

      <div className="input-area">
        {/* 回复别人的评论时显示：@某某 */}
        {name && <div className="at">@{name}:</div>}

        {/* 评论内容输入框 */}
        <textarea
          placeholder="说点什么~"
          rows={10}
          value={value}
          onChange={(e) => setValue(e.target.value.trim())}
        />
      </div>
    </div>
  )
}

export default CommentInput
