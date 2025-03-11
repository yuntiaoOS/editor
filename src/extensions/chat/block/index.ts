import { mergeAttributes } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'

import NodeView from './node-view.vue'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    insertChatBlock: {
      insertChatBlock: (options: any) => ReturnType
    }
  }
}

export default chatNode.create({
  name: 'chatBlock',
  group: 'block',
  content: '(paragraph|block)*',
  isolating: true,
  selectable: true,

  addAttributes() {
    const baseAttributes = chatNode.prototype.addAttributes.call(this)
    return {
      ...baseAttributes,
      params: {
        default: {},
        parseHTML: (element) => {
          const params = element.getAttribute('data-params')
          return JSON.parse((params as string) || '{}')
        },
        renderHTML: (attributes) => {
          if (!attributes.params) {
            return {}
          }
          return {
            'data-params': JSON.stringify(attributes.params),
          }
        },
      },
    }
  },

  parseHTML() {
    return [{ tag: 'chatBlock' }]
  },
  renderHTML({ HTMLAttributes }) {
    return ['chatBlock', mergeAttributes(HTMLAttributes), 0]
  },

  addNodeView() {
    return VueNodeViewRenderer(NodeView)
  },

  addCommands() {
    return {
      insertChatBlock:
        (option) =>
        ({ commands, editor }) => {
          const currentOption = mergeAttributes(this.options, option)
          const content = {
            type: this.name,
            attrs: {
              ...currentOption,
            },
            content: [
              {
                type: 'paragraph',
                content: [{ type: 'text', text: '12' }],
              },
            ],
          }
          return commands.insertContent(content)
        },
    }
  },
})
