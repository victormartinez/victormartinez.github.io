---
layout: post
title: Git hooks, issue tracker and Git Flow
category: Git
date: 2017-05-07T00:00:00
tags: [git, gitflow, hooks]
image: featured.png
language: en
---

At [Agilize](https://www.agilize.com.br/) a common developer workflow involves the usage of Jira for issue tracking, Git + Git Flow for versioning code, Slack for communication and programmer's tools like IDE, Text Editor and Terminal. Basically, a prioritized sprint is maintained in Jira full of cards that describe the features, bugs, spikes and chores following some conventions of SCRUM and the software engineer assign himself to a card. During the development there is a convention that **commits must have the issue code the engineer is working on**. After some commits the convention gets boring (you have to type the issue code all time). Hopefully there is a way to automate that.

## Git Hooks

Git allows us to run a script every time a particular event occurs in the repository. For instance, it is possible to setup the text editor with a template message. This [tutorial](https://www.atlassian.com/git/tutorials/git-hooks) explains the power of git hooks and provides a snippet that will be customized in this post to address our necessities.

Inside your repository there is a folder _.git/hooks_ that contains some sample scripts that can be used as a playground and they end with _.sample_ in order to not be interpreted by Git. Create a file named _prepare-commit-msg_ that will contain the code below to automate the commit message.

```bash
#!/usr/bin/env python3
import sys, os, re
from subprocess import check_output

# Setup
branch_regex = r'.+/(AGZ-\d+).*'

# Collect the parameters
commit_msg_filepath = sys.argv[1]

# Figure out which branch we're on
branch = check_output(['git', 'symbolic-ref', '--short', 'HEAD']).strip()

# Populate the commit message with the issue #, if there is one
issue_match = re.match(branch_regex, branch.decode('utf-8'), re.M|re.I)
if issue_match:
    issue_code = issue_match.group(1)
    with open(commit_msg_filepath, 'r+') as f:
        content = f.read()
        f.seek(0, 0)
        f.write("%s %s" % (issue_code, content))
```

After typing _git commit_ the file above is called to populate the commit message and, thus, enables us to adopt a template in our commits. The script is called with three arguments:

1. File name
1. The name of a temporary file that contains the message
1. The type of commit
1. The commit SHA1 hash

At Agilize the issue code follows the regex in the line 6. Once we use [gitflow](http://nvie.com/posts/a-successful-git-branching-model/) to manage our branches they will always follow some examples like _feature/AGZ-1256_, _hotfix/AGZ-981_, _release/AGZ-453_. Therefore, commits are not created in the master or dev branches. Due to that, the variable in the line 6 defines a regex that will use the branch name to create our commit message. If you want to apply that to your company it just takes to update the regex (pay attention to the regex group in line 17).

The lines 15 and 16 check if the current branch is not master/dev and contains the issue code. The final lines just create the message with the code.

**Obs:**

You can make the cursor start right after the template message. Just add the snippet below to your _.bashrc_ file.

```bash
export GIT_EDITOR="vim -c'startinsert|norm! ggA'"
```

#### References

Want more resources? Check out the links below:

1. https://www.atlassian.com/git/tutorials/git-hooks
1. http://stackoverflow.com/questions/41232722/open-git-commit-editor-to-specific-cursor-location
