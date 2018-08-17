import { _Magix } from '../install'
import { createLink } from './link'

let uid = 0
const genUid = function () {
  return '_magix_router_view_uid_' + ++uid
}

/**
 * intercept Magix.Vframe.prototype.mountZone, router-view DOM add attribute [mx-view=...] for next mountVframe
 */
function install () {
  const _oldMountZone = _Magix.Vframe.prototype.mountZone
  _Magix.Vframe.prototype.mountZone = function (zoneId, viewInitParams) {
    createLink(zoneId)

    const router = _Magix.config('router')
    const route = router.history.current
    let targets = document.querySelectorAll('#' + zoneId + ' router-view')

    if (targets.length) {
      // depth of router-view in DOM
      let depth = 0
      let owner = this
      owner.hasRouterView = true
      while (owner = owner.parent()) {
        if (owner.hasRouterView === true) depth++
      }
      const routeMatch = route.matched[depth]
      this.depth = depth
      this.routeUid = routeMatch? routeMatch.uid : ''
      this.routerViews = []
      for (let i = 0; i < targets.length; i++) {
        const oldViewElm = targets[i]
        const viewName = oldViewElm.getAttribute('name') || 'default'
        const generatedId = genUid()
        const elmId = oldViewElm.id || genUid()
        const viewElm = document.createElement('div')
        if (routeMatch) {
          let viewPath = routeMatch? routeMatch['views'][viewName] : ''

          if (viewPath) {
            if (typeof viewPath !== 'string') {
              _Magix.addView(generatedId, viewPath)
              viewPath = generatedId
            }

            viewPath += '?_renderFrom=magix-router&_depth=' + depth + '&_viewName=' + viewName
            viewElm.setAttribute('mx-view', viewPath)
          }
        }

        viewElm.setAttribute('id', elmId)

        viewElm.innerHTML = oldViewElm.innerHTML

        oldViewElm.parentElement.replaceChild(viewElm, oldViewElm)
        this.routerViews.push({
          elemId: elmId,
          name: viewName
        })
      }
    }

    _oldMountZone.call(this, zoneId, viewInitParams)
  }
}

/**
 * when route change, determine whether render again
 * @param vframe
 */
function update (vframe) {
  if (vframe.hasRouterView) {
    const router = _Magix.config('router')
    const route = router.history.current
    const { routerViews, depth } = vframe
    const routeMatch = route.matched[depth]

    if (routeMatch && (routeMatch['uid'] !== vframe.routeUid)) {
      if (routerViews.length) {
        routerViews.forEach(view => {
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

          // for developer debug
          const fullPath = viewPath + '?_renderFrom=magix-router&_depth=' + depth + '&_viewName=' + name
          document.getElementById(subZoneId).setAttribute('mx-view', fullPath)

          vframe.unmountVframe(subZoneId)
          vframe.mountVframe(subZoneId, viewPath, viewInitParams)
        })
      }
    }
  }
}

const ViewComponent = {install, update}
export default ViewComponent
