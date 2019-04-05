const generate = require('algolia-sitemap');
const indices = require('./constants').INDICES;

const algoliaConfig = {
  appId: process.env.ALGOLIA_APP_ID,
  apiKey: process.env.ALGOLIA_API_KEY,
  indexName: indices.teams,
};

const hitToParams = (res, i) => {
  console.log(i);
};

// sitemaps must be <= 50k entries per file, and <= 50 MB
// Algolia 
generate({
  algoliaConfig,
  outputFolder: 'sitemaps',
  hitToParams,
});
  