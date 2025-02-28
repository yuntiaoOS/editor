<template>
  <t-config-provider
    :global-config="{
      ...localeConfig[locale],
      classPrefix: 'umo',
    }"
  >
    <div :id="container.substr(1)" class="umo-editor-container">
      <header class="umo-toolbar">
        <toolbar
          v-if="showToolbar"
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
        <div class="umo-page-container">
          <div class="umo-zoomable-container umo-scrollbar">
            <div class="umo-zoomable-content">
              <div class="umo-page-content">
                <editor-content
                  class="umo-editor-container"
                  :class="{
                    'is-empty': isEmpty,
                  }"
                  :editor="editorInstance"
                  :style="{
                    lineHeight: 1.5,
                    '--umo-editor-placeholder': `'${l(options.document?.placeholder ?? {})}'`,
                  }"
                />
                <menus-bubble v-if="editor" />
              </div>
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

import { richTextExtensions } from '@/extensions'
import Image from '@/extensions/image'

import { defaultOptions } from '@/options'

import type { GlobalConfigProvider } from 'tdesign-vue-next'
import enConfig from 'tdesign-vue-next/esm/locale/en_US'
import cnConfig from 'tdesign-vue-next/esm/locale/zh_CN'
import {
  differenceBy,
  getCssUnitWithDefault,
  hasExtension,
  isEqual,
  throttle,
} from '@/utils/utils'
import {
  get_experiment_theme_infoFetch,
  get_experiment_record_infoFetch,
} from '@/api/experiment'
import { fixedImageUrls, fixedImageUrl } from '@/utils/index'
import type { SupportedLocale, UmoEditorOptions } from '@/types'
import { attachments_fileFetch } from '@/api'
defineOptions({ name: 'UmoSimpleEditor' })

const Document = TiptapDocument.extend({
  content: '(block|columns)+',
  // echo editor is a block editor
})

const props = defineProps({
  modelValue: {
    type: [String, Object],
    default: '',
  },
  showToolbar: {
    type: Boolean,
    default: false,
  },
  outputType: {
    type: String,
    default: 'html',
  },
  editorKey: {
    type: String,
    default: 'rich-text-editor',
  },
  readOnly: {
    type: Boolean,
    default: false,
  },
})

const { printing, } = useStore()

const container = inject('container')
const editor = inject('editor')
const options = inject('options')
const imageViewer = inject('imageViewer')



const _value = computed({
  get: () => props.modelValue,
  set: (value: string) => emits('update:modelValue', value),
})
const emits = defineEmits([
  'beforeCreate',
  'created',
  'changed',
  'print',
  'blur',
  'update:modelValue',
])

const defaultOptionsR: UmoEditorOptions = {
  ...defaultOptions,
  document: {
    placeholder: '输入 / 唤起更多',
    title: '文档',
    content: _value.value ?? '<p>请输入</p>',
  },
  toolbar: {
    defaultMode: 'classic',
    enableSourceEditor: false,
    menus: ['base', 'insert', 'table', 'tools'],
    disableMenuItems: ['markdown'],
    importWord: {
      enabled: false,
      options: {},
      useCustomMethod: false,
    },
  },
  editorKey: props.editorKey,
  file: {
    allowedMimeTypes: ['application/pdf', 'image/*', 'video/mp4', 'audio/*'],
    maxSize: 1024 * 1024 * 1024,
  },
  async onFileUpload(file: File & { url?: string }) {
    if (!file) {
      throw new Error('没有找到要上传的文件')
    }

    const res = await attachments_fileFetch({ file })

    if (res.status === 201) {
      const fileUrl =
        localStorage.getItem('BASE_URL') + `/api/storage/files/${res.data.id}/preview/`
      const fileUrl2 =
        localStorage.getItem('BASE_URL') + `/api/storage/files/${res.data.id}/download/`
      return { ...res.data, src: fileUrl, url: fileUrl, file: fileUrl2 }
    } else {
      throw new Error(res.data.msg)
      // return {
      //   id: shortId(),
      //   url: file.url ?? URL.createObjectURL(file),
      //   name: file.name,
      //   type: file.type,
      //   size: file.size,
      // }
    }
  },
}

// i18n Setup
// @ts-ignore
const { t, locale } = useI18n()

const { appContext } = getCurrentInstance() ?? {}
if (appContext) {
  appContext.config.globalProperties.t = t
  appContext.config.globalProperties.l = l
}
locale.value = 'zh-CN'

