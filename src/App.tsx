import { lazy, Suspense } from 'react'
import { Router, Route, Switch, Redirect } from 'react-router-dom'
import history from './utils/history'
import KeepAlive from '@/components/KeepAlive'
const Login = lazy(() => import('@/pages/Login'))
const Layout = lazy(() => import('@/pages/Layout'))
const EditProfile = lazy(() => import('@/pages/Profile/child-pages/Edit'))
const ChatProfile = lazy(() => import('@/pages/Profile/child-pages/Chat'))
const NotFound = lazy(() => import('@/pages/NotFound'))
const FeedBack = lazy(() => import('@/pages/Profile/child-pages/FeedBack'))
const Search = lazy(() => import('@/pages/Search'))
const SearchResult = lazy(() => import('@/pages/Search/child-pages/Result'))
const ArticleDetail = lazy(() => import('@/pages/ArticleDeatil'))

export default function App() {
  return (
    <Router history={history}>
      <div className="app">
        <Suspense fallback={<div>loading...</div>}>
          <KeepAlive
            alivePath="/home/index"
            path="/home/index"
            component={Layout}
          ></KeepAlive>
          <KeepAlive
            alivePath="/home/question"
            path="/home/question"
            component={Layout}
          ></KeepAlive>
          <KeepAlive
            alivePath="/home/video"
            path="/home/video"
            component={Layout}
          ></KeepAlive>
          <KeepAlive
            alivePath="/home/profile"
            path="/home/profile"
            component={Layout}
          ></KeepAlive>
          <Switch>
            <Redirect exact from="/" to="/home/index"></Redirect>
            <Route path="/login" component={Login}></Route>
            {/* <Route path="/home/index" component={Layout}></Route> */}
            <Route path="/search" exact component={Search}></Route>
            <Route path="/search/result" exact component={SearchResult}></Route>
            <Route path="/article/:id" exact component={ArticleDetail}></Route>
            <Route path="/profile/edit" component={EditProfile}></Route>
            <Route path="/profile/chat" component={ChatProfile}></Route>
            <Route path="/profile/feedback" component={FeedBack}></Route>
            <Route
              render={(props) => {
                if (!props.location.pathname.startsWith('/home')) {
                  return <NotFound />
                }
              }}
            ></Route>
          </Switch>
        </Suspense>
      </div>
    </Router>
  )
}
