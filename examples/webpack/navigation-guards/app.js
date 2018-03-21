import MagixRouter from 'magix-router'

MagixRouter.install(window.Magix)

const Home = Magix.View.extend({
  tmpl: '<div>home</div>',
  render () {
    this.updater.digest()
  }
})
const Foo = Magix.View.extend({
  tmpl: '<div>foo</div>',
  render () {
    this.updater.digest()
  }
})
const Bar = Magix.View.extend({
  tmpl: '<div>bar</div>',
  render () {
    this.updater.digest()
  }
})

/**
 * Signatre of all route guards:
 * @param {Route} to
 * @param {Route} from
 * @param {Function} next
 *
 * See http://router.vuejs.org/en/advanced/navigation-guards.html
 * for more details.
 */
function guardRoute (to, from, next) {
  if (window.confirm(`Navigate to ${to.path}?`)) {
    next()
  } else if (window.confirm(`Redirect to /baz?`)) {
    next('/baz')
  } else {
    next(false)
  }
}

// Baz implements an in-component beforeRouteLeave hook
const Baz = Magix.View.extend({
  tmpl: `
    <div>
      <p>baz (<%= saved ? 'saved' : 'not saved' %>)</p>
      <button mx-click="changeState()">save</button>
    </div>
  `,
  render () {
    this.updater.digest({
      saved: false
    })
  },
  beforeRouteLeave (to, from, next) {
    if (this.saved || window.confirm('Not saved, are you sure you want to navigate away?')) {
      next()
    } else {
      next(false)
    }
  },
  'changeState<click>' () {
    this.updater.digest({
      saved: !this.updater.get('saved')
    })
  }
})

// Baz implements an in-component beforeRouteEnter hook
const Qux = Magix.View.extend({
  tmpl: '<div><%= msg %></div>',
  render () {
    this.updater.digest({
      msg: null
    })
  },
  beforeRouteEnter (to, from, next) {
    // Note that enter hooks do not have access to `this`
    // because it is called before the component is even created.
    // However, we can provide a callback to `next` which will
    // receive the vm instance when the route has been confirmed.
    //
    // simulate an async data fetch.
    // this pattern is useful when you want to stay at current route
    // and only switch after the data has been fetched.
    setTimeout(() => {
      next(vm => {
        vm.msg = 'Qux'
      })
    }, 300)
  }
})

// Quux implements an in-component beforeRouteUpdate hook.
// this hook is called when the component is reused, but the route is updated.
// For example, when navigating from /quux/1 to /quux/2.
const Quux = Magix.View.extend({
  tmpl: `<div>id:<%= route.params.id %> prevId:<%= prevId %></div>`,
  init () {
    this.observeLocation({
      path: true
    })
    this.prevId = 0
  },
  beforeRouteUpdate (to, from, next) {
    this.prevId = from.params.id
    next()
  },
  render () {
    this.updater.digest({
      prevId: this.prevId,
      route: this.route
    })
  }
})

const router = new MagixRouter({
  mode: 'history',
  base: __dirname,
  routes: [
    { path: '/', view: Home },

    // inline guard
    { path: '/foo', view: Foo, beforeEnter: guardRoute },

    // using meta properties on the route config
    // and check them in a global before hook
    { path: '/bar', view: Bar, meta: { needGuard: true }},

    // Baz implements an in-component beforeRouteLeave hook
    { path: '/baz', view: Baz },

    // Qux implements an in-component beforeRouteEnter hook
    { path: '/qux', view: Qux },

   // in-component beforeRouteEnter hook for async components
    { path: '/qux-async', view: resolve => {
      setTimeout(() => {
        resolve(Qux)
      }, 0)
    } },

    // in-component beforeRouteUpdate hook
    { path: '/quux/:id', view: Quux }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(m => m.meta.needGuard)) {
    guardRoute(to, from, next)
  } else {
    next()
  }
})

Magix.boot({
  rootId: 'app',
  router
})
