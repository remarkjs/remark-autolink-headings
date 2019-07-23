# remark-autolink-headings

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]
[![Sponsors][sponsors-badge]][collective]
[![Backers][backers-badge]][collective]
[![Chat][chat-badge]][chat]

[**remark**][remark] plugin to automatically add links to headings.

> This package integrates with [`remark-html`][remark-html].
> It may be better to work with [**rehype**][rehype], which is specifically made
> for HTML, and to use [`rehype-autolink-headings`][rehype-autolink-headings]
> instead of this package.

## Install

[npm][]:

```sh
npm install remark-autolink-headings
```

## Use

Say we have the following markdown file, `example.md`:

```markdown
# Lorem ipsum 😪
## dolor—sit—amet
### consectetur &amp; adipisicing
#### elit
##### elit
```

And our script, `example.js`, looks as follows:

```js
const fs = require('fs')
const unified = require('unified')
const markdown = require('remark-parse')
const html = require('remark-html')
const slug = require('remark-slug')
const headings = require('remark-autolink-headings')

const contents = unified()
  .use(markdown)
  .use(slug)
  // Note that this module must be included after `remark-slug`.
  .use(headings)
  .use(html)
  .processSync(fs.readFileSync('example.md'))
  .toString()

console.log(contents)
```

Now, running `node example` yields:

```html
<h1 id="lorem-ipsum-"><a href="#lorem-ipsum-" aria-hidden="true"><span class="icon icon-link"></span></a>Lorem ipsum 😪</h1>
<h2 id="dolorsitamet"><a href="#dolorsitamet" aria-hidden="true"><span class="icon icon-link"></span></a>dolor—sit—amet</h2>
<h3 id="consectetur--adipisicing"><a href="#consectetur--adipisicing" aria-hidden="true"><span class="icon icon-link"></span></a>consectetur &#x26; adipisicing</h3>
<h4 id="elit"><a href="#elit" aria-hidden="true"><span class="icon icon-link"></span></a>elit</h4>
<h5 id="elit-1"><a href="#elit-1" aria-hidden="true"><span class="icon icon-link"></span></a>elit</h5>
```

## API

### `remark().use(autolinkHeadings[, options])`

Automatically add links to headings.

##### `options`

###### `options.behavior`

How to create links (`string`, default: `'prepend'`).
Pass `'prepend'` to inject the link before the heading text, `'append'` for a
link after the heading text, and `'wrap'` to wrap the whole heading text with
the link.
Note that supplying `wrap` will ignore any value defined by the `content`
option.

###### `options.content`

[**hast**][hast] nodes to insert in the link (`Node|Children`).
By default, the following is used:

```js
{
  type: 'element',
  tagName: 'span',
  properties: {className: ['icon', 'icon-link']}
}
```

###### `options.linkProperties`

Extra properties to set on the link (`Object?`).
Defaults to `{ariaHidden: true}` when in `'prepend'` or `'append'` mode.

## Security

Use of `remark-autolink-headings` can open you up to a
[cross-site scripting (XSS)][xss] attack if you pass user provided content in
`linkProperties` or `content`.

Always be wary of user input and use [`rehype-sanitize`][sanitize].

## Contribute

See [`contributing.md`][contributing] in [`remarkjs/.github`][health] for ways
to get started.
See [`support.md`][support] for ways to get help.

This project has a [Code of Conduct][coc].
By interacting with this repository, organisation, or community you agree to
abide by its terms.

## License

[MIT][license] © [Ben Briggs][author]

<!-- Definitions -->

[build-badge]: https://img.shields.io/travis/remarkjs/remark-autolink-headings/master.svg

[build]: https://travis-ci.org/remarkjs/remark-autolink-headings

[coverage-badge]: https://img.shields.io/codecov/c/github/remarkjs/remark-autolink-headings.svg

[coverage]: https://codecov.io/github/remarkjs/remark-autolink-headings

[downloads-badge]: https://img.shields.io/npm/dm/remark-autolink-headings.svg

[downloads]: https://www.npmjs.com/package/remark-autolink-headings

[size-badge]: https://img.shields.io/bundlephobia/minzip/remark-autolink-headings.svg

[size]: https://bundlephobia.com/result?p=remark-autolink-headings

[sponsors-badge]: https://opencollective.com/unified/sponsors/badge.svg

[backers-badge]: https://opencollective.com/unified/backers/badge.svg

[collective]: https://opencollective.com/unified

[chat-badge]: https://img.shields.io/badge/join%20the%20community-on%20spectrum-7b16ff.svg

[chat]: https://spectrum.chat/unified/remark

[npm]: https://docs.npmjs.com/cli/install

[health]: https://github.com/remarkjs/.github

[contributing]: https://github.com/remarkjs/.github/blob/master/contributing.md

[support]: https://github.com/remarkjs/.github/blob/master/support.md

[coc]: https://github.com/remarkjs/.github/blob/master/code-of-conduct.md

[license]: license

[author]: http://beneb.info

[remark]: https://github.com/remarkjs/remark

[remark-html]: https://github.com/remarkjs/remark-html

[rehype]: https://github.com/rehypejs/rehype

[rehype-autolink-headings]: https://github.com/rehypejs/rehype-autolink-headings

[hast]: https://github.com/syntax-tree/hast

[xss]: https://en.wikipedia.org/wiki/Cross-site_scripting

[sanitize]: https://github.com/rehypejs/rehype-sanitize
