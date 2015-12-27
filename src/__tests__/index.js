import test from 'ava';
import headings from '../';
import remark from 'remark';
import slug from 'remark-slug';
import html from 'remark-html';
import {readFileSync as read} from 'fs';
import {join} from 'path';

let base = file => read(join(__dirname, 'fixtures', file), 'utf-8');

test('should autolink headings', t => {
    ['append', 'prepend', 'wrap'].forEach(b => {
        let result = remark.use([slug, html]).use(headings, {behaviour: b}).process(base('input.md'));
        t.same(result, base(`output.${b}.html`), `should ${b} headings`);
    });
});

test('should do nothing if slugs are not used', t => {
    let result = remark.use([ headings, html ]).process(base('input.md'));
    t.same(result, base('output.html'));
});
