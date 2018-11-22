# remark-autolink-headings

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Chat][chat-badge]][chat]
[![Sponsors][sponsors-badge]][collective]
[![Backers][backers-badge]][collective]

Automatically add links to headings with [**remark**][remark].

This package integrates with [remark-html][remark-html].
It may be better to work with [**rehype**][rehype], which is specifically made
for HTML, and to use [rehype-autolink-headings][] instead of this package.

## Installation

[npm][]:

```bash
npm install remark-autolink-headings
```

## Example

Say we have the following markdown file, `example.md`:

```markdown
# Lorem ipsum 😪
## dolor—sit—amet
### consectetur &amp; adipisicing
#### elit
##### elit
```

And our script, `example.js`, looks as follows:

```javascript
const fs = require('fs')
const unified = require('unified')
const markdown = require('remark-parse')
const html = require('remark-html')
const slug = require('remark-slug')
const headings = require('remark-autolink-headings')

const contents = unified()
  .use(markdown)
  .use(slug)
  // Note that this module must be included after remark-slug.
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

### `remark.use(autolinkHeadings[, options])`

Add links to headings.

#### `options.behaviour`

How to create links (`string`, default: `'prepend'`).
Pass `'prepend'` to inject the link before the heading text, `'append'` for a
link after the heading text, and `'wrap'` to wrap the whole heading text with
the link.
Note that supplying `wrap` will ignore any value defined by the `content`
option.

#### `options.content`

[HAST][] nodes to insert in the link (`Node|Children`).
By default, the following is used:

```js
{
  type: 'element',
  tagName: 'span',
  properties: {className: ['icon', 'icon-link']}
  children: []
}
```

#### `options.linkProperties`

Extra properties to set on the link (`Object?`).
Defaults to `{ariaHidden: true}` when in `'prepend'` or `'append'` mode.

## Contribute

See [`contributing.md` in `remarkjs/remark`][contributing] for ways to get
started.

This organisation has a [Code of Conduct][coc].  By interacting with this
repository, organisation, or community you agree to abide by its terms.

## License

[MIT][license] © [Ben Briggs][author]

<!-- Definitions -->

[build-badge]: https://img.shields.io/travis/remarkjs/remark-autolink-headings.svg

[build]: https://travis-ci.org/remarkjs/remark-autolink-headings

[coverage-badge]: https://img.shields.io/codecov/c/github/remarkjs/remark-autolink-headings.svg

[coverage]: https://codecov.io/github/remarkjs/remark-autolink-headings

[downloads-badge]: https://img.shields.io/npm/dm/remark-autolink-headings.svg

[downloads]: https://www.npmjs.com/package/remark-autolink-headings

[chat-badge]: https://img.shields.io/badge/join%20the%20community-on%20spectrum-7b16ff.svg

[chat]: https://spectrum.chat/unified/remark

[sponsors-badge]: https://opencollective.com/unified/sponsors/badge.svg

[backers-badge]: https://opencollective.com/unified/backers/badge.svg

[collective]: https://opencollective.com/unified

[license]: license

[author]: http://beneb.info

[npm]: https://docs.npmjs.com/cli/install

[contributing]: https://github.com/remarkjs/remark/blob/master/contributing.md

[coc]: https://github.com/remarkjs/remark/blob/master/code-of-conduct.md

[remark]: https://github.com/remarkjs/remark

[remark-html]: https://github.com/remarkjs/remark-html

[rehype]: https://github.com/rehypejs/rehype

[rehype-autolink-headings]: https://github.com/rehypejs/rehype-autolink-headings

[hast]: https://github.com/syntax-tree/hast
