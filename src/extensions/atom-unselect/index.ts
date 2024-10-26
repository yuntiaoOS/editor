import { mergeAttributes, Node } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'

import NodeView from './node-view.vue'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    addAtomUnselect: {
      addAtomUnselect: (options: any) => ReturnType
    }
  }
}

export default Node.create({
  name: 'atomUnselect',
  group: 'block',
  atom: true,
  selectable: false,
  addAttributes() {
    return {
      vnode: {
        default: true,
      },
      language: {
        default: 'plaintext',
      },
      theme: {
        default: 'light',
      },
    }
  },
  parseHTML() {
    return [{ tag: 'atomUnselect' }]
  },
  renderHTML({ HTMLAttributes }) {
    return ['atomUnselect', mergeAttributes(HTMLAttributes, { 'data-type': this.name })]
  },
  addNodeView() {
    return VueNodeViewRenderer(NodeView)
  },
  addCommands() {
    return {
      addAtomUnselect:
        (options) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: options,
          })
        },
    }
  },
  addOptions() {
    return {
      ...this.parent?.(),
    }
  },
})
