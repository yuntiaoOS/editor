import { mergeAttributes, Node } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import NodeView from './node-view.vue'
import type { XmTableOptionModel } from '@/types'
import { timeFormat } from '@/utils/time-ago'
import { v4 as uuid } from 'uuid'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    addExperimental_designs: {
      addExperimental_designs: (options?: XmTableOptionModel<any>) => ReturnType
    }
  }
}

export default xmNode.create({
  name: 'experimental_design',
  group: 'block',
  content: 'block*',
  atom: false,
  selectable: true,
  
  parseHTML() {
    return [{ tag: 'experimental_design' }]
  },
  renderHTML({ HTMLAttributes }) {
    return ['experimental_design', mergeAttributes(HTMLAttributes), 0]
  },
  addAttributes() {
    const baseAttributes = xmNode.prototype.addAttributes.call(this);
    return { 
      ...baseAttributes,
      key: {
        default: ()=>{ return Xm_Table_key['experimental_design']  + timeFormat(null,'yyyymmddhhMMss') },
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
      designParams: {
        default: {},
        parseHTML: (element) => {
          const designParams = element.getAttribute('data-designParams');
          return JSON.parse(designParams as string || '{}');
        },
        renderHTML: (attributes) => {
          if (!attributes.designParams) {
            return {};
          }
          return { 'data-designParams': JSON.stringify(attributes.designParams)  };
        },
      },
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
      addExperimental_designs:
        (option?:XmTableOptionModel<any>) =>
          ({ commands }) => {
            const currentOption = mergeAttributes(this.options, option as XmTableOptionModel<any>)
            const content = {
              type: this.name,
              attrs: {
                ...currentOption,
                title: currentOption?.title && currentOption.title.length > 0 ? currentOption.title : `试验设计方案${timeFormat(null, 'yyyymmddhhMM')}`,
                key: option?.key ? option?.key : Xm_Table_key['experimental_design']  + timeFormat(null,'yyyymmddhhMMss'),
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
