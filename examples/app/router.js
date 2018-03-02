/**
 * Created by sprying.fang@gmail.com on 20/01/2018.
 */
const MagixRouter = require('app/plugins/magix-router.common.js')
const Magix = require('magix')

Magix.use(MagixRouter)

const routes = [
  {
    path: '/',
    view: 'app/views/index'
  },
  {
    path: '/report',
    view: 'app/views/background',
    children: [
      {
        path: '/report/index',
        view: 'app/views/report',
        beforeEnter (to, from, next) {
          next(true)
        },
        children: [
          {
            path: '/report/cpevent',
            view: 'app/views/reportContent',
            alias: '/report/cpevent-alias'
          }
        ]
      },
      {
        name: 'userInfo',
        path: '/user/:id',
        view: 'app/views/user'
      },
      {
        path: '/myaccount',
        meta: { requiresAuth: true },
        view: 'app/views/myaccount'
      },
      {
        path: '/report/cpevent-old',
        redirect: '/report/cpevent'
      }
    ]
  },
  {
    path: '/login',
    view: 'app/views/login'
  },
  {
    path: '*',
    view: 'app/views/404'
  }
]

const router = new MagixRouter({
  mode: 'history',
  routes
})
router.beforeEach(function (to, from, next) {
  // 登录判断
  if (!Magix.config('hasLogin') && to.meta.requiresAuth) {
    next({
      path: '/login',
      query: {
        from: to.path
      }
    })
  } else {
    next()
  }
})
module.exports = router
