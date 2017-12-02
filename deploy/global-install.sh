#!/usr/bin/env bash

set -e

export NODE_ENV="production"

sudo npm install -g npm
pm2 update
