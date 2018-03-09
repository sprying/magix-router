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
    if (opts._renderFrom === 'magix-router') {
      route[opts._depth]['instances'][opts['_viewName']] = this
    }

    this.on('rendered', e => {
      createLink(this.owner.id)
    })
  }
  Magix.View.merge({
    ctor
  })


  const Magix_Cfg = Magix.config()
  Magix.addViews = function(name, promiseObj){
    var cfgViews = Magix_Cfg.views = Magix_Cfg.views || {}
    cfgViews[name] = promiseObj
  }
}
