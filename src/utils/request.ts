import axios, { AxiosError } from 'axios'
import { Toast } from 'antd-mobile'
import { getTokenInfo, setTokenInfo, removeTokenInfo } from '@/utils/storage'
import history from './history'
import store from '@/store'
import { saveToken } from '@/store/actions/login'
import { Token } from '@/store/reducer/login'

const baseURL = 'http://geek.itheima.net/v1_0'

const instance = axios.create({
  timeout: 5000,
  baseURL
})

instance.interceptors.request.use(
  (config) => {
    const token = getTokenInfo().token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)
instance.interceptors.response.use(
  (res) => {
    return res.data
  },
  async (err: AxiosError) => {
    if (!err.response) {
      Toast.show({
        content: '网络繁忙，请稍后再试'
      })
    } else if (err.response.status !== 401) {
      Toast.show({
        content: err.response.data.message
      })
    }

    // token过期并且没有refresh_token情况
    if (err.response?.status === 401) {
      const { refresh_token } = getTokenInfo()
      // 如果token失效并且没有refresh_token则跳转到登录页
      if (!refresh_token) {
        history.replace({
          pathname: '/login',
          state: {
            from: history.location.pathname
          }
        })
      } else {
        try {
          const res = await axios({
            url: baseURL + '/authorizations',
            method: 'put',
            headers: {
              Authorization: `Bearer ${refresh_token}`
            }
          })
          const tokenInfo: Token = {
            token: res.data.data.token,
            refresh_token
          }
          store.dispatch(saveToken(tokenInfo))
          setTokenInfo(tokenInfo)
          return instance(err.config)
        } catch {
          removeTokenInfo()
          store.dispatch(
            saveToken({
              token: '',
              refresh_token: ''
            })
          )
          // store.dispatch(logout())
          history.replace({
            pathname: '/login',
            state: {
              from: history.location.pathname
            }
          })
          Toast.show({
            content: '用户信息失效，请重新登陆'
          })
          return Promise.reject(err)
        }
      }
    }

    // 如果有refresh_token情况

    return Promise.reject(err)
  }
)

export default instance
