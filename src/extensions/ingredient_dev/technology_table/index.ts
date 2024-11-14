import { mergeAttributes, Node } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import NodeView from './node-view.vue'
import type { XmTableOptionModel } from '@/types'
import { timeFormat } from '@/utils/time-ago'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    addTechnology_tables: {
      addTechnology_tables: (options?: XmTableOptionModel<any>) => ReturnType
    }
  }
}

export default xmNode.create({
  name: 'technology_table',
  group: 'block',
  content: 'block*',
  atom: true,
  selectable: true,
 
  parseHTML() {
    return [{ tag: 'technology_table' }]
  },
  renderHTML({ HTMLAttributes }) {
    return ['technology_table', mergeAttributes(HTMLAttributes), 0]
  },
  addAttributes() {
    const baseAttributes = xmNode.prototype.addAttributes.call(this);
    return { 
      ...baseAttributes,
      key: {
        default: ()=>{ return Xm_Table_key['technology_table'] + timeFormat(null,'yyyymmddhhMMss') },
        parseHTML: (element:any) => element.getAttribute('data-key'),
        renderHTML: (attributes:any) => {
          return { 'data-key': attributes.key };
        },
      },
      table_data: {
        default: [],
        parseHTML: (element) => {
          const table_data = element.getAttribute('data-table_data');
          return JSON.parse(table_data as string || '[]');
        },
        renderHTML: (attributes) => {
          if (!attributes.table_data) {
            return [];
          }
          return { 'data-table_data': JSON.stringify(attributes.table_data)  };
        },
      },
      title: {
        default: `工艺${timeFormat(null, 'yyyymmddhhMM')}`,
        parseHTML: (element) => element.getAttribute('data-title'),
        renderHTML: (attributes) => {
          return { 'data-title': attributes.title };
        },
      },
    }
  },

  addNodeView() {
    return VueNodeViewRenderer(NodeView, {
      update: (props) => {
        // console.log('update------------------------50', props)
        // 根据props来更新节点，这里只是一个示例，具体实现需要根据实际情况
        props.updateProps(); // 调用提供的更新props的函数
        return true; // 根据VueNodeViewRenderer的API，这里通常需要返回一个布尔值
      },
    })
  },
  addCommands() {
    return {
      addTechnology_tables:
        (option?:XmTableOptionModel<any>) =>
          ({ commands }) => {
            const currentOption = mergeAttributes(this.options, option as XmTableOptionModel<any>)
            const content = {
              type: this.name,
              attrs: {
                ...currentOption,
                key: currentOption?.key ? currentOption?.key : Xm_Table_key['technology_table']  + timeFormat(null,'yyyymmddhhMMss'),
              },
              content: [
                {
                  type: 'paragraph',
                  content: [
                    { type: 'text', text: ' ' },
                  ],
                }
              ],
            };
            return commands.insertContent(content);
          },
    }
  },

  addOptions() {
    return {
      ...this.parent?.()
    }
  },
 
})
