#!/usr/bin/env bash

set -e

export NODE_ENV="production"

sudo npm install -g pm2 bower grunt
pm2 update
