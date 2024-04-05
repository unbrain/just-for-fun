import { NodeTypes } from './ast'

export function baseParse(content: string) {
  const context = createParseContent(content)
  return createRoot(parseChildren(context))
}

function parseChildren(context: any) {
  const nodes: any[] = []
  const node = parseInterpolation(context)
  nodes.push(node)
  return nodes
}

function parseInterpolation(context) {
  const openDelimiter = '{{'
  const closeDelimiter = '}}'
  const openIndex = context.source.indexOf(openDelimiter) + openDelimiter.length
  const closeIndex = context.source.indexOf(closeDelimiter, openDelimiter)
  if (closeIndex === -1)
    return

  const rawContent = context.source.slice(openIndex, closeIndex)
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
