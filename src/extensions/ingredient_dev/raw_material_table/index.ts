import { mergeAttributes, Node } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import NodeView from './node-view.vue'
import type { XmTableOptionModel } from '@/types'
import { timeFormat } from '@/utils/time-ago'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    addRaw_material_tables: {
      addRaw_material_tables: (options?: XmTableOptionModel<any>) => ReturnType
    }
  }
}

export default xmNode.create({
  name: 'raw_material_table',
  group: 'block',
  content: 'block*',
  atom: false,
  selectable: true,
 
  parseHTML() {
    return [{ tag: 'raw_material_table' }]
  },
  renderHTML({ HTMLAttributes }) {
    return ['raw_material_table', mergeAttributes(HTMLAttributes), 0]
  },
  addAttributes() {
    const baseAttributes = xmNode.prototype.addAttributes.call(this);
    return { 
      ...baseAttributes,
      key: {
        default: ()=>{ return Xm_Table_key['raw_material_table']  + timeFormat(null,'yyyymmddhhMMss')  },
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
      }
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
      addRaw_material_tables:
        (option?:XmTableOptionModel<any>) =>
          ({ commands }) => {
            const content = {
              type: this.name,
              attrs: {
                key: option?.key ? option?.key : Xm_Table_key['raw_material_table']  + timeFormat(null,'yyyymmddhhMMss'),
                table_data: option?.table_data,
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
