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
npm install --only=prod
