const algoliaSitemap = require('algolia-sitemap');
const indices = require('./constants').INDICES;

const algoliaConfig = {
  appId: process.env.ALGOLIA_APP_ID,
  apiKey: process.env.ALGOLIA_API_KEY,
  indexName: indices.teams,
};

const hitToParams = (res) => {
  // const url = // `https://${lang}.yoursite.com/${lang}/detail/${objectID}`;
  // const loc = url({ lang: 'en', objectID });
  const lastmod = new Date().toISOString();
  const priority = 0.6; // see discussion https://www.notion.so/glitch/Sitemaps-36446db005414f87af9910c51e21d88e#1a0eff53ae9c492aa9be33ceac1126b8
};

// sitemaps must be <= 50k entries per file, and <= 50 MB
// algolia-sitemap paginates automatically: sitemaps/sitemap.{n}.xml

algoliaSitemap({
  algoliaConfig,
  outputFolder: 'sitemaps',
  hitToParams,
});
