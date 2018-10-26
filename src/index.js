import visit from 'unist-util-visit'
import extend from 'extend'

const behaviours = {prepend: 'unshift', append: 'push'}

const contentDefaults = {
  type: 'element',
  tagName: 'span',
  properties: {className: ['icon', 'icon-link']}
}

const defaults = {behaviour: 'prepend', content: contentDefaults}

export default function attacher(opts = {}) {
  let {linkProperties, behaviour, content} = {...defaults, ...opts}
  let method
  let hChildren

  if (behaviour === 'wrap') {
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
    node.children[behaviours[behaviour]]({
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
