* 2018-07-27 # v0.0.14
1. fix bug
navigation guards has problem when using in view.

* 2018-06-07 # v0.0.13
1. compatibility
remove usage of 'Array.from'

* 2018-06-07 # v0.0.12
1. fix bug
 when build，being surrounded with 'use strict;',use define function in if statement is valid

* 2018-05-17 # v0.0.11
1. fix bug

* 2018-05-12 # v0.0.10
1. transfer innerHTML's content of the router-view tag to replacement tag div[mx-view=...]
2. modify docs

* 2018-03-22 # v0.0.9
1. solve magix cmd without method of Magix.addView
2. modify docs

* 2018-03-22
1. fix using magix ctor bug
2. modify docs
3. add example

* 2018-03-21 # v0.0.6.beta
1. change examples

* 2018-03-21 # v0.0.5
1. fix bug of router-view support unmatched view
2. fix bug of seajs loader
3. modify docs
4. about router-link of `router-link-active` and `router-link-exact-active` can both existing

* 2018-03-21 # v0.0.4
1. add documents
2. add some kinds of webpack examples
3. router-link support attribute `:to`
4. router-link support custom tag
5. router-link remove default a style
6. router-view support unmatched view
7. magix-router supports more navigationGuard
8. magix-router enhance magix functions of `observeLocation`

* 2018-03-14
1. change writing method of using link or view
2. support not match route
3. add webpack example

* 2018-03-13
1. fix bugs and typo

* 2018-03-10
1. support webpack loader and code spliting function of import
2. only provide one file, remove the two files of view.mx and link.mx
3. add demo in the example for multiple divs of [router-view]

* 2018-03-06
1. update problem when route changes.
2. compare after url changes.
3. the component of link updates,owning default link class.
4. more readable writing link's component.
5. add demo in the example
