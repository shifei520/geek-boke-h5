import React from 'react'
import { ActionSheet } from 'antd-mobile'

export default function EditList({ visible, actions, onClose, onAction }) {
  return (
    <ActionSheet
      cancelText="取消"
      visible={visible}
      actions={actions}
      onClose={onClose}
      onAction={onAction}
    />
  )
}
