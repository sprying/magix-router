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
    let targets = document.querySelectorAll('#' + zoneId + ' [router-view]')
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
      this.routeUid = routeMatch.uid
      this.routerViews = this.routerViews || []
      targets.forEach(filter => {
        const viewName = filter.getAttribute('name') || 'default'
        const generatedId = genUid()
        let viewPath = routeMatch['views'][viewName]
        viewPath += '?_renderFrom=magix-router&_depth=' + depth + '&_viewName=' + viewName
        filter.setAttribute('mx-view', viewPath)
        filter.setAttribute('id', generatedId)
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
 * when route change, jude if remount [router-view]
 * @param vframe
 */
function update (vframe) {
  if (vframe.hasRouterView) {
    const router = _Magix.config('router')
    const route = router.history.current
    const routerViews = vframe.routerViews
    const depth = vframe.depth
    const routeMatch = route.matched[depth]

    if (routeMatch['uid'] !== vframe.routeUid) {
      if (routerViews.length) {
        routerViews.forEach(function (view) {
          const name = view.name
          const subZoneId = view.elemId
          const viewPath = routeMatch.views[name]
          const viewInitParams = {
            '_renderFrom': 'magix-router',
            '_depth': depth,
            '_viewName': name
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