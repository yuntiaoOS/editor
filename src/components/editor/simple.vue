<template>
  <t-config-provider
    :global-config="{
      ...localeConfig[locale],
      classPrefix: 'umo',
    }"
  >
    <div
      :id="container.substr(1)"
      class="umo-editor-container"
      :class="{
        'toolbar-classic': isRecord($toolbar) && $toolbar.mode === 'classic',
        'toolbar-ribbon': isRecord($toolbar) && $toolbar.mode === 'ribbon',
        'toolbar-source': isRecord($toolbar) && $toolbar.mode === 'source',
        'preview-mode': page.preview?.enabled,
        'laser-pointer': page.preview?.enabled && page.preview?.laserPointer,
      }"
      :style="{ height: options.height }"
    >
      <header class="umo-toolbar">
        <toolbar
          :key="toolbarKey"
          @menu-change="(event: any) => emits('menuChange', event)"
        >
          <template
            v-for="item in options.toolbar?.menus"
            :key="item"
            #[`toolbar_${item}`]="slotProps"
          >
            <slot :name="`toolbar_${item}`" v-bind="slotProps" />
          </template>
        </toolbar>
      </header>
      <main class="umo-main">
        <div class="umo-page-container" >
          <container-toc v-if="$key_data.experiment_record && page.showToc" @close="page.showToc = false" />
          <div class="umo-zoomable-container umo-scrollbar">
            <div class="umo-zoomable-content" >
              <div class="umo-page-content" >
                <editor-content
                  class="umo-editor-container"
                  :class="{
                    'is-empty': isEmpty,
                    'show-line-number': page.showLineNumber,
                    'format-painter': painter.enabled,
                    'disable-page-break': !page.pagination,
                  }"
                  :editor="editor"
                  :style="{
                    lineHeight: defaultLineHeight,
                    '--umo-editor-placeholder': `'${l(options.document?.placeholder ?? {})}'`,
                  }"
                  :spellcheck="
                    options.document?.enableSpellcheck && $document.enableSpellcheck
                  "
                />
                <menus-bubble v-if=" editor && !page.preview?.enabled && !editorDestroyed" />
                <menus-context-block
                  v-if="options.document?.enableBlockMenu &&
                    !page.preview?.enabled &&
                    editor &&
                    !editorDestroyed
                  "
                />
              </div>
              <div v-if="$key_data.experiment_theme&&$key_data.experiment_record" style="background-color: #fff;">
                <t-space direction="vertical" style="width: 100%;">
                  <t-divider dashed />
                  <comment-bottom  />
                </t-space>

              </div>
              <container-comments v-if="false"/>
            </div>
          </div>
          <t-image-viewer
            v-model:visible="imageViewer.visible"
            v-model:index="currentImageIndex"
            :images="previewImages"
            @close="imageViewer.visible = false"
          />
          <container-search-replace />
<!--          <container-print />-->
        </div>
      </main>
    </div>
  </t-config-provider>
</template>

<script setup lang="ts">
import Typography from '@tiptap/extension-typography'
import { Editor, EditorContent, type Extension } from '@tiptap/vue-3'
import type { Editor as CoreEditor } from '@tiptap/core'
import { Document as TiptapDocument } from '@tiptap/extension-document'
import Mathematics from '@tiptap-pro/extension-mathematics'
import {
  isBoolean,
  isNumber,
  isRecord,
  isString,
} from '@tool-belt/type-predicates'
import { extensions } from '@/extensions'
import Image from '@/extensions/image'
import { propsOptions } from '@/options'
import type { GlobalConfigProvider } from 'tdesign-vue-next'
import enConfig from 'tdesign-vue-next/esm/locale/en_US'
import cnConfig from 'tdesign-vue-next/esm/locale/zh_CN'
import { differenceBy, getCssUnitWithDefault, hasExtension, isEqual, throttle } from '@/utils/utils'
import { get_experiment_theme_infoFetch,get_experiment_record_infoFetch } from '@/api/experiment'
import { fixedImageUrls, fixedImageUrl } from '@/utils/index'
import type {
  AutoSaveOptions,
  DocumentOptions,
  SupportedLocale,
  WatermarkOption,
} from '@/types'
defineOptions({ name: 'UmoSimpleEditor' })

