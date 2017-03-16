var _ = require('lodash');
var randColor = require('randomcolor');

const ghConfig = require('../config/githubConfig');
const labelConfig = require('../config/labelConfig');

function ResponseFormatter(pullRequestData) {
  this.prData = pullRequestData;
}

ResponseFormatter.prototype.buildAttachments = function() {
  var userGroupings = groupPullRequestsByResponsibilian(this.prData);
  var users = groupResponsibilianPullRequestsByJob(userGroupings);
  var attachments = buildAttachmentsArray(users);

  return attachments;
}

const allExceptAuthor = ( assignees, author ) => {
  return assignees.filter(function(assignee) {
    return assignee != author;
  });
}

const assignedLink = ( user ) => {
  if(user != 'Unowned') {
    return '<https://github.com/' + ghConfig.fullRepository + '/pulls/assigned/' + user + '|' + user + ':>'
  } else {
    return user + ':';
  }
}

const buildAttachmentsArray = ( users ) => {
  var attachments = [];

  _.forEach(users, function(responsibilities, user) {
    var userAttachment = {
      "pretext": assignedLink(user),
      "color": randColor(),
      "fields": [],
      "mrkdwn_in": ["text", "pretext", "fields"]
    };

    _.forEach(responsibilities, function(responsibility) {
      var responsibilityFields = _.concat(
        [
          { "title": responsibility.job, "value": "" },
          { "title": "", "value": "" }
        ],
        responsibility.fields
      );

      userAttachment.fields = _.concat(userAttachment.fields, responsibilityFields);
    });

    attachments = _.concat(attachments, userAttachment);
  });

  return attachments;
}

const findPrResponsibilians = ( pr ) => {
  var responsibilians = null;

  if(labelsMatch(pr.labels, labelConfig.code) || labelsMatch(pr.labels, labelConfig.deploy)) {
      responsibilians = [pr.author];
  } else if(labelsMatch(pr.labels, labelConfig.review)) {
    responsibilians = allExceptAuthor(pr.assignees, pr.author);

    if(responsibilians.length == 0) {
      responsibilians = ['Unowned'];
    }
  } else {
    responsibilians = ['Invalid label schema'];
  }

  return responsibilians;
}

const findPrJob = ( pr ) => {
  var job = null;

  if(labelsMatch(pr.labels, labelConfig.deploy)) {
    job = 'Deploy:'
  } else if(labelsMatch(pr.labels, labelConfig.code)) {

    job = 'Code Fixes:';
  } else if(labelsMatch(pr.labels, labelConfig.review)) {
    job = 'Review:';
  } else {
    job = pr.labels.join('; ');
  }

  return job;
}

const groupPullRequestsByResponsibilian = ( prData ) => {
  var userGroupings = {};

  prData.forEach(function(pr) {
    var responsibilians = findPrResponsibilians(pr);
    var job = findPrJob(pr);

    responsibilians.forEach(function(user) {
      if(userGroupings.hasOwnProperty(user)) {
        userGroupings[user] = _.concat(userGroupings[user], { pr: pr, job: job });
      } else {
        userGroupings[user] = [{ pr: pr, job: job }];
      }
    });
  });

  return userGroupings;
}

const groupResponsibilianPullRequestsByJob = ( userGroupings ) => {
  var users = {};

  _.forEach(userGroupings, function(responsibilities, user) {
    var prByJob = {};

    _.forEach(responsibilities, function(responsibility) {
      if(prByJob.hasOwnProperty(responsibility.job)) {
        prByJob[responsibility.job].fields = _.concat(prByJob[responsibility.job].fields, {
          title: responsibility.pr.title,
          value: responsibility.pr.link
        });
      } else {
        prByJob[responsibility.job] = {
          job: responsibility.job,
          fields: [{
            title: responsibility.pr.title,
            value: responsibility.pr.link
          }]
        };
      }
    });

    users[user] = prByJob;
  });

  return users;
}

const labelsMatch = ( prLabels, configLabels ) => {
  return prLabels.some(label => _.includes(configLabels, label));
}

module.exports = ResponseFormatter;
