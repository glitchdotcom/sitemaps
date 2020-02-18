const algoliaSitemap = require('algolia-sitemap');
const chalk = require('chalk');
const ora = require('ora');
const api = require('./api');
const indices = require('./constants').INDICES;
const xmlSitemap = require('xml-sitemap');
const fs = require('fs');

const glitchDomain = 'https://glitch.com';

const args = process.argv.slice(2) || indices;
args.length ? generate(args) : generate();
// args.length ? filter(args) : filter();

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
          
      return {
        loc,
        lastmod,
        priority,
      };
    };
    
    // sitemaps must be <= 50k entries per file, and <= 50 MB
    // algolia-sitemap paginates automatically
    try {
      algoliaSitemap({
        algoliaConfig,
        sitemapLoc: `${glitchDomain}/sitemaps/${index}`,
        outputFolder: `.data/${index}`,
        hitToParams,
      });
      spinner.succeed();
      console.log('\nGenerated (unfiltered) sitemaps are in the .data directory');
    } catch (error) {
      console.log(error)
      spinner.fail(`${index}: ${error.toString()}`);
    }
  }

}
/*
function filter(sections = ['projects', 'users', 'teams', 'collections']) {
  for (let index of sections) {
    const spinner = ora(chalk.bold(index)).start();
    spinner.color = 'blue';
    
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
    
    const unfilteredSitemap = fs.readFileSync(`.data/${index}/sitemap.0.xml`); // will need to loop through all files
    console.log(unfilteredSitemap.urls);
    
      // extra validation for projects: exclude anon and newly-created projects
//       if (index === 'projects' &&  await !isProjectValid(item)) {
//         return null;
//       }
      
//       // remove pages with a noindex tag: any users/teams/collections that are empty
//       if (index !== 'projects' && await isPageEmpty(item)) {
//         return null;
//       }
    }
}
*/