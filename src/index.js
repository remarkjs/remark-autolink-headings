import visit from 'unist-util-visit'
import extend from 'extend'

const behaviors = {prepend: 'unshift', append: 'push'}

const contentDefaults = {
  type: 'element',
  tagName: 'span',
  properties: {className: ['icon', 'icon-link']}
}

const defaults = {behavior: 'prepend', content: contentDefaults}

let deprecationWarningIssued = false

export default function attacher(opts = {}) {
  let {linkProperties, behavior, content} = {...defaults, ...opts}
  let method
  let hChildren

  // NOTE: Remove in next major version
  if (opts.behaviour !== undefined) {
    if (!deprecationWarningIssued) {
      deprecationWarningIssued = true
      console.warn(
        '[remark-autolink-headings] Deprecation Warning: `behaviour` is a nonstandard option. Use `behavior` instead.'
      )
    }

    behavior = opts.behaviour
  }

  if (behavior === 'wrap') {
    method = wrap
  } else {
    method = inject
    hChildren = Array.isArray(content) ? content : [content]

    if (!linkProperties) {
      linkProperties = {ariaHidden: 'true'}
    }
  }

  return ast => visit(ast, 'heading', visitor)

  function visitor(node) {
    const {data} = node
    const id = data && data.hProperties && data.hProperties.id

    if (id) {
      method(node, '#' + id)
    }
  }

  function inject(node, url) {
    node.children[behaviors[behavior]]({
      type: 'link',
      url,
      title: null,
      children: [],
      data: {
        hProperties: extend(true, {}, linkProperties),
        hChildren: extend(true, [], hChildren)
      }
    })
  }

  function wrap(node, url) {
    node.children = [
      {
        type: 'link',
        url,
        title: null,
        children: node.children,
        data: {
          hProperties: extend(true, {}, linkProperties)
        }
      }
    ]
  }
}
