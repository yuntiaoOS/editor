<template>
  <div class="box">
    <!-- <xm-form v-model:form-data="xmValue" /> -->
    <!-- <UmoEditor ref="editorRef" v-bind="options" /> -->
    <UmoSimpleEditor ref="editorRef" v-bind="options" @change="changeEdit"/>
  </div>
</template>

<script setup lang="ts">
import { shortId } from '@/utils/short-id'
// import { UmoSimpleEditor,UmoEditor } from './components/index.ts'
// import UmoEdit from './components/editor/index.vue'
const { editor } = useStore()
const editorRef = $ref(null)
const xmValue = ref({})
const config = {
  "id": "name",
  "key": "name",
  "icon": "iconamoon:edit",
  "name": "SelectPlus",
  "type": "SelectPlus",
  "alias": "物料名称",
  "props": {
    "hidden": false,
    "abstract": false,
    "readOnly": false,
    "required": true,
    "enableScan": false,
    "validation": null,
    "enablePrint": true,
    "textForSuffix": "",
    "enableSuffixText": false,
    "remote": true,
    "options": [{ id: 11, name: '选项一1' }, { id: 22, name: '选项二2' }],
    "valueKey": "id",
    "labelKey": "name",
    "remoteMethod": () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            data: {
              code: 2000,
              data: [
                { id: 1, name: '选项一' },
                { id: 2, name: '选项二' }
              ]
            }
          })
        }, 500)
      })
    }
  },
  "title": "物料名称",
  "valueType": "String"
}