// Global Locale Config
const localeConfig = $ref<Record<string, GlobalConfigProvider>>({
  'zh-CN': cnConfig as unknown as GlobalConfigProvider,
  'en-US': enConfig as unknown as GlobalConfigProvider,
})

let isReady = $ref<boolean>(false)
let isEmpty = $ref<boolean>(false)

const editorInstance: Editor = new Editor({
  content: _value.value,
  editorProps: {
    attributes: {
      class: 'umo-editor',
    },
  },
  autofocus: false,
  editable: !props.readOnly,
  injectCSS: true,
  extensions: [Document, ...richTextExtensions],
  onCreate({ editor }:any) {
    isEmpty = editor.commands.setPlaceholder('')
  },
  onSelectionUpdate: ({ editor }:any) => {
  },
  onTransaction: ({ editor }:any) => {
  },
  onFocus: ({ editor }:any) => {
  },
  onBlur: ({ editor }:any) => {
    if (props.outputType === 'html') {
      _value.value = getOutput(editor, 'html')
    } else {
      _value.value = getOutput(editor, 'json')
    }
    emits('blur',_value.value)
  },
  onUpdate: throttle(({ editor }:any) => {
    const output :any = getOutput(editor, 'html')
    emits('changed', {
      editor: editor,
      json: getOutput(editor, 'json'),
      html: output,
    })
    if (props.outputType === 'html') {
      _value.value = output
    } else {
      _value.value = getOutput(editor, 'json')
    }

    isEmpty = editor.commands.setPlaceholder('')
    isReady = true
  }, 100),
})
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

function printHtmlString(htmlString: string) {
  // 打开一个新窗口（空白页）
  const printWindow = window.open('', '_blank', 'width=800,height=600')

  if (!printWindow) {
    console.error('浏览器可能阻止了弹窗，请允许弹窗后再试')
    return
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
  `)

  // 关闭文档流
  printWindow.document.close()

  // 确保新窗口聚焦，然后调用打印
  printWindow.focus()
  printWindow.print()

  // 如果你想在打印完成后自动关闭该窗口，取消注释下行
  printWindow.close()
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
    if (!printing.value) {
      return
    }
    const myHtml = getOutput(editor.value, 'html')
    emits('print', { myHtml, printing })
  },
  { deep: true },
)

// Methods Exposed to Descendants
provide('reset', reset)
provide('setLocale', setLocale)
const EDITORTYPE = 'RICHTEXT'
provide('editorType', EDITORTYPE)
provide('editorInstance', editorInstance)

onMounted(() => {


})
// 销毁编辑器实例
onUnmounted(() => {
  editor.value?.destroy()
})
defineExpose({
  editor,
  editorInstance,
  printHtmlString,
  reset,
})
</script>

<style lang="less" scoped>
@import '@/assets/styles/editor.less';
@import '@/assets/styles/drager.less';

@media print {
  /* 分页符 */
  .page-break {
    page-break-before: always; /* 在这个元素前面强制分页 */
  }

  /* 页边距等 */
  @page {
    size: A4;
    margin: 1cm;
  }
}

:deep(.umo-toolbar-actions) {
  display: none;
}

.umo-page-container {
  height: 100%;
  display: flex;
  gap: 40px;
  position: relative;
}

.umo-editor-container {
  height: 100%;
  min-height: 20px;
  background: #fff;
}
.umo-scrollbar {
  overflow: auto;
}
.umo-zoomable-container {
  flex: 1;
  background-color: #fff;
  padding: 10px;
  scroll-behavior: smooth;
  .umo-zoomable-content {
    //margin: 0 auto;
    //background-color: #fff;
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
:deep(.umo-menu-button-wrap:not(:last-child)) {
  margin-right: 1px;
}
:deep(.umo-block-menu-button) {
  border-radius: 0 !important;
  .umo-button--shape-square.umo-size-s {
    width: var(--td-comp-size-xxxs);
    padding: 0;
  }
}

:deep(.umo-node-focused:not(hr):not(.tableWrapper):not(table)) {
  border-radius: var(--umo-radius);
  background: var(--umo-content-node-selected-background);
  line-height: 1.5 !important;
  //z-index: -1;
}
:deep(.umo-block-menu-hander) {
  margin-left: -156px;
}
:deep(.umo-show-toolbar) {
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
