# 命名视图

有时候想同时（同级）展示多个视图，而不是嵌套展示，例如创建一个布局，有 `sidebar`（侧导航） 和 `main`（主内容） 两个视图，这个时候命名视图就派上用场了。你可以在界面中拥有多个单独命名的视图，而不是只有一个单独的出口。如果 `router-view` 没有设置名字，那么默认为 `default`。

``` html
<router-view class="view one"></router-view>
<router-view class="view two" name="a"></router-view>
<router-view class="view three" name="b"></router-view>
```

一个视图使用一个组件渲染，因此对于同个路由，多个视图就需要多个组件。确保正确使用 `views` 配置（带上 s）：

``` js
const router = new MagixRouter({
  routes: [
    {
      path: '/',
      views: {
        default: Foo,
        a: Bar,
        b: Baz
      }
    }
  ]
})
```

以上案例相关的可运行代码请[移步这里](https://codepen.io/sprying/pen/wmgXmQ)。

## 嵌套命名视图

我们也有可能使用命名视图创建嵌套视图的复杂布局。这时你也需要命名用到的嵌套 `router-view` 组件。我们以一个设置面板为例：

```
/settings/emails                                       /settings/profile
+-----------------------------------+                  +------------------------------+
| UserSettings                      |                  | UserSettings                 |
| +-----+-------------------------+ |                  | +-----+--------------------+ |
| | Nav | UserEmailsSubscriptions | |  +------------>  | | Nav | UserProfile        | |
| |     +-------------------------+ |                  | |     +--------------------+ |
| |     |                         | |                  | |     | UserProfilePreview | |
| +-----+-------------------------+ |                  | +-----+--------------------+ |
+-----------------------------------+                  +------------------------------+
```

- `Nav` 只是一个常规视图。
- `UserSettings` 是一个视图。
- `UserEmailsSubscriptions`、`UserProfile`、`UserProfilePreview` 是嵌套的视图。

**注意**：_我们先忘记 HTML/CSS 具体的布局的样子，只专注在用到的视图上_

`UserSettings` 视图的 `<template>` 部分应该是类似下面的这段代码：

```html
<!-- UserSettings.mx -->
<div>
  <h1>User Settings</h1>
  <NavBar/>
  <router-view/>
  <router-view name="helper"/>
</div>
```

_嵌套的视图在此已经被忽略了，但是你可以在[这里](https://codepen.io/sprying/pen/BrpPZB)找到完整的源代码_

然后你可以用这个路由配置完成该布局：

```js
{
  path: '/settings',
  // 你也可以在顶级路由就配置命名视图
  component: UserSettings,
  children: [{
    path: 'emails',
    view: UserEmailsSubscriptions
  }, {
    path: 'profile',
    views: {
      default: UserProfile,
      helper: UserProfilePreview
    }
  }]
}
```

一个可以工作的示例的 demo 在[这里](https://codepen.io/sprying/pen/BrpPZB)。
