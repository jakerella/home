#!/usr/bin/env bash

set -e

cd ~/app
pm2 start process.yml --env production
pm2 save
