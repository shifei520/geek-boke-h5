import React, { lazy, Suspense } from 'react'
import Icon from '@/components/Icon'
import styles from './index.module.scss'
import { useHistory, useLocation, Switch, Route } from 'react-router-dom'
import classnames from 'classnames'
import AuthRoute from '@/components/AuthRoute'

// 引入二级路由页面
const Home = lazy(() => import('@/pages/Home'))
const Question = lazy(() => import('@/pages/Question'))
const Video = lazy(() => import('@/pages/Video'))
const Profile = lazy(() => import('@/pages/Profile'))

// 底部footer分类个数

const buttons = [
  { id: 1, title: '首页', to: '/home', icon: 'iconbtn_home' },
  { id: 2, title: '问答', to: '/home/question', icon: 'iconbtn_qa' },
  { id: 3, title: '视频', to: '/home/video', icon: 'iconbtn_video' },
  { id: 4, title: '我的', to: '/home/profile', icon: 'iconbtn_mine' }
]

export default function Layout() {
  const history = useHistory()
  const location = useLocation()
  const { pathname } = location
  return (
    <div className={styles.root}>
      {/* 区域一：点击按钮切换显示内容的区域 */}
      <div className="tab-content">
        {/* 配置二级路由 */}
        <Suspense fallback={<div>loading...</div>}>
          <Switch>
            <Route exact path="/home" component={Home}></Route>
            <Route exact path="/home/question" component={Question}></Route>
            <Route exact path="/home/video" component={Video}></Route>
            <AuthRoute
              exact
              path="/home/profile"
              component={Profile}
            ></AuthRoute>
          </Switch>
        </Suspense>
      </div>
      {/* 区域二：按钮区域，会使用固定定位显示在页面底部 */}
      <div className="tabbar">
        {buttons.map((item) => {
          return (
            <div
              key={item.id}
              className={classnames(
                'tabbar-item',
                pathname === item.to ? 'tabbar-item-active' : ''
              )}
              onClick={() => history.push(item.to)}
            >
              <Icon
                type={item.icon + (pathname === item.to ? '_sel' : '')}
              ></Icon>
              <span>{item.title}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
