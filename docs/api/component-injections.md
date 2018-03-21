# 对视图注入

### 注入的属性

通过在 Magix.boot时候 传入 router 实例，下面这些属性成员会被注入到每个子view的共同View原型上，从而可在继承的子view中使用。

- #### router

  router 实例。

- #### route

  当前激活的[路由信息对象](route-object.md)。这个属性是只读的，里面的属性是 immutable（不可变） 的。

### 允许的额外配置（待后续补充）

- **beforeRouteEnter**
- **beforeRouteUpdate**
- **beforeRouteLeave**

  查看[组件内的守卫](../advanced/navigation-guards.md#组件内的守卫)。
