export let _Magix

export function install (Magix) {
  if (install.installed && _Magix === Magix) return
  install.installed = true

  _Magix = Magix

  const ctor = function () {
    if (!this.owner.parent()) {
      const router = Magix.config('router')
      router.init()
      const route = router.history.current
      Magix.View.merge({
        router,
        route
      })
    }
  }
  Magix.View.merge({
    ctor
  })
}
