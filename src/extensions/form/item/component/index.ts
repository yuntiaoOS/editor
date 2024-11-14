import { mergeAttributes, Node } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'

import NodeView from './node-view.vue'
declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    addFormItemComponent: {
      addFormItemComponent: (options: any) => ReturnType
    }
  }
}

export default xmNode.create({
  name: 'formItemComponent',
  group: 'block',
  addAttributes() {
    // 调用 atomUnselect 的 addAttributes 方法并获取其返回的对象
    const baseAttributes = xmNode.prototype.addAttributes.call(this);
    // 合并新的属性
    return {
      ...baseAttributes,
      formData: {
        default: undefined,
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
          "type": "DateTime",
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
          "valueType": "String"
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
    return [{ tag: 'formItemComponent' }]
  },
  renderHTML({ HTMLAttributes }) {
    return ['formItemComponent', mergeAttributes(HTMLAttributes, { 'data-type': this.name })]
  },
  addNodeView() {
    return VueNodeViewRenderer(NodeView)
  },
  addCommands() {
    return {
      addFormItemComponent:
      (options) =>
      ({ commands,editor }) => {
        const currentOption = mergeAttributes(this.options, options) 
        console.log('---------85--------------',currentOption)
        const content = {
          type: 'formItemComponent',
          attrs: {
            ...currentOption,
          }
        }
        return commands.insertContent(content)
      },
    }
  }
})
