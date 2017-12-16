#!/usr/bin/env bash

set -e

export NODE_ENV="production"

sudo npm install -g npm
sudo pm2 update
sudo pm2 startup
