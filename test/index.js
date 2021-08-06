import {readFileSync} from 'fs'
import path from 'path'
import test from 'tape'
import remark from 'remark'
import slug from 'remark-slug'
import html from 'remark-html'
import headings from '../index.js'

const base = (file) =>
  readFileSync(path.join('test', 'fixtures', file), 'utf-8')
const behaviors = ['append', 'prepend', 'after', 'before', 'wrap']

test('remark-autolink-headings', (t) => {
  behaviors.forEach((b) => {
    t.is(
      remark()
        .use(slug)
        .use(html)
        .use(headings, {behavior: b})
        .processSync(base('input.md'))
        .toString(),
      base('output.' + b + '.html'),
      'should autolink headings (' + b + ')'
    )
  })

  behaviors.forEach((b) => {
    t.is(
      remark()
        .use(slug)
        .use(html)
        .use(headings, {behaviour: b})
        .processSync(base('input.md'))
        .toString(),
      base('output.' + b + '.html'),
      'should autolink headings with deprecated option (' + b + ')'
    )
  })

  t.is(
    remark()
      .use(slug)
      .use(html)
      .use(headings, {content: {type: 'text', value: '#'}})
      .processSync('# method')
      .toString(),
    '<h1 id="method"><a href="#method" aria-hidden="true" tabindex="-1">#</a>method</h1>\n',
    'should accept custom content'
  )

  t.is(
    remark()
      .use(slug)
      .use(html)
      .use(headings, {content: [{type: 'text', value: '#'}]})
      .processSync('# method')
      .toString(),
    '<h1 id="method"><a href="#method" aria-hidden="true" tabindex="-1">#</a>method</h1>\n',
    'should accept custom content as an array'
  )

  t.is(
    remark()
      .use(slug)
      .use(html)
      .use(headings, {
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
      .use(slug)
      .use(html)
      .use(headings, {linkProperties: {hidden: true}})
      .processSync('# method')
      .toString(),
    '<h1 id="method"><a href="#method" hidden><span class="icon icon-link"></span></a>method</h1>\n',
    'should accept link properties'
  )

  t.is(
    remark()
      .use(slug)
      .use(html)
      .use(headings, {
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
      .use(slug)
      .use(html)
      .use(headings, {
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
    remark().use(headings).use(html).processSync(base('input.md')).toString(),
    base('output.html'),
    'should do nothing if slugs are not used'
  )

  t.end()
})
