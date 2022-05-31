#!/bin/bash
export PATH=$PATH:~/.nvm/versions/node/${NODE_VERSION}/bin
echo 'cd beammp-admin'
cd ${PROJECT_LOCATION}/beammp-admin
echo 'git pull'
git pull
echo 'pm2 stop'
pm2 stop beammp-admin
echo 'npm install'
npm install
echo 'npm build'
npm run build
echo 'pm2 start'
pm2 start --name beammp-admin npm -- start
echo 'deploy finished'
