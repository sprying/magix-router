# 动态路由匹配

我们经常需要把某种模式匹配到的所有路由，全都映射到同个view。例如，我们有一个 `User` view，对于所有 ID 各不相同的用户，都要使用这个视图来渲染。那么，我们可以在  `magix-router` 的路由路径中使用『动态路径参数』（dynamic segment）来达到这个效果：

``` js
define('app/user', function(require, exports, module) {
  module.exports = Magix.View.extend({
    tmpl: '<div>User</div>',
    render: function(){
      this.updater.digest()
    }
  })
})

const router = new MagixRouter({
  routes: [
    // 动态路径参数 以冒号开头
    { path: '/user/:id', view: 'app/user' }
  ]
})
```

现在呢，像 `/user/foo` 和 `/user/bar` 都将映射到相同的路由。

一个『路径参数』使用冒号 `:` 标记。当匹配到一个路由时，参数值会被设置到
 `this.route.params`，可以在每个视图内使用。于是，我们可以更新 `User` 的模板，输出当前用户的 ID：

``` js
define('app/user', function(require, exports, module) {
  module.exports = Magix.View.extend({
    tmpl: '<div>User <%= route.params.id %></div>',
    render: function(){
      this.updater.digest({
        route: this.route
      })
    }
  })
})
```

你可以看看这个[在线例子](https://codepen.io/sprying/pen/wmgXzx)。

你可以在一个路由中设置多段『路径参数』，对应的值都会设置到 `route.params` 中。例如：

| 模式 | 匹配路径 | route.params |
|---------|------|--------|
| /user/:username | /user/evan | `{ username: 'evan' }` |
| /user/:username/post/:post_id | /user/evan/post/123 | `{ username: 'evan', post_id: 123 }` |

除了 `route.params` 外，`route` 对象还提供了其它有用的信息，例如，`route.query`（如果 URL 中有查询参数）、`route.hash` 等等。你可以查看 [API 文档](../api/route-object.md) 的详细说明。

### 响应路由参数的变化

提醒一下，当使用路由参数时，例如从 `/user/foo` 导航到 `/user/bar`，**原来的视图实例会被复用**。因为两个路由都渲染同个组件，比起销毁再创建，复用则显得更加高效。**不过，这也意味着组件的生命周期钩子不会再被调用，需要调用 `observeLocation` 方法，可以查看 [导航守卫](../advanced/navigation-guards.md#observelocation) 的详情说明，path变化时会重新调用 `render` 方法**。

复用组件时，想对路由参数的变化作出响应的话，你可以使用  `beforeRouteUpdate` 守卫：

``` js
define('app/user', function(require, exports, module) {
  module.exports = Magix.View.extend({
    tmpl: '<div>User <%=route.params.id%></div>',
    render: function(){
      this.updater.digest({
        route: this.route
      })
    },
    beforeRouteUpdate (to, from, next) {
      // react to route changes...
      // don't forget to call next()
    }
  })
})
```

### 高级匹配模式

`magix-router` 使用 [path-to-regexp](https://github.com/pillarjs/path-to-regexp) 作为路径匹配引擎，所以支持很多高级的匹配模式，例如：可选的动态路径参数、匹配零个或多个、一个或多个，甚至是自定义正则匹配。查看它的 [文档](https://github.com/pillarjs/path-to-regexp#parameters) 学习高阶的路径匹配，还有 [这个例子 ](https://github.com/sprying/magix-router/tree/dev/examples/webpack/route-matching/app.js) 展示 `magix-router` 怎么使用这类匹配。

### 匹配优先级

有时候，同一个路径可以匹配多个路由，此时，匹配的优先级就按照路由的定义顺序：谁先定义的，谁的优先级就最高。
