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

export default function attacher(options = {}) {
  let {linkProperties, behavior, content} = {...defaults, ...options}
  let method

  // NOTE: Remove in next major version
  if (options.behaviour !== undefined) {
    if (!deprecationWarningIssued) {
      deprecationWarningIssued = true
      console.warn(
        '[remark-autolink-headings] Deprecation Warning: `behaviour` is a nonstandard option. Use `behavior` instead.'
      )
    }

    behavior = options.behaviour
  }

  if (behavior === 'wrap') {
    method = wrap
  } else {
    method = inject

    if (!linkProperties) {
      linkProperties = {ariaHidden: 'true', tabIndex: -1}
    }
  }

  return (tree) => visit(tree, 'heading', visitor)

  function visitor(node) {
    const {data} = node
    const id = data && data.hProperties && data.hProperties.id

    if (id) {
      method(node, '#' + id)
    }
  }

  function inject(node, url) {
    const hProperties = extend(true, {}, linkProperties)
    let hChildren = typeof content === 'function' ? content(node) : content

    hChildren = Array.isArray(hChildren) ? hChildren : [hChildren]

    if (typeof content !== 'function') {
      hChildren = extend(true, [], hChildren)
    }

    node.children[behaviors[behavior]]({
      type: 'link',
      url,
      title: null,
      children: [],
      data: {hProperties, hChildren}
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
