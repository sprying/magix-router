# 安装

### 直接下载 / CDN

在 Magix 后面加载 `magix-router`，它会自动安装的：

``` html
<script src="/path/to/magix.js"></script><!--magix3官方scoffold中将magix和它依赖的库（如jQuery）、加载器一起打包成boot.js-->
<script src="/path/to/magix-router.js"></script>
```

### NPM

``` bash
npm install magix-router
```

如果在一个模块化工程中使用它，必须要通过 `Magix.install()` 明确地安装路由功能：

``` js
import Magix from 'magix'
import MagixRouter from 'magix-router'

MagixRouter.install(Magix)
```

如果使用全局的 script 标签，则无须如此（手动安装）。

### 构建开发版

如果你想使用最新的开发版，就得从 GitHub 上直接 clone，然后自己 build 一个 `magix-router`。

``` bash
git clone https://github.com/sprying/magix-router.git node_modules/magix-router
cd node_modules/magix-router
npm install
npm run build
```
