/* @flow */

import { install, _Magix } from './install'
import { START } from './util/route'
import { assert } from './util/warn'
import { inBrowser } from './util/dom'
import { cleanPath } from './util/path'
import { createMatcher } from './create-matcher'
import { normalizeLocation } from './util/location'
import { supportsPushState } from './util/push-state'

import { HashHistory } from './history/hash'
import { HTML5History } from './history/html5'
import { AbstractHistory } from './history/abstract'

import type { Matcher } from './create-matcher'

import { createRoute, isSameRoute, isIncludedRoute } from './util/route'

import ViewComponent from './components/view'
import { update as updateLinks, clearLink } from './components/link'

export default class MagixRouter {
  static install: () => void;
  static version: string;

  app: any;
  apps: Array<any>;
  ready: boolean;
  readyCbs: Array<Function>;
  options: RouterOptions;
  mode: string;
  history: HashHistory | HTML5History;
  matcher: Matcher;
  fallback: boolean;
  beforeHooks: Array<?NavigationGuard>;
  resolveHooks: Array<?NavigationGuard>;
  afterHooks: Array<?AfterNavigationHook>;

  constructor (options: RouterOptions = {}) {
    this.app = null
    this.apps = []
    this.options = options
    this.beforeHooks = []
    this.resolveHooks = []
    this.afterHooks = []
    this.matcher = createMatcher(options.routes || [], this)

    let mode = options.mode || 'hash'
    this.fallback = mode === 'history' && !supportsPushState && options.fallback !== false
    if (this.fallback) {
      mode = 'hash'
    }
    this.mode = mode

    switch (mode) {
      case 'history':
        this.history = new HTML5History(this, options.base)
        break
      case 'hash':
        this.history = new HashHistory(this, options.base, this.fallback)
        break
      case 'abstract':
        this.history = new AbstractHistory(this, options.base)
        break
      default:
        if (process.env.NODE_ENV !== 'production') {
          assert(false, `invalid mode: ${mode}`)
        }
    }
  }

  match (
    raw: RawLocation,
    current?: Route,
    redirectedFrom?: Location
  ): Route {
    return this.matcher.match(raw, current, redirectedFrom)
  }

  get currentRoute (): ?Route {
    return this.history && this.history.current
  }

  init (app: any) {
    process.env.NODE_ENV !== 'production' && assert(
      install.installed,
      `not installed. Make sure to call \`MagixRouter.install(Magix)\` ` +
      `before creating root instance.`
    )

    // main app already initialized.
    if (this.app) {
      return
    }

    this.app = app

    const history = this.history

    if (history instanceof HTML5History) {
      history.transitionTo(history.getCurrentLocation())
    } else if (history instanceof HashHistory) {
      const setupHashListener = () => {
        history.setupListeners()
      }
      history.transitionTo(
        history.getCurrentLocation(),
        setupHashListener,
        setupHashListener
      )
    } else {
      history.push(history.getCurrentLocation())
    }

    history.listen(changedInfo => {
      // 触发变动更新
      const Vframe = _Magix.Vframe
      const rootVframe = Vframe.get(_Magix.config('rootId'))
      VframeUpdate(rootVframe, changedInfo, this.history.current)
      updateLinks()
    })
  }

  beforeEach (fn: Function): Function {
    return registerHook(this.beforeHooks, fn)
  }

  beforeResolve (fn: Function): Function {
    return registerHook(this.resolveHooks, fn)
  }

  afterEach (fn: Function): Function {
    return registerHook(this.afterHooks, fn)
  }

  onReady (cb: Function, errorCb?: Function) {
    this.history.onReady(cb, errorCb)
  }

  onError (errorCb: Function) {
    this.history.onError(errorCb)
  }

  push (location: RawLocation, onComplete?: Function, onAbort?: Function) {
    this.history.push(location, onComplete, onAbort)
  }

  replace (location: RawLocation, onComplete?: Function, onAbort?: Function) {
    this.history.replace(location, onComplete, onAbort)
  }

  go (n: number) {
    this.history.go(n)
  }

  back () {
    this.go(-1)
  }

  forward () {
    this.go(1)
  }

  getMatchedComponents (to?: RawLocation | Route): Array<any> {
    const route: any = to
      ? to.matched
        ? to
        : this.resolve(to).route
      : this.currentRoute
    if (!route) {
      return []
    }
    return [].concat.apply([], route.matched.map(m => {
      return Object.keys(m.components).map(key => {
        return m.components[key]
      })
    }))
  }

  resolve (
    to: RawLocation,
    current?: Route,
    append?: boolean
  ): {
    location: Location,
    route: Route,
    href: string,
    // for backwards compat
    normalizedTo: Location,
    resolved: Route
  } {
    const location = normalizeLocation(
      to,
      current || this.history.current,
      append,
      this
    )
    const route = this.match(location, current)
    const fullPath = route.redirectedFrom || route.fullPath
    const base = this.history.base
    const href = createHref(base, fullPath, this.mode)
    return {
      location,
      route,
      href,
      // for backwards compat
      normalizedTo: location,
      resolved: route
    }
  }

  addRoutes (routes: Array<RouteConfig>) {
    this.matcher.addRoutes(routes)
    if (this.history.current !== START) {
      this.history.transitionTo(this.history.getCurrentLocation())
    }
  }
}

function registerHook (list: Array<any>, fn: Function): Function {
  list.push(fn)
  return () => {
    const i = list.indexOf(fn)
    if (i > -1) list.splice(i, 1)
  }
}

function createHref (base: string, fullPath: string, mode) {
  const path = mode === 'hash' ? '#' + fullPath : fullPath
  return base ? cleanPath(base + '/' + path) : path
}

MagixRouter.install = install
MagixRouter.version = '__VERSION__'

MagixRouter.createRoute = createRoute
MagixRouter.isSameRoute = isSameRoute
MagixRouter.isIncludedRoute = isIncludedRoute

if (inBrowser && window.Magix) {
  MagixRouter.install(window.Magix)
}

const parentsHasOne = function (vframes, target) {
  let has = false
  while(target) {
    vframes.forEach(function (item) {
      if (item === target.id) {
        has = true
      }
    })
    if (has) {
      break
    }
    target = target.parent()
  }
  return has
}

const VframeUpdate = function (vframe, changeInfo, route) {
  const Vframe = _Magix.Vframe
  let view
  if (vframe && (view = vframe.$v || vframe['@{vframe#view.entity}'])) {
    let isChanged = ViewIsObserveChanged(view, changeInfo)

    // control updating router-view
    ViewComponent.update(vframe, changeInfo)

    if (vframe.hasLinkView) {
      isChanged = true
    }

    if (isChanged) {
      clearLink(vframe.id)
      view['render']()
    } else {
      const cs = vframe.children()
      for (var _i = 0; _i < cs.length; _i++) {
        VframeUpdate(Vframe.get(cs[_i]), changeInfo, route)
      }
    }
  }
}
const ViewIsObserveChanged = function (view, changeInfo) {
  const loc = view._observeTag
  if (!loc) return false
  if (loc.f) {
    if (loc.p && changeInfo.path) {
      return true
    }
    if (loc.k) {
      const query = changeInfo.query
      for (let _i = 0, _a = loc.k; _i < _a.length; _i++) {
        if (query[_a[_i]]) return true
      }
    }
  }
  return false
}
