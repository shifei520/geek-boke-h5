import React, { useState, useEffect, useRef } from 'react'
import NavBar from '@/components/NavBar'
import styles from './index.module.scss'
import { List, DatePicker, Toast, Dialog } from 'antd-mobile'
import {
  getProfileInfo,
  updateProfile,
  updatePhoto
} from '@/store/actions/profile'
import { useDispatch, useSelector } from 'react-redux'
import classnames from 'classnames'
import EditList from '../EditList'
import dayjs from 'dayjs'
import { saveToken } from '@/store/actions/login'
import { useHistory } from 'react-router-dom'
import { removeTokenInfo } from '@/utils/storage'

const actions = {
  photo: [
    { text: '拍照', key: '11', title: 'photo' },
    { text: '本地选择', key: '12', title: 'photo' }
  ],
  gender: [
    { text: '男', key: 0, title: 'gender' },
    { text: '女', key: 1, title: 'gender' }
  ]
}

export default function Edit() {
  // 控制日期选择框显示隐藏
  const [visible, setVisible] = useState(false)

  // 获取个人信息
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(getProfileInfo())
  }, [dispatch])

  // 从redux中拿个人信息
  const profile = useSelector((state) => state.profile.profile)
  // 控制抽屉组件显示隐藏
  const [drawerOpen, setDrawerOpen] = useState({
    visible: false,
    type: ''
  })

  const onClose = () => {
    setDrawerOpen({
      visible: false,
      type: ''
    })
  }
  const photoRef = useRef(null)
  const photoChange = async (e) => {
    const file = e.target.files[0]
    const fd = new FormData()
    fd.append('photo', file)
    await dispatch(updatePhoto(fd))
    Toast.show({
      content: '修改成功'
    })
  }
  // 修改个人信息
  const onCommit = async (type, value) => {
    if (type === 'photo') {
      photoRef.current.click()
    } else {
      await dispatch(
        updateProfile({
          [type]: value
        })
      )
      Toast.show({
        content: '修改成功'
      })
    }
    onClose()
  }
  // 修改生日
  const onBirthdayChange = async (date) => {
    onCommit('birthday', dayjs(date).format('YYYY-MM-DD'))
  }

  const history = useHistory()
  // 退出登录
  const onLogout = async () => {
    const result = await Dialog.confirm({
      content: '确认退出登录？'
    })
    if (result) {
      removeTokenInfo()
      dispatch(
        saveToken({
          token: '',
          refresh_token: ''
        })
      )
      history.replace('/login')
    }
  }
  return (
    <div className={styles.root}>
      <div className="content">
        <NavBar>个人信息</NavBar>

        <div className="wrapper">
          <List className="profile-list">
            <List.Item
              extra={
                <span className="avatar-wrapper">
                  <img src={profile.photo} alt="" />
                </span>
              }
              clickable
              onClick={() =>
                setDrawerOpen({
                  visible: true,
                  type: 'photo'
                })
              }
            >
              头像
            </List.Item>
            <List.Item extra={profile.name} clickable>
              昵称
            </List.Item>

            <List.Item
              extra={
                <span
                  className={classnames('intro', profile.intro ? 'normal' : '')}
                >
                  {profile.intro || '未填写'}
                </span>
              }
              clickable
            >
              简介
            </List.Item>
          </List>

          <List className="profile-list">
            <List.Item
              extra={profile.gender === 0 ? '男' : '女'}
              clickable
              onClick={() =>
                setDrawerOpen({
                  visible: true,
                  type: 'gender'
                })
              }
            >
              性别
            </List.Item>
            {profile.birthday && (
              <DatePicker
                visible={visible}
                onClose={() => {
                  setVisible(false)
                }}
                defaultValue={new Date(profile.birthday)}
                onConfirm={onBirthdayChange}
                max={new Date()}
                min={new Date('1950-1-1')}
              >
                {/* {(value) => value?.toDateString()} */}
                {(value) => (
                  <List.Item
                    extra={dayjs(value).format('YYYY-MM-DD')}
                    clickable
                    onClick={() => {
                      setVisible(true)
                    }}
                  >
                    生日
                  </List.Item>
                )}
              </DatePicker>
            )}
          </List>
        </div>
        {/* 底部栏：退出登录按钮 */}
        <div className="logout">
          <button className="btn" onClick={onLogout}>
            退出登录
          </button>
        </div>
      </div>
      {/* <Drawer
        position="right"
        className="drawer"
        style={{ minHeight: document.documentElement.clientHeight }}
        sidebar={<div onClick={() => setDrawerOpen(false)}>全屏抽屉</div>}
        open={drawerOpen}
      /> */}
      <EditList
        visible={drawerOpen.visible}
        actions={actions[drawerOpen.type]}
        onClose={onClose}
        onAction={({ key, title }) => {
          onCommit(title, key)
        }}
      ></EditList>
      <input
        type="file"
        name="photo"
        hidden
        ref={photoRef}
        onChange={photoChange}
      />
    </div>
  )
}
