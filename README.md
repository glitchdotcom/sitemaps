# Sitemaps generator for glitch.com

To Use
---

Open the console and run `npm run generate` to rebuild the sitemaps:

```
# rebuild all the sitemaps (projects, users, teams, collections)
npm run generate

# rebuild the projects and users sitemaps
npm run generate projects users
```
Generated sitemaps are written to `.data` and served from `/projects`, `/teams`, `/users`, and `/collections`

⏱ *Note: Generating the projects sitemaps takes a few minutes*

What's Happening
---

The `generate` script looks at all the pages indexed by Algolia, and loops through them to create a map of the sites on glitch.com.
There are some entities we don't want to index, however, so we've added additional filtering to cut the following pages out:
-  private projects
-  projects marked "not safe for kids"
-  projects less than one day old (in case there are bad actor projects, we have a time frame to catch them before they're added in)
-  team and collection pages with no projects on them (no interesting data)
-  projects with no logged-in users (these will be deleted in 5 days anyhow)
-  user pages with no projects on them

The final two filters are not able to be determined by the response from Algolia (you can see example responses of all types in `schema.txt`) and currently require an API call to get the information needed to determine them.
The package we use to query this data from Algolia does not work with the async nature of our API, so filtering based on API call has to be done separately.
The `filter` function, which is called after `generate`, takes each sitemap shard that was created by the Algolia package, loads it as a Sitemap object, and loops through the URLs in the map.
For each URL, it checks whether the page should be filtered out, and if so, removes it from the object. Once complete, it writes to the same location the file was in previously.