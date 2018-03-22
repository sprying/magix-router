# 安装

### 直接下载 / CDN

cmd-seajs下引入与使用

magix 官方打包的npm中已经有了自带的路由功能，首先我们要去掉自带的路由，magix提供了可定制打包，这里我已经生成一个在线链接。

``` html
<script src="https://unpkg.com/seajs@3.0.2/dist/sea-debug.js"></script>
<script src="https://unpkg.com/jquery@3.1.1/dist/jquery.js"></script>
<script src="http://localhost:63342/magix-router/dist/magix-router.js"></script>

<div id="app">
  <router-view></router-view>
</div>
```

```js
seajs.config({
  alias:{
    magix:'https://unpkg.com/easy-magix/dist/cmd/magix-debug'//注意我们使用的是dist中的cmd
  }
});
define('$',function(){//magix中对DOM类库的依赖使用的是$做为标识，这里我们进行适配
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

无线场景下webpack版本的 `magix-router` 引入

```html
<script src="https://g.alicdn.com/cell/lib-zepto/0.0.2/index.js"></script>
<!--magix必须依赖第三方库-->
<script src="https://g.alicdn.com/cell/lib-magix/0.0.15/index.js"></script>
<script src="https://g.alicdn.com/cell/lib-router/0.0.8/index.js"></script>
```

后面的demo都是基于无线场景

### NPM

``` bash
npm install magix-router
```

如果在一个模块化工程中使用它，必须要通过 `Magix.install()` 明确地安装路由功能：
不过Magix不支持npm方式引入，继续以外链形式引入，Magix会暴露在全局window。
引入的MagixRouter，会自动调 `MagixRouter.install(window.Magix)`

``` js
import MagixRouter from 'magix-router'
```

### 构建开发版

如果你想使用最新的开发版，就得从 GitHub 上直接 clone，然后自己 build 一个 `magix-router`。

``` bash
git clone https://github.com/sprying/magix-router.git node_modules/magix-router
cd node_modules/magix-router
npm install
npm run build
```
