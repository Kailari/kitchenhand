#!/bin/bash
indent() { sed 's/^/> /'; }

echo '====== Installing production frontend ======'
echo '\nBuilding...'
yarn workspace front build | indent

echo '\nRemoving existing installation...'
rm -Rfv ./packages/server/static | indent

echo '\nCopying new files...'
cp -vr ./packages/front/build ./packages/server/static | indent

echo '\n======     Installation finished      ======'
