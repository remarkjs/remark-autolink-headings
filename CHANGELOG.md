# 5.0.0

* Updated for remark 7.x (thanks to @wooorm).
* (Breaking) Drops support for Node 0.12.

# 4.0.0

* Upgraded to remark-html 5.x.

## Breaking changes

* `opts.attributes` is now named `opts.linkProperties`.
* `opts.template` has been replaced with `opts.content`; instead of supplying
  a HTML string here, you can specify either a single HAST node or an array
  of them. This makes the module more suitable for working with virtual node
  consumers, such as React.

# 3.0.1

* Upgraded to remark 5.x, this module will work the same using either version.

# 3.0.0

* Updated for remark 4.x.

# 2.0.0

* Renamed from mdast-autolink-headings without any API changes.
