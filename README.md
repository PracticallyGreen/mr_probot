# Mr. Probot
A node script that pulls together all pull requests for a team, and builds a slack message from them
to let each team member know which pull requests they are responsible for, and what there role is
for the pr depending on labels.


## Requirements
The repo has a `githubConfig` file, which requires you to have environment variables of
`GITHUB_ACCESS_TOKEN` `GITHUB_OWNER`, and `GITHUB_REPO` to indicate where the pull requests should
be fetched from.

Additionally, in order to communicate with Slack you must set another environment variable of
`SLACK_WEBHOOK_URL`. To get this url, set up an [Incoming Webhook](https://slack.com/services/new/incoming-webhook) in Slack.

In order for Mr. Probot to organize your pull requests properly, you apply certain labels to your prs:
- `PRS1 - in progress` - given to the author; this PR is being worked on
- `PRS2 - ready for review` - given to any assignees that are not the author, or marked as "Unknown"; the PR needs review
  - Note: While GitHub has a "Reviewer" function, we found the use of "Assignee" to denote the
    person(s) responsible for whether or not a pr ships as the more reliable designation, since
    any user who comments on a pull request is automatically marked as a "Reviewer"
- `PRS3 - in review` - given to any assignees that are not the author; the PR is in the review cycle
- `waiting on author` - given to the author; this supercedes `PRS3 - in review`, code fixes are required
- `PRS4 - ready to merge` - given to the author; the PR has passed review and is ready to be merged and deployed


## Slack Message
The message sent to slack might look something like this:
<img src="https://d3uepj124s5rcx.cloudfront.net/items/1Z0R2T3p36303G2F082P/Image%202017-03-16%20at%2012.31.59%20PM.png?v=d85e141d" width="500">


## Upcoming Features
* "Deploy to Heroku" button
* Listen to GitHub hooks and direct message individuals when their responsibility changes
* Generalize label requirements
* Convert githubAPI to use new GitHub GraphQL API
