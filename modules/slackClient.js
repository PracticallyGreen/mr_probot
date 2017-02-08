var IncomingWebhook = require('@slack/client').IncomingWebhook;
var url = process.env.SLACK_WEBHOOK_URL || '';

function SlackClient(message) {
  this.webhook = new IncomingWebhook(url);
  this.message = message;
}

SlackClient.prototype.sendMessage = function() {
  this.webhook.send(this.message, function(err, res) {
    if (err) {
        console.log('Error:', err);
    } else {
        console.log('Message sent: ', res);
    }
  });
}

module.exports = SlackClient;
