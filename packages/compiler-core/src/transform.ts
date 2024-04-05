import { NodeTypes } from './ast'

export function transform(root, options = {}) {
  const context = createTransformContext(root, options)
  traverseNode(root, context)

  createRootCodegen(root, context)
}

function createRootCodegen(root, context) {
  const child = root.children[0]
  // if (child.type === NodeTypes.ELEMENT)
  root.codegenNode = child
  // else
  // root.codegenNode = createVNodeCall(context, root, child)
}

function traverseNode(node, context) {
  context.nodeTransfoms.forEach((item) => {
    item(node)
  })
  traverseChildren(node, context)
}

function traverseChildren(node, context) {
  const children = node.children
  if (children) {
    for (let i = 0; i < children.length; i++) {
      const node = children[i]
      traverseNode(node, context)
    }
  }
}

function createTransformContext(root, options) {
  const context = {
    root,
    nodeTransfoms: options.nodeTransfoms || [],
  }

  return context
}
