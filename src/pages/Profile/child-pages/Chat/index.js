import Icon from '@/components/Icon'
import Input from '@/components/Input'
import NavBar from '@/components/NavBar'
import { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import styles from './index.module.scss'
import io from 'socket.io-client'
import { getTokenInfo } from '@/utils/storage'
import { getUserInfo } from '@/store/actions/profile'

const Chat = () => {
  // 聊天记录
  const [messageList, setMessageList] = useState([
    // 放两条初始消息
    { type: 'robot', text: '亲爱的用户您好，小智同学为您服务。' },
    { type: 'user', text: '你好' }
  ])
  const photo = useSelector((state) => state.profile.user.photo)
  // 底部发送消息框数据
  // 保存websocket实例
  const clientRef = useRef(null)
  const [msg, setMsg] = useState('')
  const sendMsg = (e) => {
    if (e.keyCode !== 13) return
    if (!msg) return
    setMessageList([
      ...messageList,
      {
        type: 'user',
        text: msg
      }
    ])
    clientRef.current.emit('message', {
      msg,
      timestamp: Date.now()
    })
    setMsg('')
  }
  const dispatch = useDispatch()
  // 使用websocket建立链接
  useEffect(() => {
    dispatch(getUserInfo())
    // 创建客户端实例
    clientRef.current = io('http://toutiao.itheima.net', {
      transports: ['websocket'],
      // 在查询字符串参数中传递 token
      query: {
        token: getTokenInfo().token
      }
    })

    clientRef.current.on('connect', () => {
      setMessageList((state) => [
        ...state,
        { type: 'robot', text: '我现在恭候着您的提问。' }
      ])
    })
    clientRef.current.on('message', (e) => {
      setMessageList((state) => [...state, { type: 'robot', text: e.msg }])
    })

    return () => {
      clientRef.current.close()
    }
  }, [dispatch])

  const ListRef = useRef(null)
  // 当发送消息时滚动条滚动到底部
  useEffect(() => {
    ListRef.current.scrollTop =
      ListRef.current.scrollHeight - ListRef.current.offsetHeight
  }, [messageList])
  return (
    <div className={styles.root}>
      {/* 顶部导航栏 */}
      <NavBar className="fixed-header">小智同学</NavBar>

      {/* 聊天记录列表 */}
      <div className="chat-list" ref={ListRef}>
        {messageList.map((item, index) => {
          if (item.type === 'robot') {
            return (
              <div key={index} className="chat-item">
                <Icon type="iconbtn_xiaozhitongxue" />
                <div className="message">{item.text}</div>
              </div>
            )
          } else {
            return (
              <div key={index} className="chat-item user">
                <img
                  src={
                    photo || 'http://toutiao.itheima.net/images/user_head.jpg'
                  }
                  alt=""
                />
                <div className="message">{item.text}</div>
              </div>
            )
          }
        })}
      </div>

      {/* 底部消息输入框 */}
      <div className="input-footer">
        <Input
          className="no-border"
          placeholder="请描述您的问题"
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          onKeyUp={sendMsg}
        />
        <Icon type="iconbianji" />
      </div>
    </div>
  )
}

export default Chat
