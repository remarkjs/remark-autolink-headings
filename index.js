/**
 * @typedef {import('mdast').Root} Root
 * @typedef {import('mdast').Heading} Heading
 * @typedef {import('mdast').Link} Link
 * @typedef {import('mdast').Blockquote} Blockquote
 * @typedef {import('mdast').BlockContent} BlockContent
 * @typedef {import('mdast').StaticPhrasingContent} StaticPhrasingContent
 * @typedef {import('mdast').PhrasingContent} PhrasingContent
 * @typedef {import('hast').Element} Element
 * @typedef {Element['children'][number]} ElementChild
 * @typedef {import('hast').Properties} Properties
 *
 * @callback Build
 * @param {Heading} node
 * @returns {ElementChild|ElementChild[]}
 *
 * @callback BuildGroup
 * @param {Heading} node
 * @returns {Element}
 *
 * @typedef BaseOptions
 * @property {Properties} [linkProperties]
 *   Extra properties to set on the link when injecting.
 *   Defaults to `{ariaHidden: true, tabIndex: -1}` when `'prepend'` or
 *   `'append'`.
 * @property {ElementChild|ElementChild[]|Build} [content={type: 'element', tagName: 'span', properties: {className: ['icon', 'icon-link']}, children: []}]
 *   Nodes (hast) to insert in the link.
 * @property {Element|BuildGroup} [group]
 *   Node (hast) to wrap the heading and link with, if `behavior` is `'before'` or
 *   `'after'`.
 *   There is no default.
 *
 * @typedef BeforeFields
 * @property {'before'} behavior
 *   Insert link before the heading.
 *
 * @typedef AfterFields
 * @property {'after'} behavior
 *   Insert link after the heading.
 *
 * @typedef WrapFields
 * @property {'wrap'} behavior
 *   Wrap the whole heading text with the link.
 *
 * @typedef PrependFields
 * @property {'prepend'} behavior
 *   Inject link before the heading text.
 *
 * @typedef AppendFields
 * @property {'append'} behavior
 *   Inject link after the heading text.
 *
 * @typedef {BaseOptions & BeforeFields} BeforeOptions
 * @typedef {BaseOptions & AfterFields} AfterOptions
 * @typedef {Pick<BaseOptions, 'linkProperties'> & WrapFields} WrapOptions
 * @typedef {Pick<BaseOptions, 'linkProperties' | 'content'> & PrependFields} PrependOptions
 * @typedef {Pick<BaseOptions, 'linkProperties' | 'content'> & AppendFields} AppendOptions
 *
 * @typedef {BaseOptions|BeforeOptions|AfterOptions|WrapOptions|PrependOptions|AppendOptions} Options
 */

import {visit, SKIP} from 'unist-util-visit'
import extend from 'extend'

/** @type {Element} */
const contentDefaults = {
  type: 'element',
  tagName: 'span',
  properties: {className: ['icon', 'icon-link']},
  children: []
}

/**
 * Plugin to automatically add links to headings (h1-h6).
 *
 * @type {import('unified').Plugin<[Options?]|void[], Root>}
 */