const Document = TiptapDocument.extend({
  content: '(block|columns)+',
  // echo editor is a block editor
})

const props = defineProps(propsOptions)
const emits = defineEmits([
  'beforeCreate',
  'created',
  'changed',
  'changed:selection',
  'changed:transaction',
  'changed:menu',
  'changed:toolbar',
  'changed:locale',
  'changed:theme',
  'contentError',
  'print',
  'focus',
  'blur',
  'saved',
  'destroy',
  'menuChange',
])
const {
  container,painter, setEditor,
  toolbarKey, imageViewer,
  options,
  page,
  tableOfContents,
  savedAt,
  editorDestroyed,
  editor,
  setOptions,
  printing,
  resetStore,
} = useStore()

onBeforeMount(() => setOptions(props))
watch(
  () => props,
  () => {
    $key_data.value = JSON.parse( localStorage.getItem('key_data') ?? '{}')
    setOptions(props)
  },
  { deep: true },
)

const $toolbar = useState('toolbar', props.editorKey)
const $document = useState('document', props.editorKey)

const $key_data = ref({})

// i18n Setup
// @ts-ignore
const { t, locale } = useI18n()
const $locale = useState('locale')
const { appContext } = getCurrentInstance() ?? {}
if (appContext) {
  appContext.config.globalProperties.t = t
  appContext.config.globalProperties.l = l
}
locale.value = $locale.value
watch(
  () => locale.value,
  (locale: any, oldLocale: any) => {
    emits('changed:locale', { locale, oldLocale })
  },
)

// Global Locale Config
const localeConfig = $ref<Record<string, GlobalConfigProvider>>({
  'zh-CN': cnConfig as unknown as GlobalConfigProvider,
  'en-US': enConfig as unknown as GlobalConfigProvider,
})


let enableRules: boolean | Extension[] = true
if (
  !options.value.document?.enableMarkdown ||
  !$document.value?.enableMarkdown
) {
  enableRules = [Mathematics, Typography, Image as Extension]
}

const defaultLineHeight = $computed(
  () =>
    options.value.dicts?.lineHeights?.find((item: any) => item.default)?.value,
)

let isReady = $ref<boolean>(false)
let isEmpty = $ref<boolean>(false)

