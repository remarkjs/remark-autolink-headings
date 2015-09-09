'use strict';

import assign from 'object-assign';
import visit from 'unist-util-visit';

let base = (node, callback) => {
    let data = node.data || {};
    if (!data || !data.htmlAttributes || !data.htmlAttributes.id) {
        return;
    }

    return callback('#' + data.htmlAttributes.id);
};

export default function attacher (mdast, opts = {}) {
    opts = assign({
        behaviour: 'prepend',
        template: '<span class="icon icon-link"></span>'
    }, opts);

    let behaviour = opts.behaviour;

    let methodMap = {
        'prepend': 'unshift',
        'append': 'push'
    };

    function inject (node) {
        return base(node, id => {
            node.children[methodMap[behaviour]]({
                type: 'link',
                href: id,
                title: null,
                children: [],
                data: {
                    htmlContent: opts.template,
                    htmlAttributes: opts.attributes || {'aria-hidden': true}
                }
            });
        });
    }

    function wrap (node) {
        return base(node, id => {
            let children = node.children;

            node.children = [{
                type: 'link',
                href: id,
                title: null,
                children: children,
                data: {
                    htmlAttributes: opts.attributes
                }
            }];
        });
    }

    return ast => visit(ast, 'heading', behaviour === 'wrap' ? wrap : inject);
}
