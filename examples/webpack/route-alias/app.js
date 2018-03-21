import MagixRouter from 'magix-router'

MagixRouter.install(window.Magix)

const Root = Magix.View.extend({
  tmpl: '<div>root</div>',
  render () {
    this.updater.digest()
  }
})
const Home = Magix.View.extend({
  tmpl: '<div><h1>Home</h1><router-view></router-view></div>',
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
const Baz = Magix.View.extend({
  tmpl: '<div>baz</div>',
  render () {
    this.updater.digest()
  }
})
const Default = Magix.View.extend({
  tmpl: '<div>default</div>',
  render () {
    this.updater.digest()
  }
})
const Nested = Magix.View.extend({
  tmpl: '<router-view/>',
  render () {
    this.updater.digest()
  }
})
const NestedFoo = Magix.View.extend({
  tmpl: '<div>nested foo</div>',
  render () {
    this.updater.digest()
  }
})

const router = new MagixRouter({
  mode: 'history',
  base: __dirname,
  routes: [
    { path: '/root', view: Root, alias: '/root-alias' },
    { path: '/home', view: Home,
      children: [
        // absolute alias
        { path: 'foo', view: Foo, alias: '/foo' },
        // relative alias (alias to /home/bar-alias)
        { path: 'bar', view: Bar, alias: 'bar-alias' },
        // multiple aliases
        { path: 'baz', view: Baz, alias: ['/baz', 'baz-alias'] },
        // default child route with empty string as alias.
        { path: 'default', view: Default, alias: '' },
        // nested alias
        { path: 'nested', view: Nested, alias: 'nested-alias',
          children: [
            { path: 'foo', view: NestedFoo }
          ]
        }
      ]
    }
  ]
})

Magix.boot({
  rootId: 'app',
  router
})
