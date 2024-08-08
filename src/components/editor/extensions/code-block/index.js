import { Node, mergeAttributes } from '@tiptap/core'
import { vnodeViewRenderer } from '@tiptap/vue-3'
import NodeView from './node-view.vue'

export default Node.create({
  name: 'codeBlock',
  group: 'block',
  atom: true,
  addAttributes() {
    return {
      vnode: {
        default: true,
      },
      code: {
        default: '',
      },
      language: {
        default: 'plaintext',
      },
      theme: {
        default: 'light',
      },
      lineNumbers: {
        default: true,
      },
      wordWrap: {
        default: false,
      },
    }
  },
  parseHTML() {
    return [{ tag: 'pre' }]
  },
  renderHTML({ HTMLAttributes }) {
    return ['pre', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)]
  },
  addNodeView() {
    return vnodeViewRenderer(NodeView)
  },
  addCommands() {
    return {
      setCodeBlock:
        (options) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: options,
          })
        },
    }
  },
  addKeyboardShortcuts() {
    return {
      'Mod-Alt-c': () => this.editor.commands.setCodeBlock(),
    }
  },
})
