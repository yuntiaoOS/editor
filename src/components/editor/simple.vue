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
      <main class="umo-main">
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
              <menus-bubble v-if="true || editor && !page.preview?.enabled && !editorDestroyed" />
              <menus-context-block 
                v-if="true ||
                  options.document?.enableBlockMenu &&
                  !page.preview?.enabled &&
                  editor &&
                  !editorDestroyed
                "
              />
            </div>
            <!-- <container-comments /> -->
          </div>
        </div>
        
      </main>
    </div>
  </t-config-provider>
</template>

<script setup lang="ts">
import Typography from '@tiptap/extension-typography'
import { Editor, EditorContent, type Extension } from '@tiptap/vue-3'
import Document from '@tiptap/extension-document'
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

defineOptions({ name: 'UmoSimpleEditor' })

const props = defineProps(propsOptions)
const emits = defineEmits([
  'beforeCreate',
  'created',
  'changed',
  'changed:selection',
  'changed:transaction',
  'changed:menu',
  'changed:toolbar',
  'changed:pageSize',
  'changed:pageOrientation',
  'changed:pageMargin',
  'changed:pageBackground',
  'changed:pageShowToc',
  'changed:pagePreview',
  'changed:pageZoom',
  'changed:pageWatermark',
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

// 页面大小
const pageSize = $computed(() => {
  const { width, height } = page.value.size ?? { width: 0, height: 0 }
  return {
    width: page.value.orientation === 'portrait' ? width : height,
    height: page.value.orientation === 'portrait' ? height : width,
  }
})

const $toolbar = useState('toolbar', props.editorKey)
const $document = useState('document', props.editorKey)

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
setOptions(props)
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
  onUpdate({ editor }) {
    isEmpty = editor.commands.setPlaceholder('')
    isReady = true
    $document.value.content = editor.getHTML()
  },
})
setEditor(editorInstance)

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

onMounted(loadTatexStyle)
// 销毁编辑器实例
onBeforeUnmount(() => {
  editorInstance.destroy()
})
</script>

<style lang="less" scoped>
@import '@/assets/styles/editor.less';
@import '@/assets/styles/drager.less';
.umo-zoomable-container {
  flex: 1;
  padding: 10px 10px 10px 0px ;
  scroll-behavior: smooth;
  overflow: visible;
  margin-left: -50px;
  .umo-zoomable-content {
    margin: 0 auto;
    position: relative;
    height: 100%;
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
  overflow: visible !important;
}
:deep( .umo-menu-button-wrap:not(:last-child) ){
  margin-right: 1px ;
}
:deep( .umo-button--shape-square.umo-size-s ) {
  width: var(--td-comp-size-xxxs) ;
  padding: 0;
}
:deep( .umo-editor-container .umo-editor ) {
  width: calc(100% - 80px);
  margin-left: 86px;
}

:deep( .umo-node-focused:not(hr):not(.tableWrapper):not(table) ) {
  border-radius: var(--umo-radius);
  background: var(--umo-content-node-selected-background);
  //z-index: -1;
}
</style>
