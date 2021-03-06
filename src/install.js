import ViewComponent from './components/view'

export let _Magix

export function install (Magix) {
  if (install.installed && _Magix === Magix) return
  install.installed = true

  _Magix = Magix

  const ctor = function (opts) {
    const router = Magix.config('router')
    let route
    if (!this.owner.parent()) {
      router.init(this)
      route = router.history.current
      Magix.View.merge({
        router,
        route
      })

      ViewComponent.install()
    } else {
      route = router.history.current
    }

    this._observeTag = {
      k: []
    }

    if (opts._renderFrom === 'magix-router') {
      route.matched[opts._depth]['instances'][opts['_viewName']] = this
    }
  }

  const extend = Magix.View.extend
  Magix.View.extend = function (props, statics) {
    const priCtor = props && props.ctor
    props = props || {}

    props.ctor = function () {
      const args = [].slice.apply(arguments)
      ctor.apply(this, args)
      if (priCtor) {
        priCtor.apply(this, args)
      }
    }
    props.observeLocation = function (params) {
      const loc = this._observeTag
      let isObservePath
      if (typeof params === 'object' && params.toString() === '[object Object]') {
        isObservePath = params.path
        params = params.params
      }
      loc.f = 1
      loc.p = isObservePath
      if (params) {
        loc.k = (params + '').split(',')
      }
    }
    return extend.call(this, props, statics)
  }
}
