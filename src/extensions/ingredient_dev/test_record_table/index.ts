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
    addTest_record_table: {
      addTest_record_table: (options?: XmTableOptionModel<any>) => ReturnType
    }
  }
}

export default xmNode.create({
  name: 'test_record_table',
  group: 'block',
  content: 'block*',
  atom: true,
  selectable: true,

  parseHTML() {
    return [{ tag: 'test_record_table' }]
  },
  renderHTML({ HTMLAttributes }) {
    return ['test_record_table', mergeAttributes(HTMLAttributes), 0]
  },
  addAttributes() {
    const baseAttributes = xmNode.prototype.addAttributes.call(this);
    return {
      ...baseAttributes,
      key: {
        default: ()=>{ return Xm_Table_key['test_record_table']  + timeFormat(null,'yyyymmddhhMMss') },
        parseHTML: (element:any) => element.getAttribute('data-key'),
        renderHTML: (attributes:any) => {
          return { 'data-key': attributes.key };
        },
      },
      customerParams: {
        default: {},
        parseHTML: (element) => {
          const customerParams = element.getAttribute('data-customerParams');
          return JSON.parse(customerParams as string || '{}');
        },
        renderHTML: (attributes) => {
          if (!attributes.customerParams) {
            return {};
          }
          return { 'data-customerParams': JSON.stringify(attributes.customerParams)  };
        },
      },
      // 组信息
      group: {
        default: '',
        parseHTML: (element) => element.getAttribute('data-group'),
        renderHTML: (attributes) => {
          return { 'data-group': attributes.group };
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
      // 生成表格时选择工艺路线的所有项
      designParams: {
        default: '',
        parseHTML: (element) => element.getAttribute('data-designParams'),
        renderHTML: (attributes) => {
          return { 'data-designParams': attributes.designParams };
        },
      },
      // 当前表格用到的工艺项及数据
      designResult: {
        default: {},
        parseHTML: (element) => {
          const designResult = element.getAttribute('data-designResult');
          return JSON.parse(designResult as string || '{}');
        },
        renderHTML: (attributes) => {
          if (!attributes.designResult) {
            return {};
          }
          return { 'data-designResult': JSON.stringify(attributes.designResult)  };
        },
      },
      selectRows: {
        default: [],
        parseHTML: (element) => {
          const selectRows = element.getAttribute('data-selectRows');
          return JSON.parse(selectRows as string || '[]');
        },
        renderHTML: (attributes) => {
          if (!attributes.selectRows) {
            return [];
          }
          return { 'data-selectRows': JSON.stringify(attributes.selectRows)  };
        },
      },
      title: {
        default: '',
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
        //
        // 根据props来更新节点，这里只是一个示例，具体实现需要根据实际情况
        props.updateProps(); // 调用提供的更新props的函数
        return true; // 根据VueNodeViewRenderer的API，这里通常需要返回一个布尔值
      },
    })
  },
  addCommands() {
    return {
      addTest_record_table:
        (option?:XmTableOptionModel<any>) =>
          ({ commands,editor }) => {
            const currentOption = mergeAttributes(this.options, option as XmTableOptionModel<any>)
            const $key_data = JSON.parse( localStorage.getItem('key_data'))
            const experiment_record = computed(() => $key_data?.experiment_record)
            const record_title = experiment_record.value?.title ?? ''
            let count = '01'
            const docD = cloneDeep(editor.getJSON())
            if (docD) {
              // 物料表
              const raw_material_tables = docD.content.filter(
                (ele) => ele.type === 'test_record_table',
              )
              count = formattedNumbers(raw_material_tables.length + 1)
            }
            const content = {
              type: this.name,
              attrs: {
                ...currentOption,
                title: currentOption?.title && currentOption.title.length > 0 ? currentOption.title : `${record_title}试验记录${count}`,
                key: option?.key ? option?.key : Xm_Table_key['test_record_table']  + timeFormat(null,'yyyymmddhhMMss'),
                table_data: option?.table_data || [],
                id: uuid(),
              },
              // content: [
              //   {
              //     type: 'paragraph',
              //     content: [
              //       { type: 'text', text: ' ' },
              //     ],
              //   }
              // ],
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
