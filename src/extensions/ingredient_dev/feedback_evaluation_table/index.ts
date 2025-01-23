import { mergeAttributes, Node } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import NodeView from './node-view.vue'
import type { XmTableOptionModel } from '@/types'
import { timeFormat } from '@/utils/time-ago'
import { v4 as uuid } from 'uuid'
import { formattedNumbers } from '@/utils/index'
import { cloneDeep } from 'lodash-es'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    addFeedback_evaluation_tables: {
      addFeedback_evaluation_tables: (options?: XmTableOptionModel<any>) => ReturnType
    }
  }
}

export default xmNode.create({
  name: 'feedback_evaluation_table',
  group: 'block',
  content: 'block*',
  atom: true,
  selectable: false,

  parseHTML() {
    return [{ tag: 'feedback_evaluation_table' }]
  },
  renderHTML({ HTMLAttributes }) {
    return ['feedback_evaluation_table', mergeAttributes(HTMLAttributes), 0]
  },
  addAttributes() {
    const baseAttributes = xmNode.prototype.addAttributes.call(this);
    return {
      ...baseAttributes,
      key: {
        default: ()=>{ return Xm_Table_key['feedback_evaluation_table']  + timeFormat(null,'yyyymmddhhMMss')  },
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
        //
        // 根据props来更新节点，这里只是一个示例，具体实现需要根据实际情况
        props.updateProps(); // 调用提供的更新props的函数
        return true; // 根据VueNodeViewRenderer的API，这里通常需要返回一个布尔值
      },
    })
  },
  addCommands() {
    return {
      addFeedback_evaluation_tables:
        (option?:XmTableOptionModel<any>) =>
          ({ commands,editor }) => {
            const currentOption = mergeAttributes(this.options, option as XmTableOptionModel<any>)
            const $key_data = JSON.parse( localStorage.getItem('key_data') ?? '{}' )
            const experiment_record = computed(() => $key_data?.experiment_record)
            const record_title = experiment_record.value?.title ?? ''
            let count = '01'
            const docD = cloneDeep(editor.getJSON())
            if (docD) {
              // 物料表
              const raw_material_tables = docD.content?.filter(
                (ele) => ele.type === 'feedback_evaluation_table',
              )
              count = formattedNumbers((raw_material_tables?.length ?? 0) + 1)
            }
            const content = {
              type: this.name,
              attrs: {
                ...currentOption,
                title: currentOption?.title && currentOption.title.length > 0 ? currentOption.title : `${record_title}反馈${count}`,
                key: option?.key ? option?.key : Xm_Table_key['feedback_evaluation_table']  + timeFormat(null,'yyyymmddhhMMss'),
                table_data: option?.table_data || [],
                id: uuid(),
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
