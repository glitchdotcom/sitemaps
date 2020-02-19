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

    const isProjectValid = (project) => {
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
        const login = api.getUserLoginById(project.members[i]);
        atleastOneAuthedUser = login != null ? true : false;
        i++;
      }
      return atleastOneAuthedUser;
    };

    const hitToParams = (item) => {
      // get template for formatting the full URL
      const loc = locTemplate(item);

      // set lastmod with updatedAt if it's available, otherwise use the current date
      const date = item.updatedAt ? new Date(item.updatedAt) : new Date();
      const lastmod = date.toISOString();

      // see discussion https://www.notion.so/glitch/Sitemaps-36446db005414f87af9910c51e21d88e#1a0eff53ae9c492aa9be33ceac1126b8
      const priority = 0.6;
      console.log(item)

      // exclude private or not safe for kids items
      if (item.notSafeForKids || item.isPrivate) {
        return null;
      }
      
      // exclude teams/collections with no projects on them
      if ((index === 'teams' || index === 'collections') && item.projects.length === 0) {
        return null;
      }

      // extra validation for projects: exclude anon and newly-created projects
      // if (index === 'projects' && !isProjectValid(item)) {
      //   return null;
      // }
      
      // also need to exclude user pages with no projects
      // use api.isEmptyUserPage(page.login)

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
      spinner.fail(`${index}: ${error.toString()}`);
    }
  }
}


/* 
team item:
{ url: 'prac',
  name: 'Prac',
  isVerified: false,
  coverColor: '',
  backgroundColor: '',
  hasCoverImage: false,
  hasAvatarImage: false,
  notSafeForKids: false,
  members: [ 6617454 ],
  collections: [],
  projects: [],
  updatedAt: 1570195139565,
  objectID: 'team-6647' }
user item:
{ name: 'Andromeda Bot creator',
  login: 'eldilzsterino',
  notSafeForKids: false,
  description: '',
  avatarUrl:
   'https://s3.amazonaws.com/production-assetsbucket-8ljvyr1xczmb/user-avatar/e91254ef-eace-4051-80b8-d89d5f948336-large.png',
  avatarThumbnailUrl:
   'https://s3.amazonaws.com/production-assetsbucket-8ljvyr1xczmb/user-avatar/e91254ef-eace-4051-80b8-d89d5f948336-small.png',
  coverColor: 'rgb(4,4,4)',
  featuredProject: null,
  thanks: 5,
  updatedAt: 1570916055321,
  hasCoverImage: true,
  objectID: 'user-647877' }
collection item:
{ name: 'My Stuff',
  isMyStuff: true,
  isPrivate: true,
  url: 'my-stuff',
  fullUrl: 'dq89group/my-stuff',
  avatarUrl:
   'https://cdn.glitch.com/1afc1ac4-170b-48af-b596-78fe15838ad3%2Fcollection-avatar.svg?1540389405633',
  avatarThumbnailUrl: null,
  coverColor: '#70ea9f',
  notSafeForKids: false,
  projects: [],
  user: 11339678,
  team: -1,
  teams: [ -1 ],
  members: [ 11339678 ],
  updatedAt: 1581521793685,
  description: 'My place to save cool finds',
  objectID: 'collection-35777' }
project item:
{ domain: 'assets-lib',
  isPrivate: false,
  members: [ 11, 728660 ],
  collections:
   [ 21643, 23325, 28381, 11977, 10373, 8777, 7045, 4109, 3503, 3415, 1584 ],
  teams: [],
  numRemixes: 160,
  createdAt: '2017-04-06T17:47:55.660Z',
  baseProject: 'cb02d9ae-61ed-4053-b465-d6e2e9656ac3',
  notSafeForKids: false,
  numAppVisits: 2023,
  numEditorVisits: 2007,
  dependencies: [ 'express' ],
  keywords: [ 'node', 'express' ],
  license: 'MIT',
  showAsGlitchTeam: false,
  updatedAt: 1550997654214,
  description: 'Use relative paths to serve assets',
  admins: [ 11, 728660 ],
  objectID: 'project-cff88cd8-5482-4e3e-a13f-d2d224c6e756' }
*/