console.log('--simple-----props--------',options.value)
const editorInstance: Editor = new Editor({
  editable: !options.value.document?.readOnly,
  autofocus: options.value.document?.autofocus,
  content: options.value.document?.content,
  enableInputRules: enableRules,
  enablePasteRules: enableRules,
  editorProps: {
    attributes: {
      class: 'umo-editor',
    },
    ...options.value.document?.editorProps,
  },
  parseOptions: options.value.document?.parseOptions,
  extensions: [
    ...extensions,
    Document,
    ...(options.value.extensions as Extension[]),
  ],
  onCreate({ editor }) {
    isEmpty = editor.commands.setPlaceholder('')
  },
  onUpdate: throttle(({ editor }) => {
    let output = getOutput(editor, 'html')
    emits('changed',{editor:editor,json: getOutput(editor, 'json') ,html: output})
    console.log('-------onUpdate---204-------',getOutput(editor, 'json'))
    isEmpty = editor.commands.setPlaceholder('')
    isReady = true
    $document.value.content = editor.getHTML()
  }, 1000),
  onTransaction: throttle(({ editor, transaction }:any) => {
    // console.log(transaction, editor,'-------208---------transaction---------------')
    const customTitleNode = editor.state.doc.nodeAt(0); // 假设标题是第一个节点

    if (transaction.docChanged) {
      const interestedNodeTypes = ['xmTitle']
      // 检查事务是否涉及到你感兴趣的节点
      // 检查事务的步骤，判断是否有节点被删除
      let nodeDeleted = false
      let deletedNode :any = null
      let deletedPosition :any = null

      // 创建一个函数来检查变化
      const checkChanges = (oldArr:any[], newArr:any[], interestedNodeTypes:string[])=> {
        // 遍历 oldArr 和 newArr
        for (let i = 0; i < oldArr.length; i++) {
          if (interestedNodeTypes.includes(oldArr[i])) {
            // 检查 newArr 中相同位置的项是否相同
            if (oldArr[i] !== newArr[i]) {
              console.log(`变化的是: ${oldArr[i]}`);
              return oldArr[i];
            }
          }
        }
        console.log('没有变化');
        return null;
      }

      transaction.steps.forEach((step:any) => {
        // if (step instanceof ReplaceStep || step instanceof ReplaceAroundStep) {
          const { from, to } = step
          const oldNode = transaction.before.nodeAt(from)
          const newNode = transaction.doc.nodeAt(from)
          console.log('transaction from, to:',transaction.before,transaction.doc,from, to,newNode, oldNode)
          const oldTypeArr = transaction.before.content.content.map((node:any) => node.type.name)
          const newTypeArr = transaction.doc.content.content.map((node:any) => node.type.name)
          const oldType = checkChanges(oldTypeArr, newTypeArr, interestedNodeTypes)
          if ((oldNode && !newNode)  || (transaction.before.childCount > transaction.doc.childCount)
            || (transaction.before.childCount === transaction.doc.childCount && oldNode?.type.name !== newNode?.type.name)
            || oldType ) {
            if (interestedNodeTypes.includes(oldNode?.type.name) || oldType) {
              nodeDeleted = true
              deletedNode = oldNode
              deletedPosition = from
              console.log('A node was deleted:', oldNode)
              // 你可以在这里添加更多的逻辑来处理节点删除事件
            }
          }
        // }
      })

      if (nodeDeleted) {
        console.log('Transaction involved node deletion')
        useMessage('warning', '该节点不能被删除')
        // 创建一个新的交易来恢复被删除的节点
        const tr :any = editor.state.tr
        tr.insert(deletedPosition, deletedNode)
        // 将新的交易分发到编辑器视图中，从而恢复被删除的节点。
        editor.view.dispatch(tr)
      }
    }
  },1000),
  // onUpdate({ editor }) {
  //   isEmpty = editor.commands.setPlaceholder('')
  //   isReady = true
  //   $document.value.content = editor.getHTML()
  // },
})
setEditor(editorInstance)

console.log('-------312--------editorInstance------')
function getOutput(editor: CoreEditor, output: 'html' | 'json' | 'text') {
  if (props.removeDefaultWrapper) {
    if (output === 'html') return editor.isEmpty ? '' : editor.getHTML()
    if (output === 'json') return editor.isEmpty ? {} : editor.getJSON()
    if (output === 'text') return editor.isEmpty ? '' : editor.getText()
    return ''
  }

  if (output === 'html') return editor.getHTML()
  if (output === 'json') return editor.getJSON()
  if (output === 'text') return editor.getText()
  return ''
}

