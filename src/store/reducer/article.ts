type DetailType = {
  art_id: string
  attitude: number
  aut_id: string
  aut_name: string
  aut_photo: string
  comm_count: number
  content: string
  is_collected: boolean
  is_followed: boolean
  like_count: number
  pubdate: string
  read_count: number
  title: string
}

export type CommentType = {
  aut_id: string
  aut_name: string
  aut_photo: string
  com_id: string
  content: string
  is_followed: boolean
  is_liking: boolean
  like_count: number
  pubdate: string
  reply_count: number
}

type ArticleType = {
  articleDetail: DetailType
  articleComment: {
    end_id: string
    last_id: string
    total_count: number
    results: CommentType[]
  }
}

const initValue: ArticleType = {
  // 文章详情
  articleDetail: {},
  // 文章评论
  articleComment: {}
} as ArticleType

type CommentPayload = {
  end_id: string
  last_id: string
  total_count: number
  results: CommentType[]
}
export type ArticleAction =
  | {
      type: 'article/saveDetail'
      payload: DetailType
    }
  | {
      type: 'article/saveComment'
      payload: CommentPayload
    }
  | {
      type: 'article/saveMoreComment'
      payload: CommentPayload
    }
  | {
      type: 'article/saveNewComment'
      payload: CommentType
    }
  | {
      type: 'article/updateReplyCount'
      payload: {
        reply_count: number
        com_id: string
      }
    }
export default function reducer(state = initValue, action: ArticleAction) {
  switch (action.type) {
    case 'article/saveDetail':
      return {
        ...state,
        articleDetail: action.payload
      }
    case 'article/saveComment':
      return {
        ...state,
        articleComment: action.payload
      }
    case 'article/saveMoreComment':
      return {
        ...state,
        articleComment: {
          ...action.payload,
          results: [...state.articleComment.results, ...action.payload.results]
        }
      }
    case 'article/saveNewComment':
      return {
        ...state,
        articleComment: {
          ...state.articleComment,
          results: [action.payload, ...state.articleComment.results]
        },
        articleDetail: {
          ...state.articleDetail,
          comm_count: state.articleDetail.comm_count + 1
        }
      }
    case 'article/updateReplyCount':
      return {
        ...state,
        articleComment: {
          ...state.articleComment,
          results: state.articleComment.results.map((item) => {
            if (item.com_id === action.payload.com_id) {
              return {
                ...item,
                reply_count: action.payload.reply_count
              }
            } else {
              return item
            }
          })
        }
      }
    default:
      return state
  }
}
