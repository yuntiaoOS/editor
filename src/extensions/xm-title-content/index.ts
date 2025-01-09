import { mergeAttributes, Node } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import atomUnselect from '../atom-unselect'

import NodeView from './node-view.vue'
import type { XmTitleContentsModel,XmTitleContentModel } from '@/types'
import { shortId } from '@/utils/short-id'
import { v4 as uuid } from 'uuid'
declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    addXmTitleContent: {
      addXmTitleContent: (options: XmTitleContentModel) => ReturnType
    }
  }
}
/*
 * @description 标题-内容
 * @param {Object} options 配置参数 {key: 'erfsfere', title: '试验内容：',content: '1、活性成分的筛选与提取'}
 * @example editorRef.editorInstance.chain().focus().addXmTitleContent({key: 'erfsfere', title: '试验内容：',content: '1、活性成分的筛选与提取' }).run()
 */

export default atomUnselect.extend({
  name: 'xmTitleContent',
  content: 'block*',
  // selectable: true,
  atom: true,
  addAttributes() {
    const baseAttributes = super.addAttributes;
    return {
      ...baseAttributes,
      key: {
        default: uuid(),
        parseHTML: (element:any) => element.getAttribute('data-key'),
        renderHTML: (attributes:any) => {
          if (!attributes.key) {
            return {};
          }
          return { 'data-key': attributes.key };
        },
      },
      content: {
        default: '',
        parseHTML: (element:any) => element.getAttribute('data-content'),
        renderHTML: (attributes:any) => {
          if (!attributes.content) {
            return '';
          }
          return { 'data-content': attributes.content };
        }
      },
      title: {
        default: '',
        parseHTML: (element:any) => element.getAttribute('data-title'),
        renderHTML: (attributes:any) => {
          if (!attributes.title) {
            return '';
          }
          return { 'data-title': attributes.title };
        }
      },
    }
  },
  addNodeView() {
    return VueNodeViewRenderer(NodeView)
  },
  addCommands() {
    return {
      addXmTitleContent:
      (options) =>
      ({ commands,editor }) => {
        const currentOption = mergeAttributes(this.options, options)
        const content = {
          type: 'xmTitleContent',
          attrs: {
            ...currentOption,
            key: options.key ? options.key : `key${shortId()}`
          },
          content:  [
              {
                "type": "heading",
                "attrs": {
                    "indent": null,
                    "textAlign": "left",
                    "lineHeight": 1.5,
                    "margin": {},
                    "id": "elm5s8",
                    "data-toc-id": "elm5s8",
                    "level": 2
                },
                "content": [
                    {
                        "type": "text",
                        "text": currentOption.title
                    }
                ]
              },
              {
                "type": "paragraph",
                "attrs": {
                    "indent": null,
                    "textAlign": "left",
                    "lineHeight": 1.5,
                    "margin": {}
                },
                "content": [
                  {
                    "type": "text",
                    "text": currentOption.content
                  }
                ]
              }
            ]
        }
        // return editor.chain().focus().insertContent(content).run()
        return commands.insertContent(content)
      },
    }
  }
})
