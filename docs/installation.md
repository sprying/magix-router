# 安装

### 直接下载 / CDN

在 Magix 后面加载 `magix-router`，它会自动安装的：

``` html
<script src="/path/to/magix.js"></script>
<!--magix3官方scaffold中将magix和它依赖的库（如jQuery）、加载器一起打包成boot.js-->
<script src="/path/to/magix-router.js"></script>
```

无线场景下webpack版本的 `magix-router` 引入

```html
<script src="https://g.alicdn.com/cell/lib-zepto/0.0.2/index.js"></script>
<!--magix必须依赖第三方库-->
<script src="https://g.alicdn.com/cell/lib-magix/0.0.15/index-debug.js"></script>
<script src="https://g.alicdn.com/cell/lib-router/0.0.8/index.js"></script>
```

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
