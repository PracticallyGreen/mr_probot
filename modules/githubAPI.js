var GitHub = require('github-api');
const ghConfig = require('../config/githubConfig');

function GitHubClient() {
  this.gh = new GitHub({
    token: ghConfig.token
  });
  this.issue = this.gh.getIssues(ghConfig.owner, ghConfig.repo)
}

GitHubClient.prototype.fetchPullRequests = function() {
  return this.issue.listIssues().then(function(response) {
    return response.data.filter(isPullRequest).map(function(pull) {
      return {
        assignees: pull.assignees.map(getAssigneeNames),
        author: pull.user.login,
        labels: pull.labels.map(getLabelNames),
        link: pull.pull_request.html_url,
        title: pull.title
      };
    });
  }).catch(function(error) {
    console.log(error);
  });
}

function getAssigneeNames(assignee) {
  return assignee.login;
}

function getLabelNames(label) {
  return label.name;
}

function isPullRequest(issue) {
  return issue.hasOwnProperty('pull_request')
}

module.exports = GitHubClient;
