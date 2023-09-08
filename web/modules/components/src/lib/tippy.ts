import tippy, { followCursor, inlinePositioning, roundArrow, type Props } from "tippy.js"

export const DEFAULT_TIPPY_OPTS: Partial<Props> = {
  ignoreAttributes: true,
  theme: "wikijump",
  arrow: roundArrow,
  animation: "scale",
  touch: ["hold", 600],
  duration: [50, 100],
  delay: [400, 50],
  inlinePositioning: true,
  plugins: [followCursor, inlinePositioning]
}

export function parseTipOpts(elem: Element, opts: Partial<Props> | string) {
  if (opts) {
    // use:tippy="foo"
    if (typeof opts === "string") {
      opts = { content: opts }
      // use:tippy={{ opt: "bar" }} aria-label="foo"
    } else if (!opts.content) {
      opts.content = elem.getAttribute("aria-label") ?? ""
    }
    // use:tippy
  } else {
    opts = { content: elem.getAttribute("aria-label") ?? "" }
  }

  // special case: if the tip is inside a dialog, we need to use
  // the dialog's element as the parent, and use fixed positioning
  if (!opts.appendTo) {
    const dialog = elem.closest("dialog")
    if (dialog) {
      opts.appendTo = dialog
      opts.popperOptions = {
        ...opts?.popperOptions,
        strategy: "fixed"
      }
    }
  }

  return { ...DEFAULT_TIPPY_OPTS, ...opts }
}

/**
 * Creates a Tippy.js tooltip instance for the element.
 *
 * The tooltip will derive its message from this list of sources, in order:
 *
 * - The value provided directly, if any
 * - The element's `aria-label` attribute, if it exists
 */
export function tip(elem: Element, opts: Partial<Props> | string = "") {
  opts = parseTipOpts(elem, opts)
  const tp = tippy(elem, opts)
  const setState = (content: unknown) => {
    if (!content) tp.disable()
    else tp.enable()
  }
  setState(opts.content)
  return {
    update(opts: Partial<Props> | string = "") {
      opts = parseTipOpts(elem, opts)
      tp.setProps(opts)
      setState(opts.content)
    },
    destroy() {
      tp.destroy()
    }
  }
}
