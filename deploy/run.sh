#!/usr/bin/env bash

set -e

cd ~/app
sudo pm2 start process.yml --env production
sudo pm2 save
