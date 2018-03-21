import ViewComponent from './components/view'
import {createLink} from './components/link'

export let _Magix

export function install (Magix) {
  if (install.installed && _Magix === Magix) return
  install.installed = true

  _Magix = Magix
  const me = this

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

    this.on('rendered', e => {
      createLink(this.owner.id)
    })
  }

  const extend = Magix.View.extend
  Magix.View.extend = function (props, statics) {
    props = props || {}
    props.ctor = ctor
    props.observeLocation = function(params) {
      const loc = this._observeTag
      let isObservePath
      if (typeof params === 'object' && params.toString() === '[object Object]') {
        isObservePath = params.path
        params = params.params;
      }
      loc.f = 1
      loc.p = isObservePath;
      if (params) {
        loc.k = (params + '').split(',')
      }
    }
    return extend.call(this, props, statics)
  }
}