// 动态导入 katex 样式
const loadTatexStyle = () => {
  const katexStyleElement = document.querySelector('#katex-style')
  if (
    katexStyleElement === null &&
    !options.value.toolbar?.disableMenuItems.includes('math')
  ) {
    const style = document.createElement('link')
    style.href = `${options.value.cdnUrl}/libs/katex/katex.min.css`
    style.rel = 'stylesheet'
    style.id = 'katex-style'
    document.querySelector('head')?.append(style)
  }
}
const setToolbar = (params: { mode: 'classic' | 'ribbon'; show: boolean }) => {
  if (!isRecord(params)) {
    throw new Error('params must be an object.')
  }
  if (params.mode) {
    if (!isString(params.mode)) {
      throw new Error('"params.mode" must be a string.')
    }
    if (!['classic', 'ribbon'].includes(params.mode)) {
      throw new Error('"params.mode" must be one of "classic" or "ribbon".')
    }
    $toolbar.value.mode = params.mode
  }
  if (isDefined(params.show)) {
    if (!isBoolean(params.show)) {
      throw new Error('"params.show" must be a boolean.')
    }
    $toolbar.value.show = params.show
  }
}

// Content Saving Methods
const saveContent = async () => {
  console.log('------349--------',options.value)
  if ($toolbar.value.mode === 'source' || options.value.document?.readOnly) {
    return
  }
  try {
    const message = await useMessage('loading', {
      content: t('save.saving'),
      placement: 'bottom',
      closeBtn: true,
      offset: [0, -20],
    })
    const success = await options.value?.onSave?.(
      {
        html: editor.value?.getHTML(),
        json: editor.value?.getJSON(),
        text: editor.value?.getHTML(),
      },
      page.value,
      $document.value,
    )
    if (!success) {
      message.close()
      useMessage('error', {
        content: t('save.failed'),
        placement: 'bottom',
        offset: [0, -20],
      })
      return
    }
    emits('saved')
    message.close()
    useMessage('success', {
      content: t('save.success'),
      placement: 'bottom',
      offset: [0, -20],
    })
    const time = useTimestamp({ offset: 0 })
    savedAt.value = time.value
  } catch (e) {
    console.error('------387--------',e)
    useMessage('error', {
      content: t('save.error'),
      placement: 'bottom',
      offset: [0, -20],
    })
    console.error((e as Error).message)
  }
}
// Locale Methods
const setLocale = (params: SupportedLocale) => {
  if (!['zh-CN', 'en-US'].includes(params)) {
    throw new Error('"params" must be one of "zh-CN" or "en-US".')
  }
  if (locale.value === params) {
    return
  }
  const $locale = useState('locale')
  $locale.value = params
  location.reload()
}

const reset = (silent: boolean) => {
  const resetFn = () => {
    sessionStorage.clear()
    location.reload()
  }
  if (silent) {
    resetFn()
    return
  }
  const dialog = useConfirm({
    theme: 'warning',
    header: t('resetAll.title'),
    body: t('resetAll.message'),
    confirmBtn: {
      theme: 'warning',
      content: t('resetAll.reset'),
    },
    onConfirm() {
      dialog.destroy()
      resetFn()
    },
  })
}

const setReadOnly = (readOnly = true) => {
  if (options.value.document) {
    options.value.document.readOnly = readOnly
  }
}

function printHtmlString(htmlString:string) {
  // 打开一个新窗口（空白页）
  const printWindow = window.open('', '_blank', 'width=800,height=600');

  if (!printWindow) {
    console.error('浏览器可能阻止了弹窗，请允许弹窗后再试');
    return;
  }

  // 写入基本的HTML结构
  printWindow.document.write(`<!DOCTYPE html>
    <html>
      <head>
        <title>打印</title>
        <!-- 在这里可以手动加入需要的CSS -->
        <style>
          /* 示例：让 body 有点边距 */
          body {
            margin: 20px;
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        ${htmlString}
      </body>
    </html>
  `);

  // 关闭文档流
  printWindow.document.close();

  // 确保新窗口聚焦，然后调用打印
  printWindow.focus();
  printWindow.print();

  // 如果你想在打印完成后自动关闭该窗口，取消注释下行
  printWindow.close();
}


// 图片预览
let previewImages = $ref<string[]>([])
let currentImageIndex = $ref<number>(0)

