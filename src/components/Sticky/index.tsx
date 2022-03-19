import { useEffect, useRef } from 'react'
import styles from './index.module.scss'

type Props = {
  children: React.ReactElement | string
  top?: number
}

const Sticky = ({ children, top = 0 }: Props) => {
  const childRef = useRef<HTMLDivElement>(null)
  const placeRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    // 当屏幕宽度不同时的换算
    // top / 375 = x / clientW
    const factTop = (top * document.documentElement.clientWidth) / 375

    const place = placeRef.current!
    const child = childRef.current!
    const onScroll = () => {
      if (place.getBoundingClientRect().top <= factTop) {
        child.style.position = 'fixed'
        child.style.top = factTop + 'px'
        place.style.height = child.offsetHeight + 'px'
      } else {
        child.style.position = 'static'
        child.style.top = 'unset'
        place.style.height = 0 + 'px'
      }
    }
    window.addEventListener('scroll', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
    }
  }, [top])
  return (
    <div className={styles.root}>
      {/* 占位元素 */}
      <div className="sticky-placeholder" ref={placeRef} />

      {/* 吸顶显示的元素 */}
      <div className="sticky-container" ref={childRef}>
        {children}
      </div>
    </div>
  )
}

export default Sticky
