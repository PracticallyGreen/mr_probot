var SlackClient = require('./modules/slackClient');
var GitHubClient = require('./modules/githubAPI');
var ResponseFormatter = require('./modules/responseFormatter');

var thisGH = new GitHubClient();
thisGH.fetchPullRequests().then(function(pulls) {
  var thisFormatter = new ResponseFormatter(pulls);

  var thisSlack = new SlackClient({
    iconUrl: 'http://i.imgur.com/dlYFukB.jpg',
    type: 'message',
    text: "Hello there! These are your open prs:",
    attachments: thisFormatter.buildAttachments()
  });
  thisSlack.sendMessage();
});
