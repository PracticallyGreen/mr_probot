var expect = require('chai').expect;
var _ = require('lodash');

const ResponseFormatter = require('../../modules/responseFormatter');
const ghConfig = require('../../config/githubConfig');
const owner = ghConfig.owner;
const repo = ghConfig.repo;

var testFormatter = new ResponseFormatter([
  {
    assignees: ['gh_login_1', 'gh_author_1'],
    author: 'gh_author_1',
    labels: ['PRS2 - ready for review'],
    link: `https://github.com/${owner}/${repo}/pull/1`,
    title: 'This PR Needs Review!'
  },
  {
    assignees: ['gh_login_1', 'gh_author_1'],
    author: 'gh_author_1',
    labels: ['PRS3 - in review', 'waiting on reviewer'],
    link: `https://github.com/${owner}/${repo}/pull/6`,
    title: 'This PR Needs Re-Review!'
  },
  {
    assignees: ['gh_login_2', 'gh_reviewer_1'],
    author: 'gh_login_2',
    labels: ['PRS3 - in review', 'waiting on author'],
    link: `https://github.com/${owner}/${repo}/pull/2`,
    title: 'This PR Needs you to address concerns!'
  },
  {
    assignees: ['gh_login_2', 'gh_reviewier_1'],
    author: 'gh_login_2',
    labels: ['kicked back'],
    link: `https://github.com/${owner}/${repo}/pull/3`,
    title: 'This PR Needs you to fix a bug!'
  },
  {
    assignees: ['gh_login_2', 'gh_reviewier_1'],
    author: 'gh_login_2',
    labels: ['PRS4 - ready for merge'],
    link: `https://github.com/${owner}/${repo}/pull/4`,
    title: 'This PR Needs you to deploy it'
  },
  {
    assignees: ['gh_login_3'],
    author: 'gh_login_3',
    labels: ['PRS2 - ready for review'],
    link: `https://github.com/${owner}/${repo}/pull/5`,
    title: 'This PR Needs a Reviewer!'
  }
]);

var expectation = [
  {
    "pretext": `<https://github.com/${owner}/${repo}/pulls/assigned/gh_login_1|gh_login_1:>`,
    "color": "#ff0000",
    "fields": [
      { "title": "Review:", "value": "" },
      { "title": "", "value": "" },
      { "title": "This PR Needs Review!", "value": `https://github.com/${owner}/${repo}/pull/1` },
      { "title": "This PR Needs Re-Review!", "value": `https://github.com/${owner}/${repo}/pull/6` }
    ],
    "mrkdwn_in": ["text", "pretext", "fields"]
  },
  {
    "pretext": `<https://github.com/${owner}/${repo}/pulls/assigned/gh_login_2|gh_login_2:>`,
    "color": "#cc4499",
    "fields": [
      { "title": "Code Fixes:", "value": "" },
      { "title": "", "value": "" },
      { "title": "This PR Needs you to address concerns!", "value": `https://github.com/${owner}/${repo}/pull/2` },
      { "title": "This PR Needs you to fix a bug!", "value": `https://github.com/${owner}/${repo}/pull/3` },
      { "title": "Deploy:", "value": "" },
      { "title": "", "value": "" },
      { "title": "This PR Needs you to deploy it", "value": `https://github.com/${owner}/${repo}/pull/4` }
    ],
    "mrkdwn_in": ["text", "pretext", "fields"]
  },
  {
    "pretext": "Unowned:",
    "color": "#abc123",
    "fields": [
      { "title": "Review:", "value": "" },
      { "title": "", "value": "" },
      { "title": "This PR Needs a Reviewer!", "value": `https://github.com/${owner}/${repo}/pull/5` }
    ],
    "mrkdwn_in": ["text", "pretext", "fields"]
  }
];

describe('formatSlackAttachment', function() {
  it('returns a properly formatted slack attachment for each github users pull request work', function() {
    var result = testFormatter.buildAttachments();

    // It returns an array of objects
    expect(result).to.be.a('array');

    // Each of the items in the array will be an object
    result.forEach(function(result) {
      expect(result).to.be.a('object');
    });

    // It has one object for each github user with work owed, plus one for unowned work
    expect(result.length).to.eql(3);

    // It groups open pull requests by user and type of work required
    // expect(result).to.eql(expectation);
    _.forEach(result, function(res, index) {
      expectedResult = expectation[index];

      expect(res.pretext).to.eql(expectedResult.pretext);
      expect(res.color).to.match(/^#(?:[0-9a-f]{3}){1,2}$/i);
      expect(res.fields).to.eql(expectedResult.fields);
      expect(res.mrkdwn_in).to.eql(expectedResult.mrkdwn_in);
    });
  });
});
