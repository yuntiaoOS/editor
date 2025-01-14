import type { Mark } from '@tiptap/pm/model'
import type { Editor } from '@tiptap/vue-3'
import type { TableOfContentDataItem } from '@tiptap-pro/extension-table-of-contents'
import { isRecord } from '@tool-belt/type-predicates'

import { changeComputedHtml } from '@/extensions/page/core'
import { defaultOptions, ojbectSchema } from '@/options'
import type { PageOption, UmoEditorOptions } from '@/types'
import { shortId } from '@/utils/short-id'

export type TableOfContentItem = TableOfContentDataItem & { title: string }

export const useStore = createGlobalState(() => {
  const toolbarKey = ref<string>(shortId())
  const options = ref<UmoEditorOptions>(defaultOptions)
  const page = ref<PageOption>(defaultOptions.page)
  const editor = ref<Editor>()
  const refreshNode = reactive({ type: '', data: undefined })
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
  const hidePageHeader = ref(true)
  const hidePageFooter = ref(true)
  const editorDestroyed = ref(false)

  // 编辑组件类型
  const editedComponentType = ref<string>('')

  const setOptions = (value: unknown) => {
    const opts =
      isRecord(value) && Object.keys(value).includes('value')
        ? value.value
        : value

    options.value = ojbectSchema.merge(
      options.value,
      Object.keys(opts).reduce<Record<string, unknown>>(
        (acc: Record<string, unknown>, key: string) => {
          if (opts[key] !== undefined) {
            acc[key] = opts[key]
          }
          return acc
        },
        {},
      ),
    )
    console.log('-------------setOptions----63---------', options.value)
    const $locale = useState('locale')
    if (!$locale.value) {
      $locale.value = options.value.locale
    }
    const {editorKey} = options.value
    sessionStorage.setItem('editorKey', editorKey)
    // TODO: 数据存储改为 localStorage.setItem(`${editorKey}:BASE_URL`, options.value.requestOptions.BASE_URL)，便于区分不同编辑器
    // 若有 requestOptions，则需要在此处存储 requestOptions  和 umo_token 到 store 中
    if (options.value.requestOptions) {
      if (options.value.requestOptions.umo_domain) localStorage.setItem('BASE_URL', options.value.requestOptions.umo_domain)
      if (options.value.requestOptions.umo_token) localStorage.setItem('mzyc_token', options.value.requestOptions.umo_token )
      // localStorage.setItem('dict_data', JSON.stringify(options.value.requestOptions.dict_data)  )
      localStorage.setItem('key_data', JSON.stringify({
        experiment_theme: options.value.requestOptions.experiment_theme,
        experiment_record: options.value.requestOptions.experiment_record
      }))
    }

    return options.value
  }

  const setPainter = ({
    enabled,
    once,
    marks,
  }: {
    enabled: boolean
    once: boolean
    marks: Mark[]
  }) => {
    painter.value.enabled = enabled
    painter.value.once = once
    painter.value.marks = marks
  }

  watch(
    () => options.value.page,
    ({
      defaultBackground,
      defaultMargin,
      defaultOrientation,
      watermark,
    }: PageOption) => {
      page.value = {
        size: options.value.dicts?.pageSizes.find(
          (item: { default: boolean }) => item.default,
        ),
        margin: defaultMargin,
        background: defaultBackground,
        orientation: defaultOrientation,
        watermark,
        header: true,
        footer: true,
        showLineNumber: false,
        showToc: false,
        pagination: true,
        zoomLevel: 100,
        autoWidth: false,
        preview: {
          enabled: false,
          laserPointer: true,
        },
      }
    },
    { immediate: true, once: true },
  )

  watch(
    () => [page.value.size, page.value.margin, page.value.orientation],
    () => {
      if (editor.value?.commands.autoPaging) editor.value?.commands.autoPaging(false)
      changeComputedHtml()
      setTimeout(() => {
        if (editor.value?.commands.autoPaging) editor.value?.commands.autoPaging(true)
      }, 1000)
    },
    { deep: true },
  )

  const setEditor = (editorInstance: Editor) => {
    editor.value = editorInstance
  }
  const resetStore = () => {
    editor.value = undefined
    tableOfContents.value = []
    // 重置 options
    options.value = defaultOptions
    sessionStorage.clear()
    searchReplace.value = false
    savedAt.value = null
    editorDestroyed.value = true
  }

  watch(
    () => options.value.document?.readOnly,
    (val: boolean) => {
      editor.value?.setEditable(!val)
      toolbarKey.value = shortId()
    },
  )

  return {
    toolbarKey,
    container: `#umo-editor-${shortId(4)}`,
    options,
    page,
    editor,
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
    hidePageHeader,
    hidePageFooter,
    editorDestroyed,
    setOptions,
    setEditor,
    setPainter,
    resetStore,
    editedComponentType,
  }
})
