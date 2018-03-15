#!/usr/bin/env bash

# This script pushes a build to GitHub pages.

set -e

CURRENT_DIR=$(dirname $0)
export ACCESS_TOKEN=$1

# The second parameter is the directory to store the build in.
export TARGET_DIRECTORY=$2

# The third parameter is the (human-readable) name of the build.
export NAME=$3

# The fourth parameter is the build's version.
export VERSION=$4

pushd "$CURRENT_DIR/.."

# Clone the GitHub pages repository.
git clone https://github.com/dubious-developments/dubious-developments.github.io

# Try to push until we succeed.
i=0
while (( i < 5 )) && ! ./ci/try-deploy-to-gh-pages.sh; do
    # Sleep for a while.
    sleep 10
    # Try again.
    i=$((i+1))
done

# Add a comment to the pull request if this is the first time
# we're deploying it to GitHub pages.
python3 ./ci/comment-pr-deployed.py "$ACCESS_TOKEN" "$TARGET_DIRECTORY"

popd
