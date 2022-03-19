import Icon from '@/components/Icon'
import { setMoreAction, unLikeArticle } from '@/store/actions/home'
import { Modal, Toast } from 'antd-mobile'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styles from './index.module.scss'

/**
 * 举报反馈菜单
 */
const FeedbackActionMenu = () => {
  // 举报类型：normal 不感兴趣或拉黑作者 | junk 垃圾内容
  const [type, setType] = useState('normal')
  const dispatch = useDispatch()
  const feedBack = useSelector((state) => state.home.feedBack)
  // 关闭弹框时的事件监听函数
  const onClose = () => {
    dispatch(
      setMoreAction({
        visible: false,
        articleId: '',
        curChannelId: 0
      })
    )
  }

  // 不感兴趣按钮
  const unLike = async () => {
    await dispatch(unLikeArticle(feedBack.articleId))
    onClose()
    Toast.show('拉黑成功')
  }

  return (
    <div className={styles.root}>
      <Modal
        className="more-action-modal"
        title=""
        transparent
        closeOnMaskClick
        footer={[]}
        onClose={onClose}
        visible={feedBack.visible}
        content={
          <div className="more-action">
            {/* normal 类型时的菜单内容 */}
            {type === 'normal' && (
              <>
                <div className="action-item" onClick={unLike}>
                  <Icon type="iconicon_unenjoy1" /> 不感兴趣
                </div>
                <div className="action-item" onClick={() => setType('junk')}>
                  <Icon type="iconicon_feedback1" />
                  <span className="text">反馈垃圾内容</span>
                  <Icon type="iconbtn_right" />
                </div>
                <div className="action-item">
                  <Icon type="iconicon_blacklist" /> 拉黑作者
                </div>
              </>
            )}

            {/* junk 类型时的菜单内容 */}
            {type === 'junk' && (
              <>
                <div className="action-item" onClick={() => setType('normal')}>
                  <Icon type="iconfanhui" />
                  <span className="back-text">反馈垃圾内容</span>
                </div>
                <div className="action-item">旧闻重复</div>
                <div className="action-item">广告软文</div>
                <div className="action-item">内容不实</div>
                <div className="action-item">涉嫌违法</div>
                <div className="action-item">
                  <span className="text">其他问题</span>
                  <Icon type="iconbtn_right" />
                </div>
              </>
            )}
          </div>
        }
      ></Modal>
    </div>
  )
}

export default FeedbackActionMenu
