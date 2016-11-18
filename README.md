# trailpack-proxy-router

[![NPM version][npm-image]][npm-url]
[![Build status][ci-image]][ci-url]
[![Dependency Status][daviddm-image]][daviddm-url]
[![Code Climate][codeclimate-image]][codeclimate-url]

The Proxy Engine Router is an Express middleware built to be used on Trailsjs with Proxy Engine.
It's purpose is to allow for easy development, SEO, and AAA (Triple A) testing (a concept developed by [Scott Wyatt](https://github.com/scott-wyatt))
from the ground up. 

Views are stored in either a Flat File database or joined with a Postgres database, and are cache-able in a document store such as Redis.
Each view has a series of tests that are displayed based on a weight, threshold, and baseline for a given demographic.

Each time a view is run, the engine will determine which series to display and track positive/negative control conversions for the demographic to score it.
Once a Series threshold and baseline is met, it becomes the default view for a given demographic.

Say good bye to A/B testing as AAA testing can handle hundreds of different series test at once for each view in a web app.

Series documents are given a test number, and version. They default to the lastest version, but the default can be changed to any version while keeping the run and score.
Large changes to any version should be given another test number. The documents are markdown documents with yaml that allow you to use normal markdown, HTML, or embeds.

Use your own mechanisms to track negative and positive interactions and then feed them back to Proxy Engine to adjust the score.

Use your own mechanisms to determine what qualifies as a demographic.

## Principles 
One of the most difficult feats when dealing with a CMS, from a developer standpoint, is continuity:

- Developing well crafted pages in a CMS requires a local or staging DB and then taking approved changes live in some slow error prone fashion.
- A/B Testing requires that Marketers and UX specialist have easy access to creating variations of views and running tests. 
- Database driven view states are notoriously slow.
- Database content is slow to search.

All of these are issues for the Modern Web, especially for web apps built as single page applications. 

Proxy Engine's router takes care of these pain points by: 

- Giving developers a flat file database for component driven views a with high amount version control.
- Giving Marketers/UXs an easy way to create variations and automatically run tests when given an appropriate editor.
- Making documents cache-able and still retaining tests and version control across millions of pages.
- Using the Metadata for each page makes using postgres' JSONB keyword searching fast (and already SEO ready), or easily connect postrgres to an Elasticsearch engine to make conent searching even better.

### Gotchas
- This style of CMS requires a "Single Source of Truth" for Frontend Components to bind too. Try using Redux or ngRX for your frontend.
- Mechanisms to determine/set Score and Demographic are up to you.

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
      return require('trailpack-proxy-router').lib.Middleware.proxyroute(req, res, next)
    }
  }
```
### Add Policies to RouteController Methods

## Usage

### Example series document

This is the default home page located at `/content/series/a0/index.md`

```sh
---
title: Homepage Hello World
keywords: proxy-engine, amazing
runs: 0
score: 0.0
scripts: 
 - /path/to/special/page/script.js

---
<header-component></header-component>
# Homepage Hello World
<h2>I can use Normal HTML</h2>

I can even use embeds like a youtube video or my own custom ones.
{@youtube: 123}

I can even use custom HTML DOM like ones from Angular2

<login></login>
<footer-component></footer-component>
```

### Remarkable
[Remarkable](https://github.com/jonschlinkert/remarkable) 
is used to parse the document.

### Remarkable Embed
[Remarkable Embed](https://github.com/Commander-lol/remarkable-embed) 
is used to grant the parsed document embedables

### Remarkable Meta
[Remarkable Meta](https://github.com/eugeneware/remarkable-meta) 
is used to give the flat file readable meta data as well as give the displayed page meta data.

[npm-image]: https://img.shields.io/npm/v/trailpack-proxy-router.svg?style=flat-square
[npm-url]: https://npmjs.org/package/trailpack-proxy-router
[ci-image]: https://img.shields.io/travis/calistyle/trailpack-proxy-router/master.svg?style=flat-square
[ci-url]: https://travis-ci.org/calistyle/trailpack-proxy-router
[daviddm-image]: http://img.shields.io/david/calistyle/trailpack-proxy-router.svg?style=flat-square
[daviddm-url]: https://david-dm.org/calistyle/trailpack-proxy-router
[codeclimate-image]: https://img.shields.io/codeclimate/github/calistyle/trailpack-proxy-router.svg?style=flat-square
[codeclimate-url]: https://codeclimate.com/github/calistyle/trailpack-proxy-router

