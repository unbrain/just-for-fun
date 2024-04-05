import { NodeTypes } from './ast'

interface Context {
  source: string
  // children: any[],
}

enum TagTypes {
  START,
  END,
}

export function baseParse(content: string) {
  const context = createParseContent(content)
  return createRoot(parseChildren(context, []))
}

function parseChildren(context: Context, ancestors: string[]) {
  const nodes: any[] = []
  while (!isEnd(context, ancestors)) {
    const s = context.source
    let node
    if (s.startsWith('{{')) { node = parseInterpolation(context) }
    else if (s.startsWith('<')) {
      if (/[a-z]/i.test(context.source[1]))
        node = parseElement(context, ancestors)
    }
    else {
      node = parseText(context)
    }
    nodes.push(node)
  }
  return nodes
}

function isEnd(context: Context, ancestors) {
  const s = context.source
  for (let i = ancestors.length - 1; i >= 0; i--) {
    const tag = ancestors[i]
    if (startsWithEndTagOpen(s, tag))
      return true
  }
  return !s
}

function parseText(context: Context) {
  let endIndex = context.source.length
  const endToken = ['{{', '</']
  for (let i = 0; i < endToken.length; i++) {
    const index = context.source.indexOf(endToken[i])
    if (index !== -1 && endIndex > index)
      endIndex = index
  }

  const content = parseTextData(context, endIndex)
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

function parseElement(context, ancestors: string[] = []) {
  const element: any = parseTag(context, TagTypes.START)
  ancestors.push(element.tag)
  element.children = parseChildren(context, ancestors)
  ancestors.pop()
  if (startsWithEndTagOpen(context.source, element.tag))
    parseTag(context, TagTypes.END)
  else
    throw new Error('tag is not closed')

  return element
}

function startsWithEndTagOpen(source, tag) {
  return source.startsWith('</') && source.slice(2, 2 + tag.length) === tag
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
  advanceBy(context, closeDelimiter.length)
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
