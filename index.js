var SlackClient = require('./modules/slackClient');

var thisSlack = new SlackClient('Hello World');
thisSlack.sendMessage();
