import { Route, Redirect, RouteProps } from 'react-router-dom'
import React from 'react'
import { hasToken } from '@/utils/storage'

interface Props extends RouteProps {
  component: React.ComponentType<any>
}
export default function AuthRoute({ component: Component, ...rest }: Props) {
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
