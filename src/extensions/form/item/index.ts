import { mergeAttributes, Node } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'

import NodeView from './node-view.vue'
declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    addFormItem: {
      addFormItem: (options: any) => ReturnType
    }
  }
}

export default xmNode.create({
  name: 'formItem',
  group: 'block',
  content: 'block*',
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
          if (!title || title.length < 1) {
            useMessage('error','Title must be at least 5 characters long');
            // throw new Error('Title must be at least 5 characters long');
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
      formData: {
        default: {},
        parseHTML: (element) => {
          const formData = element.getAttribute('data-formData');
          return JSON.parse(formData as string || '{}');
        },
        renderHTML: (attributes) => {
          if (!attributes.formData) {
            return {};
          }
          return { 'data-formData': JSON.stringify(attributes.formData)  };
        },
      },
      config: {
        default: {
          "id": "name",
          "key": "name",
          "icon": "iconamoon:edit",
          "name": "TextInput",
          "type": "TextInput",
          "alias": "物料名称",
          "props": {
              "hidden": false,
              "abstract": false,
              "readOnly": false,
              "required": true,
              "enableScan": false,
              "validation": null,
              "enablePrint": true,
              "textForSuffix": "",
              "enableSuffixText": false
          },
          "title": "物料名称",
          "valueType": "String",
          rules: [
            { required: true, message: '必填', type: 'error' },
            { min: 2, message: '至少需要两个字', type: 'error', trigger: 'blur'},
          ]
        },
        parseHTML: (element) => {
          const config = element.getAttribute('data-config');
          return JSON.parse(config as string || '{}');
        },
        renderHTML: (attributes) => {
          if (!attributes.config) {
            return {};
          }
          return { 'data-config': JSON.stringify(attributes.config)  };
        },
      },
    };
  },
  parseHTML() {
    return [{ tag: 'formItem' }]
  },
  renderHTML({ HTMLAttributes }) {
    return ['formItem', mergeAttributes(HTMLAttributes, { 'data-type': this.name })]
  },
  addNodeView() {
    return VueNodeViewRenderer(NodeView)
  },
  addCommands() {
    return {
      addFormItem:
      (options) =>
      ({ commands,editor }) => {
        const nodeType:any = this.type
        const currentOption = mergeAttributes(nodeType.defaultAttrs,this.options, options)
        
        const content = {
          type: 'formItem',
          attrs: {
            ...currentOption,
          },
          content: [
            {
              type: 'formItemComponent',
              attrs: {
                config: currentOption.config,
                formData: currentOption.formData,
                title: currentOption.title
              },
            },
          ]
        }
        return commands.insertContent(content)
      },
    }
  }

})
