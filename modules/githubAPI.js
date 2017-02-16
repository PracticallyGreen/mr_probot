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
      return pull.title;
    });
  }).catch(function(error) {
    console.log(error);
  });
}

function isPullRequest(issue) {
  return issue.hasOwnProperty('pull_request')
}

module.exports = GitHubClient;
