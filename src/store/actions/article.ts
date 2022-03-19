import request from '@/utils/request'
import { RootThunkAction } from '..'
import { ArticleAction } from '../reducer/article'
/**
 * @description 获取文章详情
 * @export
 * @param {string} id
 * @return {*}  {RootThunkAction}
 */
export function getArticleDetail(id: string): RootThunkAction {
  return async (dispatch) => {
    const res = await request({
      method: 'get',
      url: '/articles/' + id
    })
    dispatch({
      type: 'article/saveDetail',
      payload: res.data
    })
  }
}

export function getCommentList(id: string): RootThunkAction {
  return async (dispatch) => {
    const res = await request({
      url: '/comments',
      method: 'get',
      params: {
        type: 'a',
        source: id
      }
    })
    dispatch({
      type: 'article/saveComment',
      payload: res.data
    })
  }
}

/**
 * @description 获取更多评论
 * @export
 * @param {string} id
 * @param {string} offset
 * @return {*}  {RootThunkAction}
 */
export function getMoreCommentList(
  id: string,
  offset: string
): RootThunkAction {
  return async (dispatch) => {
    const res = await request({
      url: '/comments',
      method: 'get',
      params: {
        type: 'a',
        source: id,
        offset
      }
    })
    dispatch({
      type: 'article/saveMoreComment',
      payload: res.data
    })
  }
}

/**
 * @description 点赞文章
 * @export
 * @param {string} id
 * @param {number} attitude
 * @return {*}  {RootThunkAction}
 */
export function likeArticle(id: string, attitude: number): RootThunkAction {
  return async (dispatch) => {
    if (attitude === 1) {
      // 取消点赞
      await request.delete('/article/likings/' + id)
    } else {
      // 点赞
      await request.post('/article/likings', { target: id })
    }
    dispatch(getArticleDetail(id))
  }
}

export function collectArticle(
  id: string,
  isCollect: boolean
): RootThunkAction {
  return async (dispatch) => {
    if (isCollect) {
      await request.delete('/article/collections/' + id)
    } else {
      await request.post('/article/collections', {
        target: id
      })
    }
    dispatch(getArticleDetail(id))
  }
}

export function releaseComment(
  articleId: string,
  content: string
): RootThunkAction {
  return async (dispatch) => {
    const res = await request.post('/comments', {
      target: articleId,
      content
    })
    dispatch({
      type: 'article/saveNewComment',
      payload: res.data.new_obj
    })
  }
}

export function updateReplyCount(
  reply_count: number,
  com_id: string
): ArticleAction {
  return {
    type: 'article/updateReplyCount',
    payload: {
      reply_count,
      com_id
    }
  }
}
