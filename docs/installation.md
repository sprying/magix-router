# 安装

`magix-router` 现在支持 `magix3.7.0` 版本

无线端 cell ，它的 magix3 是基于 `magix3.7.0` 做了定制，`magix-router` 也同时支持cell场景。

由于 magix3 小版本升级时，可能会导致 magix-router 不能使用，发现了欢迎联系我。

## cdn地址

```html
<script src="https://g.alicdn.com/cell/lib-router/0.0.9/index.js"></script>
```

### 无线场景下webpack版本的 `magix-router` 引入

```html
<script src="https://g.alicdn.com/cell/lib-zepto/0.0.2/index.js"></script>
<!--magix要依赖第三方基类库-->
<script src="https://g.alicdn.com/cell/lib-magix/0.0.15/index.js"></script>
<script src="https://g.alicdn.com/cell/lib-router/0.0.9/index.js"></script>
```

后面的demo都是基于无线场景

### cmd-seajs下引入与使用

magix 对外的库已经自带了路由，首先我们要去掉自带的路由，下载 [magix 源码](https://github.com/thx/magix)，定制一个无路由功能的magix，为了方便演示，生成了一个在线链接

```
https://unpkg.com/easy-magix/dist/cmd/magix-debug.js
```

下面是 magix-router 简单demo

``` html
<script src="https://unpkg.com/seajs@3.0.2/dist/sea-debug.js"></script>
<script src="https://unpkg.com/jquery@3.1.1/dist/jquery.js"></script>
<script src="https://g.alicdn.com/cell/lib-router/0.0.9/index.js"></script>

<div id="app">
  <router-view></router-view>
</div>
```

```js
seajs.config({
  alias:{
    magix:'https://unpkg.com/easy-magix/dist/cmd/magix-debug'
  }
});
define('$',function(){
  return jQuery;
});
seajs.use('magix',function(Magix){
  MagixRouter.install(Magix)
  var router = new MagixRouter({
    routes: [
      {
        path: '/a',
        view: 'app/index'
      }
    ]
  })
  Magix.boot({
    rootId: 'app',
    router: router
  });
});
define('app/index', function (require, module, exports) {
  var Magix = require('magix')
  return Magix.View.extend({
    render: function () {
      this.setHTML(this.id, 'hello')
    }
  })
})
```

## NPM

``` bash
npm install magix-router
```

如果引入的 Magix 库，它的 Magix 变量没有暴露到全局，引入了 magix-router 后，需要再调用下 `MagixRouter.install(Magix)` 明确地安装路由功能。
如果Magix 变量暴露到全局，引入了 magix-router 后就OK了，内部会自动调 `MagixRouter.install(window.Magix)`

``` js
import MagixRouter from 'magix-router'
```

## 构建开发版

如果你想使用最新的开发版，就得从 GitHub 上直接 clone，然后自己 build 一个 `magix-router`。

``` bash
git clone https://github.com/sprying/magix-router.git node_modules/magix-router
cd node_modules/magix-router
npm install
npm run build
```
