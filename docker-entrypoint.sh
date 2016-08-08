#!/bin/bash
set -e

if [ -z "$S3_BUCKET" ]; then
    echo "S3_BUCKET environment variable required"
    exit 1
fi

if [ -z "$NSQD_ADDRESS" ]; then
    echo "NSQD_ADDRESS environment variable required"
    exit 1
fi

if [ -z "$FRAMES_API" ]; then
    echo "FRAMES_API environment variable required"
    exit 1
fi

# Patching config
sed -i "s|%FRAMES_API%|${FRAMES_API}|g" /usr/src/app/public/js/app.js

# execute nodejs application
exec npm start