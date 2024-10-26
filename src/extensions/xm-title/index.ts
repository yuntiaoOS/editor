import { mergeAttributes, Node } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import atomUnselect from '../atom-unselect'

import NodeView from './node-view.vue'
import type { XmTitlesModel,XmTitleModel } from '@/types'
declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    addXmTitle: {
      addXmTitle: (options: XmTitlesModel) => ReturnType
    }
  }
}

export default atomUnselect.extend({
  name: 'xmTitle',
  content: 'block*',
  // selectable: true,
  // atom: false,
  addAttributes() {
    return {
      key: '',
      content: '',
      title: '',
    }
  },
  addNodeView() {
    return VueNodeViewRenderer(NodeView)
  },
  addCommands() {
    return {
      addXmTitle:
      (options) =>
      ({ commands,editor }) => {
        const currentOption = mergeAttributes(this.options, options) 
        const content = {
          type: 'xmTitle',
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
