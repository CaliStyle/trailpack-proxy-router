# trailpack-proxy-router

[![NPM version][npm-image]][npm-url]
[![Build status][ci-image]][ci-url]
[![Dependency Status][daviddm-image]][daviddm-url]
[![Code Climate][codeclimate-image]][codeclimate-url]

## Content Management built for speed, scalability, testing, and love from [Cali Style Technologies](https://cali-style.com)

The Proxy Engine Router is an Express middleware built to be used on Trailsjs with Proxy Engine.
It's purpose is to allow for easy development, SEO, and AAA (Triple A) testing from the ground up. (a concept developed by [Scott Wyatt](https://github.com/scott-wyatt)) This means that you can still use your own controllers to handle views and add Proxy Route content to them as needed.

Views are stored in either a Flat File database or joined with a Postgres database, and are cache-able in a document store such as Redis.
Each view has a series of tests that are displayed based on a weight, threshold, and baseline for a given demographic.

Each time a view is run, the engine will determine which series to display and track the runs for a given view and positive/negative control conversions for the demographic to score it.
Once a Series threshold and baseline is met, it becomes the default view for a given demographic.

Say good bye to A/B testing as AAA testing can handle hundreds of different series test at once for each view in a web app and it can do it automatically.  This makes UI testing purely iterative and personable.
 - Want to find the best UI for a time of day and show it at the right time?
 - Want to find the best layouts for males or females or trans and show it to the corresponding audience automatcially?

AAA Testing isn't about one ~size~ site fits all, it's about finding the right layout per audience. Series documents are given a test number, and version. They default to the latest version, but the default can be changed to any version while keeping the run and score.
Large changes to any version should be given another test number. The documents are markdown documents with yaml that allow you to use normal markdown, HTML, or embeds.

Use your own mechanisms to track negative and positive interactions and then feed them back to Proxy Engine to adjust the score.

Use your own mechanisms to determine what qualifies as a demographic.

## Principles 
One of the most difficult feats when dealing with a CMS, from a developer standpoint, is continuity:

- Developing well crafted pages in a CMS requires a local or staging DB and then taking approved changes live in some slow error prone fashion.
- A/B Testing requires that Marketers and UX specialist have easy access to creating variations of views and running tests. 
- Database driven view states are notoriously slow.
- Database content with large amounts of HTML is slow to search.

All of these are issues for the Modern Web, especially for web apps built as single page applications. 

Proxy Engine's router takes care of these pain points by: 

- Giving developers a flat file database for component driven views with a high amount of version control.
- Giving Marketers/UXs an easy way to create variations and automatically run tests when given an appropriate editor.
- Making documents cache-able and still retaining tests and version control across millions of pages.
- Using the Metadata for each page makes using postgres' JSONB keyword searching fast (and already SEO ready), or easily connect postrgres to an Elasticsearch engine to make content searching even better.

### Additional Use Cases
- Assign demographics to users and display or withhold content based on it.
- Complete version control for technical manuals and blogs
- Flatfile CMS for non database driven web apps.
- Versioned display structure for web apps using Angular2 ngRX or React Flux.

### Gotchas
- This style of CMS requires a "Single Source of Truth" for Frontend Components to bind too. Try using Redux or ngRX for your frontend.
- Mechanisms to determine/set Score and Demographic are up to you.

