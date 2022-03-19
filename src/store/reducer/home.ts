export type Channel = {
  id: number
  name: string
}

export type Article = {
  art_id: string
  title: string
  aut_id: string
  comm_count: number
  pubdate: string
  aut_name: string
  cover: {
    type: number
    images: string[]
  }
  is_top?: number
  like_count?: number
  collect_count?: number
}

export type FeedBack = {
  visible: boolean
  articleId: string
  curChannelId: number
}

type HomeState = {
  userChannels: Channel[]
  allChannels: Channel[]
  articles: {
    [index: number]: {
      timestamp: string
      list: Article[]
    }
  }
  feedBack: FeedBack
}

const initValue: HomeState = {
  userChannels: [],
  allChannels: [],
  articles: {},
  feedBack: {
    visible: false,
    articleId: '',
    curChannelId: 0
  }
} as HomeState

export type ArticlePayload = {
  hasMore: boolean
  timestamp: string
  article_list: Article[]
  channelId: number
}

export type HomeAction =
  | {
      type: 'home/saveChannels'
      payload: Channel[]
    }
  | {
      type: 'home/saveAllChannels'
      payload: Channel[]
    }
  | {
      type: 'home/saveArticleList'
      payload: ArticlePayload
    }
  | {
      type: 'home/feedBackAction'
      payload: FeedBack
    }

export default function reducer(state = initValue, action: HomeAction) {
  switch (action.type) {
    case 'home/saveChannels':
      return {
        ...state,
        userChannels: action.payload
      }
    case 'home/saveAllChannels':
      return {
        ...state,
        allChannels: action.payload
      }
    case 'home/saveArticleList':
      const { hasMore, timestamp, article_list, channelId } = action.payload
      return {
        ...state,
        articles: {
          ...state.articles,
          [channelId]: {
            timestamp: timestamp,
            list: hasMore
              ? [...state.articles[channelId].list, ...article_list]
              : article_list
          }
        }
      }
    case 'home/feedBackAction':
      return {
        ...state,
        feedBack: action.payload
      }
    default:
      return state
  }
}
