import { describe, expect, it } from 'vitest'
import { baseParse } from '../src/parse'
import { transform } from '../src/transform'
import { NodeTypes } from '../src/ast'

describe('transform', () => {
  it('transform', () => {
    const ast = baseParse('<div>hi, {{message}}</div>')
    const plugin = (node) => {
      if (node.type === NodeTypes.TEXT)
        node.content += 'mini-vue'
    }
    transform(ast, {
      nodeTransfoms: [plugin],
    })

    const nodeText = ast.children[0].children[0].content

    expect(nodeText).toStrictEqual('hi, mini-vue')
  })
})
