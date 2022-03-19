import request from '@/utils/request'
import { hasToken, getLocalChannels, setLocalChannels } from '@/utils/storage'
import { RootThunkAction } from '../index'
import { Channel, HomeAction, ArticlePayload, FeedBack } from '../reducer/home'

/**
 * 将获取到的用户频道列表保存到redux中
 * @param { Object } paylaod 频道列表
 * @returns
 */
export const saveChannels = (payload: Channel[]): HomeAction => {
  return {
    type: 'home/saveChannels',
    payload
  }
}
/**
 * 获取用户频道列表
 * @returns
 */
export const getChannels = (): RootThunkAction => {
  return async (dispatch) => {
    // 如果有token（用户已登录），发送请求
    if (hasToken()) {
      const res = await request({
        url: '/user/channels',
        method: 'get'
      })
      dispatch(saveChannels(res.data.channels))
    } else {
      const channels = getLocalChannels()
      // 如果未登录，但本地已保存channels，直接拿本地
      if (channels) {
        dispatch(saveChannels(channels))
      } else {
        // 未登录，且本地无chaneels信息，重新发请求获取并保存到本地
        const res = await request({
          url: '/user/channels',
          method: 'get'
        })
        dispatch(saveChannels(res.data.channels))
        setLocalChannels(res.data.channels)
      }
    }
  }
}

/**
 * 将获取到的所有频道列表保存到redux中
 * @param {*} payload
 * @returns
 */
export const saveAllChannels = (payload: Channel[]): HomeAction => {
  return {
    type: 'home/saveAllChannels',
    payload
  }
}

export const getAllChannels = (): RootThunkAction => {
  return async (dispatch) => {
    const res = await request({
      url: '/channels',
      method: 'get'
    })
    dispatch(saveAllChannels(res.data.channels))
  }
}
/**
 * 删除用户频道
 * @param {*} id
 * @returns
 */
export const deleteUserChannel = (id: number): RootThunkAction => {
  return async (dispatch, getState) => {
    if (hasToken()) {
      // 如果登录了，发送请求获取频道信息
      await request({
        url: `/user/channels/${id}`,
        method: 'delete'
      })
      const userChannels = getState().home.userChannels.filter(
        (item) => item.id !== id
      )
      dispatch(saveChannels(userChannels))
    } else {
      // 没有登陆情况
      const userChannels = getState().home.userChannels.filter(
        (item) => item.id !== id
      )
      dispatch(saveChannels(userChannels))
      setLocalChannels(userChannels)
    }
  }
}
/**
 * 增加用户频道
 * @param {*} channel
 * @returns
 */
export const addUserChannel = (channel: Channel): RootThunkAction => {
  return async (dispatch, getState) => {
    const userChannels = [...getState().home.userChannels, channel]
    if (hasToken()) {
      await request({
        url: '/user/channels',
        method: 'patch',
        data: {
          channels: [channel]
        }
      })
    } else {
      setLocalChannels(userChannels)
    }
    dispatch(saveChannels(userChannels))
  }
}

/**
 * 将文章列表保存到redux中
 * @param {Object} payload
 * @returns
 */
export const saveArticleList = (payload: ArticlePayload): HomeAction => {
  return {
    type: 'home/saveArticleList',
    payload
  }
}
/**
 * 获取文章列表
 * @param {*} channelId
 * @param {*} timestamp
 * @returns
 */
export const getArticleList = (
  channelId: number,
  timestamp: string,
  hasMore = false
): RootThunkAction => {
  return async (dispatch) => {
    const res = await request({
      url: '/articles',
      method: 'get',
      params: {
        channel_id: channelId,
        timestamp
      }
    })
    const { pre_timestamp, results: article_list } = res.data
    dispatch(
      saveArticleList({
        channelId,
        article_list,
        timestamp: pre_timestamp,
        hasMore
      })
    )
  }
}
/**
 * 设置反馈弹框的显示隐藏
 * @param {*} payload
 * @returns
 */
export const setMoreAction = (payload: FeedBack): HomeAction => {
  return {
    type: 'home/feedBackAction',
    payload
  }
}

export const unLikeArticle = (articleId: string): RootThunkAction => {
  return async (dispatch, getState) => {
    await request({
      url: '/article/dislikes',
      method: 'post',
      data: {
        target: articleId
      }
    })
    const channelId = getState().home.feedBack.curChannelId
    const article = getState().home.articles[channelId]

    dispatch(
      saveArticleList({
        channelId,
        article_list: article.list.filter((item) => item.art_id !== articleId),
        timestamp: article.timestamp,
        hasMore: false
      })
    )
  }
}
