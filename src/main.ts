import type { UmoEditorOptions } from '@/types'

import App from './app.vue'
import { useUmoEditor } from './components'

import isToday from "dayjs/plugin/isToday";
dayjs.extend(isToday);
// dayjs.extend(isYesterday);
// dayjs.extend(isTomorrow);
// dayjs.extend(relativeTime);
// dayjs.extend(isSameOrBefore);
// dayjs.extend(isSameOrAfter);

// import { useUmoEditor } from '../dist/umo-editor.js'
// import '../dist/style.css'

//我想引用mzyc-vue-components-zzw项目里面的 /dist/lib/mzyc-lib.es.js
import MzycLib from '../../mzyc-platform-web-zzw/libs/mzyc-lib/mzyc-lib.es.js'
import '../../mzyc-platform-web-zzw/libs/mzyc-lib/mzyc-vue-components.css'
import { d as dayjs } from '../../mzyc-platform-web-zzw/libs/mzyc-lib/dayjs.min-BwF0YOLV'

// import  aiChat from '../../mzyc-platform-web-zzw/src/components/XMTest/aiChat/index.vue'

//快捷編譯
// import MzycLib from '../../mzyc-vue-components-zzw/dist/lib/mzyc-lib.es.js'
// import '../../mzyc-vue-components-zzw/dist/lib/mzyc-vue-components.css'

const app = createApp(App)
// // 引入组件库的少量全局样式变量
// import 'tdesign-vue-next/es/style/index.css';

const options = {}

app.use(useUmoEditor, options as unknown as UmoEditorOptions)
app.use(MzycLib)
// app.use(aiChat)
app.mount('#app')
