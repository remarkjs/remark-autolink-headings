import remark = require('remark')
import hastscript = require('hastscript')
import remarkAutolinkHeading from 'remark-autolink-heading'

remark().use(remarkAutolinkHeading)
remark().use(remarkAutolinkHeading, { behavior: 'wrap' })
remark().use(remarkAutolinkHeading, {
  linkProperties: {
    className: ['class-name']
  }
})
remark().use(remarkAutolinkHeading, { behavior: 'before', group: hastscript.h('div', 'example') })
remark().use(remarkAutolinkHeading, { content: hastscript.h('div', 'example') })

// $ExpectError
remark().use(remarkAutolinkHeading, { behavior: 'wrap', content: hastscript.h('div', 'example')})
