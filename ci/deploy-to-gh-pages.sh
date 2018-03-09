#!/usr/bin/env bash

# This script pushes a build to GitHub pages.

set -e

CURRENT_DIR=$(dirname $0)

ACCESS_TOKEN=$1

# The second parameter is the directory to store the build in.
TARGET_DIRECTORY=$2

pushd $CURRENT_DIR

# Clone the GitHub pages repository.
git clone https://github.com/dubious-developments/dubious-developments.github.io

# Delete the old build, if any.
rm -rf dubious-developments.github.io/$TARGET_DIRECTORY

# Copy the build to the GitHub pages directory.
mkdir dubious-developments.github.io/$TARGET_DIRECTORY
cp -r build/* dubious-developments.github.io/$TARGET_DIRECTORY

pushd dubious-developments.github.io

# Add the changes.
git add .

# Create a commit.
git -c user.name='Dubious Spongebot' \
    -c user.email='jonathan.vdc+dubious-spongebot@outlook.com' \
    commit -m "Deploy $TARGET_DIRECTORY"

# Push the changes.
git push https://dubious-spongebot:$ACCESS_TOKEN@github.com/dubious-developments/dubious-developments.github.io master

popd

popd
