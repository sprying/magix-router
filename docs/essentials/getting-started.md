# Getting Started

> 教程中的案例代码将使用 [ES2015](https://github.com/lukehoban/es6features) 来编写。

用 Magix + magix-router 创建单页应用，是非常简单的。使用 Magix ，我们已经可以通过组合view来组成应用程序，当你要把 magix-router 添加进来，我们需要做的是，将视图(views)映射到路由(routes)，然后告诉 magix-router 在哪里渲染它们。下面是个基本例子：

> 所有的例子都将 Magix 以解析模板。更多细节请[移步这里](https://thx.github.io/magix)。

### HTML

``` html
<script src="https://unpkg.com/seajs@3.0.2/dist/sea.js"></script>
<script src="//g.alicdn.com??/cell/lib-zepto/0.0.2/index.js,cell/lib-magix/0.0.15/index.js"></script>
<script src="https://unpkg.com/magix-router/dist/magix-router.js"></script>

<div id="app">
  <h1>Hello App!</h1>
  <p>
    <!-- 使用 router-link 组件来导航. -->
    <!-- 通过传入 `to` 属性指定链接. -->
    <!-- <router-link> 默认会被渲染成一个 `<a>` 标签 -->
    <router-link to="/foo">Go to Foo</router-link>
    <router-link to="/bar">Go to Bar</router-link>
  </p>
  <!-- 路由出口 -->
  <!-- 路由匹配到的组件将渲染在这里 -->
  <router-view></router-view>
</div>
```

### JavaScript

```js
// 0. 如果使用模块化机制编程，导入Magix和MagixRouter，要调用 MagixRouter.install(window.Magix)

// 1. 定义（路由）组件。
// 可以从其他文件 import 进来
define('app/views/hello', function (require, exports, module) {
 module.exports = Magix.View.extend({
   render: function () {
     this.setHTML(this.id, 'hello')
   }
 })
})
define('app/views/nice', function (require, exports, module) {
 module.exports = Magix.View.extend({
   render: function () {
     this.setHTML(this.id, 'nice')
   }
 })
})

define('app/router', function (require, exports, module) {
  // 2. 定义路由
  // 每个路由应该映射一个view。 其中"view" 可以是
  // 模块路径
  // 或者，只是返回promise的函数。
  // 我们晚点再讨论嵌套路由。
  var routes = [{
    path: '/hello.htm',
    view: 'app/views/hello'
  }, {
    path: '/nice.htm',
    view: 'app/views/nice'
  }]

  // 3. 创建 router 实例，然后传 `routes` 配置
  // 你还可以传别的配置参数, 不过先这么简单着吧。
  module.exports = new MagixRouter({
    routes
  })
})

// 4. 创建和挂载根实例。
// 记得要通过 router 配置参数注入路由，
// 从而让整个应用都有路由功能
define('app/main', function (require, exports, module) {
  var router = require('app/router')
  Magix.boot({
    rootId: 'app',
    router
  })
})

seajs.use('app/main')
```

通过注入路由器，我们可以在任何view实例内通过 `this.router` 访问路由器，也可以通过 `this.route` 访问当前路由：

```js
// Home.js
export default Magix.View.extend({
  'goBack<click>' () {
    window.history.length > 1
      ? this.router.go(-1)
      : this.router.push('/')
  }
})
```

该文档通篇都常使用 `router` 实例。留意一下 `this.router` 和 `router` 使用起来完全一样。我们使用 `this.router` 的原因是我们并不想在视图中都导入路由。

你可以看看这个[在线的](https://codepen.io/sprying/pen/MVaNJj)例子。

要注意，当 `<router-link>` 对应的路由匹配成功，将自动设置 class 属性值  `.router-link-active`。查看 [API 文档](../api/router-link.md) 学习更多相关内容。
