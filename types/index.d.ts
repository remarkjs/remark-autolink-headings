// Minimum TypeScript Version: 3.9
import {Plugin} from 'unified'
import {Node} from 'unist'
import {Element} from 'hast'

interface BaseOptions {
  /**
   * Extra properties to set on the link
   *
   * @defaultValue {ariaHidden: 'true', tabIndex: -1}
   */
  linkProperties?: Record<string, unknown>
  /**
   * Hast nodes to insert in the link
   */
  content?: Element | Element[] | (() => Element | Element[])
  /**
   * Hast node to wrap the heading and link with
   */
  group?: Element | ((node: Node) => Element)
}

interface RemarkAutolinkHeadingsBeforeOptions
  extends Pick<BaseOptions, 'linkProperties' | 'content' | 'group'> {
  /**
   * Insert link before the heading
   */
  behavior: 'before'
}

interface RemarkAutolinkHeadingsAfterOptions
  extends Pick<BaseOptions, 'linkProperties' | 'content' | 'group'> {
  /**
   * Insert link after the heading
   */
  behavior: 'after'
}

interface RemarkAutolinkHeadingsWrapOptions
  extends Pick<BaseOptions, 'linkProperties'> {
  /**
   * Wrap the whole heading text with the link
   */
  behavior: 'wrap'
}

interface RemarkAutolinkHeadingsPrependOptions
  extends Pick<BaseOptions, 'linkProperties' | 'content'> {
  /**
   * Inject link before the heading text
   */
  behavior: 'prepend'
}

interface RemarkAutolinkHeadingsAppendOptions
  extends Pick<BaseOptions, 'linkProperties' | 'content'> {
  /**
   * Inject link after the heading text
   */
  behavior: 'append'
}

type RemarkAutolinkHeadingsDefaultOptions = Omit<
  RemarkAutolinkHeadingsPrependOptions,
  'behavior'
>

type RemarkAutolinkHeadingsOptions =
  | RemarkAutolinkHeadingsDefaultOptions
  | RemarkAutolinkHeadingsPrependOptions
  | RemarkAutolinkHeadingsAppendOptions
  | RemarkAutolinkHeadingsBeforeOptions
  | RemarkAutolinkHeadingsAfterOptions
  | RemarkAutolinkHeadingsWrapOptions

declare const remarkAutolinkHeadings: Plugin<[RemarkAutolinkHeadingsOptions?]>
export default remarkAutolinkHeadings
