import { mergeAttributes, Node } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import NodeView from './node-view.vue'
import type { XmTableOptionModel } from '@/types'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    addTechnology_tables: {
      addTechnology_tables: (options?: XmTableOptionModel<any>) => ReturnType
    }
  }
}

export default Node.create({
  name: 'technology_table',
  group: 'block',
  content: 'block*',
  atom: false,
  selectable: true,
 
  parseHTML() {
    return [{ tag: 'technology_table' }]
  },
  renderHTML({ HTMLAttributes }) {
    return ['technology_table', mergeAttributes(HTMLAttributes), 0]
  },
  addAttributes() {
    return {
      id: { type: String },
      data_key: {
        type: String,
        default: ()=>{ return Xm_Table_key['technology_table'] },
      },
      table_data: {
        default: {},
      },
      option: {
        type: Object,
        default: ()=>{ return  {}},
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
            const content = {
              type: this.name,
              attrs: {
                data_key: option?.data_key ? option?.data_key : Xm_Table_key['technology_table'],
                table_data: option?.table_data,
                option: option?option.data_key:{},
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
