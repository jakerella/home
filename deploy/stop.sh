#!/usr/bin/env bash

set -e

cd ~/app || true
pm2 stop jsk-home || true
