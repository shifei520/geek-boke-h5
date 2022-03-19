import React, { useState, useEffect, useRef } from 'react'
import { Link, useHistory } from 'react-router-dom'

export default function NotFound() {
  const [countDown, setCountDown] = useState<number>(3)
  const countRef = useRef<number>(-1)
  const history = useHistory()
  useEffect(() => {
    const timer: number = window.setInterval(() => {
      setCountDown((state) => {
        countRef.current = state - 1
        return state - 1
      })
      if (countRef.current === 0) {
        clearInterval(timer)
        history.push('/home/index')
      }
    }, 1000)
  }, [history])
  return (
    <div>
      <h1>对不起，你访问的页面不存在...</h1>
      <p>
        {countDown}秒后，返回<Link to="/home/index">首页</Link>
      </p>
    </div>
  )
}
