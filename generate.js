const algoliaSitemap = require('algolia-sitemap');
const indices = require('./constants').INDICES;

const glitchDomain = 'https://glitch.com';

const args = process.argv.slice(2) || indices;
args.length ? generate(args) : generate();

function generate(sections = ['projects', 'users', 'teams', 'collections']) {
  let locTemplate;
  for (let index of sections) {
    switch (index) {
      case 'projects':
        locTemplate = (project) => `${glitchDomain}/~${project.domain}`;
        break;
      case 'users':
        locTemplate = (user) => `${glitchDomain}/@${user.login}`;
        break;
      case 'teams':
        locTemplate = (team) => `${glitchDomain}/@${team.url}`;
        break;
      case 'collections':
        locTemplate = (collection) => `${glitchDomain}/@${collection.fullUrl}`;
        break;
    }

    const algoliaConfig = {
      appId: process.env.ALGOLIA_APP_ID,
      apiKey: process.env.ALGOLIA_API_KEY,
      indexName: indices[index],
    };
    
   const hitToParams = (item) => {
      // get template for formatting the full URL
      const loc = locTemplate(item);

      // use updatedAt if it's available, otherwise use
      const date = item.updatedAt ? new Date(item.updatedAt) : new Date();
      const lastmod = date.toISOString();
      const priority = 0.6; // see discussion https://www.notion.so/glitch/Sitemaps-36446db005414f87af9910c51e21d88e#1a0eff53ae9c492aa9be33ceac1126b8
      
      if (item.notSafeForKids || item.isPrivate) {
        return null;
      }
     // console.log(item);

      return {
        loc,
        lastmod,
        priority,
      };
    };

    // sitemaps must be <= 50k entries per file, and <= 50 MB
    // algolia-sitemap paginates automatically
    algoliaSitemap({
      algoliaConfig,
      sitemapLoc: `${glitchDomain}/sitemaps/${index}`,
      outputFolder: `.data/${index}`,
      hitToParams,
    });
  }
}