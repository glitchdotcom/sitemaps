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
