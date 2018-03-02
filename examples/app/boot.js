//#loader=none;
if (typeof DEBUG == 'undefined') DEBUG = true
'@./lib/sea.js'
'@./lib/jquery.js'
define('$', () => {
  return jQuery
})
'@./lib/magix.js'

;(() => {
  let node = document.getElementById('boot')
  let src = node.src.replace('/boot.js', '')
  let Env = {
    cdn: src
  }
  seajs.config({
    paths: {
      app: Env.cdn
    }
  })
  seajs.use(['magix', 'app/router'], (Magix, router) => {
    Magix.applyStyle('@scoped.style')

    Magix.boot({
      rootId: 'app',
      router,
      defaultView: 'app/views/app'
    })
  })
})();