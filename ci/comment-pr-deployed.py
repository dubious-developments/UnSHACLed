#!/usr/bin/env python3

# This script adds a comment to a pull request, stating that it's
# been deployed to GitHub pages. Depends on PyGitHub (`pip install pygithub``).

from __future__ import print_function
import sys
from github import Github
from spongebot import \
    create_pull_request_deployed_comment, \
    parse_deploy_directory_name, \
    generate_pull_request_deployed_comment, \
    has_commented_on_pull_request

def comment_pull_request_deployed(argv):
    """Comments that a pulparse_depll request has been built and deployed to GitHub pages,
       but only if Dubious Spongebot hasn't commented before."""
    is_dry_run = False
    if len(argv) > 1 and argv[1] == '-d':
        argv = [argv[0]] + argv[2:]
        is_dry_run = True

    if len(argv) != 4:
        print('Usage: comment-pr-deployed [-d] access-token deploy-directory repo-slug', file=sys.stderr)
        return 1

    _, access_token, deploy_directory, repo_slug = argv

    pr_number = parse_deploy_directory_name(deploy_directory)
    if pr_number is None:
        print('Deploy directory is not a pull request. Nothing to do here.', file=sys.stderr)
        return 0

    # Authenticate and grab the repo.
    gh = Github(access_token)
    repo = gh.get_repo(repo_slug)
    pr = repo.get_pull(pr_number)

    # Make sure that we haven't commented already.
    if has_commented_on_pull_request(pr):
        print('Comment has already been placed. Nothing to do here.', file=sys.stderr)
        if not is_dry_run:
            return 0

    # Create an issue comment.
    if is_dry_run:
        print('Would post this:')
        print(generate_pull_request_deployed_comment(pr, deploy_directory))
    else:
        create_pull_request_deployed_comment(pr, deploy_directory)

    # Job's done.
    print('Created a comment. My job is done here. Have a wonderful day!', file=sys.stderr)
    return 0

if __name__ == '__main__':
    sys.exit(comment_pull_request_deployed(sys.argv))
