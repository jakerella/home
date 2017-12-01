#!/usr/bin/env bash

set -e

cd ~/app
pm2 stop jsk-home || true
