export function generate(ast) {
  const context = createCodegenContext()
  const { push } = context
  const functionName = `render`
  const args = ['_ctx', '_cache', '$props', '$setup', '$data', '$options']
  const signature = args.join(', ')

  push(`export function `)
  push(`${functionName}(${signature}) {`)
  const node = ast.codegenNode

  push(`return `)
  genNode(ast.codegenNode, context)
  push('}')

  return {
    code: context.code,
  }
}

function createCodegenContext() {
  const context = {
    code: '',
    push(source) {
      context.code += source
    },
  }
  return context
}
function genNode(node, content) {
  const { push } = content
  push(`'${node.content}'`)
}
