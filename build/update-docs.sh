cd docs
rm -rf _book
gitbook install
gitbook build
cp assets/circle.yml _book/circle.yml
cd _book
git init
git add -A
git commit -m 'update book'
git push -f https://github.com/sprying/magix-router.git master:gh-pages
