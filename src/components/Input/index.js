import React from 'react'
import styles from './index.module.scss'
import classname from 'classnames'

export default function Input({ extra, onExtraClick, className, ...rest }) {
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
