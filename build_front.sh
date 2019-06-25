#!/bin/bash
indent() { sed 's/^/> /'; }

echo '====== Installing production frontend ======'
echo '\nBuilding...'
yarn workspace front build | indent

echo '\nRemoving existing installation...'
rm -Rfv build | indent

echo '\nCopying new files...'
mkdir build
cp -vr ./packages/front/build ./ | indent

echo '\n======     Installation finished      ======'
