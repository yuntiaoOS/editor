import { mergeAttributes, Node } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import atomUnselect from '../atom-unselect'

import NodeView from './node-view.vue'
import type { XmTitleContentsModel,XmTitleContentModel } from '@/types'
declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    addXmTitleContent: {
      addXmTitleContent: (options: XmTitleContentsModel) => ReturnType
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
      content: '',
      title: '',
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
