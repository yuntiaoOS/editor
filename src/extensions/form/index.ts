import { mergeAttributes, Node } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'

import NodeView from './node-view.vue'
import { config } from 'process'
declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    addXmForm: {
      addXmForm: (options: any) => ReturnType
    }
  }
}

export default xmNode.create({
  name: 'xmForm',
  group: 'block',
  atom: true,
  selectable: false,
  addAttributes() {
    // 调用 atomUnselect 的 addAttributes 方法并获取其返回的对象
    const baseAttributes = xmNode.prototype.addAttributes.call(this);
    // 合并新的属性
    return {
      ...baseAttributes,
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
          "formItems": [
              {
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
                  "valueType": "String"
              },
              {
                  "id": "description",
                  "key": "description",
                  "icon": "iconamoon:edit",
                  "name": "TextInput",
                  "type": "TextInput",
                  "alias": "描述",
                  "props": {
                      "hidden": false,
                      "abstract": false,
                      "readOnly": false,
                      "required": false,
                      "enableScan": false,
                      "validation": null,
                      "enablePrint": true,
                      "textForSuffix": "",
                      "enableSuffixText": false
                  },
                  "title": "描述",
                  "valueType": "String"
              },
              {
                "id": "price",
                "key": "price",
                "icon": "iconamoon:edit",
                "name": "SelectPlus",
                "type": "SelectPlus",
                "alias": "价格",
                "props": {
                  "hidden": false,
                  "abstract": false,
                  "readOnly": false,
                  "required": false,
                  "enableScan": false,
                  "validation": null,
                  "enablePrint": true,
                  "options": [
                    // 全选
                    { label: 'tdesign-vue', value: 1 },
                    { label: 'tdesign-react', value: 2 },
                    { label: 'tdesign-miniprogram', value: 3 },
                    { label: 'tdesign-angular', value: 4 },
                    { label: 'tdesign-mobile-vue', value: 5 },
                    { label: 'tdesign-mobile-react', value: 6 },
                  ],
                },
                "title": "价格",
                "valueType": "Array",
              }
          ],
          "formConfig": {
              "rules": {
                name: [
                  { required: true, message: '必填', type: 'error' },
                  { min: 2, message: '至少需要两个字', type: 'error', trigger: 'blur'},
                ],
                description: [
                  { required: true, message: '必填', type: 'error' },
                  { min: 12, message: '至少需要11两个字', type: 'error', trigger: 'blur'},
                ]
              },
              "ruleJs": "//formData: 表单数据  formMap: 表单字段id -> 字段json配置\r\nfunction doChange(formData, formMap){\r\n\t\r\n}",
              "labelPos": "left",
              "ruleType": "SIMPLE",
              "layout": "vertical",
              "columns": 2,
              "colon": true,
              "labelWidth": "80px",
              "showSubmitBtn": false,
          }
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
      onSubmit: {
        default: () => {
          return ({ validateResult, firstError }:any) => {
            if (validateResult === true) {
              useMessage('success','提交成功') 
            } else {
              console.log('Errors: ', validateResult);
              useMessage('warning',firstError)
            }
          };
        },
        parseHTML: (element) => {
          const onSubmit = element.getAttribute('data-onSubmit');
          return JSON.parse(onSubmit as string || '{}');
        },
        renderHTML: (attributes) => {
          if (!attributes.onSubmit) {
            return {};
          }
          return { 'data-onSubmit': JSON.stringify(attributes.onSubmit)  };
        },
      },
    };
  },
  parseHTML() {
    return [{ tag: 'xmForm' }]
  },
  renderHTML({ HTMLAttributes }) {
    return ['xmForm', mergeAttributes(HTMLAttributes, { 'data-type': this.name })]
  },
  addNodeView() {
    return VueNodeViewRenderer(NodeView)
  },
  addCommands() {
    return {
      addXmForm:
      (options) =>
      ({ commands,editor }) => {
        const nodeType:any = this.type
        const currentOption = mergeAttributes(nodeType.defaultAttrs,this.options, options) 
        console.log('---------109--------------',currentOption)
        const content = {
          type: 'xmForm',
          attrs: {
            ...currentOption,
          },
        }
        return commands.insertContent(content)
      },
    }
  }
})
