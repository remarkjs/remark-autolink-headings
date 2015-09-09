'use strict';

import test from 'tape';
import headings from '../';
import mdast from 'mdast';
import slug from 'mdast-slug';
import html from 'mdast-html';
import {readFileSync as read} from 'fs';
import {join} from 'path';

let base = file => read(join(__dirname, 'fixtures', file), 'utf-8');

test('should autolink headings', t => {
    t.plan(3);

    ['append', 'prepend', 'wrap'].forEach(b => {
        let result = mdast.use([slug, html]).use(headings, {behaviour: b}).process(base('input.md'));
        t.equal(result, base(`output.${b}.html`), `should ${b} headings`);
    });
});

test('should do nothing if slugs are not used', t => {
    t.plan(1);

    let result = mdast.use([ headings, html ]).process(base('input.md'));
    t.equal(result, base('output.html'));
});
