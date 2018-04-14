#!/usr/bin/env python3

from __future__ import print_function
import os
import subprocess
import sys

# This script is basically just a fancy wrapper around
# 'deploy-to-gh-pages.sh' that takes fewer parameters.

def main(argv):
    """Deploys to GitHub pages."""
    if len(argv) > 1 and argv[1] == '-d':
        is_dry_run = True
        argv = [argv[0]] + argv[2:]
    else:
        is_dry_run = False

    if len(argv) != 2:
        print('Usage: deploy-to-gh-pages.py [-d] access-token', file=sys.stderr)
        return 1

    repo_slug = os.environ['TRAVIS_REPO_SLUG']
    build_number = os.environ['TRAVIS_BUILD_NUMBER']
    pr_slug = os.environ.get('TRAVIS_PULL_REQUEST_SLUG')
    pr_number = os.environ.get('TRAVIS_PULL_REQUEST')
    pr_origin = os.environ.get('TRAVIS_PULL_REQUEST_BRANCH')
    repo_owner, _ = repo_slug.split('/')

    is_pr = pr_slug.strip() != ''

    if repo_owner == 'dubious-developments':
        if not is_pr:
            deploy_dir = 'release-candidate'
            build_name = 'Latest release candidate'
            build_version_comment = 'release candidate'
        else:
            deploy_dir = 'pull-request-%s' % pr_number
            build_name = 'Pull request %s (from %s-%s)' % (pr_number, pr_slug, pr_origin)
            build_version_comment = 'development; pull request %s' % pr_number
    else:
        if not is_pr:
            branch_name = os.environ['TRAVIS_BRANCH']
            commit_hash = os.environ['TRAVIS_COMMIT']
            deploy_dir = '%s/%s' % (repo_owner, branch_name)
            build_name = 'Branch \'%s\'' % branch_name
            build_version_comment = 'development; commit %s at %s' % (commit_hash, repo_slug)
        else:
            deploy_dir = '%s/pull-request-%s' % (repo_owner, pr_number)
            build_name = 'Pull request %s (from %s-%s)' % (pr_number, pr_slug, pr_origin)
            build_version_comment = 'development; pull request %s at %s' % (pr_number, repo_slug)

    build_version = 'UnSHACLed build %s (%s)' % (build_number, build_version_comment)

    token = argv[1]

    command = [
        os.path.realpath(__file__ + '/../deploy-to-gh-pages.sh'),
        token,
        deploy_dir,
        build_name,
        build_version,
        repo_slug
    ]

    if is_dry_run:
        print('Running command: ' + ' '.join('"%s"' % arg if ' ' in arg else arg for arg in command), file=sys.stderr)
        return 0
    else:
        return subprocess.call(command)

if __name__ == '__main__':
    sys.exit(main(sys.argv))
