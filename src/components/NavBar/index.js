import style from './index.module.scss'
import Icon from '@/components/Icon'
import classNames from 'classnames'
// 组件内使用路由对象方式
// 方式一（使用withRouter）
// import { withRouter } from 'react-router-dom'

// 方式二（使用hooks）
import { useHistory } from 'react-router-dom'

function NavBar({ children, extra, className }) {
  const history = useHistory()
  const back = () => {
    history.go(-1)
  }
  return (
    <div className={classNames(style.root, className)}>
      {/* 后退按钮 */}
      <div className="left">
        <Icon type="iconfanhui" onClick={back} />
      </div>
      {/* 居中标题 */}
      <div className="title">{children}</div>

      {/* 右侧内容 */}
      <div className="right">{extra}</div>
    </div>
  )
}
// export default withRouter(NavBar)

export default NavBar
