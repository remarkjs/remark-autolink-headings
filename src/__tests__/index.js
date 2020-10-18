import {readFileSync as read} from 'fs'
import path from 'path'
import test from 'ava'
import remark from 'remark'
import slug from 'remark-slug'
import html from 'remark-html'
import headings from '..'

const base = (file) => read(path.join(__dirname, 'fixtures', file), 'utf-8')
const behaviors = ['append', 'prepend', 'after', 'before', 'wrap']

test('should autolink headings', (t) => {
  behaviors.forEach((b) => {
    t.is(
      remark()
        .use(slug)
        .use(html)
        .use(headings, {behavior: b})
        .processSync(base('input.md'))
        .toString(),
      base(`output.${b}.html`),
      `should ${b} headings`
    )
  })
})

test('should autolink headings with deprecated option', (t) => {
  behaviors.forEach((b) => {
    t.is(
      remark()
        .use(slug)
        .use(html)
        .use(headings, {behaviour: b})
        .processSync(base('input.md'))
        .toString(),
      base(`output.${b}.html`),
      `should ${b} headings`
    )
  })
})

test('should accept custom content', (t) => {
  t.is(
    remark()
      .use(slug)
      .use(html)
      .use(headings, {content: {type: 'text', value: '#'}})
      .processSync('# method')
      .toString(),
    '<h1 id="method"><a href="#method" aria-hidden="true" tabindex="-1">#</a>method</h1>\n'
  )
})

test('should accept custom content as an array', (t) => {
  t.is(
    remark()
      .use(slug)
      .use(html)
      .use(headings, {content: [{type: 'text', value: '#'}]})
      .processSync('# method')
      .toString(),
    '<h1 id="method"><a href="#method" aria-hidden="true" tabindex="-1">#</a>method</h1>\n'
  )
})

test('should accept custom content as a function', (t) => {
  t.is(
    remark()
      .use(slug)
      .use(html)
      .use(headings, {content, linkProperties: {}})
      .processSync('# method')
      .toString(),
    '<h1 id="method"><a href="#method">Read the “method” section</a>method</h1>\n'
  )

  function content(node) {
    return {
      type: 'text',
      value: 'Read the “' + node.children[0].value + '” section'
    }
  }
})

test('should accept link properties', (t) => {
  t.is(
    remark()
      .use(slug)
      .use(html)
      .use(headings, {linkProperties: {hidden: true}})
      .processSync('# method')
      .toString(),
    '<h1 id="method"><a href="#method" hidden><span class="icon icon-link"></span></a>method</h1>\n'
  )
})

test('should accept a custom group', (t) => {
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
    '<div class="heading-group"><a href="#method"><span class="icon icon-link"></span></a><h1 id="method">method</h1></div>\n'
  )
})

test('should accept a custom group as a function', (t) => {
  t.is(
    remark()
      .use(slug)
      .use(html)
      .use(headings, {group, behaviour: 'after'})
      .processSync('# method')
      .toString(),
    '<div class="heading-1-group"><h1 id="method">method</h1><a href="#method"><span class="icon icon-link"></span></a></div>\n'
  )

  function group(node) {
    return {
      tagName: 'div',
      properties: {className: ['heading-' + node.depth + '-group']}
    }
  }
})

test('should do nothing if slugs are not used', (t) => {
  t.is(
    remark().use(headings).use(html).processSync(base('input.md')).toString(),
    base('output.html')
  )
})
