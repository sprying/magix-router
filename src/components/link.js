/* @flow */

import { _Magix } from '../install'
import { createRoute, isSameRoute, isIncludedRoute } from '../util/route'


const cacheList: Array<Link> = []

let installed = false

class Link {
  element: HTMLElement;
  exact: boolean;
  replace: boolean;
  linkClass: string;
  activeClass: string;
  exactActiveClass: string;
  location: Location;
  compareTarget: Route;

  constructor (element: HTMLElement) {
    const router = _Magix.config('router')
    const current = router.history.current
    let to = element.getAttribute('to')
    let colonTo = element.getAttribute(':to')
    if (colonTo) {
      function genToData (data) {
        return data
      }
      to = new Function('genToData', 'return genToData(' + colonTo + ')')(genToData)
    }
    const { location, route, href } = router.resolve(to, current, true)
    this.location = location
    this.exact = element.hasAttribute('exact')
    this.replace = element.hasAttribute('replace')

    const globalLinkClass = router.options.linkClass
    const globalActiveClass = router.options.linkActiveClass
    const globalExactActiveClass = router.options.linkExactActiveClass

    this.linkClass = globalLinkClass? globalLinkClass: ''
    this.activeClass = globalActiveClass ? globalActiveClass: 'router-link-active'
    this.exactActiveClass = globalExactActiveClass? globalExactActiveClass: 'router-link-exact-active'
    this.linkClass = element.hasAttribute('class')? element.getAttribute('class'): this.linkClass
    this.activeClass = element.hasAttribute('active-class') ? element.getAttribute('active-class'): this.activeClass
    this.exactActiveClass = element.hasAttribute('exact-active-class')? element.getAttribute('exact-active-class'): this.exactActiveClass
    this.compareTarget = location.path
      ? createRoute(null, location, null, router)
      : route

    const tag = element.getAttribute('tag')

    let genLink
    if ( !tag || tag === 'a' ) {
      genLink = document.createElement('a')
      genLink.setAttribute('href', href)
    } else {
      genLink = document.createElement(tag)
    }
    genLink.innerHTML = element.innerHTML
    element.parentElement.replaceChild(genLink, element)

    this.element = genLink

    this.bindEvents()
    this.update()

    cacheList.push(this)
  }

  bindEvents () {
    const router = _Magix.config('router')
    const { element, location, replace } = this
    if (element.addEventListener) {
      element.addEventListener('click', handler, false)
    } else if (element.attachEvent) {
      element.attachEvent("onclick", handler)
    } else {
      element["onclick"] = handler
    }

    function handler (event) {
      if (event.preventDefault) {
        event.preventDefault()
      } else {
        event.returnValue = false
      }
      if (replace) {
        router.replace(location)
      } else {
        router.push(location)
      }
    }
  }

  unbindEvents () {
    const { element } = this

    function removeHandler () {
      if (element.removeEventListener) {
        element.removeEventListener(type, handler);
      } else if (element.detachEvent) {
        element.detachEvent("on" + type, handler);
      } else {
        element["on" + type] = null;
      }
    }
  }

  update () {
    const router = _Magix.config('router')
    const current = router.history.current
    const { element } = this

    element.className = this.linkClass + ' ' + (this.exact
      ? isSameRoute(current, this.compareTarget)? this.exactActiveClass + ' ' + this.activeClass: ''
      : isIncludedRoute(current, this.compareTarget)? this.activeClass : '')
  }
}

export function createLink (id) {
  const router = _Magix.config('router')
  const current = router.history.current
  let links = document.querySelectorAll('#' + id + ' router-link')
  links = Array.from(links)

  links.forEach(function (element) {
    new Link(element)
  })
}

export function update () {
  cacheList.forEach(link => {
    link.update()
  })
}

