/**
 * Created by sprying.fang@gmail.com on 13/03/2018.
 */
import MagixRouter from 'magix-router'

const Hello = () => import('custom/views/hello.mx')
const Nice = () => import('custom/views/nice.mx')
const routes = [{
  path: '/hello.htm',
  view: Hello
}, {
  path: '/nice.htm',
  view: Nice
}]

export default new MagixRouter({
  mode: 'hash',
  routes
})