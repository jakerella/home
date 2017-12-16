#!/usr/bin/env bash

set -e

cd ~/app || true
sudo pm2 stop jsk-home || true