const templates = [
  {
    title: '工作任务',
    description: '工作任务模板',
    content:
      '<h1>工作任务</h1><h3>任务名称：</h3><p>[任务的简短描述]</p><h3>负责人：</h3><p>[执行任务的个人姓名]</p><h3>截止日期：</h3><p>[任务需要完成的日期]</p><h3>任务详情：</h3><ol><li>[任务步骤1]</li><li>[任务步骤2]</li><li>[任务步骤3]...</li></ol><h3>目标：</h3><p>[任务需要达成的具体目标或结果]</p><h3>备注：</h3><p>[任何额外信息或注意事项]</p>',
  },
  {
    title: '工作周报',
    description: '工作周报模板',
    content:
      '<h1>工作周报</h1><h2>本周工作总结</h2><hr /><h3>已完成工作：</h3><ul><li>[任务1名称]：[简要描述任务内容及完成情况]</li><li>[任务2名称]：[简要描述任务内容及完成情况]</li><li>...</li></ul><h3>进行中工作：</h3><ul><li>[任务1名称]：[简要描述任务当前进度和下一步计划]</li><li>[任务2名称]：[简要描述任务当前进度和下一步计划]</li><li>...</li></ul><h3>问题与挑战：</h3><ul><li>[问题1]：[描述遇到的问题及当前解决方案或需要的支持]</li><li>[问题2]：[描述遇到的问题及当前解决方案或需要的支持]</li><li>...</li></ul><hr /><h2>下周工作计划</h2><h3>计划开展工作：</h3><ul><li>[任务1名称]：[简要描述下周计划开始的任务内容]</li><li>[任务2名称]：[简要描述下周计划开始的任务内容]</li><li>...</li></ul><h3>需要支持与资源：</h3><ul><li>[资源1]：[描述需要的资源或支持]</li><li>[资源2]：[描述需要的资源或支持]</li><li>...</li></ul>',
  },
]
const options = $ref({
  editorKey: 'experimentEdit',
  toolbar: {
    defaultMode: 'classic',
    // menus: ['base'],
    enableSourceEditor: true,
  },
  requestOptions: {
    experiment_theme: '9cabf47c-a9cb-4db6-bcc9-a4128ab4de66',
    experiment_record: '1ee31b38-fe5c-4cc7-a17d-289531d8f7ac',
    umo_domain: 'http://id.zw.rzm.com',
    umo_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzMxNjQwNjE4LCJpYXQiOjE3MzE1NTQyMTgsImp0aSI6ImQ4OTljNGI1ZGI3ZjQ4MWI4NjM2NTc0M2ZmMWFmN2Y0IiwidXNlcl9pZCI6IjgyMThhNjYzLWU5YTYtNDNkNS1hMGYxLWQ2OGE1NTA5ZTM2NiJ9.7BkL2ME8cr8dITAwxVt6n1H0dkR_Y5TUuC6oEa2jFKo',
  },
  document: {
    placeholder: '测试文档',
    content: localStorage.getItem('document.content') ?? "<p>请输入</p>",
  },
  templates,
  cdnUrl: 'https://cdn.umodoc.com',
  shareUrl: 'https://umodoc.com',
  file: {
    // allowedMimeTypes: [
    //   'application/pdf',
    //   'image/svg+xml',
    //   'video/mp4',
    //   'audio/*',
    // ],
  },
  assistant: {
    enabled: true,
  },
  user: {
    userId: 'umoeditor',
    nickName: 'Umo Editor',
    avatarUrl: 'https://tdesign.gtimg.com/site/avatar.jpg',
  },
  async onSave(content: string, page: number, document: { content: string }) {
    localStorage.setItem('document.content', document.content)
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const success = true
        if (success) {
          console.log('onSave', { content, page, document })
          resolve('操作成功')
        } else {
          reject(new Error('操作失败'))
        }
      }, 2000)
    })
  },
  async onFileUpload(file: File & { url?: string }) {
    if (!file) {
      throw new Error('没有找到要上传的文件')
    }
    console.log('onUpload', file)
    await new Promise((resolve) => setTimeout(resolve, 3000))
    return {
      id: shortId(),
      url: file.url ?? URL.createObjectURL(file),
      name: file.name,
      type: file.type,
      size: file.size,
    }
  },
  async getEntityFormMethod() {
    return await new Promise((resolve, reject) => {
      const resData = [
        {
          "id": "530667c4-5da5-46e5-a65d-52c1fc9875ec",
          "name": "风险物质表",
          "description": null,
          "is_system": true,
          "modifier_name": "/",
          "update_datetime": "2024-09-30 16:15:17",
          "vc_supported": false,
          "group": "d3a5f843-7d73-477c-80f9-dgj342twdg962e8",
          "key": "public_data_risk_substance",
          "fields": [
            {
                "id": "7bca33c6-6924-4976-ad31-5c0a4a671d10",
                "creator_name": "",
                "modifier_name": "",
                "create_datetime": "2024-06-19 14:13:45",
                "update_datetime": "2024-09-10 20:11:39",
                "is_deleted": false,
                "description": null,
                "creator_id": null,
                "modifier": null,
                "dept_belong_id": null,
                "is_system": true,
                "is_init_data": false,
                "type": "TextareaInput",
                "title": "描述",
                "key": "description",
                "value_type": "String",
                "icon": null,
                "style": null,
                "field_json": null,
                "db_field_type": "text",
                "props": {
                    "color": "#818181",
                    "hidden": false,
                    "abstract": false,
                    "required": false,
                    "validation": null,
                    "enablePrint": true
                },
                "vc_supported": true,
                "vc_enable": false,
                "sortx": 11.0,
                "tenant_id": "system",
                "is_sync": false,
                "form": "b3aae20d-a515-4740-928a-78b17ceacb68",
                "from_type_pool": null
            },
            {
                "id": "d44828bb-e6e1-462a-ad7c-0a658f5e1dc9",
                "creator_name": "",
                "modifier_name": "",
                "create_datetime": "2024-06-19 14:13:45",
                "update_datetime": "2024-09-10 20:11:39",
                "is_deleted": false,
                "description": null,
                "creator_id": null,
                "modifier": null,
                "dept_belong_id": null,
                "is_system": true,
                "is_init_data": false,
                "type": "SelectPlusRadio",
                "title": "任务标识",
                "key": "ident",
                "value_type": "String",
                "icon": null,
                "style": null,
                "field_json": null,
                "db_field_type": "varchar(128)",
                "props": {
                    "http": {},
                    "fixed": false,
                    "hidden": false,
                    "options": [],
                    "abstract": false,
                    "dictType": "task_ident",
                    "multiple": false,
                    "required": false,
                    "expanding": false,
                    "validation": null,
                    "enablePrint": true
                },
                "vc_supported": true,
                "vc_enable": false,
                "sortx": 21.0,
                "tenant_id": "system",
                "is_sync": false,
                "form": "b3aae20d-a515-4740-928a-78b17ceacb68",
                "from_type_pool": null
            },
            {
                "id": "5fb62b7f-718b-4519-91ea-faf672a5e3c1",
                "creator_name": "",
                "modifier_name": "",
                "create_datetime": "2024-06-19 14:13:45",
                "update_datetime": "2024-09-10 20:11:39",
                "is_deleted": false,
                "description": null,
                "creator_id": null,
                "modifier": null,
                "dept_belong_id": null,
                "is_system": true,
                "is_init_data": false,
                "type": "SelectPlusRadio",
                "title": "任务类别",
                "key": "category",
                "value_type": "String",
                "icon": null,
                "style": null,
                "field_json": null,
                "db_field_type": "varchar(128)",
                "props": {
                    "http": {},
                    "fixed": false,
                    "hidden": false,
                    "options": [],
                    "abstract": false,
                    "dictType": "task_category",
                    "multiple": false,
                    "required": false,
                    "expanding": false,
                    "validation": null,
                    "enablePrint": true
                },
                "vc_supported": true,
                "vc_enable": false,
                "sortx": 31.0,
                "tenant_id": "system",
                "is_sync": false,
                "form": "b3aae20d-a515-4740-928a-78b17ceacb68",
                "from_type_pool": null
            },
            {
                "id": "42158b49-0d37-4d48-b0c6-aecc7bfa8628",
                "creator_name": "",
                "modifier_name": "",
                "create_datetime": "2024-06-19 14:13:45",
                "update_datetime": "2024-09-10 20:11:39",
                "is_deleted": false,
                "description": null,
                "creator_id": null,
                "modifier": null,
                "dept_belong_id": null,
                "is_system": true,
                "is_init_data": false,
                "type": "TextInput",
                "title": "颜色",
                "key": "color",
                "value_type": "String",
                "icon": null,
                "style": null,
                "field_json": null,
                "db_field_type": "varchar(64)",
                "props": {
                    "hidden": false,
                    "abstract": false,
                    "required": false,
                    "enableScan": false,
                    "validation": null,
                    "enablePrint": true
                },
                "vc_supported": true,
                "vc_enable": false,
                "sortx": 41.0,
                "tenant_id": "system",
                "is_sync": false,
                "form": "b3aae20d-a515-4740-928a-78b17ceacb68",
                "from_type_pool": null
            },
            {
                "id": "9b55e02f-47d8-4002-a557-fb47eedb6157",
                "creator_name": "",
                "modifier_name": "",
                "create_datetime": "2024-06-19 14:13:45",
                "update_datetime": "2024-09-10 20:11:39",
                "is_deleted": false,
                "description": null,
                "creator_id": null,
                "modifier": null,
                "dept_belong_id": null,
                "is_system": true,
                "is_init_data": false,
                "type": "TextInput",
                "title": "任务图标",
                "key": "icon",
                "value_type": "String",
                "icon": null,
                "style": null,
                "field_json": null,
                "db_field_type": "varchar(64)",
                "props": {
                    "hidden": false,
                    "abstract": false,
                    "required": false,
                    "enableScan": false,
                    "validation": null,
                    "enablePrint": true
                },
                "vc_supported": true,
                "vc_enable": false,
                "sortx": 51.0,
                "tenant_id": "system",
                "is_sync": false,
                "form": "b3aae20d-a515-4740-928a-78b17ceacb68",
                "from_type_pool": null
            },
            {
                "id": "b7b6d015-f259-4afb-94fd-ce920dc52f44",
                "creator_name": "",
                "modifier_name": "",
                "create_datetime": "2024-06-19 14:13:45",
                "update_datetime": "2024-09-10 20:11:39",
                "is_deleted": false,
                "description": null,
                "creator_id": null,
                "modifier": null,
                "dept_belong_id": null,
                "is_system": true,
                "is_init_data": false,
                "type": "TextInput",
                "title": "任务项名称",
                "key": "title",
                "value_type": "String",
                "icon": null,
                "style": null,
                "field_json": null,
                "db_field_type": "varchar(64)",
                "props": {
                    "hidden": false,
                    "abstract": false,
                    "required": true,
                    "enableScan": false,
                    "validation": null,
                    "enablePrint": true
                },
                "vc_supported": true,
                "vc_enable": false,
                "sortx": 61.0,
                "tenant_id": "system",
                "is_sync": false,
                "form": "b3aae20d-a515-4740-928a-78b17ceacb68",
                "from_type_pool": null
            }
          ],
          "data": [{"description":"jdkgfklhf",
            "ident":"dsjfdskj",
            "category":"fjaskfbjasl",
            "color":"fhjasgfkh",
            "icon":"hjsdgfkj",
            "title":"sdhjfbdkjsfbh"
          } ,{"description":"jdkgfklhf",
            "ident":"dsjfdskj",
            "category":"fjaskfbjasl",
            "color":"fhjasgfkh",
            "icon":"hjsdgfkj",
            "title":"3243243"
          } ]
        },
        {
          "id": "d2948f8b-f849-4a7f-b2e2-f58d66038abd",
          "name": "报表管理",
          "description": null,
          "is_system": true,
          "modifier_name": "/",
          "update_datetime": "2024-09-30 16:15:18",
          "vc_supported": false,
          "group": "d3a5f843-7d73-477c-80f9-dgj342twdg962e8",
          "key": "public_data_elegancelab_statement",
          "fields": [
            {
                "id": "7bca33c6-6924-4976-ad31-5c0a4a671d10",
                "creator_name": "",
                "modifier_name": "",
                "create_datetime": "2024-06-19 14:13:45",
                "update_datetime": "2024-09-10 20:11:39",
                "is_deleted": false,
                "description": null,
                "creator_id": null,
                "modifier": null,
                "dept_belong_id": null,
                "is_system": true,
                "is_init_data": false,
                "type": "TextareaInput",
                "title": "描述",
                "key": "description",
                "value_type": "String",
                "icon": null,
                "style": null,
                "field_json": null,
                "db_field_type": "text",
                "props": {
                    "color": "#818181",
                    "hidden": false,
                    "abstract": false,
                    "required": false,
                    "validation": null,
                    "enablePrint": true
                },
                "vc_supported": true,
                "vc_enable": false,
                "sortx": 11.0,
                "tenant_id": "system",
                "is_sync": false,
                "form": "b3aae20d-a515-4740-928a-78b17ceacb68",
                "from_type_pool": null
            },
            {
                "id": "d44828bb-e6e1-462a-ad7c-0a658f5e1dc9",
                "creator_name": "",
                "modifier_name": "",
                "create_datetime": "2024-06-19 14:13:45",
                "update_datetime": "2024-09-10 20:11:39",
                "is_deleted": false,
                "description": null,
                "creator_id": null,
                "modifier": null,
                "dept_belong_id": null,
                "is_system": true,
                "is_init_data": false,
                "type": "SelectPlusRadio",
                "title": "任务标识",
                "key": "ident",
                "value_type": "String",
                "icon": null,
                "style": null,
                "field_json": null,
                "db_field_type": "varchar(128)",
                "props": {
                    "http": {},
                    "fixed": false,
                    "hidden": false,
                    "options": [],
                    "abstract": false,
                    "dictType": "task_ident",
                    "multiple": false,
                    "required": false,
                    "expanding": false,
                    "validation": null,
                    "enablePrint": true
                },
                "vc_supported": true,
                "vc_enable": false,
                "sortx": 21.0,
                "tenant_id": "system",
                "is_sync": false,
                "form": "b3aae20d-a515-4740-928a-78b17ceacb68",
                "from_type_pool": null
            },
            {
                "id": "5fb62b7f-718b-4519-91ea-faf672a5e3c1",
                "creator_name": "",
                "modifier_name": "",
                "create_datetime": "2024-06-19 14:13:45",
                "update_datetime": "2024-09-10 20:11:39",
                "is_deleted": false,
                "description": null,
                "creator_id": null,
                "modifier": null,
                "dept_belong_id": null,
                "is_system": true,
                "is_init_data": false,
                "type": "SelectPlusRadio",
                "title": "任务类别",
                "key": "category",
                "value_type": "String",
                "icon": null,
                "style": null,
                "field_json": null,
                "db_field_type": "varchar(128)",
                "props": {
                    "http": {},
                    "fixed": false,
                    "hidden": false,
                    "options": [],
                    "abstract": false,
                    "dictType": "task_category",
                    "multiple": false,
                    "required": false,
                    "expanding": false,
                    "validation": null,
                    "enablePrint": true
                },
                "vc_supported": true,
                "vc_enable": false,
                "sortx": 31.0,
                "tenant_id": "system",
                "is_sync": false,
                "form": "b3aae20d-a515-4740-928a-78b17ceacb68",
                "from_type_pool": null
            },
            {
                "id": "42158b49-0d37-4d48-b0c6-aecc7bfa8628",
                "creator_name": "",
                "modifier_name": "",
                "create_datetime": "2024-06-19 14:13:45",
                "update_datetime": "2024-09-10 20:11:39",
                "is_deleted": false,
                "description": null,
                "creator_id": null,
                "modifier": null,
                "dept_belong_id": null,
                "is_system": true,
                "is_init_data": false,
                "type": "TextInput",
                "title": "颜色",
                "key": "color",
                "value_type": "String",
                "icon": null,
                "style": null,
                "field_json": null,
                "db_field_type": "varchar(64)",
                "props": {
                    "hidden": false,
                    "abstract": false,
                    "required": false,
                    "enableScan": false,
                    "validation": null,
                    "enablePrint": true
                },
                "vc_supported": true,
                "vc_enable": false,
                "sortx": 41.0,
                "tenant_id": "system",
                "is_sync": false,
                "form": "b3aae20d-a515-4740-928a-78b17ceacb68",
                "from_type_pool": null
            },
            {
                "id": "9b55e02f-47d8-4002-a557-fb47eedb6157",
                "creator_name": "",
                "modifier_name": "",
                "create_datetime": "2024-06-19 14:13:45",
                "update_datetime": "2024-09-10 20:11:39",
                "is_deleted": false,
                "description": null,
                "creator_id": null,
                "modifier": null,
                "dept_belong_id": null,
                "is_system": true,
                "is_init_data": false,
                "type": "TextInput",
                "title": "任务图标",
                "key": "icon",
                "value_type": "String",
                "icon": null,
                "style": null,
                "field_json": null,
                "db_field_type": "varchar(64)",
                "props": {
                    "hidden": false,
                    "abstract": false,
                    "required": false,
                    "enableScan": false,
                    "validation": null,
                    "enablePrint": true
                },
                "vc_supported": true,
                "vc_enable": false,
                "sortx": 51.0,
                "tenant_id": "system",
                "is_sync": false,
                "form": "b3aae20d-a515-4740-928a-78b17ceacb68",
                "from_type_pool": null
            },
            {
                "id": "b7b6d015-f259-4afb-94fd-ce920dc52f44",
                "creator_name": "",
                "modifier_name": "",
                "create_datetime": "2024-06-19 14:13:45",
                "update_datetime": "2024-09-10 20:11:39",
                "is_deleted": false,
                "description": null,
                "creator_id": null,
                "modifier": null,
                "dept_belong_id": null,
                "is_system": true,
                "is_init_data": false,
                "type": "TextInput",
                "title": "任务项名称",
                "key": "title",
                "value_type": "String",
                "icon": null,
                "style": null,
                "field_json": null,
                "db_field_type": "varchar(64)",
                "props": {
                    "hidden": false,
                    "abstract": false,
                    "required": true,
                    "enableScan": false,
                    "validation": null,
                    "enablePrint": true
                },
                "vc_supported": true,
                "vc_enable": false,
                "sortx": 61.0,
                "tenant_id": "system",
                "is_sync": false,
                "form": "b3aae20d-a515-4740-928a-78b17ceacb68",
                "from_type_pool": null
            }
          ],
          "data": [{"description":"jdkgfklhf",
            "ident":"dsjfdskj",
            "category":"fjaskfbjasl",
            "color":"fhjasgfkh",
            "icon":"hjsdgfkj",
            "title":"sdhjfbdkjsfbh"
          } ]
        },  
      ]
      resolve(resData)
    })
    
  },
  async onAssistant() {
    return await Promise.resolve('<p>AI助手测试</p>')
  },
  async onCustomImportWordMethod() {
    return await Promise.resolve({
      value: '<p>测试导入word</p>',
    })
  },
})

