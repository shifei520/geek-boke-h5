import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import '@/assets/styles/index.scss'
import store from './store'
import { Provider } from 'react-redux'

// 扩展dayjs
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime) // dayjs扩展插件，返回现在到当前实例的相对时间
dayjs.locale('zh-cn') // 全局使用简体中文

ReactDOM.render(
  <Provider store={store}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Provider>,
  document.getElementById('root')
)
