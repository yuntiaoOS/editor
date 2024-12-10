import type { UmoEditorOptions } from '@/types'

import App from './app.vue'
import { useUmoEditor } from './components'

import MzycLib from './lib/mzyc-lib.es.js'
import './lib/mzyc-vue-components.css'

const app = createApp(App)
// // 引入组件库的少量全局样式变量
// import 'tdesign-vue-next/es/style/index.css';

const options = {}

app.use(useUmoEditor, options as unknown as UmoEditorOptions)
app.use(MzycLib,options)
app.mount('#app')
