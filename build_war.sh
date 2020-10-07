#!/bin/bash

rm -rf .build_war
rm naits.war
rm naits/naits-georgia*
git checkout -- naits/index.html

npm run build
# start stupid
sed -i 's/PERUN/RERUN/g' naits/naits-georgia*
sed -i 's/perun/failrun/g' naits/naits-georgia*
sed -i 's/PRTECH/SMTHING/g' naits/naits-georgia*
sed -i 's/prtech/othrsstupd/g' naits/naits-georgia*
# end stupid
rsync -avz --exclude '/js' naits/ .build_war
cd .build_war/ && jar -cvf ../naits.war *
