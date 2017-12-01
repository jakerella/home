#!/usr/bin/env bash

set -e

export NODE_ENV="production"

npm install -g pm2 bower grunt
pm2 update
