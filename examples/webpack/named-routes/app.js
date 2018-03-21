import MagixRouter from 'magix-router'

const Home = Magix.View.extend({
  tmpl: '<div>This is Home</div>',
  render () {
    this.updater.digest()
  }
})
const Foo = Magix.View.extend({
  tmpl: '<div>This is Foo</div>',
  render () {
    this.updater.digest()
  }
})
const Bar = Magix.View.extend({
  tmpl: '<div>This is Bar <%= route.params.id %></div>',
  render () {
    this.updater.digest({
      route: this.route
    })
  }
})
const App = Magix.View.extend({
  tmpl: `
    <h1>Named Routes</h1>
    <p>Current route name: <%= route.name %></p>
    <ul>
      <li><router-link :to='{ "name": "home" }'>home</router-link></li>
      <li><router-link :to='{ "name": "foo" }'>foo</router-link></li>
      <li><router-link :to='{ name: "bar", params: { id: "123" }}'>bar</router-link></li>
    </ul>
    <router-view class="view"></router-view>
  `,
  init () {
    this.observeLocation({
      path: true
    })
  },
  render () {
    this.updater.digest({
      route: this.route
    })
  }
})

const router = new MagixRouter({
  mode: 'history',
  base: __dirname,
  routes: [
    { path: '/', name: 'home', view: Home },
    { path: '/foo', name: 'foo', view: Foo },
    { path: '/bar/:id', name: 'bar', view: Bar }
  ]
})

Magix.addView('App', App)
Magix.boot({
  rootId: 'app',
  router,
  defaultView: 'App'
})
