var expect = require('chai').expect;
var nock = require('nock');

var GitHub = require('../../modules/githubAPI');
var testGH = new GitHub();

const issueResponse = require('../nock_data/issueResponse');
const ghConfig = require('../../config/githubConfig');

describe('fetchPullRequests', function() {
  beforeEach(function() {
    nock('https://api.github.com')
      .get('/repos/' + ghConfig.fullRepository + '/issues')
      .reply(200, issueResponse);
  });

  it('returns the names of all pull requests in the environments designated repository', function() {
    return testGH.fetchPullRequests().then(function(pulls) {
      // It should return an array object
      expect(Array.isArray(pulls)).to.equal(true);

      // Each of the items in the array should be an object
      pulls.forEach(function(pull) {
        expect(pull).to.be.a('object');
      });

      // There should only be one object returned for this test
      expect(pulls.length).to.equal(1)

      // Each object in the array should be have the following keys:
      //  - author: String
      //  - title: String
      //  - link: String
      //  - labels: Array of Strings
      //  - assignees: Array of Strings
      var pr = pulls[0]
      expect(pr.author).to.eql('octocatPR');
      expect(pr.title).to.eql('Found a bug - Pull Request');
      expect(pr.link).to.eql('https://github.com/octocat/Hello-World/pull/1347');
      expect(pr.labels).to.eql(['bug','foo']);
      expect(pr.assignees).to.eql(['octocatPR','hubot','other_user']);
    });
  });
});
