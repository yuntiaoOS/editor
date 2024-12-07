import 'virtual:svg-icons-register'

import type { UmoEditorOptions } from '@/types'

import UmoEditor from './index.vue'
import UmoMenuButton from './menus/button.vue'
import UmoDialog from './modal.vue'
import UmoTooltip from './tooltip.vue'

import UmoSimpleEditor from './editor/simple.vue'

import technologyTable from './technology-table.vue'

import technologyTableNodeView from './technology-table-node-view.vue'

import evaluatingTableNodeView  from './evaluating-table-node-view.vue'

const useUmoEditor = {
  install: (app: any, options: UmoEditorOptions) => {
    // 组件配置
    const { setOptions } = useStore()
    setOptions(options)
    // 使用组件
    app.component(UmoEditor.name ?? 'UmoEditor instance', UmoEditor)
    app.component(UmoSimpleEditor.name ?? 'UmoSimpleEditor', UmoSimpleEditor)
    app.component('technologyTable', technologyTable)
    app.component("technologyTableNodeView",technologyTableNodeView)
    app.component("evaluatingTableNodeView", evaluatingTableNodeView)
  },
}

export {
  UmoEditor as default,
  UmoDialog,
  UmoEditor,
  UmoMenuButton,
  UmoTooltip,
  useUmoEditor,
  technologyTable,
  UmoSimpleEditor,
  technologyTableNodeView,
  evaluatingTableNodeView
}
