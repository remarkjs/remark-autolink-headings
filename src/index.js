import visit from 'unist-util-visit';

const icon = 'icon';
const link = 'link';
const wrap = 'wrap';

const methodMap = {
    prepend: 'unshift',
    append: 'push',
};

const base = (node, callback) => {
    const {data} = node;
    if (!data || !data.hProperties || !data.hProperties.id) {
        return;
    }

    return callback('#' + data.hProperties.id);
};

const contentDefaults = {
    type: 'element',
    tagName: 'span',
    properties: {className: [icon, `${icon}-${link}`]},
};

export default function attacher (opts = {}) {
    let {linkProperties, behaviour, content} = {
        behaviour: 'prepend',
        content: contentDefaults,
        ...opts,
    };

    if (behaviour !== wrap && !linkProperties) {
        linkProperties = {'aria-hidden': true};
    }

    function injectNode (node) {
        return base(node, url => {
            if (!Array.isArray(content)) {
                content = [content];
            }
            node.children[methodMap[behaviour]]({
                type: link,
                url,
                title: null,
                data: {
                    hProperties: linkProperties,
                    hChildren: content,
                },
            });
        });
    }

    function wrapNode (node) {
        return base(node, url => {
            const {children} = node;

            node.children = [{
                type: link,
                url,
                title: null,
                children,
                data: {
                    hProperties: linkProperties,
                },
            }];
        });
    }

    return ast => visit(ast, 'heading', behaviour === wrap ? wrapNode : injectNode);
}
