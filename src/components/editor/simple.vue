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
        <toolbar defaultMode="hideToolbar"
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
import type { Editor as CoreEditor } from '@tiptap/core'
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
import { differenceBy, getCssUnitWithDefault, hasExtension, isEqual, throttle } from '@/utils/utils'
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

setOptions(props)
watch(
  () => props,
  () => setOptions(props),
  { deep: true },
)

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
    isEmpty = editor.commands.setPlaceholder(options.value.document?.placeholder?? '请输入' )
  },
  onUpdate: throttle(({ editor }) => {
    let output = getOutput(editor, 'html')
    emits('change')
    console.log('-------onUpdate---204-------', output,getOutput(editor, 'json'))
  
    isEmpty = editor.commands.setPlaceholder(options.value.document?.placeholder)
    isReady = true
    $document.value.content = editor.getHTML()
  }, 1000),
  // onUpdate({ editor }) {
  //   isEmpty = editor.commands.setPlaceholder('')
  //   isReady = true
  //   $document.value.content = editor.getHTML()
  // },
})
setEditor(editorInstance)


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

onMounted(loadTatexStyle)
// 销毁编辑器实例
onBeforeUnmount(() => {
  editorInstance.destroy()
})
defineExpose({
  editorInstance,
})
</script>

<style lang="less" scoped>
@import '@/assets/styles/editor.less';
@import '@/assets/styles/drager.less';
.umo-zoomable-container {
  flex: 1;
  scroll-behavior: smooth;
  overflow: visible;
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
