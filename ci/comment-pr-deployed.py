#!/usr/bin/env python3

# This script adds a comment to a pull request, stating that it's
# been deployed to GitHub pages. Depends on PyGitHub (`pip install pygithub``).

from __future__ import print_function
import sys
from github import Github

def parse_deploy_directory_name(deploy_directory_name):
    """Parses the name of a deploy directory as a pull request number.
       Returns None if the deploy directory name does not identify
       a pull request."""
    prefix = 'pull-request-'
    if deploy_directory_name.startswith(prefix):
        try:
            return int(deploy_directory_name[len(prefix):])
        except:
            return None
    else:
        return None

def has_commented_on_pull_request(pull_request):
    """Tells if Dubious Spongebot has commented on a pull request."""
    for comment in pull_request.get_issue_comments():
        if comment.user.name == 'dubious-spongebot':
            return True
    return False

def create_pull_request_deployed_comment(pull_request, deploy_directory_name):
    """Adds an issue comment to a pull request that links to the deployed build."""
    pull_request.create_issue_comment(
"""Oh hi there!

I've built and deployed your awesome pull request. You can try it out [here](https://dubious-developments.github.io/%s/index.html).

Thanks for contributing! Keep up the good work!

> **Note:** it may take a little while before GitHub pages gets updated. Try again in a minute if your deployed build doesn't show up right away."""
        % deploy_directory_name)


def comment_pull_request_deployed(argv):
    """Comments that a pull request has been built and deployed to GitHub pages,
       but only if Dubious Spongebot hasn't commented before."""
    if len(argv) != 3:
        print('Usage: comment-pr-deployed access-token deploy-directory', file=sys.stderr)
        return 1

    _, access_token, deploy_directory = argv

    pr_number = parse_deploy_directory_name(deploy_directory)
    if pr_number is None:
        print('Deploy directory is not a pull request. Nothing to do here.', file=sys.stderr)
        return 0

    # Authenticate and grab the repo.
    gh = Github(access_token)
    repo = gh.get_repo('dubious-developments/UnSHACLed')
    pr = repo.get_pull(pr_number)

    # Make sure that we haven't commented already.
    if has_commented_on_pull_request(pr):
        print('Comment has already been placed. Nothing to do here.', file=sys.stderr)
        return 0

    # Create an issue comment.
    create_pull_request_deployed_comment(pr, deploy_directory)

    # Job's done.
    print('Created a comment. My job is done here. Have a wonderful day!', file=sys.stderr)
    return 0

if __name__ == '__main__':
    sys.exit(comment_pull_request_deployed(sys.argv))
