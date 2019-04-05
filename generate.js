const algoliaSitemap = require('algolia-sitemap');
const indices = require('./constants').INDICES;

const algoliaConfig = {
  appId: process.env.ALGOLIA_APP_ID,
  apiKey: process.env.ALGOLIA_API_KEY,
  indexName: indices.users,
};

const hitToParams = (item) => {
  console.log(item);
  const loc = locTemplate(item);
    `https://glitch.com/@${item.login}`;
  const lastmod = new Date().toISOString();
  const priority = 0.6; // see discussion https://www.notion.so/glitch/Sitemaps-36446db005414f87af9910c51e21d88e#1a0eff53ae9c492aa9be33ceac1126b8

  return {
    loc,
    lastmod,
    priority,
  };
};

const args = process.argv.slice(2);
args.length ? generate(args) : generate();

let locTemplate;
const glitchDomain = 'https://glitch.com';

function generate(indices = ['projects', 'users', 'teams', 'collections']) {
  for (let index of indices) {
    switch (index) {
      case 'projects':
        locTemplate = (project) => `${glitchDomain}/~${project.domain}`;
        break;
      case 'users':
        locTemplate = (user) => `${glitchDomain}/@${user.login}`;
        break;
      /* TODO: these are being re-indexed soon
      case 'teams':
        locTemplate = (team) => `${glitchDoomain}/@${team.login}`;
        break;
      case 'collections':
        locTemplate = (team) => 
    }
    
    // sitemaps must be <= 50k entries per file, and <= 50 MB
    // algolia-sitemap paginates automatically: sitemaps/sitemap.{n}.xml
    algoliaSitemap({
      algoliaConfig,
      outputFolder: `sitemaps/${index}`,
      hitToParams,
    });
  }
}
