import MagixRouter from 'magix-router'

MagixRouter.install(window.Magix)

const Home = Magix.View.extend({
  tmpl: '<div><h2>Home</h2></div>',
  render () {
    this.updater.digest()
  },
  beforeRouteEnter: function (to, from, next) {
    next()
  }
})

const About = Magix.View.extend({
  tmpl: '<div><h2>About</h2></div>',
  render () {
    this.updater.digest()
  }
})

const Users = Magix.View.extend({
  tmpl: `
    <div>
      <h2>Users</h2>
      <router-view></router-view>
    </div>
  `,
  render () {
    this.updater.digest()
  }

})

const User = Magix.View.extend({
  tmpl: `<div><%= route.params.username %></div>`,
  render () {
    this.updater.digest({
      route: this.route
    })
  }
})

const router = new MagixRouter({
  mode: 'hash',
  base: __dirname,
  routes: [
    {path: '/', view: Home},
    {path: '/about', view: About},
    {
      path: '/users', view: Users,
      children: [
        {path: ':username', name: 'user', view: User}
      ]
    },
  ]
})

Magix.boot({
  rootId: 'app', // root view html structure detail reference related html file
  router
})
