const labelConfig = {
  code: process.env.CODE_LABELS || ['waiting on author', 'kicked back', 'PRS1 - in progress'],
  deploy: process.env.DEPLOY_LABELS || ['PRS4 - ready for merge'],
  review: process.env.REVIEW_LABELS || ['PRS2 - ready for review', 'PRS3 - in review']
};

module.exports = labelConfig;
