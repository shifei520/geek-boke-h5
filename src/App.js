import React, { lazy, Suspense } from 'react'
import { Router, Route, Switch, Redirect } from 'react-router-dom'
import history from './utils/history'
const Login = lazy(() => import('@/pages/Login'))
const Layout = lazy(() => import('@/pages/Layout'))
const EditProfile = lazy(() => import('@/pages/Profile/child-pages/Edit'))
const ChatProfile = lazy(() => import('@/pages/Profile/child-pages/Chat'))

export default function App() {
  return (
    <Router history={history}>
      <div className="app">
        <span></span>
        <Suspense fallback={<div>loading...</div>}>
          <Switch>
            <Redirect exact from="/" to="/home"></Redirect>
            <Route path="/login" component={Login}></Route>
            <Route path="/home" component={Layout}></Route>
            <Route path="/profile/edit" component={EditProfile}></Route>
            <Route path="/profile/chat" component={ChatProfile}></Route>
          </Switch>
        </Suspense>
      </div>
    </Router>
  )
}