## Dependencies
### Supported ORMs
| Repo          |  Build Status (edge)                  |
|---------------|---------------------------------------|
| [trailpack-sequelize](https://github.com/trailsjs/trailpack-sequelize) | [![Build status][ci-sequelize-image]][ci-sequelize-url] |

### Supported Webserver
| Repo          |  Build Status (edge)                  |
|---------------|---------------------------------------|
| [trailpack-express](https://github.com/trailsjs/trailpack-express) | [![Build status][ci-express-image]][ci-express-url] |


## Install

```sh
$ npm install --save trailpack-proxy-router
```

## Configure

```js
// config/main.js
module.exports = {
  packs: [
    // ... other trailpacks
    require('trailpack-proxy-router')
  ]
}
```

```js
// config/web.js
  middlewares: {
    order: [
      ... other middleware
      'proxyrouter', // proxyrouter must be before router
      'router'
    ],
    proxyrouter: function(req, res, next){
      return require('trailpack-proxy-router/lib').Middleware.proxyroute(req, res, next)
    }
  }
```
```js
// config/proxyroute.js
module.exports = {
  // Default Threshold
  threshold: 100,
  // Default Baseline
  baseline: 0.75,
  // Default Weight
  weight: 50,
  // Default Flat File Folder
  folder: 'content',
  // Force Flat File and ignore DB
  forceFL: true,
  // The number of controls to enqueue before flushing to processor.
  flushAt: 20,
  // The number of milliseconds to wait before flushing the queue automatically to processor.
  flushAfter: 10000,
  // Cache
  cache: {
    // The redis datastore prefix
    prefix: 'pxy',
    // Allow Caching
    allow: true,
    // Milliseconds before cache is ejected
    eject: 10000
  },
  // Remarkable
  remarkable: {
    options: {
      html: true
    },
    plugins: [
      // Example Plugin (remarkable meta and remarkable components are required and already installed)
      // {
      //   plugin: require('remarkable-embed'),
      //   options: {}
      // }
    ]
  }
}
```

### Content Folder
By default the Proxy Route content directory is `content` in the root directory of your application.  However, it can changed to any directory or even a node_module in `config/proxyroute`. Whatever the content folder, the file structure must follow these guidelines:

- Every directory must have a series directory that contains a named test directory eg. `a0` with a SemVer versioned markdown document.
- Named test directories follow this pattern: `a0`, `b0`, `c0` etc.  Upon exceeding `z0` change to `a1`, `b1`, `c1` etc.
- Directories that start with wild cards eg. `:world` or `*` will match express routes.

##### Example
```
 - content
   - hello
     - :world
       - series
         - a0
           - 0.0.0.md
     - earth
       - series
         - a0
           - 0.0.0.md
     - series
       - a0
         - 0.0.0.md
   - series
     - a0
       - 0.0.0.md
       - 0.0.1.md
     - b0
       - 0.0.0.md
```

### req.locals
Proxy Route merges any document's id, series, test, and metadata with req.locals so it can be used in any view template engine required.

### Ignore Routes and Alternate Routes
When the trails app starts, two configurations are added to trailsApp.config.proxyroute:
- `ignoreRoutes`
- `alternateRoutes`

Ignored Routes are any routes that do not use the GET method or have an app config with ignore set to true 
```js
  {
    method: ['GET'],
    path: '/ignore/me',
    handler: 'IgnoreController.me',
    config: {
      app: {
        proxyroute: {
          ignore: true
        }
      }
    }
  }
```
It's important to ignore routes that you don't want Proxy Route to check as it will speed up the application.

Alternate Routes are any routes that use the GET method and have a wildcard or an express parameter in the url eg `/home/*` or `/hello/:world`.
This is useful for when a child route may not have a specific view eg. `/products/1` and the wildcard might eg. `products/:id`.  With this schema, you need not make a view for each product, and instead just define the wildcard templates which the product will inherit.  This does allow you to still have extreme control over any individual page while also having a fallback.

### Add Policies to RouteController Methods
By default trailpack-proxy-route has no policies to prevent anything from hitting the RouteController endpoints. You will need to create policies with your authentication strategy to determine what is allowed to hit them. 

### Server Clusters with Flat File (TODO)
For trailpack-proxy-route to work on a server cluster as a Flat File server, Redis is required. 
After any route or series is updated as a Flat File, an event is produced to all other servers in the cluster to copy the flat files to their folder structure.

## Usage

### Example series document

This is the default home page located at `/content/series/a0/index.md`

```sh
---
title: Homepage Hello World
keywords: proxy-engine, amazing
runs: 0
score: 0.0
demographics: 
 - {name: 'unknown'}
scripts:
 - /i/can/do/arrays/too.js
 - /path/to/special/page/script.js
og: {'image': '/and/cool/things/like/og-tags.jpg'}
---
<header-component></header-component>
# Homepage Hello World
<h2>I can use Normal HTML</h2>

I can even use embeds like a youtube video or my own custom ones.
@[youtube](lJIrF4YjHfQ)

I can even use custom HTML DOM like ones from Angular2

<login></login>
<footer-component [wow]="amazing"></footer-component>
```

### Markdown-it (required)
[Markdown-it](https://www.npmjs.com/package/markdown-it) 
is used to parse the document from markdown/html to html.

### Markdown-it Meta Plugin (Default)
Is used to give the flat file readable meta data as well as give the displayed page meta data.

### Markdown-it Component Plugin (Default)
Is used to give the flat files the ability to use html components typical of angular, angular2 and react

### Markdown-it Block Embed (optional)
[Markdown-it Block Embed Embed](https://github.com/rotorz/markdown-it-block-embed) 
is used to grant the parsed document embed-ables.  This could be youtube, vimeo, your own short codes, whatever!

### Controllers
#### RouteController
##### RouteController.view
An example of using `req.proxyroute`.  RouteController.view can return a view as html or as JSON.

##### RouteController.buildToDB
Builds the Flat File structure to the database 

##### RouteController.buildToFL
Builds the Database to a Flat File Structure

##### RouteController.addPage
Adds a Route Model (Page)

##### RouteController.editPage
Edits a Route Model (Page)

##### RouteController.removePage
Removes a Route Model (Page)

##### RouteController.addSeries
Adds a RouteDocument Model (Document)

##### RouteController.editSeries
Edits a RouteDocument Model (Document)

##### RouteController.removeSeries
Removes a RouteDocument Model (Document)

##### RouteController.control
Adds a Positive or Negative value for a series

### Services
#### Controls
##### RouteControlsService.addRun()
Adds a run score to a series

##### RouteControlsService.positive()
Adds a positive score to a series

##### RouteControlsService.negative()
Adds a negative score to a series

#### General
##### RouteService.addPage()
Adds a Route Model (Page)

##### RouteService.editPage()
Edits a Route Model (Page)

##### RouteService.removePage()
Removes a Route Model (Page)

##### RouteService.addSeries()
Adds a RouteDocument Model (Document)

##### RouteService.editSeries()
Edits a RouteDocument Model (Document)

##### RouteService.removeSeries()
Removes a RouteDocument Model (Document)

#### Render
##### RouteRenderService.render()
Renders a markdown document using remarkable and all the plugins configured
@returns
```js
{ 
  id: String,
  path: String,
  series: String,
  version: String,
  meta: Object,
  document: String 
}
```

[npm-image]: https://img.shields.io/npm/v/trailpack-proxy-router.svg?style=flat-square
[npm-url]: https://npmjs.org/package/trailpack-proxy-router
[ci-image]: https://img.shields.io/travis/calistyle/trailpack-proxy-router/master.svg?style=flat-square
[ci-url]: https://travis-ci.org/calistyle/trailpack-proxy-router
[daviddm-image]: http://img.shields.io/david/calistyle/trailpack-proxy-router.svg?style=flat-square
[daviddm-url]: https://david-dm.org/calistyle/trailpack-proxy-router
[codeclimate-image]: https://img.shields.io/codeclimate/github/calistyle/trailpack-proxy-router.svg?style=flat-square
[codeclimate-url]: https://codeclimate.com/github/calistyle/trailpack-proxy-router

[ci-sequelize-image]: https://img.shields.io/travis/trailsjs/trailpack-sequelize/master.svg?style=flat-square
[ci-sequelize-url]: https://travis-ci.org/trailsjs/trailpack-sequelize

[ci-express-image]: https://img.shields.io/travis/trailsjs/trailpack-express/master.svg?style=flat-square
[ci-express-url]: https://travis-ci.org/trailsjs/trailpack-express
