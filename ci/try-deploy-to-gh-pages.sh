#!/usr/bin/env bash

set -e # Exit with nonzero exit code if anything fails

# This file is based on the tutorial here: https://gist.github.com/domenic/ec8b0fc8ab45f39403dd

# Delete the old build, if any.
rm -rf "dubious-developments.github.io/$TARGET_DIRECTORY"
echo "Deleted old $TARGET_DIRECTORY directory."

# Copy the build and the coverage to the GitHub pages directory.
mkdir -p "dubious-developments.github.io/$TARGET_DIRECTORY"
cp -r build/* "dubious-developments.github.io/$TARGET_DIRECTORY"
mkdir "dubious-developments.github.io/$TARGET_DIRECTORY/coverage"
cp -r coverage/Firefox*/* "dubious-developments.github.io/$TARGET_DIRECTORY/coverage"
echo "Created new $TARGET_DIRECTORY directory."

# Create build name and version files.
echo "$NAME" > "dubious-developments.github.io/$TARGET_DIRECTORY/build-name"
echo "$VERSION" > "dubious-developments.github.io/$TARGET_DIRECTORY/version"

pushd dubious-developments.github.io

# Regenerate the index.
python3 ../ci/generate-index.py > index.html
echo "Generated index."

# Add files.
git add .

# If there are no changes to the deployed build then just bail.
if git diff -s --cached --exit-code; then
    echo "No changes to the output on this push; exiting."
    exit 0
fi

REPO_URL="https://dubious-spongebot:$ACCESS_TOKEN@github.com/dubious-developments/dubious-developments.github.io"

# Commit the "changes", i.e., the new version.
# The delta will show diffs between new and old versions.
echo "Committing changes..."
git -c user.name='Dubious Spongebot' \
    -c user.email='jonathan.vdc+dubious-spongebot@outlook.com' \
    commit -m "Deploy $TARGET_DIRECTORY (${SHA})"

# Now that we're all set up, we can push.
echo "Pushing commit..."
if git push $REPO_URL master &2> /dev/null; then
    echo "Pushed commit"
    popd

    # Add a comment to the pull request if this is the first time
    # we're deploying it to GitHub pages.
    python3 ./ci/comment-pr-deployed.py "$ACCESS_TOKEN" "$TARGET_DIRECTORY" "$REPO_SLUG"
else
    # Nuke the commit we just made.
    echo "Push failed. Nuking commit..."
    git reset --hard HEAD^
    # Do a git pull.
    git pull $REPO_URL master
    popd
    exit 1
fi
