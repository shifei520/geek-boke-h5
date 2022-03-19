import classnames from 'classnames'
import Icon from '@/components/Icon'
import styles from './index.module.scss'
import dayjs from 'dayjs'
import Img from '@/components/Img'
import 'dayjs/locale/zh-cn'
import { useDispatch, useSelector } from 'react-redux'
import { setMoreAction } from '@/store/actions/home'
import { Article } from '@/store/reducer/home'
import { RootState } from '@/store'
import { useHistory } from 'react-router-dom'

type Props = {
  article: Article
  curChannelId: number
}
const ArticleItem = ({ article, curChannelId }: Props) => {
  const history = useHistory()
  const {
    cover: { type, images },
    title,
    aut_name,
    comm_count,
    pubdate,
    art_id
  } = article

  const dispatch = useDispatch()
  // 判断是否登录
  const isLogin = useSelector((state: RootState) => state.login.token)

  const onEssayClose = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    e.stopPropagation()

    dispatch(
      setMoreAction({
        visible: true,
        articleId: art_id,
        curChannelId
      })
    )
  }
  return (
    <div
      className={styles.root}
      onClick={() => history.push('/article/' + article.art_id)}
    >
      <div
        className={classnames(
          'article-content',
          type === 3 ? 't3' : '',
          type === 0 ? 'none-mt' : ''
        )}
      >
        <h3>{title}</h3>
        {type !== 0 && (
          <div className="article-imgs">
            {images.map((item, i) => (
              <div className="article-img-wrapper" key={i}>
                <Img src={item} alt="hahahah" />
              </div>
            ))}
          </div>
        )}
      </div>
      <div className={classnames('article-info', type === 0 ? 'none-mt' : '')}>
        <span>{aut_name}</span>
        <span>{comm_count} 评论</span>
        <span>{dayjs(pubdate).fromNow()}</span>

        <span className="close">
          {isLogin && (
            <Icon
              type="iconbtn_essay_close"
              onClick={(e) => onEssayClose(e!)}
            />
          )}
        </span>
      </div>
    </div>
  )
}

export default ArticleItem
