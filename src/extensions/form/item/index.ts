import { mergeAttributes, Node } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'

import NodeView from './node-view.vue'
interface TitleModel {
  key: string
  title: string
}
declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    addXmTitle: {
      addXmTitle: (options: TitleModel) => ReturnType
    }
  }
}

export default xmNode.create({
  name: 'xmTitle',
  group: 'block',
  atom: true,
  selectable: false,
  addAttributes() {
    // 调用 atomUnselect 的 addAttributes 方法并获取其返回的对象
    const baseAttributes = xmNode.prototype.addAttributes.call(this);
    // 合并新的属性
    return {
      ...baseAttributes,
      title: {
        default: '',
        parseHTML: (element) => {
          const title = element.getAttribute('data-title');
          if (!title || title.length < 5) {
            useMessage('error','Title must be at least 5 characters long');
            throw new Error('Title must be at least 5 characters long');
          }
          return title;
        },
        renderHTML: (attributes) => {
          if (!attributes.title) {
            return {};
          }
          return { 'data-title': attributes.title };
        },
      },
      showSubTitle: false,
    };
  },
  parseHTML() {
    return [{ tag: 'xmTitle' }]
  },
  renderHTML({ HTMLAttributes }) {
    return ['xmTitle', mergeAttributes(HTMLAttributes, { 'data-type': this.name })]
  },
  addNodeView() {
    return VueNodeViewRenderer(NodeView)
  },
  addCommands() {
    return {
      addXmTitle:
      (options) =>
      ({ commands,editor }) => {
        const currentOption = mergeAttributes(this.options, options) 
        console.log('---------47--------------',currentOption)
        const content = {
          type: 'xmTitle',
          attrs: {
            ...currentOption,
          }
        }
        return commands.insertContent(content)
      },
    }
  }
})
