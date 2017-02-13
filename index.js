var SlackClient = require('./modules/slackClient');
var GitHubClient = require('./modules/githubAPI');

var thisGH = new GitHubClient();
thisGH.fetchPullRequests().then(function(pulls) {
  var thisSlack = new SlackClient("Good Morning, these are your open prs:\n" + pulls.join('\n'));
  thisSlack.sendMessage();
});
