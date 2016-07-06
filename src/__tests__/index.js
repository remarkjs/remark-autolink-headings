import {readFileSync as read} from 'fs';
import {join} from 'path';
import test from 'ava';
import remark from 'remark';
import slug from 'remark-slug';
import html from 'remark-html';
import headings from '../';

let base = file => read(join(__dirname, 'fixtures', file), 'utf-8');

test('should autolink headings', t => {
    ['append', 'prepend', 'wrap'].forEach(b => {
        let {contents} = remark().use(slug).use(html).use(headings, {behaviour: b}).process(base('input.md'));
        t.deepEqual(contents, base(`output.${b}.html`), `should ${b} headings`);
    });
});

test('should do nothing if slugs are not used', t => {
    let {contents} = remark().use(headings).use(html).process(base('input.md'));
    t.deepEqual(contents, base('output.html'));
});
