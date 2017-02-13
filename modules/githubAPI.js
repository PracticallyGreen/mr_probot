var GitHub = require('github-api');
const ghConfig = require('../config/githubConfig');

function GitHubClient() {
  this.gh = new GitHub({
    token: ghConfig.token
  });
  this.repo = this.gh.getRepo(ghConfig.fullRepository);
}

GitHubClient.prototype.fetchPullRequests = function() {
  return this.repo.listPullRequests().then(function(response) {
    return response.data.map(function(pull) {
      return pull.title;
    });
  }).catch(function(error) {
    console.log(error);
  });
}

module.exports = GitHubClient;
