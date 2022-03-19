import React from 'react'
import styles from './index.module.scss'
import classname from 'classnames'
import { InputHTMLAttributes } from 'react'

// 方法一
// interface Props extends InputHTMLAttributes<HTMLInputElement> {
//   extra?: string
//   onExtraClick?: () => void
//   className?: string
//   type?: 'text' | 'password'
// }
// 方法二
type Props = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  extra?: string
  onExtraClick?: () => void
  className?: string
  type?: 'text' | 'password'
}
export default function Input({
  extra,
  onExtraClick,
  className,
  ...rest
}: Props) {
  return (
    <div className={styles.root}>
      <input className={classname('input', className)} {...rest} />
      {extra && (
        <div className="extra" onClick={onExtraClick}>
          {extra}
        </div>
      )}
    </div>
  )
}
