githubConfig = {
  token: process.env.GITHUB_ACCESS_TOKEN || 'testToken',
  owner: process.env.GITHUB_OWNER || 'testOwner',
  repo: process.env.GITHUB_REPO || 'testRepo'
};

githubConfig.fullRepository = githubConfig.owner + '/' + githubConfig.repo;

module.exports = githubConfig;
