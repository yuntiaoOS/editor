import { mergeAttributes, Node } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import NodeView from './node-view.vue'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    addEvaluating_tables: {
      addEvaluating_tables: (options: any) => ReturnType
    }
  }
}

export default Node.create({
  name: 'evaluating_table',
  group: 'block',
  content: 'block*',
  atom: false,
  selectable: true,
 
  parseHTML() {
    return [{ tag: 'evaluating_table' }]
  },
  renderHTML({ HTMLAttributes }) {
    return ['evaluating_table', mergeAttributes(HTMLAttributes), 0]
  },
  addAttributes() {
    return {
      typeE: {
        type: Object,
        default: ()=>{ return { type: 'operation' }},
      },
      id: {
        default: '111111111',
      },
      nameO: {
        default: '22222222222',
      },
      option: {
        type: Object,
        default: ()=>{ return  {}},
      },
    }
  },

  addNodeView() {
    return VueNodeViewRenderer(NodeView, {
      update: (props) => {
        // console.log('update------------------------50', props)
        // 根据props来更新节点，这里只是一个示例，具体实现需要根据实际情况
        props.updateProps(); // 调用提供的更新props的函数
        return true; // 根据VueNodeViewRenderer的API，这里通常需要返回一个布尔值
      },
    })
  },
  addCommands() {
    return {
      addEvaluating_tables:
        (option?:any) =>
          ({ commands }) => {
            const content = {
              type: this.name,
              attrs: {
                typeE: { type: 'operation44444' },
                id: 'operation2222225555555555555522',
                nameO: '5opr1155',
                option: option?option:[],
              },
              content: [
                {
                  type: 'paragraph',
                  content: [
                    { type: 'text', text: '图表1' },
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
  onTransaction({ transaction ,editor}:any) {
    // 获取当前的选择
    const selection : any = transaction.curSelection

    // 检查选择的类型
    if (selection) {
      const { $anchor, $head } :any = selection

      // 判断选择的类型
      if ($anchor.sameParent($head)) {
        const parent :any = $anchor.parent
        const type  :any= parent.type.name

        // console.log(`Current selection type: ${type}`,parent)

        
      }
    } 

    
  
  },
})
