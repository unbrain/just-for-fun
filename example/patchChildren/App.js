import { h } from '../../dist/fun-vue.esm.js'
import TextToArray from './TextToArray.js'

export default {
  name: 'App',
  setup() {},

  render() {
    return h('div', { tId: 1 }, [
      h('p', {}, '主页'),
      // 老的是 array 新的是 text
      // h(ArrayToText),
      // 老的是 text 新的是 text
      // h(TextToText),
      // 老的是 text 新的是 array
      h(TextToArray),
      // 老的是 array 新的是 array
      // h(ArrayToArray),
    ])
  },
}