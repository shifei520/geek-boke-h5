import Icon from '@/components/Icon'
import styles from './index.module.scss'
import { useSelector, useDispatch } from 'react-redux'
import differenceBy from 'lodash/differenceBy'
import classNames from 'classnames'
import { useState } from 'react'
import { deleteUserChannel, addUserChannel } from '@/store/actions/home'
import { Toast } from 'antd-mobile'
import { RootState } from '@/store'
import { Channel } from '@/store/reducer/home'

/**
 * 频道管理组件
 * @param {Number} props.tabActiveIndex 用户选中的频道的索引
 * @param {Function} props.onClose 关闭频道管理抽屉时的回调函数
 * @param {Function} props.onChannelClick 当点击频道列表中的某个频道时的会带哦函数
 */
type Props = {
  index: number
  onClose: () => void
  onChange: (i: number) => void
}
const Channels = ({
  index: tabActiveIndex,
  onClose,
  onChange: onChannelClick
}: Props) => {
  const dispatch = useDispatch()
  // 从redux获取用户频道列表
  const channels = useSelector((state: RootState) => state.home.userChannels)

  // 从redux获取推荐频道列表
  const recommendChannels = useSelector((state: RootState) => {
    const { userChannels, allChannels } = state.home
    // 1. 使用原生过滤
    // return allChannels.filter((item) => {
    //   return !userChannels.find((v) => v.id === item.id)
    // })
    // 2. 使用lodash中函数过滤
    return differenceBy(allChannels, userChannels, 'id')
  })

  // 点击频道触发事件
  const onTabClick = (i: number) => {
    if (editing) return
    onChannelClick(i)
    onClose()
  }

  // 控制编辑状态
  const [editing, setEditing] = useState(false)

  // 删除用户频道
  const delChannel = async (id: number, i: number) => {
    // 如果频道小于4个，不允许删除
    if (channels.length <= 4) return Toast.show('频道数不能小于4哦~')
    // 如果删除索引小于当前高亮索引，高亮索引减一
    // 如果删除索引等于当前高亮索引，高亮变为默认0
    // 如果删除索引大于当前高亮索引，不做处理
    if (i < tabActiveIndex) {
      onChannelClick(tabActiveIndex - 1)
    } else if (i === tabActiveIndex) {
      onChannelClick(0)
    }
    await dispatch(deleteUserChannel(id))
    Toast.show({
      icon: 'success',
      content: '删除成功'
    })
  }

  // 添加用户频道
  const addChannels = async (channel: Channel) => {
    await dispatch(addUserChannel(channel))
    Toast.show({
      icon: 'success',
      content: '添加成功'
    })
  }
  return (
    <div className={styles.root}>
      {/* 顶部栏：带关闭按钮 */}
      <div className="channel-header">
        <Icon type="iconbtn_channel_close" onClick={onClose} />
      </div>

      {/* 频道列表 */}
      <div className="channel-content">
        {/* 当前已选择的频道列表 */}
        <div className={classNames('channel-item', { edit: editing })}>
          <div className="channel-item-header">
            <span className="channel-item-title">我的频道</span>
            <span className="channel-item-title-extra">
              {editing ? '点击删除频道' : '点击进入频道'}
            </span>
            <span
              className="channel-item-edit"
              onClick={() => setEditing(!editing)}
            >
              {editing ? '保存' : '编辑'}
            </span>
          </div>

          <div className="channel-list">
            {channels.map((item, i) => {
              return (
                <span
                  className={classNames('channel-list-item', {
                    selected: tabActiveIndex === i
                  })}
                  key={item.id}
                  onClick={() => onTabClick(i)}
                >
                  {item.name}
                  {i !== 0 ? (
                    <Icon
                      type="iconbtn_tag_close"
                      onClick={() => delChannel(item.id, i)}
                    />
                  ) : null}
                </span>
              )
            })}
          </div>
        </div>

        {/* 推荐的频道列表 */}
        <div className="channel-item">
          <div className="channel-item-header">
            <span className="channel-item-title">频道推荐</span>
            <span className="channel-item-title-extra">点击添加频道</span>
          </div>
          <div className="channel-list">
            {recommendChannels.map((item) => {
              return (
                <span
                  className="channel-list-item"
                  key={item.id}
                  onClick={() => addChannels(item)}
                >
                  + {item.name}
                </span>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Channels
