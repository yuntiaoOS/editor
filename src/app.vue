<template>
  <div class="box">
<!--    <div v-if="true" style="height:200px;">-->
<!--      <rich-text-editor v-model="content" :showToolbar="true" />-->
<!--    </div>-->
<!--    -&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;-->
<!--    <div v-if="true" style="height:600px;">-->
<!--      <rich-text-editor ref="richTextEditorRef" v-model="content1" outputType="json" @print="onPrint" />-->
<!--    </div>-->
<!--    <FormRender :forms="[formItems]" v-model="xmValue"></FormRender>-->
    <!-- <FormDesignRender
      v-model="_value"
      mode="NORMAL"
      :config="formItems">
    </FormDesignRender> -->
    <!-- <TTitle>What is TDesign</TTitle>
    <TText mark>
      TDesign is an enterprise-level design system accumulated by Tencent's
      various business teams.
    </TText> -->
    <!-- <xm-form v-model:form-data="xmValue" /> -->
<!--     <UmoEditor ref="editorRef" v-bind="options" />-->
    <UmoSimpleEditor v-if="true" ref="editorRef" v-bind="options" @change="changeEdit" />
  </div>
</template>

<script setup lang="ts">
import { getOrg_memberFetch, attachments_fileFetch } from '@/api/index'
import { put_experiment_record_fetch } from '@/api/experiment'
import { checkBeforeSaveDoc } from '@/utils/index'
// import { UmoSimpleEditor,UmoEditor } from './components/index.ts'
// import UmoEdit from './components/editor/index.vue'
const { editor } = useStore()
const editorRef = $ref(null)
const $key_data = JSON.parse(localStorage.getItem('key_data') ?? '{}')
const experiment_record = computed(() => $key_data?.experiment_record)
const experiment_theme = computed(() => $key_data?.experiment_theme)
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
const content = ref('')
const content1 = ref('')
const _value = ref('大锅饭的师傅')
const formItems =
  {
    key: "",
    icon: "creditcard",
    type: "TextInput",
    props: {
      abstract: true,
      required: false,
      enableScan: true,
      enablePrint: true,
      suffix: undefined,
    },
    title: "单行文本",
    valueType: "String"
  }

const richTextEditorRef = ref()