watch(
  () => imageViewer.value.visible,
  async (visible: boolean) => {
    if (!visible) {
      previewImages = []
      currentImageIndex = 0
      return
    }
    await nextTick()
    const images = document.querySelectorAll(
      `${container} .umo-page-content img:not(.umo-icon)`,
    )
    Array.from(images).forEach((image, index) => {
      const src = fixedImageUrl(image.getAttribute('src'))
      const nodeId = image.getAttribute('data-id')
      previewImages.push(src)
      if (nodeId === imageViewer.value.current) {
        currentImageIndex = index
      }
    })
  },
)

watch(
  () => printing.value,
  () => {
    const myHtml = getOutput(editorInstance, 'html')
    emits('print',myHtml)
  },
  { deep: true },
)


// Methods Exposed to Descendants
provide('saveContent', saveContent)
provide('setLocale', setLocale)
provide('reset', reset)

onMounted(()=>{
  page.value.showToc = false
  console.log('-----------------experiment_record-----451---------',options.value)
  // setToolbar({ mode: 'classic', show: false })
  loadTatexStyle()
  if (options.value?.requestOptions) {
    localStorage.setItem('key_data',JSON.stringify({
      experiment_theme: options.value.requestOptions.experiment_theme,
      experiment_record: options.value.requestOptions.experiment_record
    }))

    // if (options.value.requestOptions.dict_data) {
    //   localStorage.setItem('dict_data', JSON.stringify(options.value.requestOptions.dict_data)  )
    // }
  }
})
// 销毁编辑器实例
onUnmounted(() => {
  resetStore()
  editor.value?.destroy()
})
defineExpose({
  editorInstance,
  setToolbar,
  saveContent,
  printHtmlString,
  setLocale,
  setReadOnly,
  reset
})
</script>

<style lang="less" scoped>
@import '@/assets/styles/editor.less';
@import '@/assets/styles/drager.less';

.umo-page-container {
  height: 100%;
  display: flex;
  gap: 40px;
  position: relative;
}

.umo-editor-container {
  height: 100%;
  min-height: 100px;
  background: #fff;
}
.umo-scrollbar {
  overflow: auto;
}
.umo-zoomable-container {
  flex: 1;
  padding: 20px 50px;
  scroll-behavior: smooth;
  .umo-zoomable-content {
    margin: 0 auto;
    background-color: #fff;
    position: relative;
    //height: 100%;
    width: 100%;
    overflow: visible;
    .umo-page-content {
      height: 100%;
      width: 100%;
      transform-origin: 0 0;
      box-sizing: border-box;
      display: flex;
      position: relative;
      overflow: visible !important;
      [contenteditable] {
        outline: none;
      }
    }
  }
}
.umo-main {
  flex: 1;
  background-color: #fff;
  //background-color: var(--umo-container-background);
  overflow: visible !important;
  height: calc(100% - 60px);
}
:deep( .umo-menu-button-wrap:not(:last-child) ){
  margin-right: 1px ;
}
:deep( .umo-block-menu-button ) {
  border-radius: 0 !important;
 .umo-button--shape-square.umo-size-s  {
    width: var(--td-comp-size-xxxs) ;
    padding: 0;
  }
}

:deep( .umo-node-focused:not(hr):not(.tableWrapper):not(table) ) {
  border-radius: var(--umo-radius);
  background: var(--umo-content-node-selected-background);
  line-height: 1.5 !important;
  //z-index: -1;
}
:deep( .umo-block-menu-hander ) {
  margin-left: -156px;
}
:deep( .umo-show-toolbar ) {
  cursor: pointer;
  position: absolute;
  top: -24px;
  right: 0px;
  font-size: 18px;
  padding: 3px 6px;
  z-index: 99;
  background-color: var(--umo-color-white);
  color: var(--umo-text-color-light);
  border-bottom-left-radius: var(--umo-radius);
  border-bottom-right-radius: var(--umo-radius);
  border: solid 1px var(--umo-border-color);
  border-top: none;
}
</style>
