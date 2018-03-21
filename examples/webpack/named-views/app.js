import MagixRouter from 'magix-router'

MagixRouter.install(window.Magix)

const Foo = Magix.View.extend({
  tmpl: '<div>foo</div>',
  render: function(){
    this.updater.digest()
  }
})
const Bar = Magix.View.extend({
  tmpl: '<div>bar</div>',
  render: function(){
    this.updater.digest()
  }
})
const Baz = Magix.View.extend({
  tmpl: '<div>baz</div>',
  render: function(){
    this.updater.digest()
  }
})

const router = new MagixRouter({
  mode: 'history',
  base: __dirname,
  routes: [
    { path: '/',
      // a single route can define multiple named components
      // which will be rendered into <router-view>s with corresponding names.
      views: {
        default: Foo,
        a: Bar,
        b: Baz
      }
    },
    {
      path: '/other',
      views: {
        default: Baz,
        a: Bar,
        b: Foo
      }
    }
  ]
})

Magix.boot({
  rootId: 'app',
  router
})
