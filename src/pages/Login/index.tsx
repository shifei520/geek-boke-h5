import NavBar from '@/components/NavBar'
import styles from './index.module.scss'
import Input from '@/components/Input'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import classname from 'classnames'
import { useDispatch } from 'react-redux'
import { sendCode, login } from '@/store/actions/login'
import { Toast } from 'antd-mobile'
import { useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
// import

// 表单验证规则
// const validate = (values) => {
//   const errors = {}
//   if (!values.mobile) {
//     errors.mobile = '请输入手机号'
//   }
//   if (!values.code) {
//     errors.code = '请输入验证码'
//   }
//   return errors
// }

type TLocation = {
  from: string
}

export default function Login() {
  const dispatch = useDispatch()
  const history = useHistory()
  const location = useLocation<TLocation>()
  const [count, setCount] = useState(0)

  // 获取验证码
  const getCode = async () => {
    if (count > 0) return
    if (!/^1[3-9]\d{9}$/.test(mobile)) {
      formik.setTouched({
        mobile: true
      })
      return
    }
    await dispatch(sendCode(mobile))
    Toast.show({
      icon: 'success',
      content: '验证码发送成功'
    })
    setCount(5)
    let timer = setInterval(() => {
      console.log('定时器')
      setCount((count) => {
        if (count <= 1) clearInterval(timer)
        return count - 1
      })
    }, 1000)
  }
  // 表单校验
  const formik = useFormik({
    initialValues: {
      mobile: '15178175014',
      code: '246810'
    },
    onSubmit: async (values) => {
      await dispatch(login(values))
      Toast.show({
        icon: 'success',
        content: '登陆成功'
      })

      // 如果是从其他页面从定向到登录页，登录后从新回到原来的页面；否则跳转到首页
      const path = location.state ? location.state.from : '/home/index'
      history.replace(path)
    },
    // validate
    validationSchema: Yup.object({
      mobile: Yup.string()
        .required('手机号不能为空')
        .matches(/^1[3-9]\d{9}$/, '手机号格式错误'),
      code: Yup.string()
        .required('验证码不能为空')
        .matches(/^\d{6}$/, '验证码格式错误')
    })
  })
  const {
    handleSubmit,
    handleChange,
    values: { mobile, code },
    touched,
    errors,
    handleBlur
  } = formik
  return (
    <div className={styles.root}>
      <NavBar extra="详情">登录</NavBar>
      <div className="content">
        {/* 标题 */}
        <h3>短信登录</h3>
        <form onSubmit={handleSubmit}>
          {/* 手机号输入框 */}
          <div className="input-item">
            <Input
              type="text"
              placeholder="请输入手机号"
              name="mobile"
              onChange={handleChange}
              value={mobile}
              onBlur={handleBlur}
              maxLength={11}
            ></Input>
            {errors.mobile && touched.mobile ? (
              <div className="validate">{errors.mobile}</div>
            ) : null}
          </div>
          {/* 短信验证码输入框 */}
          <div className="input-item">
            <Input
              type="text"
              placeholder="请输入验证码"
              name="code"
              extra={count <= 0 ? '获取验证码' : count + 's'}
              onExtraClick={getCode}
              onChange={handleChange}
              value={code}
              onBlur={handleBlur}
              maxLength={6}
            ></Input>
            {errors.code && touched.code ? (
              <div className="validate">{errors.code}</div>
            ) : null}
          </div>
          <button
            className={classname('login-btn', { disabled: !formik.isValid })}
            type="submit"
          >
            登录
          </button>
        </form>
      </div>
    </div>
  )
}
