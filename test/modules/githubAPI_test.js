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

      // Each of the items in the array should be a string
      pulls.forEach(function(pull) {
        expect(pull).to.be.a('string');
      });

      // Each item in the array should be a pull request title
      expect(pulls).to.eql(['Found a bug - Pull Request']);
    });
  });
});
