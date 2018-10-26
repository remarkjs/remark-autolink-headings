import {readFileSync as read} from 'fs'
import {join} from 'path'
import test from 'ava'
import remark from 'remark'
import slug from 'remark-slug'
import html from 'remark-html'
import headings from '..'

const base = file => read(join(__dirname, 'fixtures', file), 'utf-8')

test('should autolink headings', t => {
  const behaviours = ['append', 'prepend', 'wrap']

  behaviours.forEach(b => {
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

test('should accept custom content', t => {
  t.is(
    remark()
      .use(slug)
      .use(html)
      .use(headings, {content: {type: 'text', value: '#'}})
      .processSync('# method')
      .toString(),
    '<h1 id="method"><a href="#method" aria-hidden="true">#</a>method</h1>\n'
  )
})

test('should accept custom content as an array', t => {
  t.is(
    remark()
      .use(slug)
      .use(html)
      .use(headings, {content: [{type: 'text', value: '#'}]})
      .processSync('# method')
      .toString(),
    '<h1 id="method"><a href="#method" aria-hidden="true">#</a>method</h1>\n'
  )
})

test('should accept link properties', t => {
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

test('should do nothing if slugs are not used', t => {
  t.is(
    remark()
      .use(headings)
      .use(html)
      .processSync(base('input.md'))
      .toString(),
    base('output.html')
  )
})
