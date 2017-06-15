# [remark]-autolink-headings [![Build Status](https://travis-ci.org/ben-eb/remark-autolink-headings.svg?branch=master)][ci] [![NPM version](https://badge.fury.io/js/remark-autolink-headings.svg)][npm] [![Dependency Status](https://gemnasium.com/ben-eb/remark-autolink-headings.svg)][deps]

> Automatically add links to headings in Markdown.

This package integrates with [remark-html][html]. It may be better to work with
[rehype], which is specifically made for HTML, and to use
[rehype-autolink-headings] instead of this package.

## Install

With [npm](https://npmjs.org/package/remark-autolink-headings) do:

```
npm install remark-autolink-headings --save
```


## Example

remark-autolink-headings is designed to work with
[remark-html][html] & [remark-slug][slug], and creates GitHub style links for
each of your headings.

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
var fs = require('fs');
var unified = require('unified');
var markdown = require('remark-parse');
var html = require('remark-html');
var slug = require('remark-slug');
var headings = require('remark-autolink-headings');

var result = unified()
    .use(markdown)
    .use(slug)
    // Note that this module must be included after remark-slug.
    .use(headings)
    .use(html)
    .processSync(fs.readFileSync('example.md'))
    .toString();

console.log(result);
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

### remark.use(headings, [options])

#### options

##### behaviour

Type: `string`
Default: `prepend`

Set this to `prepend` to inject the link before the heading text; `append` after
it, and `wrap` to wrap the whole heading text with the link. Note that supplying
`wrap` will ignore any value defined by the `content` option.

##### content

Type: `Object|Array`
Default: ``{type: 'element', tagName: 'span', properties: {className: [icon, `${icon}-${link}`]} }``

Supply a list of HAST nodes or a single node here. For further details, please
refer to the specification at <https://github.com/syntax-tree/hast>.

##### linkProperties

Type: `object`

By default, when using the `append` or `prepend` behaviour, this will add
`aria-hidden="false"` to the anchor. When using the `wrap` behaviour, this is
left empty for you to add any extra HTML attributes.


## Contributing

Pull requests are welcome. If you add functionality, then please add unit tests
to cover it.


## License

MIT © [Ben Briggs](http://beneb.info)


[ci]:      https://travis-ci.org/ben-eb/remark-autolink-headings
[deps]:    https://gemnasium.com/ben-eb/remark-autolink-headings
[npm]:     http://badge.fury.io/js/remark-autolink-headings
[html]:    https://github.com/wooorm/remark-html
[remark]:  https://github.com/wooorm/remark
[rehype]:  https://github.com/wooorm/rehype
[slug]:    https://github.com/wooorm/remark-slug
[rehype-autolink-headings]: https://github.com/wooorm/rehype-autolink-headings
