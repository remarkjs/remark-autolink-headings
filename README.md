# [mdast]-autolink-headings [![Build Status](https://travis-ci.org/ben-eb/mdast-autolink-headings.svg?branch=master)][ci] [![NPM version](https://badge.fury.io/js/mdast-autolink-headings.svg)][npm] [![Dependency Status](https://gemnasium.com/ben-eb/mdast-autolink-headings.svg)][deps]

> Automatically add links to headings in Markdown.

## Install

With [npm](https://npmjs.org/package/mdast-autolink-headings) do:

```
npm install mdast-autolink-headings --save
```

## Example

mdast-autolink-headings is designed to work with
[mdast-html][html] & [mdast-slug][slug], and creates GitHub style links for
each of your headings:

```js
var mdast    = require('mdast');
var html     = require('mdast-html');
var slug     = require('mdast-slug');
var headings = require('mdast-autolink-headings');

var markdown = '# Hello';
var result   = mdast.use([ slug, headings, html ]).process(markdown);
console.log(result);

//=> <h1 id="hello"><a href="#hello" aria-hidden="true"><span class="icon icon-link"></span></a>Hello</h1>
```

## API

### mdast.use(headings, [options])

#### options

##### attributes

Type: `object`

By default, when using the `append` or `prepend` behaviour, this will add
`aria-hidden="false"` to the anchor. When using the `wrap` behaviour, this is
left empty for you to add any extra HTML attributes.

##### behaviour

Type: `string`
Default: `prepend`

Set this to `prepend` to inject the link before the heading text; `append` after
it, and `wrap` to wrap the whole heading text with the link. Note that the
`wrap` option doesn't apply any value set by the `template` option.

##### template

Type: `string`
Default: `<span class="icon icon-link"></span>`

The template used by the `append` & `prepend` behaviours.

## Contributing

Pull requests are welcome. If you add functionality, then please add unit tests
to cover it.

## License

MIT © [Ben Briggs](http://beneb.info)

[ci]:      https://travis-ci.org/ben-eb/mdast-autolink-headings
[deps]:    https://gemnasium.com/ben-eb/mdast-autolink-headings
[npm]:     http://badge.fury.io/js/mdast-autolink-headings
[html]:    https://github.com/wooorm/mdast-html
[mdast]:   https://github.com/wooorm/mdast
[slug]:    https://github.com/wooorm/mdast-slug
