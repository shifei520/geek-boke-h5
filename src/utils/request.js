import axios from 'axios'
import { Toast } from 'antd-mobile'
import { getTokenInfo } from '@/utils/storage'
import history from './history'

const instance = axios.create({
  timeout: 5000,
  baseURL: 'http://geek.itheima.net/v1_0'
})

instance.interceptors.request.use(
  (config) => {
    const token = getTokenInfo().token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)
instance.interceptors.response.use(
  (res) => {
    return res.data
  },
  (err) => {
    if (!err.response) {
      Toast.show({
        content: '网络繁忙，请稍后再试'
      })
    } else if (err.response.status !== 401) {
      Toast.show({
        content: err.response.data.message
      })
    }

    if (err.response.status === 401) {
      const { refresh_token } = getTokenInfo()
      // 如果token失效并且没有refresh_token则跳转到登录页
      if (!refresh_token) {
        history.replace({
          pathname: '/login',
          state: {
            from: history.location.pathname
          }
        })
      }
    }
    return Promise.reject(err)
  }
)

export default instance
