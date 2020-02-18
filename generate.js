const algoliaSitemap = require('algolia-sitemap');
const chalk = require('chalk');
const ora = require('ora');
const api = require('./api');
const indices = require('./constants').INDICES;

const glitchDomain = 'https://glitch.com';

const args = process.argv.slice(2) || indices;
args.length ? generate(args) : generate();

async function generate(sections = ['projects', 'users', 'teams', 'collections']) {
  console.log(chalk.blue.bold(`Generating sitemaps for ${sections.join(', ')}\n`));

  for (let index of sections) {
    const spinner = ora(chalk.bold(index)).start();
    spinner.color = 'blue';

    let locTemplate;
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
    
    const isPageEmpty = async (page) => {
      // exclude pages that have no projects on them, whether user, team or collection
      switch (index) {
      case 'users':
        return await api.isEmptyUserPage(page.login);
        break;
      case 'teams':
        return await api.isEmptyTeamPage(page.url);
        break;
      case 'collections':
        return await api.isEmptyCollection(page.fullUrl);
        break;
      }
    }

    const isProjectValid = async (project) => {
      // exclude projects created within the last 24 hours
      // this gives us a window to catch egregiously bad projects before tacitly endorsing them via sitemap
      const elapsed = Date.now() - Date.UTC(project.createdAt);
      const oneDay = 1000 * 60 * 60 * 24;
      if (elapsed < oneDay) {
        return false;
      }

      // exclude projects made by anons, must have at least one authed user to be included
      let atleastOneAuthedUser = false;
      let i = 0;
      while (!atleastOneAuthedUser && i < project.members.length) {
        const login = await api.getUserLoginById(project.members[0]);
        atleastOneAuthedUser = login != null ? true : false;
        i++;
      }
      return atleastOneAuthedUser;
    };

    const hitToParams = async (item) => {
      // get template for formatting the full URL
      const loc = encodeURI(locTemplate(item));

      // set lastmod with updatedAt if it's available, otherwise use the current date
      const date = item.updatedAt ? new Date(item.updatedAt) : new Date();
      const lastmod = date.toISOString();

      // see discussion https://www.notion.so/glitch/Sitemaps-36446db005414f87af9910c51e21d88e#1a0eff53ae9c492aa9be33ceac1126b8
      const priority = 0.6;

      // exclude private or not safe for kids items
      if (item.notSafeForKids || item.isPrivate) {
        return null;
      }
/* hitToParams doesn't play nicely with async functions, need more brains to figure out how to do this
      // extra validation for projects: exclude anon and newly-created projects
      if (index === 'projects' &&  await !isProjectValid(item)) {
        return null;
      }
      
      // remove pages with a noindex tag: any users/teams/collections that are empty
      if (index !== 'projects' && isPageEmpty(item)) {
        return null;
      }
 */     
      return {
        loc,
        lastmod,
        priority,
      };
    };
    
    // sitemaps must be <= 50k entries per file, and <= 50 MB
    // algolia-sitemap paginates automatically
    try {
      await algoliaSitemap({
        algoliaConfig,
        sitemapLoc: `${glitchDomain}/sitemaps/${index}`,
        outputFolder: `.data/${index}`,
        hitToParams,
      });
      spinner.succeed();
    } catch (error) {
      console.log(error)
      spinner.fail(`${index}: ${error.toString()}`);
    }
  }
  console.log('\nGenerated sitemaps are in the .data directory');
}


/*

Error: loc "undefined" was not valid. It's required.

see https://www.sitemaps.org/protocol.html
    at isValidURL (/rbd/pnpm-volume/e4b14a4b-0348-4a18-89e2-5d8d9c2ca6cc/node_modules/.registry.npmjs.org/algolia-sitemap/2.2.0/node_modules/algolia-sitemap/build/sitemap.js:47:11)
    at url (/rbd/pnpm-volume/e4b14a4b-0348-4a18-89e2-5d8d9c2ca6cc/node_modules/.registry.npmjs.org/algolia-sitemap/2.2.0/node_modules/algolia-sitemap/build/sitemap.js:175:23)
    at Array.map (<anonymous>)
    at createSitemap (/rbd/pnpm-volume/e4b14a4b-0348-4a18-89e2-5d8d9c2ca6cc/node_modules/.registry.npmjs.org/algolia-sitemap/2.2.0/node_modules/algolia-sitemap/build/sitemap.js:229:13)
    at /rbd/pnpm-volume/e4b14a4b-0348-4a18-89e2-5d8d9c2ca6cc/node_modules/.registry.npmjs.org/algolia-sitemap/2.2.0/node_modules/algolia-sitemap/build/index.js:35:20
    at Generator.next (<anonymous>)
    at step (/rbd/pnpm-volume/e4b14a4b-0348-4a18-89e2-5d8d9c2ca6cc/node_modules/.registry.npmjs.org/algolia-sitemap/2.2.0/node_modules/algolia-sitemap/build/index.js:3:191)
    at /rbd/pnpm-volume/e4b14a4b-0348-4a18-89e2-5d8d9c2ca6cc/node_modules/.registry.npmjs.org/algolia-sitemap/2.2.0/node_modules/algolia-sitemap/build/index.js:3:437
    at new Promise (<anonymous>)
    at /rbd/pnpm-volume/e4b14a4b-0348-4a18-89e2-5d8d9c2ca6cc/node_modules/.registry.npmjs.org/algolia-sitemap/2.2.0/node_modules/algolia-sitemap/build/index.js:3:99
✖ collections: Error: loc "undefined" was not valid. It's required.

see https://www.sitemaps.org/protocol.html

Generated sitemaps are in the .data directory

*/