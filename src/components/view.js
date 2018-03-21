import { _Magix } from '../install'

let uid = 0
const genUid = function () {
  return '_magix_router_view_uid_' + ++uid
}

/**
 * intercept Magix.Vframe.prototype.mountZone, add DOM [router-view] attribute [mx-view=...], ready for next mountVframe
 */
function install () {
  const router = _Magix.config('router')
  const _oldMountZone = _Magix.Vframe.prototype.mountZone
  _Magix.Vframe.prototype.mountZone = function (zoneId, viewInitParams) {
    const route = router.history.current
    let targets = document.querySelectorAll('#' + zoneId + ' router-view')
    targets = Array.from(targets)

    let depth = 0
    let owner = this
    if (targets.length) {
      owner.hasRouterView = true
      while (owner = owner.parent()) {
        if (owner.hasRouterView === true) depth++
      }
      const routeMatch = route.matched[depth]
      this.depth = depth
      this.routeUid = routeMatch? routeMatch.uid: ''
      this.routerViews = this.routerViews || []
      targets.forEach(filter => {
        const viewName = filter.getAttribute('name') || 'default'
        const generatedId = genUid()
        const wrapper = document.createElement('div')
        if (routeMatch) {
          let viewPath = routeMatch? routeMatch['views'][viewName]: ''

          if (viewPath) {
            if (typeof viewPath !== 'string') {
              _Magix.addView(generatedId, viewPath)
              viewPath = generatedId
            }
            viewPath += '?_renderFrom=magix-router&_depth=' + depth + '&_viewName=' + viewName
            wrapper.setAttribute('mx-view', viewPath)
          }
        }
        wrapper.setAttribute('id', generatedId)
        filter.parentElement.replaceChild(wrapper, filter)
        this.routerViews.push({
          elemId: generatedId,
          name: viewName
        })
      })
    }

    _oldMountZone.call(this, zoneId, viewInitParams)
  }
}

/**
 * when route change, determine if you need to render again
 * @param vframe
 */
function update (vframe) {
  if (vframe.hasRouterView) {
    const router = _Magix.config('router')
    const route = router.history.current
    const routerViews = vframe.routerViews
    const depth = vframe.depth
    const routeMatch = route.matched[depth]

    if (routeMatch && (routeMatch['uid'] !== vframe.routeUid)) {
      if (routerViews.length) {
        routerViews.forEach(function (view) {
          const name = view.name
          const subZoneId = view.elemId
          let viewPath = routeMatch.views[name]

          if (!viewPath) return
          const viewInitParams = {
            '_renderFrom': 'magix-router',
            '_depth': depth,
            '_viewName': name
          }
          if (typeof viewPath !== 'string') {
            const generatedId = genUid()
            _Magix.addView(generatedId, viewPath)
            viewPath = generatedId
          }
          vframe.routeUid = routeMatch.uid
          vframe.unmountVframe(subZoneId)
          vframe.mountVframe(subZoneId, viewPath, viewInitParams)
        })
      }
    }
  }
}

const ViewComponent = {install, update}
export default ViewComponent