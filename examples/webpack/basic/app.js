import MagixRouter from 'magix-router'


// 1. Use plugin.
// This installs <router-view> and <router-link>,
// and injects router and route to all child views
// MagixRouter.install(window.Magix)
// because of Magix exporting global, there is no need to execute

// 2. Define route views
const Home = Magix.View.extend({
  tmpl: '<div><h2>Home</h2></div>',
  render () {
    this.updater.digest()
  }
})
const Foo = Magix.View.extend({
  tmpl: '<div><h2>foo</h2></div>',
  render () {
    this.updater.digest()
  }
})
const Bar = Magix.View.extend({
  tmpl: '<div><h2>bar</h2></div>',
  render () {
    this.updater.digest()
  }
})

// 3. Create the router
const router = new MagixRouter({
  mode: 'abstract',
  base: __dirname,
  routes: [
    { path: '/', view: Home },
    { path: '/foo', view: Foo },
    { path: '/bar', view: Bar }
  ]
})

// 4. Create and mount root instance.
// Make sure to inject the router.
// Route views will be rendered inside <router-view>.
Magix.boot({
  rootId: 'app',
  router
})
