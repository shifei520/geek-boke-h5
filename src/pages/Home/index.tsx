import React, { useEffect, useState } from 'react'
import { Popup } from 'antd-mobile'
import styles from './index.module.scss'
import Tabs from '@/components/Tabs'
import Icon from '@/components/Icon'
import { useDispatch, useSelector } from 'react-redux'
import { getChannels, getAllChannels } from '@/store/actions/home'
import Channels from './components/Channels'
import ArticleList from './components/ArticleList'
import MoreAction from './components/MoreAction'
import { RootState } from '@/store'
import { useHistory } from 'react-router-dom'

export default function Home() {
  const history = useHistory()
  // 发送请求获取频道列表
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(getChannels())
    dispatch(getAllChannels())
  }, [dispatch])

  const tabs = useSelector((state: RootState) => state.home.userChannels)

  // 控制编辑/选择频道弹出框的显示与隐藏
  const [popupVisible, setPopupVisible] = useState(false)
  const onClosePopup = () => {
    setPopupVisible(false)
  }

  // 控制频道列表高亮显示
  const [active, setActive] = useState(0)
  return (
    <div className={styles.root}>
      <Tabs tabs={tabs} index={active} onChange={(i: number) => setActive(i)}>
        {tabs.map((item) => (
          <ArticleList
            key={item.id}
            channelId={item.id}
            activeId={tabs[active].id}
          ></ArticleList>
        ))}
      </Tabs>
      {/* 频道 Tab 栏右侧的两个图标按钮：搜索、频道管理 */}
      <div className="tabs-opration">
        <Icon type="iconbtn_search" onClick={() => history.push('/search')} />
        <Icon type="iconbtn_channel" onClick={() => setPopupVisible(true)} />
      </div>
      <Popup
        visible={popupVisible}
        onMaskClick={() => {
          setPopupVisible(false)
        }}
        position="left"
        bodyStyle={{ width: '100vw', overflowY: 'scroll' }}
      >
        {
          <Channels
            onClose={onClosePopup}
            index={active}
            onChange={(i: number) => setActive(i)}
          ></Channels>
        }
      </Popup>
      <MoreAction></MoreAction>
    </div>
  )
}
