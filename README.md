# [remark]-autolink-headings [![Build Status](https://travis-ci.org/ben-eb/remark-autolink-headings.svg?branch=master)][ci] [![NPM version](https://badge.fury.io/js/remark-autolink-headings.svg)][npm] [![Dependency Status](https://gemnasium.com/ben-eb/remark-autolink-headings.svg)][deps]

> Automatically add links to headings in Markdown.


## Install

With [npm](https://npmjs.org/package/remark-autolink-headings) do:

```
npm install remark-autolink-headings --save
```


## Example

remark-autolink-headings is designed to work with
[remark-html][html] & [remark-slug][slug], and creates GitHub style links for
each of your headings:

```js
var remark    = require('remark');
var html     = require('remark-html');
var slug     = require('remark-slug');
var headings = require('remark-autolink-headings');

var markdown = '# Hello';
var result   = remark.use([ slug, headings, html ]).process(markdown);
console.log(result);

//=> <h1 id="hello"><a href="#hello" aria-hidden="true"><span class="icon icon-link"></span></a>Hello</h1>
```


## API

### remark.use(headings, [options])

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


[ci]:      https://travis-ci.org/ben-eb/remark-autolink-headings
[deps]:    https://gemnasium.com/ben-eb/remark-autolink-headings
[npm]:     http://badge.fury.io/js/remark-autolink-headings
[html]:    https://github.com/wooorm/remark-html
[remark]:  https://github.com/wooorm/remark
[slug]:    https://github.com/wooorm/remark-slug
