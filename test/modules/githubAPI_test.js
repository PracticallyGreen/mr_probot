var expect = require('chai').expect;
var nock = require('nock');

var GitHub = require('../../modules/githubAPI');
var testGH = new GitHub();

const prResponse = require('../nock_data/pullRequestResponse');
const ghConfig = require('../../config/githubConfig');

describe('fetchPullRequests', function() {
  beforeEach(function() {
    nock('https://api.github.com')
      .get('/repos/' + ghConfig.fullRepository + '/pulls')
      .reply(200, prResponse);
  });

  it('returns the names of all pull requests in the environments designated repository', function(done) {
    testGH.fetchPullRequests().then(function(pulls) {
      // It should return an array object
      expect(Array.isArray(pulls)).to.equal(true);

      // Each of the items in the array should be a string
      pulls.forEach(function(follower) {
        expect(follower).to.be.a('string');
      });

      // Each item in the array should be a pull request
      expect(pulls).to.eql(['new-feature']);

      done();
    });
  });
});
