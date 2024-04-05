import { NodeTypes } from './ast'

interface Context {
  source: string
}

enum TagTypes {
  START,
  END,
}

export function baseParse(content: string) {
  const context = createParseContent(content)
  return createRoot(parseChildren(context))
}

function parseChildren(context: Context) {
  const nodes: any[] = []
  const s = context.source
  let node
  if (s.startsWith('{{')) { node = parseInterpolation(context) }
  else if (s.startsWith('<')) {
    if (/[a-z]/i.test(context.source[1]))
      node = parseElement(context)
  }
  else {
    node = parseText(context)
  }
  nodes.push(node)
  return nodes
}

function parseText(context) {
  const content = parseTextData(context, context.length)
  return {
    type: NodeTypes.TEXT,
    content,
  }
}

function parseTextData(context, length) {
  const content = context.source.slice(0, length)

  advanceBy(context, content.length)

  return content
}

function parseElement(context) {
  const element = parseTag(context, TagTypes.START)
  parseTag(context, TagTypes.END)

  return element
}

function parseTag(context, type: TagTypes) {
  const match: any = /^<\/?([a-z]*)>/i.exec(context.source)
  const tag = match[1]
  advanceBy(context, match[0].length)

  if (type === TagTypes.END)
    return
  return {
    type: NodeTypes.ELEMENT,
    tag,
  }
}

function advanceBy(context, length) {
  context.source = context.source.slice(length)
}

function parseInterpolation(context) {
  const openDelimiter = '{{'
  const closeDelimiter = '}}'

  const closeIndex = context.source.indexOf(closeDelimiter, openDelimiter)
  if (closeIndex === -1)
    return
  const rawContentLength = closeIndex - closeDelimiter.length
  advanceBy(context, openDelimiter.length)
  const rawContent = parseTextData(context, rawContentLength)
  const content = rawContent.trim()
  return {
    type: NodeTypes.INTERPOLATION,
    content: {
      type: NodeTypes.SIMPLE_EXPRESSION,
      content,
    },
  }
}

function createRoot(children) {
  return {
    children,
  }
}

function createParseContent(content: string) {
  return {
    source: content,
  }
}