export default function rehypeAutolinkHeadings(options = {}) {
  let props = options.linkProperties
  const behavior = ('behavior' in options && options.behavior) || 'prepend'
  const content = ('content' in options && options.content) || contentDefaults
  const group = 'group' in options ? options.group : undefined
  /** @type {import('unist-util-visit').Visitor<Heading>} */
  let method

  if (behavior === 'wrap') {
    method = wrap
  } else if (behavior === 'before' || behavior === 'after') {
    method = around
  } else {
    if (!props) {
      props = {ariaHidden: 'true', tabIndex: -1}
    }

    method = inject
  }

  return (tree) => {
    visit(tree, 'heading', method)
  }

  /** @type {import('unist-util-visit').Visitor<Heading>} */
  function inject(node) {
    const url = getUrl(node)

    if (url) {
      const link = create(url)

      link.data = Object.assign({}, link.data, {
        hProperties: extend(true, {}, props),
        hChildren: toChildren(content, node)
      })

      node.children[behavior === 'prepend' ? 'unshift' : 'push'](link)
    }
  }

  /** @type {import('unist-util-visit').Visitor<Heading>} */
  function around(node, index, parent) {
    const url = getUrl(node)

    if (url && typeof index === 'number' && parent) {
      const link = create(url)
      const grouping = group ? toGrouping(group, node) : undefined

      link.data = Object.assign({}, link.data, {
        hProperties: extend(true, {}, props),
        hChildren: toChildren(content, node)
      })

      /** @type {BlockContent[]} */
      // @ts-expect-error: links are not allowed, but it works fine.
      let nodes = behavior === 'before' ? [link, node] : [node, link]

      if (grouping) {
        grouping.children = nodes
        nodes = [grouping]
      }

      parent.children.splice(index, 1, ...nodes)

      return [SKIP, index + nodes.length]
    }
  }

  /** @type {import('unist-util-visit').Visitor<Heading>} */
  function wrap(node) {
    const url = getUrl(node)

    if (url) {
      const link = create(url, toStaticPhrasingContent(node.children))
      link.data = {hProperties: extend(true, {}, props)}
      node.children = [link]
    }
  }

  /**
   * @param {ElementChild|ElementChild[]|Build} value
   * @param {Heading} node
   * @returns {ElementChild|ElementChild[]}
   */
  function toNode(value, node) {
    return typeof value === 'function' ? value(node) : value
  }

  /**
   * @param {ElementChild|ElementChild[]|Build} value
   * @param {Heading} node
   * @returns {ElementChild[]}
   */
  function toChildren(value, node) {
    const result = toNode(value, node)
    const children = Array.isArray(result) ? result : [result]
    return typeof value === 'function' ? children : extend(true, [], children)
  }

  /**
   * @param {ElementChild|ElementChild[]|Build} value
   * @param {Heading} node
   * @returns {Blockquote}
   */
  function toGrouping(value, node) {
    const grouping = toNode(value, node)

    if (Array.isArray(grouping) || grouping.type !== 'element') {
      throw new Error('Expected element as grouping')
    }

    const hName = grouping.tagName
    const hProperties = grouping.properties

    return {
      // @ts-expect-error: custom node.
      type: 'heading-group',
      data: {
        hName,
        hProperties:
          typeof value === 'function'
            ? extend(true, {}, hProperties)
            : hProperties
      },
      children: []
    }
  }

  /**
   * @param {string} url
   * @param {StaticPhrasingContent[]} [children]
   * @returns {Link}
   */
  function create(url, children) {
    return {
      type: 'link',
      url,
      title: null,
      children: children || []
    }
  }

  /**
   * @param {Heading} node
   * @returns {string|undefined}
   */
  function getUrl(node) {
    const data = node.data || {}
    const props = /** @type {Properties} */ (data.hProperties)
    const id = props && props.id
    return id ? '#' + id : undefined
  }

  /**
   * @param {Array.<PhrasingContent>} [nodes]
   * @returns {Array.<StaticPhrasingContent>}
   */
  function toStaticPhrasingContent(nodes) {
    /** @type {Array.<StaticPhrasingContent>} */
    let result = []
    let index = -1

    if (nodes) {
      while (++index < nodes.length) {
        result = result.concat(toStaticPhrasingContentOne(nodes[index]))
      }
    }

    return result
  }

  /**
   * @param {PhrasingContent} node
   * @returns {StaticPhrasingContent|Array.<StaticPhrasingContent>}
   */
  function toStaticPhrasingContentOne(node) {
    if (
      node.type === 'link' ||
      node.type === 'linkReference' ||
      node.type === 'footnote' ||
      node.type === 'footnoteReference'
    ) {
      // @ts-expect-error Looks like a parent.
      return toStaticPhrasingContent(node.children)
    }

    if ('children' in node) {
      const {children, position, ...copy} = node
      return Object.assign(extend(true, {}, copy), {
        children: toStaticPhrasingContent(node.children)
      })
    }

    const {position, ...copy} = node
    return extend(true, {}, copy)
  }
}