const inputstring = ref('测试导入word')

const changeEdit = (data: any) => {
  if (editorRef && editorRef.editorInstance) {
    console.log('--------12------',editorRef.editorInstance.getJSON())
  }
}

onMounted(() => {
  // console.log('--------12------',editorRef.editorInstance.getJSON())
  // editorRef.editorInstance.chain().focus().addXmTitle({key: 'erfsfere', title: '' }).run()
  // editorRef.editorInstance.chain().focus().addXmForm().run()
  // editorRef.editorInstance?.chain().focus().setColumns().focus(editorRef.editorInstance.state.selection.head - 1).run()
  // editorRef.editorInstance.chain().focus().addXmTitleContent({key: 'erere', title: '试验背景：',content: '国内功效护肤成为美妆护肤的大趋势。在越来越多功效诉求的今天，越来越多消费者认可“功效护肤”理念，护肤品的成分与功效成为消费者在购买产品时的首要考虑因素' }).run()

  // editorRef.editorInstance.chain().focus().addXmTitleContent({key: 'ewr', title: '试验目的：',content: '从传统医学和现代医学促进活性物吸收和效用的方法路径出发，开发一款物质清晰、机理明确、功效性强的促效方' }).run()
  // editorRef.editorInstance.chain().focus().addRaw_material_tables({key: 'raw_material_table',title:'电子实验记录测试工艺'}).run()
  // editorRef.editorInstance.chain().focus().addXmTitleContent({key: 'erfsfere', title: '试验内容：',content: '1、活性成分的筛选与提取' }).run()
  // editorRef.editorInstance.chain().focus().addTechnology_tables({key: 'technology_table',title:'电子实验记录测试工艺'}).run()
  // editorRef.editorInstance?.chain().focus().addExperimental_method_designs({key: 'experimental_method_designs',title:'试验方式使用面板'}).run()
  // editorRef.editorInstance?.chain().focus().addSample_tables({key: 'sample_table',title:'试验方式使用面板'}).run()
  const jsonContent = {
    "type": "doc",
    "content": [
        {
            "type": "paragraph",
            "attrs": {
                "indent": null,
                "textAlign": "left",
                "lineHeight": 1.5,
                "margin": {}
            }
        },
        {
            "type": "raw_material_table",
            "attrs": {
                "id": "",
                "key": "raw_material_table",
                "name": "",
                "isChanged": false,
                "table_data": [
                    {
                        "id": "a060cb6e-23ea-4643-9c9b-22649eb58619",
                        "material": {
                            "id": "50831c42-06a1-407b-a14d-dde160a7db8b",
                            "name": "YL10171643",
                            "sn": "SN-1729154564209"
                        },
                        "state": "In-Progress",
                        "batch": "BT-1729154564209",
                        "price": "12.00",
                        "production_date": "2024-10-17",
                        "margin": "23.00",
                        "goods": "为了",
                        "supplier": "sadas",
                        "place": "",
                        "description": null,
                        "create_datetime": "2024-10-17 16:43:17",
                        "update_datetime": "2024-10-21 14:18:05"
                    },
                    {
                        "id": "5622ae82-bf06-47ed-9db9-f66ee75d640d",
                        "material": {
                            "id": "4cb7c311-ab8f-4fdf-aef4-61167a78c48f",
                            "name": "YL01171535",
                            "sn": "SN-1729150535817"
                        },
                        "state": "Not-Started",
                        "batch": "BT-1729150535818",
                        "price": "2354.00",
                        "production_date": "2024-10-17",
                        "margin": "12.00",
                        "goods": "货架位置",
                        "supplier": "供应商",
                        "place": "存放位置",
                        "description": null,
                        "create_datetime": "2024-10-17 15:36:27",
                        "update_datetime": "2024-10-17 15:36:27"
                    },
                    {
                        "id": "64886cd2-1b88-49aa-b7c1-a687a8ffbad4",
                        "material": {
                            "id": "7867a6e8-71a1-4ae3-afd5-f07f6ac0bb7a",
                            "name": "YL10171534",
                            "sn": "SN-1729150438237"
                        },
                        "state": "Not-Started",
                        "batch": "BT-1729150438237",
                        "price": "1243.00",
                        "production_date": "2024-10-17",
                        "margin": null,
                        "goods": "",
                        "supplier": "",
                        "place": "",
                        "description": null,
                        "create_datetime": "2024-10-17 15:34:26",
                        "update_datetime": "2024-10-17 15:34:26"
                    }
                ]
            },
            "content": [
                {
                    "type": "paragraph",
                    "attrs": {
                        "indent": null,
                        "textAlign": "left",
                        "lineHeight": 1.5,
                        "margin": {}
                    },
                    "content": [
                        {
                            "type": "text",
                            "text": " "
                        }
                    ]
                }
            ]
        },
        {
            "type": "technology_table",
            "attrs": {
                "id": "",
                "key": "technology_table",
                "name": "",
                "isChanged": false,
                "table_data": [
                    {
                        "id": "51d6f030-de74-45c0-b8d7-09a6837ea2f1",
                        "name": "das",
                        "typeCode": "processes",
                        "description": "",
                        "list": [
                            {
                                "id": "7",
                                "gourp": [],
                                "name": "温度",
                                "props": {
                                    "abstract": false,
                                    "required": false,
                                    "enableScan": false,
                                    "validation": "number",
                                    "enablePrint": true
                                },
                                "key": "temperature",
                                "type": "TextInput",
                                "value": null,
                                "unit": null,
                                "attribute_type": "single",
                                "typeCode": "operation",
                                "defaultValue": "23",
                                "data_id": 7,
                                "parent": "51d6f030-de74-45c0-b8d7-09a6837ea2f1",
                                "description": ""
                            },
                            {
                                "id": "8",
                                "gourp": [],
                                "name": "压力",
                                "props": {
                                    "abstract": false,
                                    "required": false,
                                    "enableScan": false,
                                    "validation": "number",
                                    "enablePrint": true
                                },
                                "key": "pressure",
                                "type": "TextInput",
                                "value": null,
                                "unit": null,
                                "attribute_type": "single",
                                "typeCode": "operation",
                                "defaultValue": "24",
                                "data_id": 8,
                                "parent": "51d6f030-de74-45c0-b8d7-09a6837ea2f1",
                                "description": "额我"
                            },
                            {
                                "id": "9",
                                "gourp": [],
                                "name": "原材料",
                                "props": {
                                    "custom": false,
                                    "options": [
                                        "无"
                                    ],
                                    "abstract": false,
                                    "required": true,
                                    "expanding": false,
                                    "enablePrint": true,
                                    "customConfig": {
                                        "name": "customerTreeSelect",
                                        "label": "配方版本",
                                        "value": "FormulaVersion"
                                    }
                                },
                                "key": "xm_raw_material",
                                "type": "MultipleSelect",
                                "value": null,
                                "unit": null,
                                "attribute_type": "single",
                                "typeCode": "operation",
                                "defaultValue": null,
                                "data_id": 9,
                                "parent": "51d6f030-de74-45c0-b8d7-09a6837ea2f1",
                                "description": ""
                            }
                        ]
                    }
                ],
                "title": ""
            },
            "content": [
                {
                    "type": "paragraph",
                    "attrs": {
                        "indent": null,
                        "textAlign": "left",
                        "lineHeight": 1.5,
                        "margin": {}
                    },
                    "content": [
                        {
                            "type": "text",
                            "text": "文档 "
                        }
                    ]
                },
            ]
        },
        {
            "type": "paragraph",
            "attrs": {
                "indent": null,
                "textAlign": "left",
                "lineHeight": 1.5,
                "margin": {}
            }
        },
        {
            "type": "sample_table",
            "attrs": {
                "id": "",
                "key": "sample_table",
                "name": "",
                "isChanged": false,
                "table_data": [
                    {
                        "check": true,
                        "id": "8b589d19-60dd-4e9e-b716-e490d8017baf",
                        "temperature": "23.0",
                        "pressure": "24.0",
                        "xm_raw_material": [
                            "a060cb6e-23ea-4643-9c9b-22649eb58619",
                            "5622ae82-bf06-47ed-9db9-f66ee75d640d"
                        ],
                        "name": "YL10171643/SN-1729154564209;YL01171535/SN-1729150535817",
                        "sn": "S-001",
                        "count": "0",
                        "description": "风度书房"
                    },
                    {
                        "check": true,
                        "id": "73fca46f-d0aa-45c7-b380-2b05341a5259",
                        "temperature": "46.0",
                        "pressure": "58.0",
                        "xm_raw_material": [
                            "a060cb6e-23ea-4643-9c9b-22649eb58619",
                            "5622ae82-bf06-47ed-9db9-f66ee75d640d"
                        ],
                        "name": "YL10171643/SN-1729154564209;YL01171535/SN-1729150535817",
                        "sn": "S-002",
                        "count": "0",
                        "description": "发大水发大水"
                    },
                    {
                        "check": true,
                        "id": "fd2342dd-fc51-4a2d-8b7f-3fbed97e578e",
                        "temperature": "69.0",
                        "pressure": "92.0",
                        "xm_raw_material": [
                            "a060cb6e-23ea-4643-9c9b-22649eb58619",
                            "5622ae82-bf06-47ed-9db9-f66ee75d640d"
                        ],
                        "name": "YL10171643/SN-1729154564209;YL01171535/SN-1729150535817",
                        "sn": "S-003",
                        "count": "0",
                        "description": "发大水发大水"
                    },
                    {
                        "check": true,
                        "id": "146665ca-f340-4f82-829f-aba83687082d",
                        "temperature": "92.0",
                        "pressure": "126.0",
                        "xm_raw_material": [
                            "a060cb6e-23ea-4643-9c9b-22649eb58619",
                            "5622ae82-bf06-47ed-9db9-f66ee75d640d"
                        ],
                        "name": "YL10171643/SN-1729154564209;YL01171535/SN-1729150535817",
                        "sn": "S-004",
                        "count": "0",
                        "description": "发生电话多少"
                    },
                    {
                        "check": true,
                        "id": "5172b139-b32a-4873-a038-6478ef9a9e75",
                        "temperature": "115.0",
                        "pressure": "160.0",
                        "xm_raw_material": [
                            "a060cb6e-23ea-4643-9c9b-22649eb58619",
                            "5622ae82-bf06-47ed-9db9-f66ee75d640d"
                        ],
                        "name": "YL10171643/SN-1729154564209;YL01171535/SN-1729150535817",
                        "sn": "S-005",
                        "count": "0",
                        "description": "发大水发大水"
                    }
                ],
                "designParams": []
            },
            "content": [
                {
                    "type": "paragraph",
                    "attrs": {
                        "indent": null,
                        "textAlign": "left",
                        "lineHeight": 1.5,
                        "margin": {}
                    },
                    "content": [
                        {
                            "type": "text",
                            "text": " "
                        }
                    ]
                }
            ]
        },
        {
            "type": "paragraph",
            "attrs": {
                "indent": null,
                "textAlign": "left",
                "lineHeight": 1.5,
                "margin": {}
            }
        }
    ]
  }
  // editorRef.editorInstance?.commands.setContent(jsonContent)

  // editorRef.editorInstance?.chain().focus().addSample_tables({key: 'sample_table',title:'试验方式使用面板'}).run()
})


</script>

<style>
.box {
  margin: 40px;
  height: calc(100vh - 80px);
  box-sizing: border-box;
  position: relative;
}

html,
body {
  height: 100vh;
  overflow: hidden;
}
</style>
