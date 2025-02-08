import { mergeAttributes, Node } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import NodeView from './node-view.vue'
import type { XmTableOptionModel } from '@/types'
import { timeFormat } from '@/utils/time-ago'
import { v4 as uuid } from 'uuid'
import { cloneDeep } from 'lodash-es'
import { formattedNumbers } from '@/utils/index'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    addEvaluation_comparisons: {
      addEvaluation_comparisons: (options?: XmTableOptionModel<any>) => ReturnType
    }
  }
}

export default xmNode.create({
  name: 'evaluation_comparison',
  group: 'block',
  content: 'block*',
  atom: true,
  selectable: true,

  parseHTML() {
    return [{ tag: 'evaluation_comparison' }]
  },
  renderHTML({ HTMLAttributes }) {
    return ['evaluation_comparison', mergeAttributes(HTMLAttributes), 0]
  },
  addAttributes() {
    const baseAttributes = xmNode.prototype.addAttributes.call(this);
    return {
      ...baseAttributes,
      key: {
        default: ()=>{ return Xm_Table_key['evaluation_comparison']  + timeFormat(null,'yyyymmddhhMMss')  },
        parseHTML: (element:any) => element.getAttribute('data-key'),
        renderHTML: (attributes:any) => {
          return { 'data-key': attributes.key };
        },
      },
      // 表格数据
      params: {
        default: [],
        parseHTML: (element) => {
          const params = element.getAttribute('data-params')
          return JSON.parse((params as string) || '{}')
        },
        renderHTML: (attributes) => {
          if (!attributes.params) {
            return {};
          }
          return { 'data-params': JSON.stringify(attributes.params)  };
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
      addEvaluation_comparisons:
        (option?:XmTableOptionModel<any>) =>
          ({ commands,editor }) => {
            const currentOption =  mergeAttributes(this.options, option as XmTableOptionModel<any>)
            const $key_data = JSON.parse( localStorage.getItem('key_data') ?? '{}' )
            const experiment_record = computed(() => $key_data?.experiment_record)
            const record_title = experiment_record.value?.title ?? ''
            let count = '01'
            const docD = cloneDeep(editor.getJSON())
            if (docD) {
              // 物料表
              const evaluation_comparisons = docD.content?.filter(
                (ele) => ele.type === 'evaluation_comparison',
              )
              count = formattedNumbers((evaluation_comparisons?.length ?? 0) + 1)
            }
            const content = {
              type: this.name,
              attrs: {
                ...currentOption,
                title: currentOption?.title && currentOption.title.length > 0 ? currentOption.title : `${record_title}/样品评测对比${count}`,
                key: option?.key ? option?.key : Xm_Table_key['evaluation_comparison']  + timeFormat(null,'yyyymmddhhMMss'),
                params: option?.params || {},
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
