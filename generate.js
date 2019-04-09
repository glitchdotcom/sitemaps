const algoliaSitemap = require('algolia-sitemap');
const indices = require('./constants').INDICES;

const args = process.argv.slice(2) || indices;
args.length ? generate(args) : generate();

const glitchDomain = 'https://glitch.com';

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
        locTemplate = (team) => `test.com/@${team.url}`;
        break;
      case 'collections':
        locTemplate = (collection) => `${glitchDomain}/@${collection.fullUrl}`;
        break;
      default:
        locTemplate = (objectUrl) => `${glitchDomain}/${objectUrl}`;
        break;
    }

    const algoliaConfig = {
      appId: process.env.ALGOLIA_APP_ID,
      apiKey: process.env.ALGOLIA_API_KEY,
      indexName: indices[index],
    };

    const hitToParams = (item) => {
      const loc = locTemplate(item);
      // TODO: use the actual lastmod date
      // Mads will add lastmod date to the indices within a week or two
      const lastmod = new Date().toISOString();
      const priority = 0.6; // see discussion https://www.notion.so/glitch/Sitemaps-36446db005414f87af9910c51e21d88e#1a0eff53ae9c492aa9be33ceac1126b8
      
      // console.log(loc);

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
      outputFolder: `.data/${index}`,
      hitToParams,
    });
  }
}
