import {readFileSync} from 'fs'
import path from 'path'
import test from 'tape'
import {remark} from 'remark'
import remarkSlug from 'remark-slug'
import remarkHtml from 'remark-html'
import remarkAutolinkHeadings from '../index.js'

const base = (file) =>
  readFileSync(path.join('test', 'fixtures', file), 'utf-8')
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

    t.is(
      remark()
        .use(remarkSlug)
        .use(remarkHtml)
        .use(remarkAutolinkHeadings, {behaviour: b})
        .processSync(base('input.md'))
        .toString(),
      base('output.' + b + '.html'),
      'should autolink headings with deprecated option (' + b + ')'
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
          return {
            type: 'text',
            value: 'Read the “' + node.children[0].value + '” section'
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
          tagName: 'div',
          properties: {className: ['heading-group']}
        },
        behaviour: 'before'
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
            tagName: 'div',
            properties: {className: ['heading-' + node.depth + '-group']}
          }
        },
        behaviour: 'after'
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

  t.end()
})