const onPrint = ({myHtml,printing}:any) => {
  console.log(myHtml,printing)
  richTextEditorRef.value.printHtmlString(myHtml)
  printing.value = false
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
    dict_data: {
      test_conditions: [
        {
          "id": "125534c7-d47d-4952-af8d-e642e1a6ee23",
          "label": "日常",
          "value": "1",
          "parent": "0cdb6652-df7a-4968-9b32-0d416f6ad382",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 1,
          "remark": "",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval",
            "sales_marketing"
          ]
        },
        {
          "id": "8592b7df-a9ab-48a0-bcae-da13a9f64fc1",
          "label": "光照",
          "value": "2",
          "parent": "0cdb6652-df7a-4968-9b32-0d416f6ad382",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 2,
          "remark": "",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval",
            "sales_marketing"
          ]
        },
        {
          "id": "94008a0f-51ac-4dd2-a0b1-41bd73ab02ba",
          "label": "45±1℃",
          "value": "3",
          "parent": "0cdb6652-df7a-4968-9b32-0d416f6ad382",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 3,
          "remark": "",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval",
            "sales_marketing"
          ]
        },
        {
          "id": "bc5850a2-753e-4958-b43a-e9c3dc963881",
          "label": "冷冻 -15±1℃",
          "value": "4",
          "parent": "0cdb6652-df7a-4968-9b32-0d416f6ad382",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 4,
          "remark": "",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval",
            "sales_marketing"
          ]
        },
        {
          "id": "7b372a42-1423-44d5-ae3c-34b6117b5e4d",
          "label": "冷藏 4±1℃",
          "value": "5",
          "parent": "0cdb6652-df7a-4968-9b32-0d416f6ad382",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 5,
          "remark": "",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval",
            "sales_marketing"
          ]
        },
        {
          "id": "e62594c6-b203-4868-ac56-cf3ab2dd94ad",
          "label": "交替循环",
          "value": "6",
          "parent": "0cdb6652-df7a-4968-9b32-0d416f6ad382",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 6,
          "remark": "",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval",
            "sales_marketing"
          ]
        },
        {
          "id": "8bc51c00-0799-483c-8c15-0cc9cf14a077",
          "label": "暗",
          "value": "7",
          "parent": "0cdb6652-df7a-4968-9b32-0d416f6ad382",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 7,
          "remark": "",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval",
            "sales_marketing"
          ]
        }
      ],
      evaluating_test_period: [
        {
          "id": "99a6be9d-4043-4ebe-bc0d-96d019183d14",
          "label": "周",
          "value": "1",
          "parent": "bd34187b-91b1-4d38-862d-5497e5332f6c",
          "type": 1,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 1,
          "remark": "",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval",
            "sales_marketing"
          ]
        },
        {
          "id": "f5291072-8786-4236-a145-a162a72e2297",
          "label": "天",
          "value": "2",
          "parent": "bd34187b-91b1-4d38-862d-5497e5332f6c",
          "type": 1,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 2,
          "remark": "",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval",
            "sales_marketing"
          ]
        }
      ]
    },
    experiment_theme: {
      "id": "2270b604-cbeb-47dc-96c7-f0bc2381e926",
      "modifier_name": "赵紫文",
      "dept_belong_id": null,
      "creator_name": "赵紫文",
      "create_datetime": "2024-12-19 16:23:20",
      "update_datetime": "2024-12-19 17:41:51",
      "is_collect": false,
      "person_in_charge": {
        "id": "63aed191-f093-4e9d-b4ef-4a159ffa3938",
        "user_id": "63aed191-f093-4e9d-b4ef-4a159ffa3938",
        "name": "赵紫文",
        "is_owner": true,
        "avatar": "http://192.168.2.11:8002/media/avatar/abf0f9c664c6c4b3e4b0fbaf054c1db7_r9xK2Nq.png"
      },
      "participants": [
        {
          "id": "cea15e47-dcdd-4880-8bf3-ca6829109cf7",
          "user_id": "cea15e47-dcdd-4880-8bf3-ca6829109cf7",
          "name": "张三丰",
          "is_owner": true,
          "avatar": "http://192.168.2.11:8002/media/avatar/f21be6bb-34b9-481d-88dd-5c6c3d6ed66b.png"
        },
        {
          "id": "69d25690-2f7a-458e-8f10-1c38162a1c58",
          "user_id": "69d25690-2f7a-458e-8f10-1c38162a1c58",
          "name": "张大彪",
          "is_owner": false,
          "avatar": "http://192.168.2.11:8002/media/avatar/db1f268d-5b27-4bed-95f5-6426025519e0.png"
        },
        {
          "id": "995dda9e-dbee-46db-af4f-02686c470357",
          "user_id": "995dda9e-dbee-46db-af4f-02686c470357",
          "name": "胡汉三",
          "is_owner": false,
          "avatar": "http://192.168.2.11:8002/media/avatar/5ea58e76-fcbd-43bc-9493-dde4ba269b3e.png"
        },
        {
          "id": "9dc2696a-b931-4abb-bb81-5fa2d088947e",
          "user_id": "9dc2696a-b931-4abb-bb81-5fa2d088947e",
          "name": "等待",
          "is_owner": false,
          "avatar": "http://192.168.2.11:8002/media/avatar/26e35b37-d464-48f6-a423-b73f17ca2538.png"
        },
        {
          "id": "63aed191-f093-4e9d-b4ef-4a159ffa3938",
          "user_id": "63aed191-f093-4e9d-b4ef-4a159ffa3938",
          "name": "赵紫文",
          "is_owner": true,
          "avatar": "http://192.168.2.11:8002/media/avatar/abf0f9c664c6c4b3e4b0fbaf054c1db7_r9xK2Nq.png"
        },
        {
          "id": "63aed191-f093-4e9d-b4ef-4a159ffa3935",
          "user_id": "63aed191-f093-4e9d-b4ef-4a159ffa3935",
          "name": "小白1",
          "is_owner": true,
          "avatar": "http://192.168.2.11:8002/media/avatar/abf0f9c664c6c4b3e4b0fbaf054c1db7_l1HXx8V.jpg"
        }
      ],
      "description": "wdewd了了了2柔柔弱弱柔柔弱弱柔柔弱弱揉揉揉呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃",
      "creator": "63aed191-f093-4e9d-b4ef-4a159ffa3938",
      "modifier": "63aed191-f093-4e9d-b4ef-4a159ffa3938",
      "name": "SY121916230001",
      "sn": "SN-1734596573156",
      "icon": "/experiment/picture1.png",
      "label": null,
      "experiment_template": null,
      "start_time": null,
      "end_time": null,
      "attachment": [],
      "publish": false
    },
    experiment_record: {
      "id": "1333b668-3df8-4e63-95db-dd0fbc781fc9",
      "modifier_name": "赵紫文",
      "dept_belong_id": null,
      "creator_name": "赵紫文",
      "create_datetime": "2024-12-19 16:25:02",
      "update_datetime": "2024-12-19 19:02:50",
      "liked": false,
      "experimenter": [
        {
          "id": "cea15e47-dcdd-4880-8bf3-ca6829109cf7",
          "name": "张三丰",
          "avatar": "http://192.168.2.11:8002/media/avatar/f21be6bb-34b9-481d-88dd-5c6c3d6ed66b.png"
        },
        {
          "id": "69d25690-2f7a-458e-8f10-1c38162a1c58",
          "name": "张大彪",
          "avatar": "http://192.168.2.11:8002/media/avatar/db1f268d-5b27-4bed-95f5-6426025519e0.png"
        },
        {
          "id": "995dda9e-dbee-46db-af4f-02686c470357",
          "name": "胡汉三",
          "avatar": "http://192.168.2.11:8002/media/avatar/5ea58e76-fcbd-43bc-9493-dde4ba269b3e.png"
        },
        {
          "id": "9dc2696a-b931-4abb-bb81-5fa2d088947e",
          "name": "等待",
          "avatar": "http://192.168.2.11:8002/media/avatar/26e35b37-d464-48f6-a423-b73f17ca2538.png"
        },
        {
          "id": "63aed191-f093-4e9d-b4ef-4a159ffa3938",
          "name": "赵紫文",
          "avatar": "http://192.168.2.11:8002/media/avatar/abf0f9c664c6c4b3e4b0fbaf054c1db7_r9xK2Nq.png"
        },
        {
          "id": "63aed191-f093-4e9d-b4ef-4a159ffa3935",
          "name": "小白1",
          "avatar": "http://192.168.2.11:8002/media/avatar/abf0f9c664c6c4b3e4b0fbaf054c1db7_l1HXx8V.jpg"
        }
      ],
      "description": null,
      "creator": "63aed191-f093-4e9d-b4ef-4a159ffa3938",
      "modifier": "63aed191-f093-4e9d-b4ef-4a159ffa3938",
      "title": "LJ12191625",
      "sn": null,
      "start_time": null,
      "end_time": null,
      "experiment_design": null,
      "sample_number": null,
      "version": 1,
      "document_attachments": null,
      "json_data": {
        "type": "doc",
        "content": []
      },
      "experiment_theme": "2270b604-cbeb-47dc-96c7-f0bc2381e926",
      "previous_record": null,
      "catalog": null
    },
    umo_domain: 'http://192.168.2.11:8003/api',
    umo_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzM2ODU2MTQyLCJpYXQiOjE3MzY3Njk3NDIsImp0aSI6IjA3NTBkYzJjOWZmZDRhZGZiMWZkOWEzNzc5ODBkMWUwIiwidXNlcl9pZCI6Ijg1Mjg4NThmLTdjYjgtNDc3ZS1iZjE3LWZkZTNkMmZiYjIzZSJ9.6F-3S18jTByOsfMG0ntUpyHLXR8kl-cK4zFeeHw_xxQ',
  },
  document: {
    placeholder: '请输入',
    content: localStorage.getItem('document.content') ?? "<p>请输入</p>",
  },
  templates,
  cdnUrl: 'http://id.zw.rzm.com',
  shareUrl: 'http://id.zw.rzm.com',
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
    userId: '8218a663-e9a6-43d5-a0f1-d68a5509e366',
    nickName: '赵紫文',
    avatarUrl: "http://192.168.2.11:8002/media/avatar/e615457e-5102-43b2-a46f-34c7686affa0.png",
  },
  async onSave(content: string, page: number, document: { content: string }) {
    try {
      localStorage.setItem('document.content', document.content)
    } catch (error) {
      console.log('------------error----------276--------',error)
    }
    const contentJson = editorRef.editorInstance.getJSON()
    checkBeforeSaveDoc(contentJson.content)
    return new Promise((resolve, reject) => {
      // const contentJson = editorRef.editorInstance.getJSON()
      let title = experiment_record.value?.title
      let sn = experiment_record.value?.sn
      let start_time = experiment_record.value?.start_time
      let end_time = experiment_record.value?.end_time
      let experimenter = experiment_record.value?.experimenter

      if (!contentJson || contentJson.content.length === 0) {
        reject('请先编辑实验设计,再保存')
      } else {
        const titleArr = contentJson.content.filter((ele: any) => ele.type === 'xmTitle' && ele.attrs.key === 'baseTitle')
        if (titleArr.length > 0) {
          if (titleArr[0].attrs.title.length > 0) {
            title = titleArr[0].attrs.title
          } else {
            reject('请输入实验标题')
          }
        } else {
          reject('缺少实验标题组件，联系管理员添加')
        }
        const formArr = contentJson.content.filter((ele: any) => ele.type === 'xmForm' && ele.attrs.key === 'baseInfo')
        if (formArr.length > 0) {
          sn = formArr[0].attrs.formData.sn
          start_time = formArr[0].attrs.formData.start_time
          end_time = formArr[0].attrs.formData.end_time
          experimenter = formArr[0].attrs.formData.experimenter
        } else {
          reject('缺少实验基本信息组件，联系管理员添加')
        }
      }
      const params = {
        title: title,
        sn: sn,
        start_time: start_time,
        end_time: end_time,
        experimenter: [],
        json_data: contentJson
      }
      put_experiment_record_fetch(experiment_record.value ? experiment_record.value.id : '6e252907-4fa3-4e50-a97c-6d8a33bbb579', params).then((res) => {
        console.log('-------handleOnSave-------res', res)
        if (res.data.code === 2000) {
          resolve('操作成功')
        } else {
          reject(res.data.message)
        }
      }).catch((err) => {
        reject(err.message)
      })
    })
  },
  async onFileUpload(file: File & { url?: string }) {
    if (!file) {
      throw new Error('没有找到要上传的文件')
    }
    console.log('-------1111111111----onUpload-----------', file)
    const res = await attachments_fileFetch({ file: file})
    console.log('-------res-----1111111111111----', res)
    if (res.status === 201) {
      const fileUrl = localStorage.getItem('BASE_URL') + `/api/storage/files/${res.data.id}/preview/`
      const fileUrl2 = localStorage.getItem('BASE_URL') + `/api/storage/files/${res.data.id}/download/`
      return { ...res.data,src: fileUrl,url: fileUrl ,file:fileUrl2}
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
  async getEntityFormMethod() {
    return await new Promise((resolve, reject) => {
      const resData :any[] = []
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
    console.log('--------12------', editorRef.editorInstance.getJSON())
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
        "type": "xmTitle",
        "attrs": {
          "id": "1333b668-3df8-4e63-95db-dd0fbc781fc9",
          "key": "baseTitle",
          "name": "5dddbd0e-88e2-49a7-ac1d-9d9c63cff0d0",
          "title": "热狗热狗热狗人",
          "isChanged": false,
          "updateTime": "",
          "showSubTitle": true
        }
      },
      {
        "type": "paragraph",
        "attrs": {
          "indent": null,
          "margin": {},
          "textAlign": "left",
          "lineHeight": 1.5
        }
      },
      {
        "type": "xmTitleContent",
        "attrs": {
          "title": "试验目的：",
          "content": "目的"
        },
        "content": [
          {
            "type": "heading",
            "attrs": {
              "id": "elm5s8",
              "level": 2,
              "indent": null,
              "margin": {},
              "textAlign": "left",
              "lineHeight": 1.5,
              "data-toc-id": "elm5s8"
            },
            "content": [
              {
                "text": "试验目的：eeeeeeeeeeeeeeeee",
                "type": "text"
              }
            ]
          },
          {
            "type": "paragraph",
            "attrs": {
              "indent": null,
              "margin": {},
              "textAlign": "left",
              "lineHeight": 1.5
            },
            "content": [
              {
                "text": "目的",
                "type": "text"
              }
            ]
          }
        ]
      },
      {
        "type": "raw_material_table",
        "attrs": {
          "id": "fc3bd82a-8a6f-471c-bd53-632671e34b63",
          "updateTime": "2025-01-06 14:05:38",
          "key": "raw_material_table20250106140533",
          "name": "88b02eeb-26ca-417a-ad59-9fb0f70af1ba",
          "isChanged": false,
          "change_log": {},
          "is_integration": true,
          "table_data": [
            {
              "id": "2c8fc50f-fa87-4423-baba-06be739b8d07",
              "material": "d4b21f73-ec06-4071-bac0-e871be087c37",
              "batch": "111",
              "name": "测试11",
              "price": null,
              "sn": "111",
              "state": {
                "id": "63e1c32f-f9f6-4caf-a698-631443950b93",
                "name": "待审核",
                "color": "#0052d9",
                "type_id": 0
              },
              "supplier": null,
              "description": ""
            },
            {
              "id": "aaa82945-a49e-49a7-bf3d-0119f5063ae4",
              "material": "cb3cfa37-3012-4109-b295-88bb083a2aa6",
              "batch": "22222",
              "name": "测试标题模版",
              "price": "222.00",
              "sn": "SN-2222222222",
              "state": {
                "id": "63e1c32f-f9f6-4caf-a698-631443950b93",
                "name": "待审核",
                "color": "#0052d9",
                "type_id": 0
              },
              "supplier": null,
              "description": ""
            },
            {
              "id": "f066fd92-d037-4386-9383-69af99785dda",
              "material": "397ba2c4-1f0a-4f85-9a22-cc61bb174708",
              "batch": "测试22222",
              "name": "测试222",
              "price": null,
              "sn": "测试2222",
              "state": {
                "id": "63e1c32f-f9f6-4caf-a698-631443950b93",
                "name": "待审核",
                "color": "#0052d9",
                "type_id": 0
              },
              "supplier": null,
              "description": ""
            },
            {
              "id": "1b7ae135-3075-4795-9014-41866959b111",
              "material": "91d26e74-10e4-4302-b971-9d7a94e5d769",
              "batch": "测试",
              "name": "测试",
              "price": null,
              "sn": "测试",
              "state": {
                "id": "8330f570-6742-4d43-b743-d01d1574c253",
                "name": "草稿",
                "color": "#e7e7e7",
                "type_id": 1
              },
              "supplier": null,
              "description": ""
            }
          ],
          "title": "物料202501061405"
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
          "margin": {},
          "textAlign": "left",
          "lineHeight": 1.5
        },
        "content": [
          {
            "text": "jkdhtrhtrhthrhthtrhtrhtrhtrhtrhgfdgdfcscs",
            "type": "text"
          }
        ]
      },
      {
        "type": "technology_table",
        "attrs": {
          "id": "43de3071-935d-49f4-a61f-ddef77711316",
          "updateTime": "",
          "key": "technology_table20250106141139",
          "name": "eb4c38af-a017-4f89-9ff2-51daf7235ebf",
          "isChanged": false,
          "change_log": {},
          "is_integration": false,
          "table_data": [
            {
              "id": "ef124a56-3391-44e1-ba10-d163a7248b6b",
              "rowKey": "ef124a56-3391-44e1-ba10-d163a7248b6b/7ptrqvg0",
              "name": "111",
              "type": "procedure",
              "description": "",
              "form": {
                "formItems": [
                  {
                    "id": 2,
                    "name": "测试模块2",
                    "description": "测试22",
                    "type": "操作",
                    "attribute": [
                      {
                        "id": 31,
                        "title": "单行输入",
                        "type": "TextInput",
                        "value": null,
                        "props": {
                          "suffix": null,
                          "abstract": true,
                          "required": false,
                          "enableScan": false,
                          "enablePrint": true
                        },
                        "key": "dan_hang_shu_ru",
                        "attribute_type": "single",
                        "multiple": false,
                        "description": "",
                        "rowKey": "31/650rbgbf"
                      },
                      {
                        "id": 32,
                        "title": "团材料",
                        "type": "SelectMaterial",
                        "value": null,
                        "props": {
                          "http": {},
                          "fixed": true,
                          "hidden": false,
                          "suffix": null,
                          "options": [
                            {
                              "group": "物料202501061405",
                              "children": [
                                {
                                  "value": "2c8fc50f-fa87-4423-baba-06be739b8d07",
                                  "label": "测试11/111"
                                },
                                {
                                  "value": "aaa82945-a49e-49a7-bf3d-0119f5063ae4",
                                  "label": "测试标题模版/SN-2222222222"
                                },
                                {
                                  "value": "f066fd92-d037-4386-9383-69af99785dda",
                                  "label": "测试222/测试2222"
                                },
                                {
                                  "value": "1b7ae135-3075-4795-9014-41866959b111",
                                  "label": "测试/测试"
                                }
                              ]
                            }
                          ],
                          "abstract": false,
                          "dictType": null,
                          "multiple": true,
                          "readOnly": false,
                          "required": false,
                          "expanding": false,
                          "validation": null,
                          "enablePrint": true
                        },
                        "key": "tuan_cai_liao",
                        "attribute_type": "single",
                        "multiple": false,
                        "rowKey": "32/bbl4hkgp",
                        "description": ""
                      },
                      {
                        "id": 33,
                        "title": "单选",
                        "type": "SelectInputRadio",
                        "value": null,
                        "props": {
                          "suffix": null,
                          "options": [
                            "选项1",
                            "选项2"
                          ],
                          "abstract": false,
                          "required": false,
                          "expanding": false,
                          "enablePrint": true
                        },
                        "key": "dan_xuan",
                        "attribute_type": "single",
                        "multiple": false,
                        "description": "",
                        "rowKey": "33/q4zp85nc"
                      },
                      {
                        "id": 34,
                        "title": "主角儿组合",
                        "type": "FieldsGroup",
                        "value": null,
                        "props": {
                          "size": 8,
                          "items": [
                            {
                              "id": 31,
                              "key": "dan_hang_shu_ru",
                              "type": "TextInput",
                              "unit": null,
                              "props": {
                                "suffix": null,
                                "abstract": true,
                                "required": false,
                                "enableScan": false,
                                "enablePrint": true
                              },
                              "title": "单行输入",
                              "value": null,
                              "multiple": false,
                              "attribute_type": "single",
                              "description": "",
                              "rowKey": "31/z9qsvicu"
                            },
                            {
                              "id": 32,
                              "key": "tuan_cai_liao",
                              "type": "SelectMaterial",
                              "unit": null,
                              "props": {
                                "http": {},
                                "fixed": true,
                                "hidden": false,
                                "suffix": null,
                                "options": [
                                  {
                                    "group": "物料202501061405",
                                    "children": [
                                      {
                                        "value": "2c8fc50f-fa87-4423-baba-06be739b8d07",
                                        "label": "测试11/111"
                                      },
                                      {
                                        "value": "aaa82945-a49e-49a7-bf3d-0119f5063ae4",
                                        "label": "测试标题模版/SN-2222222222"
                                      },
                                      {
                                        "value": "f066fd92-d037-4386-9383-69af99785dda",
                                        "label": "测试222/测试2222"
                                      },
                                      {
                                        "value": "1b7ae135-3075-4795-9014-41866959b111",
                                        "label": "测试/测试"
                                      }
                                    ]
                                  }
                                ],
                                "abstract": false,
                                "dictType": null,
                                "multiple": true,
                                "readOnly": false,
                                "required": false,
                                "expanding": false,
                                "validation": null,
                                "enablePrint": true
                              },
                              "title": "团材料",
                              "value": null,
                              "multiple": false,
                              "attribute_type": "single",
                              "rowKey": "32/twvvqw33",
                              "description": ""
                            },
                            {
                              "id": 33,
                              "key": "dan_xuan",
                              "type": "SelectInputRadio",
                              "unit": null,
                              "props": {
                                "suffix": null,
                                "options": [
                                  "选项1",
                                  "选项2"
                                ],
                                "abstract": false,
                                "required": false,
                                "expanding": false,
                                "enablePrint": true
                              },
                              "title": "单选",
                              "value": null,
                              "multiple": false,
                              "attribute_type": "single",
                              "description": "",
                              "rowKey": "33/yd76f431"
                            }
                          ],
                          "abstract": false,
                          "required": false,
                          "direction": "horizontal",
                          "expanding": false,
                          "enablePrint": true
                        },
                        "key": "zhu_jiao_er_zu_he",
                        "attribute_type": "single",
                        "multiple": false,
                        "rowKey": "34/133zk0iq",
                        "description": ""
                      }
                    ],
                    "rowKey": "2/6xexe1pe",
                    "key": "2/6xexe1pe",
                    "title": "测试模块2",
                    "operateType": "操作"
                  },
                  {
                    "id": 3,
                    "name": "工艺模块",
                    "description": "测试",
                    "type": "物料",
                    "attribute": [
                      {
                        "id": 31,
                        "title": "单行输入",
                        "type": "TextInput",
                        "value": null,
                        "props": {
                          "suffix": null,
                          "abstract": true,
                          "required": false,
                          "enableScan": false,
                          "enablePrint": true
                        },
                        "key": "dan_hang_shu_ru",
                        "attribute_type": "single",
                        "multiple": false,
                        "description": "",
                        "rowKey": "31/pz9wtec1"
                      },
                      {
                        "id": 33,
                        "title": "单选",
                        "type": "SelectInputRadio",
                        "value": null,
                        "props": {
                          "suffix": null,
                          "options": [
                            "选项1",
                            "选项2"
                          ],
                          "abstract": false,
                          "required": false,
                          "expanding": false,
                          "enablePrint": true
                        },
                        "key": "dan_xuan",
                        "attribute_type": "single",
                        "multiple": false,
                        "description": "",
                        "rowKey": "33/cgevme5w"
                      }
                    ],
                    "rowKey": "3/dg672stv",
                    "key": "3/dg672stv",
                    "title": "工艺模块",
                    "operateType": "物料"
                  }
                ],
                "formData": {
                  "description": "",
                  "2/6xexe1pe": {
                    "dan_hang_shu_ru": "",
                    "tuan_cai_liao": [],
                    "dan_xuan": "",
                    "zhu_jiao_er_zu_he": {
                      "dan_hang_shu_ru": "",
                      "tuan_cai_liao": [],
                      "dan_xuan": ""
                    }
                  },
                  "3/dg672stv": {
                    "dan_hang_shu_ru": "",
                    "dan_xuan": ""
                  }
                }
              }
            },
            {
              "id": "74124df7-34a0-49fe-9e7d-07f05f27080a",
              "rowKey": "74124df7-34a0-49fe-9e7d-07f05f27080a/ynomysil",
              "name": "测试22",
              "type": "procedure",
              "description": "",
              "form": {
                "formItems": [
                  {
                    "id": 2,
                    "name": "测试模块2",
                    "description": "测试22",
                    "type": "操作",
                    "attribute": [
                      {
                        "id": 31,
                        "title": "单行输入",
                        "type": "TextInput",
                        "value": null,
                        "props": {
                          "suffix": null,
                          "abstract": true,
                          "required": false,
                          "enableScan": false,
                          "enablePrint": true
                        },
                        "key": "dan_hang_shu_ru",
                        "attribute_type": "single",
                        "multiple": false,
                        "description": "",
                        "rowKey": "31/u01atp16"
                      },
                      {
                        "id": 32,
                        "title": "团材料",
                        "type": "SelectMaterial",
                        "value": null,
                        "props": {
                          "http": {},
                          "fixed": true,
                          "hidden": false,
                          "suffix": null,
                          "options": [
                            {
                              "group": "物料202501061405",
                              "children": [
                                {
                                  "value": "2c8fc50f-fa87-4423-baba-06be739b8d07",
                                  "label": "测试11/111"
                                },
                                {
                                  "value": "aaa82945-a49e-49a7-bf3d-0119f5063ae4",
                                  "label": "测试标题模版/SN-2222222222"
                                },
                                {
                                  "value": "f066fd92-d037-4386-9383-69af99785dda",
                                  "label": "测试222/测试2222"
                                },
                                {
                                  "value": "1b7ae135-3075-4795-9014-41866959b111",
                                  "label": "测试/测试"
                                }
                              ]
                            }
                          ],
                          "abstract": false,
                          "dictType": null,
                          "multiple": true,
                          "readOnly": false,
                          "required": false,
                          "expanding": false,
                          "validation": null,
                          "enablePrint": true
                        },
                        "key": "tuan_cai_liao",
                        "attribute_type": "single",
                        "multiple": false,
                        "rowKey": "32/n861ib97",
                        "description": ""
                      },
                      {
                        "id": 33,
                        "title": "单选",
                        "type": "SelectInputRadio",
                        "value": null,
                        "props": {
                          "suffix": null,
                          "options": [
                            "选项1",
                            "选项2"
                          ],
                          "abstract": false,
                          "required": false,
                          "expanding": false,
                          "enablePrint": true
                        },
                        "key": "dan_xuan",
                        "attribute_type": "single",
                        "multiple": false,
                        "description": "",
                        "rowKey": "33/ss69r3kf"
                      },
                      {
                        "id": 34,
                        "title": "主角儿组合",
                        "type": "FieldsGroup",
                        "value": null,
                        "props": {
                          "size": 8,
                          "items": [
                            {
                              "id": 31,
                              "key": "dan_hang_shu_ru",
                              "type": "TextInput",
                              "unit": null,
                              "props": {
                                "suffix": null,
                                "abstract": true,
                                "required": false,
                                "enableScan": false,
                                "enablePrint": true
                              },
                              "title": "单行输入",
                              "value": null,
                              "multiple": false,
                              "attribute_type": "single",
                              "description": "",
                              "rowKey": "31/tjwng3l2"
                            },
                            {
                              "id": 32,
                              "key": "tuan_cai_liao",
                              "type": "SelectMaterial",
                              "unit": null,
                              "props": {
                                "http": {},
                                "fixed": true,
                                "hidden": false,
                                "suffix": null,
                                "options": [
                                  {
                                    "group": "物料202501061405",
                                    "children": [
                                      {
                                        "value": "2c8fc50f-fa87-4423-baba-06be739b8d07",
                                        "label": "测试11/111"
                                      },
                                      {
                                        "value": "aaa82945-a49e-49a7-bf3d-0119f5063ae4",
                                        "label": "测试标题模版/SN-2222222222"
                                      },
                                      {
                                        "value": "f066fd92-d037-4386-9383-69af99785dda",
                                        "label": "测试222/测试2222"
                                      },
                                      {
                                        "value": "1b7ae135-3075-4795-9014-41866959b111",
                                        "label": "测试/测试"
                                      }
                                    ]
                                  }
                                ],
                                "abstract": false,
                                "dictType": null,
                                "multiple": true,
                                "readOnly": false,
                                "required": false,
                                "expanding": false,
                                "validation": null,
                                "enablePrint": true
                              },
                              "title": "团材料",
                              "value": null,
                              "multiple": false,
                              "attribute_type": "single",
                              "rowKey": "32/aopzrdvl",
                              "description": ""
                            },
                            {
                              "id": 33,
                              "key": "dan_xuan",
                              "type": "SelectInputRadio",
                              "unit": null,
                              "props": {
                                "suffix": null,
                                "options": [
                                  "选项1",
                                  "选项2"
                                ],
                                "abstract": false,
                                "required": false,
                                "expanding": false,
                                "enablePrint": true
                              },
                              "title": "单选",
                              "value": null,
                              "multiple": false,
                              "attribute_type": "single",
                              "description": "",
                              "rowKey": "33/1hvyvut6"
                            }
                          ],
                          "abstract": false,
                          "required": false,
                          "direction": "horizontal",
                          "expanding": false,
                          "enablePrint": true
                        },
                        "key": "zhu_jiao_er_zu_he",
                        "attribute_type": "single",
                        "multiple": false,
                        "rowKey": "34/lx3kfrip",
                        "description": ""
                      }
                    ],
                    "rowKey": "2/der9om5s",
                    "key": "2/der9om5s",
                    "title": "测试模块2",
                    "operateType": "操作"
                  },
                  {
                    "id": 6,
                    "name": "测试",
                    "description": "111",
                    "type": "操作",
                    "attribute": [
                      {
                        "id": 31,
                        "title": "单行输入",
                        "type": "TextInput",
                        "value": null,
                        "props": {
                          "suffix": null,
                          "abstract": true,
                          "required": false,
                          "enableScan": false,
                          "enablePrint": true
                        },
                        "key": "dan_hang_shu_ru",
                        "attribute_type": "single",
                        "multiple": false,
                        "description": "",
                        "rowKey": "31/o1sg5dll"
                      },
                      {
                        "id": 32,
                        "title": "团材料",
                        "type": "SelectMaterial",
                        "value": null,
                        "props": {
                          "http": {},
                          "fixed": true,
                          "hidden": false,
                          "suffix": null,
                          "options": [
                            {
                              "group": "物料202501061405",
                              "children": [
                                {
                                  "value": "2c8fc50f-fa87-4423-baba-06be739b8d07",
                                  "label": "测试11/111"
                                },
                                {
                                  "value": "aaa82945-a49e-49a7-bf3d-0119f5063ae4",
                                  "label": "测试标题模版/SN-2222222222"
                                },
                                {
                                  "value": "f066fd92-d037-4386-9383-69af99785dda",
                                  "label": "测试222/测试2222"
                                },
                                {
                                  "value": "1b7ae135-3075-4795-9014-41866959b111",
                                  "label": "测试/测试"
                                }
                              ]
                            }
                          ],
                          "abstract": false,
                          "dictType": null,
                          "multiple": true,
                          "readOnly": false,
                          "required": false,
                          "expanding": false,
                          "validation": null,
                          "enablePrint": true
                        },
                        "key": "tuan_cai_liao",
                        "attribute_type": "single",
                        "multiple": false,
                        "rowKey": "32/53wls6e7",
                        "description": ""
                      },
                      {
                        "id": 33,
                        "title": "单选",
                        "type": "SelectInputRadio",
                        "value": null,
                        "props": {
                          "suffix": null,
                          "options": [
                            "选项1",
                            "选项2"
                          ],
                          "abstract": false,
                          "required": false,
                          "expanding": false,
                          "enablePrint": true
                        },
                        "key": "dan_xuan",
                        "attribute_type": "single",
                        "multiple": false,
                        "description": "",
                        "rowKey": "33/6a0rwrlj"
                      }
                    ],
                    "rowKey": "6/6lset9lt",
                    "key": "6/6lset9lt",
                    "title": "测试",
                    "operateType": "操作"
                  }
                ],
                "formData": {
                  "description": "",
                  "2/der9om5s": {
                    "dan_hang_shu_ru": "",
                    "tuan_cai_liao": [],
                    "dan_xuan": "",
                    "zhu_jiao_er_zu_he": {
                      "dan_hang_shu_ru": "",
                      "tuan_cai_liao": [],
                      "dan_xuan": ""
                    }
                  },
                  "6/6lset9lt": {
                    "dan_hang_shu_ru": "",
                    "tuan_cai_liao": [],
                    "dan_xuan": ""
                  }
                }
              }
            },
            {
              "id": "acbc22e4-8c6d-4412-8e5e-7edc855e1510",
              "rowKey": "acbc22e4-8c6d-4412-8e5e-7edc855e1510/3ds3qb3g",
              "name": "测试11",
              "type": "procedure",
              "description": "",
              "form": {
                "formItems": [
                  {
                    "id": 2,
                    "name": "测试模块2",
                    "description": "测试22",
                    "type": "操作",
                    "attribute": [
                      {
                        "id": 31,
                        "title": "单行输入",
                        "type": "TextInput",
                        "value": null,
                        "props": {
                          "suffix": null,
                          "abstract": true,
                          "required": false,
                          "enableScan": false,
                          "enablePrint": true
                        },
                        "key": "dan_hang_shu_ru",
                        "attribute_type": "single",
                        "multiple": false,
                        "description": "",
                        "rowKey": "31/0dz1rnez"
                      },
                      {
                        "id": 32,
                        "title": "团材料",
                        "type": "SelectMaterial",
                        "value": null,
                        "props": {
                          "http": {},
                          "fixed": true,
                          "hidden": false,
                          "suffix": null,
                          "options": [
                            {
                              "group": "物料202501061405",
                              "children": [
                                {
                                  "value": "2c8fc50f-fa87-4423-baba-06be739b8d07",
                                  "label": "测试11/111"
                                },
                                {
                                  "value": "aaa82945-a49e-49a7-bf3d-0119f5063ae4",
                                  "label": "测试标题模版/SN-2222222222"
                                },
                                {
                                  "value": "f066fd92-d037-4386-9383-69af99785dda",
                                  "label": "测试222/测试2222"
                                },
                                {
                                  "value": "1b7ae135-3075-4795-9014-41866959b111",
                                  "label": "测试/测试"
                                }
                              ]
                            }
                          ],
                          "abstract": false,
                          "dictType": null,
                          "multiple": true,
                          "readOnly": false,
                          "required": false,
                          "expanding": false,
                          "validation": null,
                          "enablePrint": true
                        },
                        "key": "tuan_cai_liao",
                        "attribute_type": "single",
                        "multiple": false,
                        "rowKey": "32/o6hjj6w5",
                        "description": ""
                      },
                      {
                        "id": 33,
                        "title": "单选",
                        "type": "SelectInputRadio",
                        "value": null,
                        "props": {
                          "suffix": null,
                          "options": [
                            "选项1",
                            "选项2"
                          ],
                          "abstract": false,
                          "required": false,
                          "expanding": false,
                          "enablePrint": true
                        },
                        "key": "dan_xuan",
                        "attribute_type": "single",
                        "multiple": false,
                        "description": "",
                        "rowKey": "33/3e4tgqfp"
                      },
                      {
                        "id": 34,
                        "title": "主角儿组合",
                        "type": "FieldsGroup",
                        "value": null,
                        "props": {
                          "size": 8,
                          "items": [
                            {
                              "id": 31,
                              "key": "dan_hang_shu_ru",
                              "type": "TextInput",
                              "unit": null,
                              "props": {
                                "suffix": null,
                                "abstract": true,
                                "required": false,
                                "enableScan": false,
                                "enablePrint": true
                              },
                              "title": "单行输入",
                              "value": null,
                              "multiple": false,
                              "attribute_type": "single",
                              "description": "",
                              "rowKey": "31/axtc428b"
                            },
                            {
                              "id": 32,
                              "key": "tuan_cai_liao",
                              "type": "SelectMaterial",
                              "unit": null,
                              "props": {
                                "http": {},
                                "fixed": true,
                                "hidden": false,
                                "suffix": null,
                                "options": [
                                  {
                                    "group": "物料202501061405",
                                    "children": [
                                      {
                                        "value": "2c8fc50f-fa87-4423-baba-06be739b8d07",
                                        "label": "测试11/111"
                                      },
                                      {
                                        "value": "aaa82945-a49e-49a7-bf3d-0119f5063ae4",
                                        "label": "测试标题模版/SN-2222222222"
                                      },
                                      {
                                        "value": "f066fd92-d037-4386-9383-69af99785dda",
                                        "label": "测试222/测试2222"
                                      },
                                      {
                                        "value": "1b7ae135-3075-4795-9014-41866959b111",
                                        "label": "测试/测试"
                                      }
                                    ]
                                  }
                                ],
                                "abstract": false,
                                "dictType": null,
                                "multiple": true,
                                "readOnly": false,
                                "required": false,
                                "expanding": false,
                                "validation": null,
                                "enablePrint": true
                              },
                              "title": "团材料",
                              "value": null,
                              "multiple": false,
                              "attribute_type": "single",
                              "rowKey": "32/ckhbeyvi",
                              "description": ""
                            },
                            {
                              "id": 33,
                              "key": "dan_xuan",
                              "type": "SelectInputRadio",
                              "unit": null,
                              "props": {
                                "suffix": null,
                                "options": [
                                  "选项1",
                                  "选项2"
                                ],
                                "abstract": false,
                                "required": false,
                                "expanding": false,
                                "enablePrint": true
                              },
                              "title": "单选",
                              "value": null,
                              "multiple": false,
                              "attribute_type": "single",
                              "description": "",
                              "rowKey": "33/udfeg3fl"
                            }
                          ],
                          "abstract": false,
                          "required": false,
                          "direction": "horizontal",
                          "expanding": false,
                          "enablePrint": true
                        },
                        "key": "zhu_jiao_er_zu_he",
                        "attribute_type": "single",
                        "multiple": false,
                        "rowKey": "34/3nup2cvl",
                        "description": ""
                      }
                    ],
                    "rowKey": "2/s33v0ro2",
                    "key": "2/s33v0ro2",
                    "title": "测试模块2",
                    "operateType": "操作"
                  },
                  {
                    "id": 3,
                    "name": "工艺模块",
                    "description": "测试",
                    "type": "物料",
                    "attribute": [
                      {
                        "id": 31,
                        "title": "单行输入",
                        "type": "TextInput",
                        "value": null,
                        "props": {
                          "suffix": null,
                          "abstract": true,
                          "required": false,
                          "enableScan": false,
                          "enablePrint": true
                        },
                        "key": "dan_hang_shu_ru",
                        "attribute_type": "single",
                        "multiple": false,
                        "description": "",
                        "rowKey": "31/v332k4nk"
                      },
                      {
                        "id": 33,
                        "title": "单选",
                        "type": "SelectInputRadio",
                        "value": null,
                        "props": {
                          "suffix": null,
                          "options": [
                            "选项1",
                            "选项2"
                          ],
                          "abstract": false,
                          "required": false,
                          "expanding": false,
                          "enablePrint": true
                        },
                        "key": "dan_xuan",
                        "attribute_type": "single",
                        "multiple": false,
                        "description": "",
                        "rowKey": "33/b9jjngyr"
                      }
                    ],
                    "rowKey": "3/68jojvto",
                    "key": "3/68jojvto",
                    "title": "工艺模块",
                    "operateType": "物料"
                  },
                  {
                    "id": 6,
                    "name": "测试",
                    "description": "111",
                    "type": "操作",
                    "attribute": [
                      {
                        "id": 31,
                        "title": "单行输入",
                        "type": "TextInput",
                        "value": null,
                        "props": {
                          "suffix": null,
                          "abstract": true,
                          "required": false,
                          "enableScan": false,
                          "enablePrint": true
                        },
                        "key": "dan_hang_shu_ru",
                        "attribute_type": "single",
                        "multiple": false,
                        "description": "",
                        "rowKey": "31/n2i1xpu3"
                      },
                      {
                        "id": 32,
                        "title": "团材料",
                        "type": "SelectMaterial",
                        "value": null,
                        "props": {
                          "http": {},
                          "fixed": true,
                          "hidden": false,
                          "suffix": null,
                          "options": [
                            {
                              "group": "物料202501061405",
                              "children": [
                                {
                                  "value": "2c8fc50f-fa87-4423-baba-06be739b8d07",
                                  "label": "测试11/111"
                                },
                                {
                                  "value": "aaa82945-a49e-49a7-bf3d-0119f5063ae4",
                                  "label": "测试标题模版/SN-2222222222"
                                },
                                {
                                  "value": "f066fd92-d037-4386-9383-69af99785dda",
                                  "label": "测试222/测试2222"
                                },
                                {
                                  "value": "1b7ae135-3075-4795-9014-41866959b111",
                                  "label": "测试/测试"
                                }
                              ]
                            }
                          ],
                          "abstract": false,
                          "dictType": null,
                          "multiple": true,
                          "readOnly": false,
                          "required": false,
                          "expanding": false,
                          "validation": null,
                          "enablePrint": true
                        },
                        "key": "tuan_cai_liao",
                        "attribute_type": "single",
                        "multiple": false,
                        "rowKey": "32/rxq6rfnc",
                        "description": ""
                      },
                      {
                        "id": 33,
                        "title": "单选",
                        "type": "SelectInputRadio",
                        "value": null,
                        "props": {
                          "suffix": null,
                          "options": [
                            "选项1",
                            "选项2"
                          ],
                          "abstract": false,
                          "required": false,
                          "expanding": false,
                          "enablePrint": true
                        },
                        "key": "dan_xuan",
                        "attribute_type": "single",
                        "multiple": false,
                        "description": "",
                        "rowKey": "33/ygdv0vs9"
                      }
                    ],
                    "rowKey": "6/gruciaqk",
                    "key": "6/gruciaqk",
                    "title": "测试",
                    "operateType": "操作"
                  }
                ],
                "formData": {
                  "description": "",
                  "2/s33v0ro2": {
                    "dan_hang_shu_ru": "",
                    "tuan_cai_liao": [],
                    "dan_xuan": "",
                    "zhu_jiao_er_zu_he": {
                      "dan_hang_shu_ru": "",
                      "tuan_cai_liao": [],
                      "dan_xuan": ""
                    }
                  },
                  "3/68jojvto": {
                    "dan_hang_shu_ru": "",
                    "dan_xuan": ""
                  },
                  "6/gruciaqk": {
                    "dan_hang_shu_ru": "",
                    "tuan_cai_liao": [],
                    "dan_xuan": ""
                  }
                }
              }
            }
          ],
          "title": "工艺202501061411"
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
          "margin": {},
          "textAlign": "left",
          "lineHeight": 1.5
        }
      },
      {
        "type": "test_record_table",
        "attrs": {
          "id": "eb56aceb-446f-487a-b45c-fb920e92f36d",
          "updateTime": "2025-01-06 15:44:33",
          "key": "test_record_table20250106154324",
          "name": "0c8fcd43-1ea0-4a3a-9a12-7e33b4fb082e",
          "isChanged": false,
          "customerParams": {},
          "group": "",
          "table_data": [
            {
              "id": "8e4846eb-ed8d-4e4f-8061-7b749f5629ab",
              "procedure_rowKey": "ef124a56-3391-44e1-ba10-d163a7248b6b/7ptrqvg0",
              "operate_rowKey": "3/dg672stv",
              "operateType": "物料",
              "formData": {
                "dan_hang_shu_ru": "hgfhdfhgf",
                "dan_xuan": "选项1"
              },
              "formItems": {
                "id": 3,
                "name": "工艺模块",
                "description": "测试",
                "type": "物料",
                "attribute": [
                  {
                    "id": 31,
                    "title": "单行输入",
                    "type": "TextInput",
                    "value": null,
                    "props": {
                      "suffix": null,
                      "abstract": true,
                      "required": false,
                      "enableScan": false,
                      "enablePrint": true
                    },
                    "key": "dan_hang_shu_ru",
                    "attribute_type": "single",
                    "multiple": false,
                    "description": "",
                    "rowKey": "31/pz9wtec1"
                  },
                  {
                    "id": 33,
                    "title": "单选",
                    "type": "SelectInputRadio",
                    "value": null,
                    "props": {
                      "suffix": null,
                      "options": [
                        "选项1",
                        "选项2"
                      ],
                      "abstract": false,
                      "required": false,
                      "expanding": false,
                      "enablePrint": true
                    },
                    "key": "dan_xuan",
                    "attribute_type": "single",
                    "multiple": false,
                    "description": "",
                    "rowKey": "33/cgevme5w"
                  }
                ],
                "rowKey": "3/dg672stv",
                "key": "3/dg672stv",
                "title": "工艺模块",
                "operateType": "物料"
              },
              "description": "测试",
              "procedure": {
                "id": "ef124a56-3391-44e1-ba10-d163a7248b6b",
                "title": "111",
                "key": "ef124a56-3391-44e1-ba10-d163a7248b6b",
                "rowKey": "ef124a56-3391-44e1-ba10-d163a7248b6b/7ptrqvg0"
              },
              "is_sample": false,
              "sample": {},
              "operate_router": {
                "id": 3,
                "title": "工艺模块",
                "key": "3/dg672stv",
                "rowKey": "3/dg672stv"
              }
            },
            {
              "id": "0d43b6d1-e34d-49bf-ab1d-f31f45a92ba7",
              "procedure_rowKey": "ef124a56-3391-44e1-ba10-d163a7248b6b/7ptrqvg0",
              "operate_rowKey": "过程描述jllvwix3",
              "operateType": "过程描述",
              "formData": {},
              "formItems": {
                "title": "过程描述"
              },
              "procedure": {
                "id": "ef124a56-3391-44e1-ba10-d163a7248b6b",
                "title": "111",
                "key": "ef124a56-3391-44e1-ba10-d163a7248b6b",
                "rowKey": "ef124a56-3391-44e1-ba10-d163a7248b6b/7ptrqvg0"
              },
              "is_sample": false,
              "sample": {},
              "operate_router": {
                "title": "过程描述"
              }
            },
            {
              "id": "312d4e01-7c92-4b47-b10d-e3fa0c47f261",
              "procedure_rowKey": "74124df7-34a0-49fe-9e7d-07f05f27080a/ynomysil",
              "operate_rowKey": "6/6lset9lt",
              "operateType": "操作",
              "formData": {
                "dan_hang_shu_ru": "dfhgh",
                "tuan_cai_liao": [
                  "2c8fc50f-fa87-4423-baba-06be739b8d07"
                ],
                "dan_xuan": "选项2"
              },
              "formItems": {
                "id": 6,
                "name": "测试",
                "description": "111",
                "type": "操作",
                "attribute": [
                  {
                    "id": 31,
                    "title": "单行输入",
                    "type": "TextInput",
                    "value": null,
                    "props": {
                      "suffix": null,
                      "abstract": true,
                      "required": false,
                      "enableScan": false,
                      "enablePrint": true
                    },
                    "key": "dan_hang_shu_ru",
                    "attribute_type": "single",
                    "multiple": false,
                    "description": "",
                    "rowKey": "31/o1sg5dll"
                  },
                  {
                    "id": 32,
                    "title": "团材料",
                    "type": "SelectMaterial",
                    "value": null,
                    "props": {
                      "http": {},
                      "fixed": true,
                      "hidden": false,
                      "suffix": null,
                      "options": [
                        {
                          "group": "物料202501061405",
                          "children": [
                            {
                              "value": "2c8fc50f-fa87-4423-baba-06be739b8d07",
                              "label": "测试11/111"
                            },
                            {
                              "value": "aaa82945-a49e-49a7-bf3d-0119f5063ae4",
                              "label": "测试标题模版/SN-2222222222"
                            },
                            {
                              "value": "f066fd92-d037-4386-9383-69af99785dda",
                              "label": "测试222/测试2222"
                            },
                            {
                              "value": "1b7ae135-3075-4795-9014-41866959b111",
                              "label": "测试/测试"
                            }
                          ]
                        }
                      ],
                      "abstract": false,
                      "dictType": null,
                      "multiple": true,
                      "readOnly": false,
                      "required": false,
                      "expanding": false,
                      "validation": null,
                      "enablePrint": true
                    },
                    "key": "tuan_cai_liao",
                    "attribute_type": "single",
                    "multiple": false,
                    "rowKey": "32/53wls6e7",
                    "description": ""
                  },
                  {
                    "id": 33,
                    "title": "单选",
                    "type": "SelectInputRadio",
                    "value": null,
                    "props": {
                      "suffix": null,
                      "options": [
                        "选项1",
                        "选项2"
                      ],
                      "abstract": false,
                      "required": false,
                      "expanding": false,
                      "enablePrint": true
                    },
                    "key": "dan_xuan",
                    "attribute_type": "single",
                    "multiple": false,
                    "description": "",
                    "rowKey": "33/6a0rwrlj"
                  }
                ],
                "rowKey": "6/6lset9lt",
                "key": "6/6lset9lt",
                "title": "测试",
                "operateType": "操作"
              },
              "description": "111",
              "procedure": {
                "id": "74124df7-34a0-49fe-9e7d-07f05f27080a",
                "title": "测试22",
                "key": "74124df7-34a0-49fe-9e7d-07f05f27080a",
                "rowKey": "74124df7-34a0-49fe-9e7d-07f05f27080a/ynomysil"
              },
              "is_sample": false,
              "sample": {},
              "operate_router": {
                "id": 6,
                "title": "测试",
                "key": "6/6lset9lt",
                "rowKey": "6/6lset9lt"
              }
            },
            {
              "id": "5824f937-c5b1-4e53-b24b-fcd8e4d76803",
              "procedure_rowKey": "74124df7-34a0-49fe-9e7d-07f05f27080a/ynomysil",
              "operate_rowKey": "过程描述o0thirbp",
              "operateType": "过程描述",
              "formData": {},
              "formItems": {
                "title": "过程描述"
              },
              "procedure": {
                "id": "74124df7-34a0-49fe-9e7d-07f05f27080a",
                "title": "测试22",
                "key": "74124df7-34a0-49fe-9e7d-07f05f27080a",
                "rowKey": "74124df7-34a0-49fe-9e7d-07f05f27080a/ynomysil"
              },
              "is_sample": false,
              "sample": {},
              "operate_router": {
                "title": "过程描述"
              }
            },
            {
              "id": "2ac628fa-79b0-42a8-b246-578c49f2fcb3",
              "procedure_rowKey": "acbc22e4-8c6d-4412-8e5e-7edc855e1510/3ds3qb3g",
              "operate_rowKey": "3/68jojvto",
              "operateType": "物料",
              "formData": {
                "dan_hang_shu_ru": "hdfhgf",
                "dan_xuan": "选项1"
              },
              "formItems": {
                "id": 3,
                "name": "工艺模块",
                "description": "测试",
                "type": "物料",
                "attribute": [
                  {
                    "id": 31,
                    "title": "单行输入",
                    "type": "TextInput",
                    "value": null,
                    "props": {
                      "suffix": null,
                      "abstract": true,
                      "required": false,
                      "enableScan": false,
                      "enablePrint": true
                    },
                    "key": "dan_hang_shu_ru",
                    "attribute_type": "single",
                    "multiple": false,
                    "description": "",
                    "rowKey": "31/v332k4nk"
                  },
                  {
                    "id": 33,
                    "title": "单选",
                    "type": "SelectInputRadio",
                    "value": null,
                    "props": {
                      "suffix": null,
                      "options": [
                        "选项1",
                        "选项2"
                      ],
                      "abstract": false,
                      "required": false,
                      "expanding": false,
                      "enablePrint": true
                    },
                    "key": "dan_xuan",
                    "attribute_type": "single",
                    "multiple": false,
                    "description": "",
                    "rowKey": "33/b9jjngyr"
                  }
                ],
                "rowKey": "3/68jojvto",
                "key": "3/68jojvto",
                "title": "工艺模块",
                "operateType": "物料"
              },
              "description": "测试",
              "procedure": {
                "id": "acbc22e4-8c6d-4412-8e5e-7edc855e1510",
                "title": "测试11",
                "key": "acbc22e4-8c6d-4412-8e5e-7edc855e1510",
                "rowKey": "acbc22e4-8c6d-4412-8e5e-7edc855e1510/3ds3qb3g"
              },
              "is_sample": false,
              "sample": {},
              "operate_router": {
                "id": 3,
                "title": "工艺模块",
                "key": "3/68jojvto",
                "rowKey": "3/68jojvto"
              }
            },
            {
              "id": "33619c70-f6cd-4e3b-8f18-f78169754b24",
              "procedure_rowKey": "acbc22e4-8c6d-4412-8e5e-7edc855e1510/3ds3qb3g",
              "operate_rowKey": "3/68jojvto",
              "operateType": "样品",
              "formData": {},
              "formItems": [
                {
                  "id": "8e4846eb-ed8d-4e4f-8061-7b749f5629ab",
                  "procedure_rowKey": "ef124a56-3391-44e1-ba10-d163a7248b6b/7ptrqvg0",
                  "operate_rowKey": "3/dg672stv",
                  "operateType": "物料",
                  "formData": {
                    "dan_hang_shu_ru": "hgfhdfhgf",
                    "dan_xuan": "选项1"
                  },
                  "formItems": {
                    "id": 3,
                    "name": "工艺模块",
                    "description": "测试",
                    "type": "物料",
                    "attribute": [
                      {
                        "id": 31,
                        "title": "单行输入",
                        "type": "TextInput",
                        "value": null,
                        "props": {
                          "suffix": null,
                          "abstract": true,
                          "required": false,
                          "enableScan": false,
                          "enablePrint": true
                        },
                        "key": "dan_hang_shu_ru",
                        "attribute_type": "single",
                        "multiple": false,
                        "description": "",
                        "rowKey": "31/pz9wtec1"
                      },
                      {
                        "id": 33,
                        "title": "单选",
                        "type": "SelectInputRadio",
                        "value": null,
                        "props": {
                          "suffix": null,
                          "options": [
                            "选项1",
                            "选项2"
                          ],
                          "abstract": false,
                          "required": false,
                          "expanding": false,
                          "enablePrint": true
                        },
                        "key": "dan_xuan",
                        "attribute_type": "single",
                        "multiple": false,
                        "description": "",
                        "rowKey": "33/cgevme5w"
                      }
                    ],
                    "rowKey": "3/dg672stv",
                    "key": "3/dg672stv",
                    "title": "工艺模块",
                    "operateType": "物料"
                  },
                  "description": "测试",
                  "procedure": {
                    "id": "ef124a56-3391-44e1-ba10-d163a7248b6b",
                    "title": "111",
                    "key": "ef124a56-3391-44e1-ba10-d163a7248b6b",
                    "rowKey": "ef124a56-3391-44e1-ba10-d163a7248b6b/7ptrqvg0"
                  },
                  "is_sample": false,
                  "sample": {},
                  "operate_router": {
                    "id": 3,
                    "title": "工艺模块",
                    "key": "3/dg672stv",
                    "rowKey": "3/dg672stv"
                  }
                },
                {
                  "id": "0d43b6d1-e34d-49bf-ab1d-f31f45a92ba7",
                  "procedure_rowKey": "ef124a56-3391-44e1-ba10-d163a7248b6b/7ptrqvg0",
                  "operate_rowKey": "过程描述jllvwix3",
                  "operateType": "过程描述",
                  "formData": {},
                  "formItems": {
                    "title": "过程描述"
                  },
                  "procedure": {
                    "id": "ef124a56-3391-44e1-ba10-d163a7248b6b",
                    "title": "111",
                    "key": "ef124a56-3391-44e1-ba10-d163a7248b6b",
                    "rowKey": "ef124a56-3391-44e1-ba10-d163a7248b6b/7ptrqvg0"
                  },
                  "is_sample": false,
                  "sample": {},
                  "operate_router": {
                    "title": "过程描述"
                  }
                },
                {
                  "id": "312d4e01-7c92-4b47-b10d-e3fa0c47f261",
                  "procedure_rowKey": "74124df7-34a0-49fe-9e7d-07f05f27080a/ynomysil",
                  "operate_rowKey": "6/6lset9lt",
                  "operateType": "操作",
                  "formData": {
                    "dan_hang_shu_ru": "dfhgh",
                    "tuan_cai_liao": [
                      "2c8fc50f-fa87-4423-baba-06be739b8d07"
                    ],
                    "dan_xuan": "选项2"
                  },
                  "formItems": {
                    "id": 6,
                    "name": "测试",
                    "description": "111",
                    "type": "操作",
                    "attribute": [
                      {
                        "id": 31,
                        "title": "单行输入",
                        "type": "TextInput",
                        "value": null,
                        "props": {
                          "suffix": null,
                          "abstract": true,
                          "required": false,
                          "enableScan": false,
                          "enablePrint": true
                        },
                        "key": "dan_hang_shu_ru",
                        "attribute_type": "single",
                        "multiple": false,
                        "description": "",
                        "rowKey": "31/o1sg5dll"
                      },
                      {
                        "id": 32,
                        "title": "团材料",
                        "type": "SelectMaterial",
                        "value": null,
                        "props": {
                          "http": {},
                          "fixed": true,
                          "hidden": false,
                          "suffix": null,
                          "options": [
                            {
                              "group": "物料202501061405",
                              "children": [
                                {
                                  "value": "2c8fc50f-fa87-4423-baba-06be739b8d07",
                                  "label": "测试11/111"
                                },
                                {
                                  "value": "aaa82945-a49e-49a7-bf3d-0119f5063ae4",
                                  "label": "测试标题模版/SN-2222222222"
                                },
                                {
                                  "value": "f066fd92-d037-4386-9383-69af99785dda",
                                  "label": "测试222/测试2222"
                                },
                                {
                                  "value": "1b7ae135-3075-4795-9014-41866959b111",
                                  "label": "测试/测试"
                                }
                              ]
                            }
                          ],
                          "abstract": false,
                          "dictType": null,
                          "multiple": true,
                          "readOnly": false,
                          "required": false,
                          "expanding": false,
                          "validation": null,
                          "enablePrint": true
                        },
                        "key": "tuan_cai_liao",
                        "attribute_type": "single",
                        "multiple": false,
                        "rowKey": "32/53wls6e7",
                        "description": ""
                      },
                      {
                        "id": 33,
                        "title": "单选",
                        "type": "SelectInputRadio",
                        "value": null,
                        "props": {
                          "suffix": null,
                          "options": [
                            "选项1",
                            "选项2"
                          ],
                          "abstract": false,
                          "required": false,
                          "expanding": false,
                          "enablePrint": true
                        },
                        "key": "dan_xuan",
                        "attribute_type": "single",
                        "multiple": false,
                        "description": "",
                        "rowKey": "33/6a0rwrlj"
                      }
                    ],
                    "rowKey": "6/6lset9lt",
                    "key": "6/6lset9lt",
                    "title": "测试",
                    "operateType": "操作"
                  },
                  "description": "111",
                  "procedure": {
                    "id": "74124df7-34a0-49fe-9e7d-07f05f27080a",
                    "title": "测试22",
                    "key": "74124df7-34a0-49fe-9e7d-07f05f27080a",
                    "rowKey": "74124df7-34a0-49fe-9e7d-07f05f27080a/ynomysil"
                  },
                  "is_sample": false,
                  "sample": {},
                  "operate_router": {
                    "id": 6,
                    "title": "测试",
                    "key": "6/6lset9lt",
                    "rowKey": "6/6lset9lt"
                  }
                },
                {
                  "id": "5824f937-c5b1-4e53-b24b-fcd8e4d76803",
                  "procedure_rowKey": "74124df7-34a0-49fe-9e7d-07f05f27080a/ynomysil",
                  "operate_rowKey": "过程描述o0thirbp",
                  "operateType": "过程描述",
                  "formData": {},
                  "formItems": {
                    "title": "过程描述"
                  },
                  "procedure": {
                    "id": "74124df7-34a0-49fe-9e7d-07f05f27080a",
                    "title": "测试22",
                    "key": "74124df7-34a0-49fe-9e7d-07f05f27080a",
                    "rowKey": "74124df7-34a0-49fe-9e7d-07f05f27080a/ynomysil"
                  },
                  "is_sample": false,
                  "sample": {},
                  "operate_router": {
                    "title": "过程描述"
                  }
                },
                {
                  "id": "2ac628fa-79b0-42a8-b246-578c49f2fcb3",
                  "procedure_rowKey": "acbc22e4-8c6d-4412-8e5e-7edc855e1510/3ds3qb3g",
                  "operate_rowKey": "3/68jojvto",
                  "operateType": "物料",
                  "formData": {
                    "dan_hang_shu_ru": "hdfhgf",
                    "dan_xuan": "选项1"
                  },
                  "formItems": {
                    "id": 3,
                    "name": "工艺模块",
                    "description": "测试",
                    "type": "物料",
                    "attribute": [
                      {
                        "id": 31,
                        "title": "单行输入",
                        "type": "TextInput",
                        "value": null,
                        "props": {
                          "suffix": null,
                          "abstract": true,
                          "required": false,
                          "enableScan": false,
                          "enablePrint": true
                        },
                        "key": "dan_hang_shu_ru",
                        "attribute_type": "single",
                        "multiple": false,
                        "description": "",
                        "rowKey": "31/v332k4nk"
                      },
                      {
                        "id": 33,
                        "title": "单选",
                        "type": "SelectInputRadio",
                        "value": null,
                        "props": {
                          "suffix": null,
                          "options": [
                            "选项1",
                            "选项2"
                          ],
                          "abstract": false,
                          "required": false,
                          "expanding": false,
                          "enablePrint": true
                        },
                        "key": "dan_xuan",
                        "attribute_type": "single",
                        "multiple": false,
                        "description": "",
                        "rowKey": "33/b9jjngyr"
                      }
                    ],
                    "rowKey": "3/68jojvto",
                    "key": "3/68jojvto",
                    "title": "工艺模块",
                    "operateType": "物料"
                  },
                  "description": "测试",
                  "procedure": {
                    "id": "acbc22e4-8c6d-4412-8e5e-7edc855e1510",
                    "title": "测试11",
                    "key": "acbc22e4-8c6d-4412-8e5e-7edc855e1510",
                    "rowKey": "acbc22e4-8c6d-4412-8e5e-7edc855e1510/3ds3qb3g"
                  },
                  "is_sample": false,
                  "sample": {},
                  "operate_router": {
                    "id": 3,
                    "title": "工艺模块",
                    "key": "3/68jojvto",
                    "rowKey": "3/68jojvto"
                  }
                }
              ],
              "description": "",
              "procedure": {
                "id": "acbc22e4-8c6d-4412-8e5e-7edc855e1510",
                "title": "测试11",
                "key": "acbc22e4-8c6d-4412-8e5e-7edc855e1510",
                "rowKey": "acbc22e4-8c6d-4412-8e5e-7edc855e1510/3ds3qb3g"
              },
              "is_sample": true,
              "operate_router": {
                "title": "样品检测"
              },
              "sample": {
                "id": "551d7a49-ce82-4929-a7de-69e1e7166271",
                "name": "样品-2025010615445l",
                "sn": "SF-202501061544v0",
                "weight": 1,
                "record_table": {
                  "id": "2b23c70d-7ec0-4d13-af7d-a90c93fccbaa",
                  "title": "测试nvgskk2j",
                  "table_data": [
                    {
                      "id": "b7966c4b-c789-48f9-aa8d-db1e92409d14",
                      "index_type": {
                        "id": 18,
                        "title": "LAB_L",
                        "props": {
                          "suffix": "%",
                          "abstract": false,
                          "required": false,
                          "precision": null,
                          "enablePrint": true
                        },
                        "key": "lab_l",
                        "type": "NumberInput",
                        "value": null,
                        "unit": null,
                        "attribute_type": "single"
                      },
                      "time": "2025-01-06 15:44:51",
                      "data": "45",
                      "description": "45545445"
                    },
                    {
                      "id": "ccab36a2-e434-4b91-9ab8-76b4227c3a02",
                      "index_type": {
                        "id": 19,
                        "title": "LAB_A",
                        "props": {
                          "suffix": "%",
                          "abstract": false,
                          "required": false,
                          "precision": null,
                          "enablePrint": true
                        },
                        "key": "lab_a",
                        "type": "NumberInput",
                        "value": null,
                        "unit": null,
                        "attribute_type": "single"
                      },
                      "time": "2025-01-06 15:44:51",
                      "data": "45",
                      "description": "4343543534"
                    },
                    {
                      "id": "a030c415-a711-43e0-ad4e-52f542cf5339",
                      "index_type": {
                        "id": 20,
                        "title": "LAB_B",
                        "props": {
                          "suffix": "%",
                          "abstract": false,
                          "required": false,
                          "precision": null,
                          "enablePrint": true
                        },
                        "key": "lab_b",
                        "type": "NumberInput",
                        "value": null,
                        "unit": null,
                        "attribute_type": "single"
                      },
                      "time": "2025-01-06 15:44:51",
                      "data": "34",
                      "description": "543543543534"
                    }
                  ],
                  "columns": [
                    {
                      "title": "操作栏",
                      "colKey": "operate",
                      "width": 150,
                      "cell": "type-slot-operate"
                    }
                  ],
                  "params": {}
                },
                "description": "",
                "really_sample": false
              }
            },
            {
              "id": "12419af6-e3aa-4a2f-8dd2-ec671a696787",
              "procedure_rowKey": "acbc22e4-8c6d-4412-8e5e-7edc855e1510/3ds3qb3g",
              "operate_rowKey": "6/gruciaqk",
              "operateType": "操作",
              "formData": {
                "dan_hang_shu_ru": "hgdfhgf",
                "tuan_cai_liao": [
                  "aaa82945-a49e-49a7-bf3d-0119f5063ae4"
                ],
                "dan_xuan": "选项2"
              },
              "formItems": {
                "id": 6,
                "name": "测试",
                "description": "111",
                "type": "操作",
                "attribute": [
                  {
                    "id": 31,
                    "title": "单行输入",
                    "type": "TextInput",
                    "value": null,
                    "props": {
                      "suffix": null,
                      "abstract": true,
                      "required": false,
                      "enableScan": false,
                      "enablePrint": true
                    },
                    "key": "dan_hang_shu_ru",
                    "attribute_type": "single",
                    "multiple": false,
                    "description": "",
                    "rowKey": "31/n2i1xpu3"
                  },
                  {
                    "id": 32,
                    "title": "团材料",
                    "type": "SelectMaterial",
                    "value": null,
                    "props": {
                      "http": {},
                      "fixed": true,
                      "hidden": false,
                      "suffix": null,
                      "options": [
                        {
                          "group": "物料202501061405",
                          "children": [
                            {
                              "value": "2c8fc50f-fa87-4423-baba-06be739b8d07",
                              "label": "测试11/111"
                            },
                            {
                              "value": "aaa82945-a49e-49a7-bf3d-0119f5063ae4",
                              "label": "测试标题模版/SN-2222222222"
                            },
                            {
                              "value": "f066fd92-d037-4386-9383-69af99785dda",
                              "label": "测试222/测试2222"
                            },
                            {
                              "value": "1b7ae135-3075-4795-9014-41866959b111",
                              "label": "测试/测试"
                            }
                          ]
                        }
                      ],
                      "abstract": false,
                      "dictType": null,
                      "multiple": true,
                      "readOnly": false,
                      "required": false,
                      "expanding": false,
                      "validation": null,
                      "enablePrint": true
                    },
                    "key": "tuan_cai_liao",
                    "attribute_type": "single",
                    "multiple": false,
                    "rowKey": "32/rxq6rfnc",
                    "description": ""
                  },
                  {
                    "id": 33,
                    "title": "单选",
                    "type": "SelectInputRadio",
                    "value": null,
                    "props": {
                      "suffix": null,
                      "options": [
                        "选项1",
                        "选项2"
                      ],
                      "abstract": false,
                      "required": false,
                      "expanding": false,
                      "enablePrint": true
                    },
                    "key": "dan_xuan",
                    "attribute_type": "single",
                    "multiple": false,
                    "description": "",
                    "rowKey": "33/ygdv0vs9"
                  }
                ],
                "rowKey": "6/gruciaqk",
                "key": "6/gruciaqk",
                "title": "测试",
                "operateType": "操作"
              },
              "description": "111",
              "procedure": {
                "id": "acbc22e4-8c6d-4412-8e5e-7edc855e1510",
                "title": "测试11",
                "key": "acbc22e4-8c6d-4412-8e5e-7edc855e1510",
                "rowKey": "acbc22e4-8c6d-4412-8e5e-7edc855e1510/3ds3qb3g"
              },
              "is_sample": false,
              "sample": {},
              "operate_router": {
                "id": 6,
                "title": "测试",
                "key": "6/gruciaqk",
                "rowKey": "6/gruciaqk"
              }
            },
            {
              "id": "2ad5b62f-3cf9-4419-b055-f0a70c426cf2",
              "procedure_rowKey": "acbc22e4-8c6d-4412-8e5e-7edc855e1510/3ds3qb3g",
              "operate_rowKey": "过程描述bno3j6gc",
              "operateType": "过程描述",
              "formData": {},
              "formItems": {
                "title": "过程描述"
              },
              "description": "543543543",
              "procedure": {
                "id": "acbc22e4-8c6d-4412-8e5e-7edc855e1510",
                "title": "测试11",
                "key": "acbc22e4-8c6d-4412-8e5e-7edc855e1510",
                "rowKey": "acbc22e4-8c6d-4412-8e5e-7edc855e1510/3ds3qb3g"
              },
              "is_sample": false,
              "sample": {},
              "operate_router": {
                "title": "过程描述"
              }
            }
          ],
          "designParams": {
            "formItems": [
              {
                "formItems": [
                  {
                    "id": 2,
                    "name": "测试模块2",
                    "description": "测试22",
                    "type": "操作",
                    "attribute": [
                      {
                        "id": 31,
                        "title": "单行输入",
                        "type": "TextInput",
                        "value": null,
                        "props": {
                          "suffix": null,
                          "abstract": true,
                          "required": false,
                          "enableScan": false,
                          "enablePrint": true
                        },
                        "key": "dan_hang_shu_ru",
                        "attribute_type": "single",
                        "multiple": false,
                        "description": "",
                        "rowKey": "31/650rbgbf"
                      },
                      {
                        "id": 32,
                        "title": "团材料",
                        "type": "SelectMaterial",
                        "value": null,
                        "props": {
                          "http": {},
                          "fixed": true,
                          "hidden": false,
                          "suffix": null,
                          "options": [
                            {
                              "group": "物料202501061405",
                              "children": [
                                {
                                  "value": "2c8fc50f-fa87-4423-baba-06be739b8d07",
                                  "label": "测试11/111"
                                },
                                {
                                  "value": "aaa82945-a49e-49a7-bf3d-0119f5063ae4",
                                  "label": "测试标题模版/SN-2222222222"
                                },
                                {
                                  "value": "f066fd92-d037-4386-9383-69af99785dda",
                                  "label": "测试222/测试2222"
                                },
                                {
                                  "value": "1b7ae135-3075-4795-9014-41866959b111",
                                  "label": "测试/测试"
                                }
                              ]
                            }
                          ],
                          "abstract": false,
                          "dictType": null,
                          "multiple": true,
                          "readOnly": false,
                          "required": false,
                          "expanding": false,
                          "validation": null,
                          "enablePrint": true
                        },
                        "key": "tuan_cai_liao",
                        "attribute_type": "single",
                        "multiple": false,
                        "rowKey": "32/bbl4hkgp",
                        "description": ""
                      },
                      {
                        "id": 33,
                        "title": "单选",
                        "type": "SelectInputRadio",
                        "value": null,
                        "props": {
                          "suffix": null,
                          "options": [
                            "选项1",
                            "选项2"
                          ],
                          "abstract": false,
                          "required": false,
                          "expanding": false,
                          "enablePrint": true
                        },
                        "key": "dan_xuan",
                        "attribute_type": "single",
                        "multiple": false,
                        "description": "",
                        "rowKey": "33/q4zp85nc"
                      },
                      {
                        "id": 34,
                        "title": "主角儿组合",
                        "type": "FieldsGroup",
                        "value": null,
                        "props": {
                          "size": 8,
                          "items": [
                            {
                              "id": 31,
                              "key": "dan_hang_shu_ru",
                              "type": "TextInput",
                              "unit": null,
                              "props": {
                                "suffix": null,
                                "abstract": true,
                                "required": false,
                                "enableScan": false,
                                "enablePrint": true
                              },
                              "title": "单行输入",
                              "value": null,
                              "multiple": false,
                              "attribute_type": "single",
                              "description": "",
                              "rowKey": "31/z9qsvicu"
                            },
                            {
                              "id": 32,
                              "key": "tuan_cai_liao",
                              "type": "SelectMaterial",
                              "unit": null,
                              "props": {
                                "http": {},
                                "fixed": true,
                                "hidden": false,
                                "suffix": null,
                                "options": [
                                  {
                                    "group": "物料202501061405",
                                    "children": [
                                      {
                                        "value": "2c8fc50f-fa87-4423-baba-06be739b8d07",
                                        "label": "测试11/111"
                                      },
                                      {
                                        "value": "aaa82945-a49e-49a7-bf3d-0119f5063ae4",
                                        "label": "测试标题模版/SN-2222222222"
                                      },
                                      {
                                        "value": "f066fd92-d037-4386-9383-69af99785dda",
                                        "label": "测试222/测试2222"
                                      },
                                      {
                                        "value": "1b7ae135-3075-4795-9014-41866959b111",
                                        "label": "测试/测试"
                                      }
                                    ]
                                  }
                                ],
                                "abstract": false,
                                "dictType": null,
                                "multiple": true,
                                "readOnly": false,
                                "required": false,
                                "expanding": false,
                                "validation": null,
                                "enablePrint": true
                              },
                              "title": "团材料",
                              "value": null,
                              "multiple": false,
                              "attribute_type": "single",
                              "rowKey": "32/twvvqw33",
                              "description": ""
                            },
                            {
                              "id": 33,
                              "key": "dan_xuan",
                              "type": "SelectInputRadio",
                              "unit": null,
                              "props": {
                                "suffix": null,
                                "options": [
                                  "选项1",
                                  "选项2"
                                ],
                                "abstract": false,
                                "required": false,
                                "expanding": false,
                                "enablePrint": true
                              },
                              "title": "单选",
                              "value": null,
                              "multiple": false,
                              "attribute_type": "single",
                              "description": "",
                              "rowKey": "33/yd76f431"
                            }
                          ],
                          "abstract": false,
                          "required": false,
                          "direction": "horizontal",
                          "expanding": false,
                          "enablePrint": true
                        },
                        "key": "zhu_jiao_er_zu_he",
                        "attribute_type": "single",
                        "multiple": false,
                        "rowKey": "34/133zk0iq",
                        "description": ""
                      }
                    ],
                    "rowKey": "2/6xexe1pe",
                    "key": "2/6xexe1pe",
                    "title": "测试模块2",
                    "operateType": "操作"
                  },
                  {
                    "id": 3,
                    "name": "工艺模块",
                    "description": "测试",
                    "type": "物料",
                    "attribute": [
                      {
                        "id": 31,
                        "title": "单行输入",
                        "type": "TextInput",
                        "value": null,
                        "props": {
                          "suffix": null,
                          "abstract": true,
                          "required": false,
                          "enableScan": false,
                          "enablePrint": true
                        },
                        "key": "dan_hang_shu_ru",
                        "attribute_type": "single",
                        "multiple": false,
                        "description": "",
                        "rowKey": "31/pz9wtec1"
                      },
                      {
                        "id": 33,
                        "title": "单选",
                        "type": "SelectInputRadio",
                        "value": null,
                        "props": {
                          "suffix": null,
                          "options": [
                            "选项1",
                            "选项2"
                          ],
                          "abstract": false,
                          "required": false,
                          "expanding": false,
                          "enablePrint": true
                        },
                        "key": "dan_xuan",
                        "attribute_type": "single",
                        "multiple": false,
                        "description": "",
                        "rowKey": "33/cgevme5w"
                      }
                    ],
                    "rowKey": "3/dg672stv",
                    "key": "3/dg672stv",
                    "title": "工艺模块",
                    "operateType": "物料"
                  }
                ],
                "id": "ef124a56-3391-44e1-ba10-d163a7248b6b",
                "key": "ef124a56-3391-44e1-ba10-d163a7248b6b",
                "rowKey": "ef124a56-3391-44e1-ba10-d163a7248b6b/7ptrqvg0",
                "title": "111",
                "name": "111"
              },
              {
                "formItems": [
                  {
                    "id": 2,
                    "name": "测试模块2",
                    "description": "测试22",
                    "type": "操作",
                    "attribute": [
                      {
                        "id": 31,
                        "title": "单行输入",
                        "type": "TextInput",
                        "value": null,
                        "props": {
                          "suffix": null,
                          "abstract": true,
                          "required": false,
                          "enableScan": false,
                          "enablePrint": true
                        },
                        "key": "dan_hang_shu_ru",
                        "attribute_type": "single",
                        "multiple": false,
                        "description": "",
                        "rowKey": "31/u01atp16"
                      },
                      {
                        "id": 32,
                        "title": "团材料",
                        "type": "SelectMaterial",
                        "value": null,
                        "props": {
                          "http": {},
                          "fixed": true,
                          "hidden": false,
                          "suffix": null,
                          "options": [
                            {
                              "group": "物料202501061405",
                              "children": [
                                {
                                  "value": "2c8fc50f-fa87-4423-baba-06be739b8d07",
                                  "label": "测试11/111"
                                },
                                {
                                  "value": "aaa82945-a49e-49a7-bf3d-0119f5063ae4",
                                  "label": "测试标题模版/SN-2222222222"
                                },
                                {
                                  "value": "f066fd92-d037-4386-9383-69af99785dda",
                                  "label": "测试222/测试2222"
                                },
                                {
                                  "value": "1b7ae135-3075-4795-9014-41866959b111",
                                  "label": "测试/测试"
                                }
                              ]
                            }
                          ],
                          "abstract": false,
                          "dictType": null,
                          "multiple": true,
                          "readOnly": false,
                          "required": false,
                          "expanding": false,
                          "validation": null,
                          "enablePrint": true
                        },
                        "key": "tuan_cai_liao",
                        "attribute_type": "single",
                        "multiple": false,
                        "rowKey": "32/n861ib97",
                        "description": ""
                      },
                      {
                        "id": 33,
                        "title": "单选",
                        "type": "SelectInputRadio",
                        "value": null,
                        "props": {
                          "suffix": null,
                          "options": [
                            "选项1",
                            "选项2"
                          ],
                          "abstract": false,
                          "required": false,
                          "expanding": false,
                          "enablePrint": true
                        },
                        "key": "dan_xuan",
                        "attribute_type": "single",
                        "multiple": false,
                        "description": "",
                        "rowKey": "33/ss69r3kf"
                      },
                      {
                        "id": 34,
                        "title": "主角儿组合",
                        "type": "FieldsGroup",
                        "value": null,
                        "props": {
                          "size": 8,
                          "items": [
                            {
                              "id": 31,
                              "key": "dan_hang_shu_ru",
                              "type": "TextInput",
                              "unit": null,
                              "props": {
                                "suffix": null,
                                "abstract": true,
                                "required": false,
                                "enableScan": false,
                                "enablePrint": true
                              },
                              "title": "单行输入",
                              "value": null,
                              "multiple": false,
                              "attribute_type": "single",
                              "description": "",
                              "rowKey": "31/tjwng3l2"
                            },
                            {
                              "id": 32,
                              "key": "tuan_cai_liao",
                              "type": "SelectMaterial",
                              "unit": null,
                              "props": {
                                "http": {},
                                "fixed": true,
                                "hidden": false,
                                "suffix": null,
                                "options": [
                                  {
                                    "group": "物料202501061405",
                                    "children": [
                                      {
                                        "value": "2c8fc50f-fa87-4423-baba-06be739b8d07",
                                        "label": "测试11/111"
                                      },
                                      {
                                        "value": "aaa82945-a49e-49a7-bf3d-0119f5063ae4",
                                        "label": "测试标题模版/SN-2222222222"
                                      },
                                      {
                                        "value": "f066fd92-d037-4386-9383-69af99785dda",
                                        "label": "测试222/测试2222"
                                      },
                                      {
                                        "value": "1b7ae135-3075-4795-9014-41866959b111",
                                        "label": "测试/测试"
                                      }
                                    ]
                                  }
                                ],
                                "abstract": false,
                                "dictType": null,
                                "multiple": true,
                                "readOnly": false,
                                "required": false,
                                "expanding": false,
                                "validation": null,
                                "enablePrint": true
                              },
                              "title": "团材料",
                              "value": null,
                              "multiple": false,
                              "attribute_type": "single",
                              "rowKey": "32/aopzrdvl",
                              "description": ""
                            },
                            {
                              "id": 33,
                              "key": "dan_xuan",
                              "type": "SelectInputRadio",
                              "unit": null,
                              "props": {
                                "suffix": null,
                                "options": [
                                  "选项1",
                                  "选项2"
                                ],
                                "abstract": false,
                                "required": false,
                                "expanding": false,
                                "enablePrint": true
                              },
                              "title": "单选",
                              "value": null,
                              "multiple": false,
                              "attribute_type": "single",
                              "description": "",
                              "rowKey": "33/1hvyvut6"
                            }
                          ],
                          "abstract": false,
                          "required": false,
                          "direction": "horizontal",
                          "expanding": false,
                          "enablePrint": true
                        },
                        "key": "zhu_jiao_er_zu_he",
                        "attribute_type": "single",
                        "multiple": false,
                        "rowKey": "34/lx3kfrip",
                        "description": ""
                      }
                    ],
                    "rowKey": "2/der9om5s",
                    "key": "2/der9om5s",
                    "title": "测试模块2",
                    "operateType": "操作"
                  },
                  {
                    "id": 6,
                    "name": "测试",
                    "description": "111",
                    "type": "操作",
                    "attribute": [
                      {
                        "id": 31,
                        "title": "单行输入",
                        "type": "TextInput",
                        "value": null,
                        "props": {
                          "suffix": null,
                          "abstract": true,
                          "required": false,
                          "enableScan": false,
                          "enablePrint": true
                        },
                        "key": "dan_hang_shu_ru",
                        "attribute_type": "single",
                        "multiple": false,
                        "description": "",
                        "rowKey": "31/o1sg5dll"
                      },
                      {
                        "id": 32,
                        "title": "团材料",
                        "type": "SelectMaterial",
                        "value": null,
                        "props": {
                          "http": {},
                          "fixed": true,
                          "hidden": false,
                          "suffix": null,
                          "options": [
                            {
                              "group": "物料202501061405",
                              "children": [
                                {
                                  "value": "2c8fc50f-fa87-4423-baba-06be739b8d07",
                                  "label": "测试11/111"
                                },
                                {
                                  "value": "aaa82945-a49e-49a7-bf3d-0119f5063ae4",
                                  "label": "测试标题模版/SN-2222222222"
                                },
                                {
                                  "value": "f066fd92-d037-4386-9383-69af99785dda",
                                  "label": "测试222/测试2222"
                                },
                                {
                                  "value": "1b7ae135-3075-4795-9014-41866959b111",
                                  "label": "测试/测试"
                                }
                              ]
                            }
                          ],
                          "abstract": false,
                          "dictType": null,
                          "multiple": true,
                          "readOnly": false,
                          "required": false,
                          "expanding": false,
                          "validation": null,
                          "enablePrint": true
                        },
                        "key": "tuan_cai_liao",
                        "attribute_type": "single",
                        "multiple": false,
                        "rowKey": "32/53wls6e7",
                        "description": ""
                      },
                      {
                        "id": 33,
                        "title": "单选",
                        "type": "SelectInputRadio",
                        "value": null,
                        "props": {
                          "suffix": null,
                          "options": [
                            "选项1",
                            "选项2"
                          ],
                          "abstract": false,
                          "required": false,
                          "expanding": false,
                          "enablePrint": true
                        },
                        "key": "dan_xuan",
                        "attribute_type": "single",
                        "multiple": false,
                        "description": "",
                        "rowKey": "33/6a0rwrlj"
                      }
                    ],
                    "rowKey": "6/6lset9lt",
                    "key": "6/6lset9lt",
                    "title": "测试",
                    "operateType": "操作"
                  }
                ],
                "id": "74124df7-34a0-49fe-9e7d-07f05f27080a",
                "key": "74124df7-34a0-49fe-9e7d-07f05f27080a",
                "rowKey": "74124df7-34a0-49fe-9e7d-07f05f27080a/ynomysil",
                "title": "测试22",
                "name": "测试22"
              },
              {
                "formItems": [
                  {
                    "id": 2,
                    "name": "测试模块2",
                    "description": "测试22",
                    "type": "操作",
                    "attribute": [
                      {
                        "id": 31,
                        "title": "单行输入",
                        "type": "TextInput",
                        "value": null,
                        "props": {
                          "suffix": null,
                          "abstract": true,
                          "required": false,
                          "enableScan": false,
                          "enablePrint": true
                        },
                        "key": "dan_hang_shu_ru",
                        "attribute_type": "single",
                        "multiple": false,
                        "description": "",
                        "rowKey": "31/0dz1rnez"
                      },
                      {
                        "id": 32,
                        "title": "团材料",
                        "type": "SelectMaterial",
                        "value": null,
                        "props": {
                          "http": {},
                          "fixed": true,
                          "hidden": false,
                          "suffix": null,
                          "options": [
                            {
                              "group": "物料202501061405",
                              "children": [
                                {
                                  "value": "2c8fc50f-fa87-4423-baba-06be739b8d07",
                                  "label": "测试11/111"
                                },
                                {
                                  "value": "aaa82945-a49e-49a7-bf3d-0119f5063ae4",
                                  "label": "测试标题模版/SN-2222222222"
                                },
                                {
                                  "value": "f066fd92-d037-4386-9383-69af99785dda",
                                  "label": "测试222/测试2222"
                                },
                                {
                                  "value": "1b7ae135-3075-4795-9014-41866959b111",
                                  "label": "测试/测试"
                                }
                              ]
                            }
                          ],
                          "abstract": false,
                          "dictType": null,
                          "multiple": true,
                          "readOnly": false,
                          "required": false,
                          "expanding": false,
                          "validation": null,
                          "enablePrint": true
                        },
                        "key": "tuan_cai_liao",
                        "attribute_type": "single",
                        "multiple": false,
                        "rowKey": "32/o6hjj6w5",
                        "description": ""
                      },
                      {
                        "id": 33,
                        "title": "单选",
                        "type": "SelectInputRadio",
                        "value": null,
                        "props": {
                          "suffix": null,
                          "options": [
                            "选项1",
                            "选项2"
                          ],
                          "abstract": false,
                          "required": false,
                          "expanding": false,
                          "enablePrint": true
                        },
                        "key": "dan_xuan",
                        "attribute_type": "single",
                        "multiple": false,
                        "description": "",
                        "rowKey": "33/3e4tgqfp"
                      },
                      {
                        "id": 34,
                        "title": "主角儿组合",
                        "type": "FieldsGroup",
                        "value": null,
                        "props": {
                          "size": 8,
                          "items": [
                            {
                              "id": 31,
                              "key": "dan_hang_shu_ru",
                              "type": "TextInput",
                              "unit": null,
                              "props": {
                                "suffix": null,
                                "abstract": true,
                                "required": false,
                                "enableScan": false,
                                "enablePrint": true
                              },
                              "title": "单行输入",
                              "value": null,
                              "multiple": false,
                              "attribute_type": "single",
                              "description": "",
                              "rowKey": "31/axtc428b"
                            },
                            {
                              "id": 32,
                              "key": "tuan_cai_liao",
                              "type": "SelectMaterial",
                              "unit": null,
                              "props": {
                                "http": {},
                                "fixed": true,
                                "hidden": false,
                                "suffix": null,
                                "options": [
                                  {
                                    "group": "物料202501061405",
                                    "children": [
                                      {
                                        "value": "2c8fc50f-fa87-4423-baba-06be739b8d07",
                                        "label": "测试11/111"
                                      },
                                      {
                                        "value": "aaa82945-a49e-49a7-bf3d-0119f5063ae4",
                                        "label": "测试标题模版/SN-2222222222"
                                      },
                                      {
                                        "value": "f066fd92-d037-4386-9383-69af99785dda",
                                        "label": "测试222/测试2222"
                                      },
                                      {
                                        "value": "1b7ae135-3075-4795-9014-41866959b111",
                                        "label": "测试/测试"
                                      }
                                    ]
                                  }
                                ],
                                "abstract": false,
                                "dictType": null,
                                "multiple": true,
                                "readOnly": false,
                                "required": false,
                                "expanding": false,
                                "validation": null,
                                "enablePrint": true
                              },
                              "title": "团材料",
                              "value": null,
                              "multiple": false,
                              "attribute_type": "single",
                              "rowKey": "32/ckhbeyvi",
                              "description": ""
                            },
                            {
                              "id": 33,
                              "key": "dan_xuan",
                              "type": "SelectInputRadio",
                              "unit": null,
                              "props": {
                                "suffix": null,
                                "options": [
                                  "选项1",
                                  "选项2"
                                ],
                                "abstract": false,
                                "required": false,
                                "expanding": false,
                                "enablePrint": true
                              },
                              "title": "单选",
                              "value": null,
                              "multiple": false,
                              "attribute_type": "single",
                              "description": "",
                              "rowKey": "33/udfeg3fl"
                            }
                          ],
                          "abstract": false,
                          "required": false,
                          "direction": "horizontal",
                          "expanding": false,
                          "enablePrint": true
                        },
                        "key": "zhu_jiao_er_zu_he",
                        "attribute_type": "single",
                        "multiple": false,
                        "rowKey": "34/3nup2cvl",
                        "description": ""
                      }
                    ],
                    "rowKey": "2/s33v0ro2",
                    "key": "2/s33v0ro2",
                    "title": "测试模块2",
                    "operateType": "操作"
                  },
                  {
                    "id": 3,
                    "name": "工艺模块",
                    "description": "测试",
                    "type": "物料",
                    "attribute": [
                      {
                        "id": 31,
                        "title": "单行输入",
                        "type": "TextInput",
                        "value": null,
                        "props": {
                          "suffix": null,
                          "abstract": true,
                          "required": false,
                          "enableScan": false,
                          "enablePrint": true
                        },
                        "key": "dan_hang_shu_ru",
                        "attribute_type": "single",
                        "multiple": false,
                        "description": "",
                        "rowKey": "31/v332k4nk"
                      },
                      {
                        "id": 33,
                        "title": "单选",
                        "type": "SelectInputRadio",
                        "value": null,
                        "props": {
                          "suffix": null,
                          "options": [
                            "选项1",
                            "选项2"
                          ],
                          "abstract": false,
                          "required": false,
                          "expanding": false,
                          "enablePrint": true
                        },
                        "key": "dan_xuan",
                        "attribute_type": "single",
                        "multiple": false,
                        "description": "",
                        "rowKey": "33/b9jjngyr"
                      }
                    ],
                    "rowKey": "3/68jojvto",
                    "key": "3/68jojvto",
                    "title": "工艺模块",
                    "operateType": "物料"
                  },
                  {
                    "id": 6,
                    "name": "测试",
                    "description": "111",
                    "type": "操作",
                    "attribute": [
                      {
                        "id": 31,
                        "title": "单行输入",
                        "type": "TextInput",
                        "value": null,
                        "props": {
                          "suffix": null,
                          "abstract": true,
                          "required": false,
                          "enableScan": false,
                          "enablePrint": true
                        },
                        "key": "dan_hang_shu_ru",
                        "attribute_type": "single",
                        "multiple": false,
                        "description": "",
                        "rowKey": "31/n2i1xpu3"
                      },
                      {
                        "id": 32,
                        "title": "团材料",
                        "type": "SelectMaterial",
                        "value": null,
                        "props": {
                          "http": {},
                          "fixed": true,
                          "hidden": false,
                          "suffix": null,
                          "options": [
                            {
                              "group": "物料202501061405",
                              "children": [
                                {
                                  "value": "2c8fc50f-fa87-4423-baba-06be739b8d07",
                                  "label": "测试11/111"
                                },
                                {
                                  "value": "aaa82945-a49e-49a7-bf3d-0119f5063ae4",
                                  "label": "测试标题模版/SN-2222222222"
                                },
                                {
                                  "value": "f066fd92-d037-4386-9383-69af99785dda",
                                  "label": "测试222/测试2222"
                                },
                                {
                                  "value": "1b7ae135-3075-4795-9014-41866959b111",
                                  "label": "测试/测试"
                                }
                              ]
                            }
                          ],
                          "abstract": false,
                          "dictType": null,
                          "multiple": true,
                          "readOnly": false,
                          "required": false,
                          "expanding": false,
                          "validation": null,
                          "enablePrint": true
                        },
                        "key": "tuan_cai_liao",
                        "attribute_type": "single",
                        "multiple": false,
                        "rowKey": "32/rxq6rfnc",
                        "description": ""
                      },
                      {
                        "id": 33,
                        "title": "单选",
                        "type": "SelectInputRadio",
                        "value": null,
                        "props": {
                          "suffix": null,
                          "options": [
                            "选项1",
                            "选项2"
                          ],
                          "abstract": false,
                          "required": false,
                          "expanding": false,
                          "enablePrint": true
                        },
                        "key": "dan_xuan",
                        "attribute_type": "single",
                        "multiple": false,
                        "description": "",
                        "rowKey": "33/ygdv0vs9"
                      }
                    ],
                    "rowKey": "6/gruciaqk",
                    "key": "6/gruciaqk",
                    "title": "测试",
                    "operateType": "操作"
                  }
                ],
                "id": "acbc22e4-8c6d-4412-8e5e-7edc855e1510",
                "key": "acbc22e4-8c6d-4412-8e5e-7edc855e1510",
                "rowKey": "acbc22e4-8c6d-4412-8e5e-7edc855e1510/3ds3qb3g",
                "title": "测试11",
                "name": "测试11"
              }
            ],
            "formData": {
              "ef124a56-3391-44e1-ba10-d163a7248b6b": {
                "description": "",
                "2/6xexe1pe": {
                  "dan_hang_shu_ru": "",
                  "tuan_cai_liao": [],
                  "dan_xuan": "",
                  "zhu_jiao_er_zu_he": {
                    "dan_hang_shu_ru": "",
                    "tuan_cai_liao": [],
                    "dan_xuan": ""
                  }
                },
                "3/dg672stv": {
                  "dan_hang_shu_ru": "hgfhdfhgf",
                  "dan_xuan": "选项1"
                }
              },
              "74124df7-34a0-49fe-9e7d-07f05f27080a": {
                "description": "",
                "2/der9om5s": {
                  "dan_hang_shu_ru": "",
                  "tuan_cai_liao": [],
                  "dan_xuan": "",
                  "zhu_jiao_er_zu_he": {
                    "dan_hang_shu_ru": "",
                    "tuan_cai_liao": [],
                    "dan_xuan": ""
                  }
                },
                "6/6lset9lt": {
                  "dan_hang_shu_ru": "dfhgh",
                  "tuan_cai_liao": [
                    "2c8fc50f-fa87-4423-baba-06be739b8d07"
                  ],
                  "dan_xuan": "选项2"
                }
              },
              "acbc22e4-8c6d-4412-8e5e-7edc855e1510": {
                "description": "",
                "2/s33v0ro2": {
                  "dan_hang_shu_ru": "",
                  "tuan_cai_liao": [],
                  "dan_xuan": "",
                  "zhu_jiao_er_zu_he": {
                    "dan_hang_shu_ru": "",
                    "tuan_cai_liao": [],
                    "dan_xuan": "选项1"
                  }
                },
                "3/68jojvto": {
                  "dan_hang_shu_ru": "hdfhgf",
                  "dan_xuan": "选项1"
                },
                "6/gruciaqk": {
                  "dan_hang_shu_ru": "hgdfhgf",
                  "tuan_cai_liao": [
                    "aaa82945-a49e-49a7-bf3d-0119f5063ae4"
                  ],
                  "dan_xuan": "选项2"
                }
              }
            },
            "stepData": {
              "ef124a56-3391-44e1-ba10-d163a7248b6b": {
                "description": "",
                "2/6xexe1pe": {
                  "dan_hang_shu_ru": "",
                  "tuan_cai_liao": [],
                  "dan_xuan": "",
                  "zhu_jiao_er_zu_he": {
                    "dan_hang_shu_ru": "",
                    "tuan_cai_liao": [],
                    "dan_xuan": ""
                  }
                },
                "3/dg672stv": {
                  "dan_hang_shu_ru": "hgfhdfhgf",
                  "dan_xuan": "选项1"
                }
              },
              "74124df7-34a0-49fe-9e7d-07f05f27080a": {
                "description": "",
                "2/der9om5s": {
                  "dan_hang_shu_ru": "",
                  "tuan_cai_liao": [],
                  "dan_xuan": "",
                  "zhu_jiao_er_zu_he": {
                    "dan_hang_shu_ru": "",
                    "tuan_cai_liao": [],
                    "dan_xuan": ""
                  }
                },
                "6/6lset9lt": {
                  "dan_hang_shu_ru": "dfhgh",
                  "tuan_cai_liao": [
                    "2c8fc50f-fa87-4423-baba-06be739b8d07"
                  ],
                  "dan_xuan": "选项2"
                }
              },
              "acbc22e4-8c6d-4412-8e5e-7edc855e1510": {
                "description": "",
                "2/s33v0ro2": {
                  "dan_hang_shu_ru": "",
                  "tuan_cai_liao": [],
                  "dan_xuan": "",
                  "zhu_jiao_er_zu_he": {
                    "dan_hang_shu_ru": "",
                    "tuan_cai_liao": [],
                    "dan_xuan": "选项1"
                  }
                },
                "3/68jojvto": {
                  "dan_hang_shu_ru": "hdfhgf",
                  "dan_xuan": "选项1"
                },
                "6/gruciaqk": {
                  "dan_hang_shu_ru": "hgdfhgf",
                  "tuan_cai_liao": [
                    "aaa82945-a49e-49a7-bf3d-0119f5063ae4"
                  ],
                  "dan_xuan": "选项2"
                }
              }
            }
          },
          "designResult": {
            "formData": {
              "ef124a56-3391-44e1-ba10-d163a7248b6b": {
                "description": "",
                "2/6xexe1pe": {
                  "dan_hang_shu_ru": "",
                  "tuan_cai_liao": [],
                  "dan_xuan": "",
                  "zhu_jiao_er_zu_he": {
                    "dan_hang_shu_ru": "",
                    "tuan_cai_liao": [],
                    "dan_xuan": ""
                  }
                },
                "3/dg672stv": {
                  "dan_hang_shu_ru": "hgfhdfhgf",
                  "dan_xuan": "选项1"
                }
              },
              "74124df7-34a0-49fe-9e7d-07f05f27080a": {
                "description": "",
                "2/der9om5s": {
                  "dan_hang_shu_ru": "",
                  "tuan_cai_liao": [],
                  "dan_xuan": "",
                  "zhu_jiao_er_zu_he": {
                    "dan_hang_shu_ru": "",
                    "tuan_cai_liao": [],
                    "dan_xuan": ""
                  }
                },
                "6/6lset9lt": {
                  "dan_hang_shu_ru": "dfhgh",
                  "tuan_cai_liao": [
                    "2c8fc50f-fa87-4423-baba-06be739b8d07"
                  ],
                  "dan_xuan": "选项2"
                }
              },
              "acbc22e4-8c6d-4412-8e5e-7edc855e1510": {
                "description": "",
                "2/s33v0ro2": {
                  "dan_hang_shu_ru": "",
                  "tuan_cai_liao": [],
                  "dan_xuan": "",
                  "zhu_jiao_er_zu_he": {
                    "dan_hang_shu_ru": "",
                    "tuan_cai_liao": [],
                    "dan_xuan": "选项1"
                  }
                },
                "3/68jojvto": {
                  "dan_hang_shu_ru": "hdfhgf",
                  "dan_xuan": "选项1"
                },
                "6/gruciaqk": {
                  "dan_hang_shu_ru": "hgdfhgf",
                  "tuan_cai_liao": [
                    "aaa82945-a49e-49a7-bf3d-0119f5063ae4"
                  ],
                  "dan_xuan": "选项2"
                }
              }
            },
            "formItems": [
              {
                "formItems": [
                  {
                    "id": 3,
                    "name": "工艺模块",
                    "description": "测试",
                    "type": "物料",
                    "attribute": [
                      {
                        "id": 31,
                        "title": "单行输入",
                        "type": "TextInput",
                        "value": null,
                        "props": {
                          "suffix": null,
                          "abstract": true,
                          "required": false,
                          "enableScan": false,
                          "enablePrint": true
                        },
                        "key": "dan_hang_shu_ru",
                        "attribute_type": "single",
                        "multiple": false,
                        "description": "",
                        "rowKey": "31/pz9wtec1"
                      },
                      {
                        "id": 33,
                        "title": "单选",
                        "type": "SelectInputRadio",
                        "value": null,
                        "props": {
                          "suffix": null,
                          "options": [
                            "选项1",
                            "选项2"
                          ],
                          "abstract": false,
                          "required": false,
                          "expanding": false,
                          "enablePrint": true
                        },
                        "key": "dan_xuan",
                        "attribute_type": "single",
                        "multiple": false,
                        "description": "",
                        "rowKey": "33/cgevme5w"
                      }
                    ],
                    "rowKey": "3/dg672stv",
                    "key": "3/dg672stv",
                    "title": "工艺模块",
                    "operateType": "物料"
                  }
                ],
                "id": "ef124a56-3391-44e1-ba10-d163a7248b6b",
                "key": "ef124a56-3391-44e1-ba10-d163a7248b6b",
                "rowKey": "ef124a56-3391-44e1-ba10-d163a7248b6b/7ptrqvg0",
                "title": "111",
                "name": "111"
              },
              {
                "formItems": [
                  {
                    "id": 6,
                    "name": "测试",
                    "description": "111",
                    "type": "操作",
                    "attribute": [
                      {
                        "id": 31,
                        "title": "单行输入",
                        "type": "TextInput",
                        "value": null,
                        "props": {
                          "suffix": null,
                          "abstract": true,
                          "required": false,
                          "enableScan": false,
                          "enablePrint": true
                        },
                        "key": "dan_hang_shu_ru",
                        "attribute_type": "single",
                        "multiple": false,
                        "description": "",
                        "rowKey": "31/o1sg5dll"
                      },
                      {
                        "id": 32,
                        "title": "团材料",
                        "type": "SelectMaterial",
                        "value": null,
                        "props": {
                          "http": {},
                          "fixed": true,
                          "hidden": false,
                          "suffix": null,
                          "options": [
                            {
                              "group": "物料202501061405",
                              "children": [
                                {
                                  "value": "2c8fc50f-fa87-4423-baba-06be739b8d07",
                                  "label": "测试11/111"
                                },
                                {
                                  "value": "aaa82945-a49e-49a7-bf3d-0119f5063ae4",
                                  "label": "测试标题模版/SN-2222222222"
                                },
                                {
                                  "value": "f066fd92-d037-4386-9383-69af99785dda",
                                  "label": "测试222/测试2222"
                                },
                                {
                                  "value": "1b7ae135-3075-4795-9014-41866959b111",
                                  "label": "测试/测试"
                                }
                              ]
                            }
                          ],
                          "abstract": false,
                          "dictType": null,
                          "multiple": true,
                          "readOnly": false,
                          "required": false,
                          "expanding": false,
                          "validation": null,
                          "enablePrint": true
                        },
                        "key": "tuan_cai_liao",
                        "attribute_type": "single",
                        "multiple": false,
                        "rowKey": "32/53wls6e7",
                        "description": ""
                      },
                      {
                        "id": 33,
                        "title": "单选",
                        "type": "SelectInputRadio",
                        "value": null,
                        "props": {
                          "suffix": null,
                          "options": [
                            "选项1",
                            "选项2"
                          ],
                          "abstract": false,
                          "required": false,
                          "expanding": false,
                          "enablePrint": true
                        },
                        "key": "dan_xuan",
                        "attribute_type": "single",
                        "multiple": false,
                        "description": "",
                        "rowKey": "33/6a0rwrlj"
                      }
                    ],
                    "rowKey": "6/6lset9lt",
                    "key": "6/6lset9lt",
                    "title": "测试",
                    "operateType": "操作"
                  }
                ],
                "id": "74124df7-34a0-49fe-9e7d-07f05f27080a",
                "key": "74124df7-34a0-49fe-9e7d-07f05f27080a",
                "rowKey": "74124df7-34a0-49fe-9e7d-07f05f27080a/ynomysil",
                "title": "测试22",
                "name": "测试22"
              },
              {
                "formItems": [
                  {
                    "id": 3,
                    "name": "工艺模块",
                    "description": "测试",
                    "type": "物料",
                    "attribute": [
                      {
                        "id": 31,
                        "title": "单行输入",
                        "type": "TextInput",
                        "value": null,
                        "props": {
                          "suffix": null,
                          "abstract": true,
                          "required": false,
                          "enableScan": false,
                          "enablePrint": true
                        },
                        "key": "dan_hang_shu_ru",
                        "attribute_type": "single",
                        "multiple": false,
                        "description": "",
                        "rowKey": "31/v332k4nk"
                      },
                      {
                        "id": 33,
                        "title": "单选",
                        "type": "SelectInputRadio",
                        "value": null,
                        "props": {
                          "suffix": null,
                          "options": [
                            "选项1",
                            "选项2"
                          ],
                          "abstract": false,
                          "required": false,
                          "expanding": false,
                          "enablePrint": true
                        },
                        "key": "dan_xuan",
                        "attribute_type": "single",
                        "multiple": false,
                        "description": "",
                        "rowKey": "33/b9jjngyr"
                      }
                    ],
                    "rowKey": "3/68jojvto",
                    "key": "3/68jojvto",
                    "title": "工艺模块",
                    "operateType": "物料"
                  },
                  {
                    "id": 6,
                    "name": "测试",
                    "description": "111",
                    "type": "操作",
                    "attribute": [
                      {
                        "id": 31,
                        "title": "单行输入",
                        "type": "TextInput",
                        "value": null,
                        "props": {
                          "suffix": null,
                          "abstract": true,
                          "required": false,
                          "enableScan": false,
                          "enablePrint": true
                        },
                        "key": "dan_hang_shu_ru",
                        "attribute_type": "single",
                        "multiple": false,
                        "description": "",
                        "rowKey": "31/n2i1xpu3"
                      },
                      {
                        "id": 32,
                        "title": "团材料",
                        "type": "SelectMaterial",
                        "value": null,
                        "props": {
                          "http": {},
                          "fixed": true,
                          "hidden": false,
                          "suffix": null,
                          "options": [
                            {
                              "group": "物料202501061405",
                              "children": [
                                {
                                  "value": "2c8fc50f-fa87-4423-baba-06be739b8d07",
                                  "label": "测试11/111"
                                },
                                {
                                  "value": "aaa82945-a49e-49a7-bf3d-0119f5063ae4",
                                  "label": "测试标题模版/SN-2222222222"
                                },
                                {
                                  "value": "f066fd92-d037-4386-9383-69af99785dda",
                                  "label": "测试222/测试2222"
                                },
                                {
                                  "value": "1b7ae135-3075-4795-9014-41866959b111",
                                  "label": "测试/测试"
                                }
                              ]
                            }
                          ],
                          "abstract": false,
                          "dictType": null,
                          "multiple": true,
                          "readOnly": false,
                          "required": false,
                          "expanding": false,
                          "validation": null,
                          "enablePrint": true
                        },
                        "key": "tuan_cai_liao",
                        "attribute_type": "single",
                        "multiple": false,
                        "rowKey": "32/rxq6rfnc",
                        "description": ""
                      },
                      {
                        "id": 33,
                        "title": "单选",
                        "type": "SelectInputRadio",
                        "value": null,
                        "props": {
                          "suffix": null,
                          "options": [
                            "选项1",
                            "选项2"
                          ],
                          "abstract": false,
                          "required": false,
                          "expanding": false,
                          "enablePrint": true
                        },
                        "key": "dan_xuan",
                        "attribute_type": "single",
                        "multiple": false,
                        "description": "",
                        "rowKey": "33/ygdv0vs9"
                      }
                    ],
                    "rowKey": "6/gruciaqk",
                    "key": "6/gruciaqk",
                    "title": "测试",
                    "operateType": "操作"
                  }
                ],
                "id": "acbc22e4-8c6d-4412-8e5e-7edc855e1510",
                "key": "acbc22e4-8c6d-4412-8e5e-7edc855e1510",
                "rowKey": "acbc22e4-8c6d-4412-8e5e-7edc855e1510/3ds3qb3g",
                "title": "测试11",
                "name": "测试11"
              }
            ],
            "orthogonalDesign": {
              "cycleNumber": 1,
              "stepItems": []
            },
            "id": "48b18cc3-9a19-4cb3-919e-248c571aabc2",
            "title": "试验设计方案-20250106154419"
          },
          "selectRows": [],
          "title": "试验记录202501061543"
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
          "margin": {},
          "textAlign": "left",
          "lineHeight": 1.5
        },
        "content": [
          {
            "text": "cr3r23r3r23r23fdswqdw",
            "type": "text"
          }
        ]
      },
      {
        "type": "paragraph",
        "attrs": {
          "indent": null,
          "margin": {},
          "textAlign": "left",
          "lineHeight": 1.5
        }
      },
      {
        "type": "paragraph",
        "attrs": {
          "indent": null,
          "margin": {},
          "textAlign": "left",
          "lineHeight": 1.5
        }
      },
      {
        "type": "paragraph",
        "attrs": {
          "indent": null,
          "margin": {},
          "textAlign": "left",
          "lineHeight": 1.5
        },
        "content": [
          {
            "text": "cr3r23r3r23r23fdswqdw",
            "type": "text"
          }
        ]
      },
      {
        "type": "paragraph",
        "attrs": {
          "indent": null,
          "margin": {},
          "textAlign": "left",
          "lineHeight": 1.5
        }
      },
      {
        "type": "paragraph",
        "attrs": {
          "indent": null,
          "margin": {},
          "textAlign": "left",
          "lineHeight": 1.5
        }
      },
      {
        "type": "paragraph",
        "attrs": {
          "indent": null,
          "margin": {},
          "textAlign": "left",
          "lineHeight": 1.5
        },
        "content": [
          {
            "text": "cr3r23r3r23r23fdswqdw",
            "type": "text"
          }
        ]
      },
      {
        "type": "paragraph",
        "attrs": {
          "indent": null,
          "margin": {},
          "textAlign": "left",
          "lineHeight": 1.5
        }
      },
      {
        "type": "paragraph",
        "attrs": {
          "indent": null,
          "margin": {},
          "textAlign": "left",
          "lineHeight": 1.5
        }
      },
      {
        "type": "paragraph",
        "attrs": {
          "indent": null,
          "margin": {},
          "textAlign": "left",
          "lineHeight": 1.5
        },
        "content": [
          {
            "text": "cr3r23r3r23r23fdswqdw",
            "type": "text"
          }
        ]
      },
      {
        "type": "paragraph",
        "attrs": {
          "indent": null,
          "margin": {},
          "textAlign": "left",
          "lineHeight": 1.5
        }
      },
      {
        "type": "paragraph",
        "attrs": {
          "indent": null,
          "margin": {},
          "textAlign": "left",
          "lineHeight": 1.5
        }
      },
      {
        "type": "paragraph",
        "attrs": {
          "indent": null,
          "margin": {},
          "textAlign": "left",
          "lineHeight": 1.5
        },
        "content": [
          {
            "text": "cr3r23r3r23r23fdswqdw",
            "type": "text"
          }
        ]
      },
      {
        "type": "paragraph",
        "attrs": {
          "indent": null,
          "margin": {},
          "textAlign": "left",
          "lineHeight": 1.5
        }
      },
      {
        "type": "xmTitleContent",
        "attrs": {
          "title": "试验结论：",
          "content": "结论"
        },
        "content": [
          {
            "type": "heading",
            "attrs": {
              "id": "sy03fy",
              "level": 2,
              "indent": null,
              "margin": {},
              "textAlign": "left",
              "lineHeight": 1.5,
              "data-toc-id": "sy03fy"
            },
            "content": [
              {
                "text": "试验结论：",
                "type": "text"
              }
            ]
          },
          {
            "type": "paragraph",
            "attrs": {
              "indent": null,
              "margin": {},
              "textAlign": "left",
              "lineHeight": 1.5
            },
            "content": [
              {
                "text": "结论",
                "type": "text"
              }
            ]
          }
        ]
      },
    ]
  }
  editorRef && editorRef.editorInstance?.commands.setContent(jsonContent)

  // editorRef.editorInstance?.chain().focus().addSample_tables({key: 'sample_table',title:'试验方式使用面板'}).run()
})


</script>

<style scoped>
.box {
  height: calc(100vh - 0px);
  box-sizing: border-box;
  position: relative;
}

html,
body {
  height: 100vh;
  overflow: auto;
}
</style>
