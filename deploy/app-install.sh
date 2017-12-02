#!/usr/bin/env bash

set -e

# setup NODE_ENV
touch ~/.bash_profile
hasEnv=`grep "export NODE_ENV" ~/.bash_profile | cat`
if [ -z "$hasEnv" ]; then
    echo "export NODE_ENV=production" >> ~/.bash_profile
else
    sed -i "/export NODE_ENV=\b/c\export NODE_ENV=production" ~/.bash_profile
fi

cd ~/app
npm install

# add app to startup
hasRc=`grep "su -l $USER" /etc/rc.d/rc.local | cat`
if [ -z "$hasRc" ]; then
    sh -c "echo 'su -l $USER -c \"cd ~/app;sh ./run.sh\"' >> /etc/rc.d/rc.local"
fi
