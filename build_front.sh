#!/bin/bash
indent() { sed 's/^/> /'; }

echo '====== Installing production frontend ======'
echo '\nBuilding...'
yarn workspace front build | indent

echo '\nRemoving existing installation...'
rm -Rfv ./packages/kitchenhand-server/build/static | indent

echo '\nCopying new files...'
mkdir -p build
cp -vr ./packages/front/build ./packages/kitchenhand-server/build/static | indent

echo '\n======     Installation finished      ======'
