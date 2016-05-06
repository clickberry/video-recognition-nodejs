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

# execute nodejs application
exec npm start