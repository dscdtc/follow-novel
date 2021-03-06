import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const novel = () => import('comp/novel/novel')
const community = () => import('comp/community/community')
const discover = () => import('comp/discover/discover')
const search = () => import('comp/search/search')
const reader = () => import('comp/reader/reader')
const srclist = () => import('comp/srclist/srclist')

const routes = [
  {
    path: '/',
    redirect: '/novel'
  },
  {
    path: '/novel',
    component: novel
  },
  {
    path: '/community',
    component: community
  },
  {
    path: '/discover',
    component: discover
  },
  {
    path: '/search',
    component: search
  },
  {
    path: '/reader',
    component: reader
  },
  {
    path: '/srclist',
    component: srclist
  }
]

export default new Router({
  routes,
  linkActiveClass: 'active'
})
