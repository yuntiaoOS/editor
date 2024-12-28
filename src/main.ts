import type { UmoEditorOptions } from '@/types'

import App from './app.vue'
import { useUmoEditor } from './components'
//我想引用mzyc-vue-components-zzw项目里面的 /dist/lib/mzyc-lib.es.js
import MzycLib from '../../mzyc-web/libs/mzyc-vue-components/outDist/lib/mzyc-lib.es.js'
import '../../mzyc-web/libs/mzyc-vue-components/outDist/lib/mzyc-vue-components.css'

const app = createApp(App)
// // 引入组件库的少量全局样式变量
// import 'tdesign-vue-next/es/style/index.css';

const options = {}

app.use(useUmoEditor, options as unknown as UmoEditorOptions)
app.use(MzycLib)
app.mount('#app')
