import MagixRouter from 'magix-router'

MagixRouter.install(window.Magix)

const Home = Magix.View.extend({
  tmpl: '<router-view></router-view>',
  render () {
    this.updater.digest({ route: this.route })
  }
})
const Default = Magix.View.extend({
  tmpl: '<div>default</div>',
  render () {
    this.updater.digest({ route: this.route })
  }
})
const Foo = Magix.View.extend({
  tmpl: '<div>foo</div>',
  render () {
    this.updater.digest({ route: this.route })
  }
})
const Bar = Magix.View.extend({
  tmpl: '<div>bar</div>',
  render () {
    this.updater.digest({ route: this.route })
  }
})
const Baz = Magix.View.extend({
  tmpl: '<div>baz</div>',
  render () {
    this.updater.digest({ route: this.route })
  }
})
const WithParams = Magix.View.extend({
  tmpl: '<div><%= route.params.id %></div>',
  render () {
    this.updater.digest({ route: this.route })
  }
})
const Foobar = Magix.View.extend({
  tmpl: '<div>foobar</div>',
  render () {
    this.updater.digest({ route: this.route })
  }
})
const FooBar = Magix.View.extend({
  tmpl: '<div>FooBar</div>',
  render () {
    this.updater.digest({ route: this.route })
  }
})

const router = new MagixRouter({
  mode: 'history',
  base: __dirname,
  routes: [
    { path: '/', view: Home,
      children: [
        { path: '', view: Default },
        { path: 'foo', view: Foo },
        { path: 'bar', view: Bar },
        { path: 'baz', name: 'baz', view: Baz },
        { path: 'with-params/:id', view: WithParams },
        // relative redirect to a sibling route
        { path: 'relative-redirect', redirect: 'foo' }
      ]
    },
    // absolute redirect
    { path: '/absolute-redirect', redirect: '/bar' },
    // dynamic redirect, note that the target route `to` is available for the redirect function
    { path: '/dynamic-redirect/:id?',
      redirect: to => {
        const { hash, params, query } = to
        if (query.to === 'foo') {
          return { path: '/foo', query: null }
        }
        if (hash === '#baz') {
          return { name: 'baz', hash: '' }
        }
        if (params.id) {
          return '/with-params/:id'
        } else {
          return '/bar'
        }
      }
    },
    // named redirect
    { path: '/named-redirect', redirect: { name: 'baz' }},

    // redirect with params
    { path: '/redirect-with-params/:id', redirect: '/with-params/:id' },

    // redirect with caseSensitive
    { path: '/foobar', view: Foobar, caseSensitive: true },

    // redirect with pathToRegexpOptions
    { path: '/FooBar', view: FooBar, pathToRegexpOptions: { sensitive: true }},

    // catch all redirect
    { path: '*', redirect: '/' }
  ]
})

Magix.boot({
  rootId: 'app',
  router
})
