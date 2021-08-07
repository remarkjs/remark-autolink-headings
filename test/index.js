import assert from 'node:assert'
import fs from 'node:fs'
import path from 'node:path'
import test from 'tape'
import {remark} from 'remark'
import remarkSlug from 'remark-slug'
import remarkHtml from 'remark-html'
import remarkAutolinkHeadings from '../index.js'

/**
 * @param {string} name
 */
const base = function (name) {
  return fs.readFileSync(path.join('test', 'fixtures', name), 'utf-8')
}

/** @type {['append', 'prepend', 'after', 'before', 'wrap']} */
const behaviors = ['append', 'prepend', 'after', 'before', 'wrap']

test('remarkAutolinkHeadings', (t) => {
  let index = -1
  while (++index < behaviors.length) {
    const b = behaviors[index]
    t.is(
      remark()
        .use(remarkSlug)
        .use(remarkHtml)
        .use(remarkAutolinkHeadings, {behavior: b})
        .processSync(base('input.md'))
        .toString(),
      base('output.' + b + '.html'),
      'should autolink headings (' + b + ')'
    )
  }

  t.is(
    remark()
      .use(remarkSlug)
      .use(remarkHtml)
      .use(remarkAutolinkHeadings, {content: {type: 'text', value: '#'}})
      .processSync('# method')
      .toString(),
    '<h1 id="method"><a href="#method" aria-hidden="true" tabindex="-1">#</a>method</h1>\n',
    'should accept custom content'
  )

  t.is(
    remark()
      .use(remarkSlug)
      .use(remarkHtml)
      .use(remarkAutolinkHeadings, {content: [{type: 'text', value: '#'}]})
      .processSync('# method')
      .toString(),
    '<h1 id="method"><a href="#method" aria-hidden="true" tabindex="-1">#</a>method</h1>\n',
    'should accept custom content as an array'
  )

  t.is(
    remark()
      .use(remarkSlug)
      .use(remarkHtml)
      .use(remarkAutolinkHeadings, {
        content(node) {
          const head = node.children[0]
          assert(head.type === 'text')
          return {
            type: 'text',
            value: 'Read the “' + head.value + '” section'
          }
        },
        linkProperties: {}
      })
      .processSync('# method')
      .toString(),
    '<h1 id="method"><a href="#method">Read the “method” section</a>method</h1>\n',
    'should accept custom content as a function'
  )

  t.is(
    remark()
      .use(remarkSlug)
      .use(remarkHtml)
      .use(remarkAutolinkHeadings, {linkProperties: {hidden: true}})
      .processSync('# method')
      .toString(),
    '<h1 id="method"><a href="#method" hidden><span class="icon icon-link"></span></a>method</h1>\n',
    'should accept link properties'
  )

  t.is(
    remark()
      .use(remarkSlug)
      .use(remarkHtml)
      .use(remarkAutolinkHeadings, {
        group: {
          type: 'element',
          tagName: 'div',
          properties: {className: ['heading-group']},
          children: []
        },
        behavior: 'before'
      })
      .processSync('# method')
      .toString(),
    '<div class="heading-group"><a href="#method"><span class="icon icon-link"></span></a><h1 id="method">method</h1></div>\n',
    'should accept a custom group'
  )

  t.is(
    remark()
      .use(remarkSlug)
      .use(remarkHtml)
      .use(remarkAutolinkHeadings, {
        group(node) {
          return {
            type: 'element',
            tagName: 'div',
            properties: {className: ['heading-' + node.depth + '-group']},
            children: []
          }
        },
        behavior: 'after'
      })
      .processSync('# method')
      .toString(),
    '<div class="heading-1-group"><h1 id="method">method</h1><a href="#method"><span class="icon icon-link"></span></a></div>\n',
    'should accept a custom group as a function'
  )

  t.is(
    remark()
      .use(remarkAutolinkHeadings)
      .use(remarkHtml)
      .processSync(base('input.md'))
      .toString(),
    base('output.html'),
    'should do nothing if slugs are not used'
  )

  t.throws(
    () => {
      remark()
        .use(remarkSlug)
        .use(remarkHtml)
        // @ts-expect-error: invalid group.
        .use(remarkAutolinkHeadings, {
          group() {
            return {type: 'text', value: 'x'}
          },
          behavior: 'after'
        })
        .processSync('# method')
        .toString()
    },
    /Expected element as grouping/,
    'should throw when `group` is not an element'
  )

  t.is(
    remark()
      .use(remarkSlug)
      .use(remarkAutolinkHeadings, {behavior: 'wrap'})
      .use(remarkHtml)
      .processSync('# [Hello](#), **world**!')
      .toString(),
    '<h1 id="hello-world"><a href="#hello-world">Hello, <strong>world</strong>!</a></h1>\n',
    'should unravel interactive content when wrapping'
  )

  t.end()
})
