import type { Mark } from '@tiptap/pm/model'
import type { TableOfContentDataItem } from '@tiptap-pro/extension-table-of-contents'
export type TableOfContentItem = TableOfContentDataItem & { title: string }

export const useStore = createGlobalState(() => {
  const refreshNode = reactive({ type: '', data: {} ,selectId: undefined })
  const painter = ref<{
    enabled: boolean
    once: boolean
    marks: Mark[]
  }>({
    enabled: false,
    once: true,
    marks: [],
  })

  const blockMenu = ref(false)
  const assistantBox = ref(false)
  const commentBox = ref(false)
  const tableOfContents = ref<TableOfContentItem[]>([])
  const imageViewer = ref({
    visible: false,
    current: null,
  })
  const searchReplace = ref(false)
  const savedAt = ref<number | null>(null)
  const printing = ref(false)
  const exportImage = ref(false)
  const exportPDF = ref(false)
  const editorDestroyed = ref(false)

  // 编辑组件类型
  const editedComponentType = ref<string>('')

  const resetStore = () => {
    tableOfContents.value = []
    sessionStorage.clear()
    searchReplace.value = false
    savedAt.value = null
    editorDestroyed.value = true
  }

  return {
    refreshNode,
    painter,
    blockMenu,
    assistantBox,
    commentBox,
    tableOfContents,
    imageViewer,
    searchReplace,
    savedAt,
    printing,
    exportImage,
    exportPDF,
    editorDestroyed,
    resetStore,
    editedComponentType,
  }
})
