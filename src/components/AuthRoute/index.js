import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { hasToken } from '@/utils/storage'

export default function AuthRoute({ component: Component, ...rest }) {
  return (
    <Route
      {...rest}
      render={({ location }) => {
        if (hasToken()) {
          return <Component></Component>
        } else {
          return (
            <Redirect
              to={{
                pathname: '/login',
                state: { from: location.pathname }
              }}
            ></Redirect>
          )
        }
      }}
    ></Route>
  )
}
