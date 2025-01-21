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
    <UmoSimpleEditor v-if="true" ref="editorRef" v-bind="options" @changed="changeEdit" />
  </div>
</template>

<script setup lang="ts">
import { getOrg_memberFetch, attachments_fileFetch } from '@/api/index'
import { put_experiment_record_fetch } from '@/api/experiment'
import { checkBeforeSaveDoc } from '@/utils/index'
import Fuse from 'fuse.js';
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
    umo_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzM3NTEzMDgxLCJpYXQiOjE3Mzc0MjY2ODEsImp0aSI6IjVkMTRhM2I3Mzc3NTQyMzdiMzZhODlkNDA1OTk5MGVmIiwidXNlcl9pZCI6Ijg1Mjg4NThmLTdjYjgtNDc3ZS1iZjE3LWZkZTNkMmZiYjIzZSJ9.aRVU9l7Oo9GELnGrMN8UEr5-U0BCM8-fQmM0zYeSTkY',
  },
  document: {
    placeholder: '输入 / 唤起更多',
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

    const res = await attachments_fileFetch({ file: file})

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
  async onAssistant(payload:any, content:any) {
    console.log('assistant-----', payload, content)
    const FuseOptions = {
      keys: ['name','title','text'], // Set the keys to search on
      includeScore: false, // Optional: to include score for each match
      threshold: 0.7, // Adjust search sensitivity (0.0 exact, 1.0 everything)
    };
    const fuse = new Fuse(content.json.content, FuseOptions);
    console.log('assistant---fuse--', fuse, content.json.content)
    const result = fuse.search(payload.command)
    console.log('assistant--------result', result)
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
    console.log('changeEdit', data)
  }
}

onMounted(() => {
  //
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
          "sn": "SN654654",
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
          "id": "5c0e2018-8a8e-4018-b93c-1ceffc61e2a2",
          "updateTime": "",
          "key": "technology_table20250118135540",
          "name": "2765042c-1b9f-4c95-a072-5fb7da496e44",
          "isChanged": false,
          "change_log": {},
          "is_integration": false,
          "table_data": [
            {
              "id": "500cf083-fcfc-4493-add7-122cc8ec2112",
              "rowKey": "500cf083-fcfc-4493-add7-122cc8ec2112/6b85fir8",
              "name": "准备操作",
              "type": "procedure",
              "description": "",
              "form": {
                "formItems": [
                  {
                    "id": 2,
                    "name": "准备物料",
                    "description": "",
                    "type": "操作",
                    "attribute": [
                      {
                        "id": 2,
                        "title": "时间",
                        "type": "NumberInput",
                        "value": null,
                        "props": {
                          "unit": "y|M|d|h|m|s",
                          "hidden": false,
                          "suffix": "h",
                          "abstract": false,
                          "required": false,
                          "precision": null,
                          "enablePrint": true
                        },
                        "key": "shi_jian",
                        "attribute_type": "single",
                        "multiple": false,
                        "description": "",
                        "rowKey": "2/peqtp7z7"
                      },
                      {
                        "id": 4,
                        "title": "质量",
                        "type": "NumberInput",
                        "value": null,
                        "props": {
                          "unit": "kg|g|L|ml",
                          "hidden": false,
                          "suffix": "g",
                          "abstract": false,
                          "required": false,
                          "precision": null,
                          "enablePrint": true
                        },
                        "key": "zhi_liang",
                        "attribute_type": "single",
                        "multiple": false,
                        "description": "",
                        "rowKey": "4/672f3oyc"
                      }
                    ],
                    "rowKey": "2/g3q16i63",
                    "key": "2/g3q16i63",
                    "title": "准备物料",
                    "operateType": "操作"
                  },
                  {
                    "id": 4,
                    "name": "粉碎",
                    "description": "",
                    "type": "物料",
                    "attribute": [
                      {
                        "id": 1,
                        "title": "原材料",
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
                          "multiple": false,
                          "required": false,
                          "expanding": false,
                          "validation": null,
                          "enablePrint": true
                        },
                        "key": "yuan_cai_liao",
                        "attribute_type": "single",
                        "multiple": false,
                        "rowKey": "1/c17oqzq0",
                        "description": ""
                      },
                      {
                        "id": 2,
                        "title": "时间",
                        "type": "NumberInput",
                        "value": null,
                        "props": {
                          "unit": "y|M|d|h|m|s",
                          "hidden": false,
                          "suffix": "h",
                          "abstract": false,
                          "required": false,
                          "precision": null,
                          "enablePrint": true
                        },
                        "key": "shi_jian",
                        "attribute_type": "single",
                        "multiple": false,
                        "description": "",
                        "rowKey": "2/rwp0wyu5"
                      },
                      {
                        "id": 4,
                        "title": "质量",
                        "type": "NumberInput",
                        "value": null,
                        "props": {
                          "unit": "kg|g|L|ml",
                          "hidden": false,
                          "suffix": "g",
                          "abstract": false,
                          "required": false,
                          "precision": null,
                          "enablePrint": true
                        },
                        "key": "zhi_liang",
                        "attribute_type": "single",
                        "multiple": false,
                        "description": "",
                        "rowKey": "4/jjisdl97"
                      }
                    ],
                    "rowKey": "4/u5ss2c5h",
                    "key": "4/u5ss2c5h",
                    "title": "粉碎",
                    "operateType": "物料"
                  }
                ],
                "formData": {
                  "description": "",
                  "2/g3q16i63": {
                    "shi_jian_unit": "",
                    "shi_jian": "",
                    "zhi_liang_unit": "",
                    "zhi_liang": ""
                  },
                  "4/u5ss2c5h": {
                    "yuan_cai_liao": [],
                    "shi_jian_unit": "",
                    "shi_jian": "",
                    "zhi_liang_unit": "",
                    "zhi_liang": ""
                  }
                }
              }
            },
            {
              "id": "96bd6373-3439-4ed7-b972-ab9230c90aed",
              "rowKey": "96bd6373-3439-4ed7-b972-ab9230c90aed/y9zzv3lu",
              "name": "粉碎过程",
              "type": "procedure",
              "description": "",
              "form": {
                "formItems": [
                  {
                    "id": 1,
                    "name": "添加物料",
                    "description": "",
                    "type": "物料",
                    "attribute": [
                      {
                        "id": 3,
                        "title": "物料",
                        "type": "TableList",
                        "value": null,
                        "props": {
                          "hidden": false,
                          "columns": [
                            {
                              "id": 1,
                              "key": "yuan_cai_liao",
                              "type": "SelectMaterial",
                              "unit": null,
                              "props": {
                                "http": {},
                                "fixed": true,
                                "hidden": false,
                                "suffix": null,
                                "options": [],
                                "abstract": false,
                                "dictType": null,
                                "multiple": false,
                                "required": false,
                                "expanding": false,
                                "validation": null,
                                "enablePrint": true
                              },
                              "title": "原材料",
                              "value": null,
                              "multiple": false,
                              "attribute_type": "single"
                            },
                            {
                              "id": 4,
                              "key": "zhi_liang",
                              "type": "NumberInput",
                              "unit": null,
                              "props": {
                                "unit": "kg|g|L|ml",
                                "hidden": false,
                                "suffix": "g",
                                "abstract": false,
                                "required": false,
                                "precision": null,
                                "enablePrint": true
                              },
                              "title": "质量",
                              "value": null,
                              "multiple": false,
                              "attribute_type": "single"
                            }
                          ],
                          "maxSize": 0,
                          "abstract": false,
                          "required": false,
                          "rowLayout": true,
                          "showBorder": true,
                          "enablePrint": true,
                          "showSummary": false,
                          "summaryColumns": []
                        },
                        "key": "wu_liao",
                        "attribute_type": "single",
                        "multiple": false,
                        "description": "",
                        "rowKey": "3/dks1hoxx"
                      }
                    ],
                    "rowKey": "1/t99aojvc",
                    "key": "1/t99aojvc",
                    "title": "添加物料",
                    "operateType": "物料"
                  },
                  {
                    "id": 4,
                    "name": "粉碎",
                    "description": "",
                    "type": "物料",
                    "attribute": [
                      {
                        "id": 1,
                        "title": "原材料",
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
                          "multiple": false,
                          "required": false,
                          "expanding": false,
                          "validation": null,
                          "enablePrint": true
                        },
                        "key": "yuan_cai_liao",
                        "attribute_type": "single",
                        "multiple": false,
                        "rowKey": "1/bbkucetc",
                        "description": ""
                      },
                      {
                        "id": 2,
                        "title": "时间",
                        "type": "NumberInput",
                        "value": null,
                        "props": {
                          "unit": "y|M|d|h|m|s",
                          "hidden": false,
                          "suffix": "h",
                          "abstract": false,
                          "required": false,
                          "precision": null,
                          "enablePrint": true
                        },
                        "key": "shi_jian",
                        "attribute_type": "single",
                        "multiple": false,
                        "description": "",
                        "rowKey": "2/odrjw1z7"
                      },
                      {
                        "id": 4,
                        "title": "质量",
                        "type": "NumberInput",
                        "value": null,
                        "props": {
                          "unit": "kg|g|L|ml",
                          "hidden": false,
                          "suffix": "g",
                          "abstract": false,
                          "required": false,
                          "precision": null,
                          "enablePrint": true
                        },
                        "key": "zhi_liang",
                        "attribute_type": "single",
                        "multiple": false,
                        "description": "",
                        "rowKey": "4/d8xl9vwu"
                      }
                    ],
                    "rowKey": "4/uk0z6996",
                    "key": "4/uk0z6996",
                    "title": "粉碎",
                    "operateType": "物料"
                  }
                ],
                "formData": {
                  "description": "",
                  "1/t99aojvc": {
                    "wu_liao": []
                  },
                  "4/uk0z6996": {
                    "yuan_cai_liao": [],
                    "shi_jian_unit": "",
                    "shi_jian": "",
                    "zhi_liang_unit": "",
                    "zhi_liang": ""
                  }
                }
              }
            }
          ],
          "title": "工艺202501181355"
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
        "type": "test_record_table",
        "attrs": {
          "id": "33dc8cc0-3825-407d-87d0-9e0ea37908c9",
          "updateTime": "2025-01-18 18:43:16",
          "key": "test_record_table20250118184252",
          "name": "1c411602-8ce9-4d0d-a5ef-2cdbe1b6b969",
          "isChanged": false,
          "customerParams": {},
          "group": "",
          "table_data": [
            {
              "id": "f5ff8bec-ab08-4707-8058-2357390c67cf",
              "procedure_rowKey": "500cf083-fcfc-4493-add7-122cc8ec2112/6b85fir8",
              "operate_rowKey": "2/g3q16i63",
              "operateType": "操作",
              "formData": {
                "shi_jian_unit": "y",
                "shi_jian": "2",
                "zhi_liang_unit": "kg",
                "zhi_liang": "3"
              },
              "formItems": {
                "id": 2,
                "name": "准备物料",
                "description": "",
                "type": "操作",
                "attribute": [
                  {
                    "id": 2,
                    "title": "时间",
                    "type": "NumberInput",
                    "value": null,
                    "props": {
                      "unit": "y|M|d|h|m|s",
                      "hidden": false,
                      "suffix": "h",
                      "abstract": false,
                      "required": false,
                      "precision": null,
                      "enablePrint": true
                    },
                    "key": "shi_jian",
                    "attribute_type": "single",
                    "multiple": false,
                    "description": "",
                    "rowKey": "2/peqtp7z7"
                  },
                  {
                    "id": 4,
                    "title": "质量",
                    "type": "NumberInput",
                    "value": null,
                    "props": {
                      "unit": "kg|g|L|ml",
                      "hidden": false,
                      "suffix": "g",
                      "abstract": false,
                      "required": false,
                      "precision": null,
                      "enablePrint": true
                    },
                    "key": "zhi_liang",
                    "attribute_type": "single",
                    "multiple": false,
                    "description": "",
                    "rowKey": "4/672f3oyc"
                  }
                ],
                "rowKey": "2/g3q16i63",
                "key": "2/g3q16i63",
                "title": "准备物料",
                "operateType": "操作"
              },
              "description": "",
              "procedure": {
                "id": "500cf083-fcfc-4493-add7-122cc8ec2112",
                "title": "准备操作",
                "key": "500cf083-fcfc-4493-add7-122cc8ec2112",
                "rowKey": "500cf083-fcfc-4493-add7-122cc8ec2112/6b85fir8"
              },
              "is_sample": false,
              "sample": {},
              "operate_router": {
                "id": 2,
                "title": "准备物料",
                "key": "2/g3q16i63",
                "rowKey": "2/g3q16i63"
              }
            },
            {
              "id": "92b69a24-6165-4606-b9ef-208761fd542f",
              "procedure_rowKey": "500cf083-fcfc-4493-add7-122cc8ec2112/6b85fir8",
              "operate_rowKey": "4/u5ss2c5h",
              "operateType": "物料",
              "formData": {
                "yuan_cai_liao": [
                  "2c8fc50f-fa87-4423-baba-06be739b8d07"
                ],
                "shi_jian_unit": "y",
                "shi_jian": "1",
                "zhi_liang_unit": "kg",
                "zhi_liang": "2"
              },
              "formItems": {
                "id": 4,
                "name": "粉碎",
                "description": "",
                "type": "物料",
                "attribute": [
                  {
                    "id": 1,
                    "title": "原材料",
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
                      "multiple": false,
                      "required": false,
                      "expanding": false,
                      "validation": null,
                      "enablePrint": true
                    },
                    "key": "yuan_cai_liao",
                    "attribute_type": "single",
                    "multiple": false,
                    "rowKey": "1/c17oqzq0",
                    "description": ""
                  },
                  {
                    "id": 2,
                    "title": "时间",
                    "type": "NumberInput",
                    "value": null,
                    "props": {
                      "unit": "y|M|d|h|m|s",
                      "hidden": false,
                      "suffix": "h",
                      "abstract": false,
                      "required": false,
                      "precision": null,
                      "enablePrint": true
                    },
                    "key": "shi_jian",
                    "attribute_type": "single",
                    "multiple": false,
                    "description": "",
                    "rowKey": "2/rwp0wyu5"
                  },
                  {
                    "id": 4,
                    "title": "质量",
                    "type": "NumberInput",
                    "value": null,
                    "props": {
                      "unit": "kg|g|L|ml",
                      "hidden": false,
                      "suffix": "g",
                      "abstract": false,
                      "required": false,
                      "precision": null,
                      "enablePrint": true
                    },
                    "key": "zhi_liang",
                    "attribute_type": "single",
                    "multiple": false,
                    "description": "",
                    "rowKey": "4/jjisdl97"
                  }
                ],
                "rowKey": "4/u5ss2c5h",
                "key": "4/u5ss2c5h",
                "title": "粉碎",
                "operateType": "物料"
              },
              "description": "",
              "procedure": {
                "id": "500cf083-fcfc-4493-add7-122cc8ec2112",
                "title": "准备操作",
                "key": "500cf083-fcfc-4493-add7-122cc8ec2112",
                "rowKey": "500cf083-fcfc-4493-add7-122cc8ec2112/6b85fir8"
              },
              "is_sample": false,
              "sample": {},
              "operate_router": {
                "id": 4,
                "title": "粉碎",
                "key": "4/u5ss2c5h",
                "rowKey": "4/u5ss2c5h"
              }
            },
            {
              "id": "b0c7c303-f3c0-4643-8ce6-7dd7c9999d6b",
              "procedure_rowKey": "500cf083-fcfc-4493-add7-122cc8ec2112/6b85fir8",
              "operate_rowKey": "过程描述sccjpymu",
              "operateType": "过程描述",
              "formData": {},
              "formItems": {
                "title": "过程描述"
              },
              "procedure": {
                "id": "500cf083-fcfc-4493-add7-122cc8ec2112",
                "title": "准备操作",
                "key": "500cf083-fcfc-4493-add7-122cc8ec2112",
                "rowKey": "500cf083-fcfc-4493-add7-122cc8ec2112/6b85fir8"
              },
              "is_sample": false,
              "sample": {},
              "operate_router": {
                "title": "过程描述"
              }
            },
            {
              "id": "6db7d03e-61a6-4e7c-abbc-84be9ced5537",
              "procedure_rowKey": "96bd6373-3439-4ed7-b972-ab9230c90aed/y9zzv3lu",
              "operate_rowKey": "1/t99aojvc",
              "operateType": "物料",
              "formData": {
                "wu_liao": [
                  {
                    "1": [
                      "2c8fc50f-fa87-4423-baba-06be739b8d07"
                    ],
                    "4": "1"
                  }
                ],
                "zhi_liang_unit": "kg"
              },
              "formItems": {
                "id": 1,
                "name": "添加物料",
                "description": "",
                "type": "物料",
                "attribute": [
                  {
                    "id": 3,
                    "title": "物料",
                    "type": "TableList",
                    "value": null,
                    "props": {
                      "hidden": false,
                      "columns": [
                        {
                          "id": 1,
                          "key": "yuan_cai_liao",
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
                            "multiple": false,
                            "required": false,
                            "expanding": false,
                            "validation": null,
                            "enablePrint": true
                          },
                          "title": "原材料",
                          "value": null,
                          "multiple": false,
                          "attribute_type": "single"
                        },
                        {
                          "id": 4,
                          "key": "zhi_liang",
                          "type": "NumberInput",
                          "unit": null,
                          "props": {
                            "unit": "kg|g|L|ml",
                            "hidden": false,
                            "suffix": "g",
                            "abstract": false,
                            "required": false,
                            "precision": null,
                            "enablePrint": true
                          },
                          "title": "质量",
                          "value": null,
                          "multiple": false,
                          "attribute_type": "single"
                        }
                      ],
                      "maxSize": 0,
                      "abstract": false,
                      "required": false,
                      "rowLayout": true,
                      "showBorder": false,
                      "enablePrint": true,
                      "showSummary": false,
                      "summaryColumns": []
                    },
                    "key": "wu_liao",
                    "attribute_type": "single",
                    "multiple": false,
                    "description": "",
                    "rowKey": "3/dks1hoxx"
                  }
                ],
                "rowKey": "1/t99aojvc",
                "key": "1/t99aojvc",
                "title": "添加物料",
                "operateType": "物料"
              },
              "description": "",
              "procedure": {
                "id": "96bd6373-3439-4ed7-b972-ab9230c90aed",
                "title": "粉碎过程",
                "key": "96bd6373-3439-4ed7-b972-ab9230c90aed",
                "rowKey": "96bd6373-3439-4ed7-b972-ab9230c90aed/y9zzv3lu"
              },
              "is_sample": false,
              "sample": {},
              "operate_router": {
                "id": 1,
                "title": "添加物料",
                "key": "1/t99aojvc",
                "rowKey": "1/t99aojvc"
              }
            },
            {
              "id": "894992de-ca42-4cfa-8201-6696442478f5",
              "procedure_rowKey": "96bd6373-3439-4ed7-b972-ab9230c90aed/y9zzv3lu",
              "operate_rowKey": "1/t99aojvc",
              "operateType": "样品",
              "formData": {},
              "formItems": [
                {
                  "id": "f5ff8bec-ab08-4707-8058-2357390c67cf",
                  "procedure_rowKey": "500cf083-fcfc-4493-add7-122cc8ec2112/6b85fir8",
                  "operate_rowKey": "2/g3q16i63",
                  "operateType": "操作",
                  "formData": {
                    "shi_jian_unit": "y",
                    "shi_jian": "2",
                    "zhi_liang_unit": "kg",
                    "zhi_liang": "3"
                  },
                  "formItems": {
                    "id": 2,
                    "name": "准备物料",
                    "description": "",
                    "type": "操作",
                    "attribute": [
                      {
                        "id": 2,
                        "title": "时间",
                        "type": "NumberInput",
                        "value": null,
                        "props": {
                          "unit": "y|M|d|h|m|s",
                          "hidden": false,
                          "suffix": "h",
                          "abstract": false,
                          "required": false,
                          "precision": null,
                          "enablePrint": true
                        },
                        "key": "shi_jian",
                        "attribute_type": "single",
                        "multiple": false,
                        "description": "",
                        "rowKey": "2/peqtp7z7"
                      },
                      {
                        "id": 4,
                        "title": "质量",
                        "type": "NumberInput",
                        "value": null,
                        "props": {
                          "unit": "kg|g|L|ml",
                          "hidden": false,
                          "suffix": "g",
                          "abstract": false,
                          "required": false,
                          "precision": null,
                          "enablePrint": true
                        },
                        "key": "zhi_liang",
                        "attribute_type": "single",
                        "multiple": false,
                        "description": "",
                        "rowKey": "4/672f3oyc"
                      }
                    ],
                    "rowKey": "2/g3q16i63",
                    "key": "2/g3q16i63",
                    "title": "准备物料",
                    "operateType": "操作"
                  },
                  "description": "",
                  "procedure": {
                    "id": "500cf083-fcfc-4493-add7-122cc8ec2112",
                    "title": "准备操作",
                    "key": "500cf083-fcfc-4493-add7-122cc8ec2112",
                    "rowKey": "500cf083-fcfc-4493-add7-122cc8ec2112/6b85fir8"
                  },
                  "is_sample": false,
                  "sample": {},
                  "operate_router": {
                    "id": 2,
                    "title": "准备物料",
                    "key": "2/g3q16i63",
                    "rowKey": "2/g3q16i63"
                  }
                },
                {
                  "id": "92b69a24-6165-4606-b9ef-208761fd542f",
                  "procedure_rowKey": "500cf083-fcfc-4493-add7-122cc8ec2112/6b85fir8",
                  "operate_rowKey": "4/u5ss2c5h",
                  "operateType": "物料",
                  "formData": {
                    "yuan_cai_liao": [
                      "2c8fc50f-fa87-4423-baba-06be739b8d07"
                    ],
                    "shi_jian_unit": "y",
                    "shi_jian": "1",
                    "zhi_liang_unit": "kg",
                    "zhi_liang": "2"
                  },
                  "formItems": {
                    "id": 4,
                    "name": "粉碎",
                    "description": "",
                    "type": "物料",
                    "attribute": [
                      {
                        "id": 1,
                        "title": "原材料",
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
                          "multiple": false,
                          "required": false,
                          "expanding": false,
                          "validation": null,
                          "enablePrint": true
                        },
                        "key": "yuan_cai_liao",
                        "attribute_type": "single",
                        "multiple": false,
                        "rowKey": "1/c17oqzq0",
                        "description": ""
                      },
                      {
                        "id": 2,
                        "title": "时间",
                        "type": "NumberInput",
                        "value": null,
                        "props": {
                          "unit": "y|M|d|h|m|s",
                          "hidden": false,
                          "suffix": "h",
                          "abstract": false,
                          "required": false,
                          "precision": null,
                          "enablePrint": true
                        },
                        "key": "shi_jian",
                        "attribute_type": "single",
                        "multiple": false,
                        "description": "",
                        "rowKey": "2/rwp0wyu5"
                      },
                      {
                        "id": 4,
                        "title": "质量",
                        "type": "NumberInput",
                        "value": null,
                        "props": {
                          "unit": "kg|g|L|ml",
                          "hidden": false,
                          "suffix": "g",
                          "abstract": false,
                          "required": false,
                          "precision": null,
                          "enablePrint": true
                        },
                        "key": "zhi_liang",
                        "attribute_type": "single",
                        "multiple": false,
                        "description": "",
                        "rowKey": "4/jjisdl97"
                      }
                    ],
                    "rowKey": "4/u5ss2c5h",
                    "key": "4/u5ss2c5h",
                    "title": "粉碎",
                    "operateType": "物料"
                  },
                  "description": "",
                  "procedure": {
                    "id": "500cf083-fcfc-4493-add7-122cc8ec2112",
                    "title": "准备操作",
                    "key": "500cf083-fcfc-4493-add7-122cc8ec2112",
                    "rowKey": "500cf083-fcfc-4493-add7-122cc8ec2112/6b85fir8"
                  },
                  "is_sample": false,
                  "sample": {},
                  "operate_router": {
                    "id": 4,
                    "title": "粉碎",
                    "key": "4/u5ss2c5h",
                    "rowKey": "4/u5ss2c5h"
                  }
                },
                {
                  "id": "b0c7c303-f3c0-4643-8ce6-7dd7c9999d6b",
                  "procedure_rowKey": "500cf083-fcfc-4493-add7-122cc8ec2112/6b85fir8",
                  "operate_rowKey": "过程描述sccjpymu",
                  "operateType": "过程描述",
                  "formData": {},
                  "formItems": {
                    "title": "过程描述"
                  },
                  "procedure": {
                    "id": "500cf083-fcfc-4493-add7-122cc8ec2112",
                    "title": "准备操作",
                    "key": "500cf083-fcfc-4493-add7-122cc8ec2112",
                    "rowKey": "500cf083-fcfc-4493-add7-122cc8ec2112/6b85fir8"
                  },
                  "is_sample": false,
                  "sample": {},
                  "operate_router": {
                    "title": "过程描述"
                  }
                },
                {
                  "id": "6db7d03e-61a6-4e7c-abbc-84be9ced5537",
                  "procedure_rowKey": "96bd6373-3439-4ed7-b972-ab9230c90aed/y9zzv3lu",
                  "operate_rowKey": "1/t99aojvc",
                  "operateType": "物料",
                  "formData": {
                    "wu_liao": [
                      {
                        "1": [
                          "2c8fc50f-fa87-4423-baba-06be739b8d07"
                        ],
                        "4": "1"
                      }
                    ],
                    "zhi_liang_unit": "kg"
                  },
                  "formItems": {
                    "id": 1,
                    "name": "添加物料",
                    "description": "",
                    "type": "物料",
                    "attribute": [
                      {
                        "id": 3,
                        "title": "物料",
                        "type": "TableList",
                        "value": null,
                        "props": {
                          "hidden": false,
                          "columns": [
                            {
                              "id": 1,
                              "key": "yuan_cai_liao",
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
                                "multiple": false,
                                "required": false,
                                "expanding": false,
                                "validation": null,
                                "enablePrint": true
                              },
                              "title": "原材料",
                              "value": null,
                              "multiple": false,
                              "attribute_type": "single"
                            },
                            {
                              "id": 4,
                              "key": "zhi_liang",
                              "type": "NumberInput",
                              "unit": null,
                              "props": {
                                "unit": "kg|g|L|ml",
                                "hidden": false,
                                "suffix": "g",
                                "abstract": false,
                                "required": false,
                                "precision": null,
                                "enablePrint": true
                              },
                              "title": "质量",
                              "value": null,
                              "multiple": false,
                              "attribute_type": "single"
                            }
                          ],
                          "maxSize": 0,
                          "abstract": false,
                          "required": false,
                          "rowLayout": true,
                          "showBorder": false,
                          "enablePrint": true,
                          "showSummary": false,
                          "summaryColumns": []
                        },
                        "key": "wu_liao",
                        "attribute_type": "single",
                        "multiple": false,
                        "description": "",
                        "rowKey": "3/dks1hoxx"
                      }
                    ],
                    "rowKey": "1/t99aojvc",
                    "key": "1/t99aojvc",
                    "title": "添加物料",
                    "operateType": "物料"
                  },
                  "description": "",
                  "procedure": {
                    "id": "96bd6373-3439-4ed7-b972-ab9230c90aed",
                    "title": "粉碎过程",
                    "key": "96bd6373-3439-4ed7-b972-ab9230c90aed",
                    "rowKey": "96bd6373-3439-4ed7-b972-ab9230c90aed/y9zzv3lu"
                  },
                  "is_sample": false,
                  "sample": {},
                  "operate_router": {
                    "id": 1,
                    "title": "添加物料",
                    "key": "1/t99aojvc",
                    "rowKey": "1/t99aojvc"
                  }
                }
              ],
              "description": "",
              "procedure": {
                "id": "96bd6373-3439-4ed7-b972-ab9230c90aed",
                "title": "粉碎过程",
                "key": "96bd6373-3439-4ed7-b972-ab9230c90aed",
                "rowKey": "96bd6373-3439-4ed7-b972-ab9230c90aed/y9zzv3lu"
              },
              "is_sample": true,
              "operate_router": {
                "title": "样品检测"
              },
              "sample": {
                "id": "2edf63a4-ba16-4a5a-9c10-2dfee3bc5455",
                "name": "样品-2025011818438v",
                "sn": "S202501182",
                "weight": 1,
                "record_table": {
                  "id": "40de92b6-bcd2-4c6a-b3e7-e1659c6ea542",
                  "title": "测试e80mn6fe",
                  "table_data": [
                    {
                      "id": "bcf31ff1-64ec-4bb5-b2ed-450977889fc9",
                      "index_type": {
                        "id": 1,
                        "title": "LAB_L",
                        "props": {
                          "unit": "k|gre|bf|gfd",
                          "hidden": false,
                          "suffix": "",
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
                      "time": "2025-01-18 18:43:24",
                      "data": "21",
                      "description": "2121",
                      "lab_l_unit": "k"
                    },
                    {
                      "id": "ee373e59-e7bd-4ace-bf1e-e288c32667a3",
                      "index_type": {
                        "id": 2,
                        "title": "LAB_A",
                        "props": {
                          "unit": "df|fg|f|fg",
                          "hidden": false,
                          "suffix": "",
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
                      "time": "2025-01-18 18:43:24",
                      "data": "12",
                      "description": "",
                      "lab_a_unit": "df"
                    },
                    {
                      "id": "bca69277-7f01-4ea8-9155-3663634121ff",
                      "index_type": {
                        "id": 3,
                        "title": "LAB_B",
                        "props": {
                          "hidden": false,
                          "suffix": "",
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
                      "time": "2025-01-18 18:43:24",
                      "data": "",
                      "description": ""
                    }
                  ],
                  "columns": [
                    {
                      "title": "操作",
                      "colKey": "operate",
                      "width": 150,
                      "cell": "type-slot-operate"
                    }
                  ],
                  "params": {}
                },
                "description": "",
                "really_sample": true
              }
            },
            {
              "id": "f5c35da8-3c25-403e-a4aa-51b55d8f5460",
              "procedure_rowKey": "96bd6373-3439-4ed7-b972-ab9230c90aed/y9zzv3lu",
              "operate_rowKey": "4/uk0z6996",
              "operateType": "物料",
              "formData": {
                "yuan_cai_liao": [
                  "2c8fc50f-fa87-4423-baba-06be739b8d07"
                ],
                "shi_jian_unit": "y",
                "shi_jian": "1",
                "zhi_liang_unit": "kg",
                "zhi_liang": "2"
              },
              "formItems": {
                "id": 4,
                "name": "粉碎",
                "description": "",
                "type": "物料",
                "attribute": [
                  {
                    "id": 1,
                    "title": "原材料",
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
                      "multiple": false,
                      "required": false,
                      "expanding": false,
                      "validation": null,
                      "enablePrint": true
                    },
                    "key": "yuan_cai_liao",
                    "attribute_type": "single",
                    "multiple": false,
                    "rowKey": "1/bbkucetc",
                    "description": ""
                  },
                  {
                    "id": 2,
                    "title": "时间",
                    "type": "NumberInput",
                    "value": null,
                    "props": {
                      "unit": "y|M|d|h|m|s",
                      "hidden": false,
                      "suffix": "h",
                      "abstract": false,
                      "required": false,
                      "precision": null,
                      "enablePrint": true
                    },
                    "key": "shi_jian",
                    "attribute_type": "single",
                    "multiple": false,
                    "description": "",
                    "rowKey": "2/odrjw1z7"
                  },
                  {
                    "id": 4,
                    "title": "质量",
                    "type": "NumberInput",
                    "value": null,
                    "props": {
                      "unit": "kg|g|L|ml",
                      "hidden": false,
                      "suffix": "g",
                      "abstract": false,
                      "required": false,
                      "precision": null,
                      "enablePrint": true
                    },
                    "key": "zhi_liang",
                    "attribute_type": "single",
                    "multiple": false,
                    "description": "",
                    "rowKey": "4/d8xl9vwu"
                  }
                ],
                "rowKey": "4/uk0z6996",
                "key": "4/uk0z6996",
                "title": "粉碎",
                "operateType": "物料"
              },
              "description": "",
              "procedure": {
                "id": "96bd6373-3439-4ed7-b972-ab9230c90aed",
                "title": "粉碎过程",
                "key": "96bd6373-3439-4ed7-b972-ab9230c90aed",
                "rowKey": "96bd6373-3439-4ed7-b972-ab9230c90aed/y9zzv3lu"
              },
              "is_sample": false,
              "sample": {},
              "operate_router": {
                "id": 4,
                "title": "粉碎",
                "key": "4/uk0z6996",
                "rowKey": "4/uk0z6996"
              }
            },
            {
              "id": "8ceec7f2-46ca-4952-9a42-389a4eb85ef1",
              "procedure_rowKey": "96bd6373-3439-4ed7-b972-ab9230c90aed/y9zzv3lu",
              "operate_rowKey": "过程描述6x0sn3jb",
              "operateType": "过程描述",
              "formData": {},
              "formItems": {
                "title": "过程描述"
              },
              "procedure": {
                "id": "96bd6373-3439-4ed7-b972-ab9230c90aed",
                "title": "粉碎过程",
                "key": "96bd6373-3439-4ed7-b972-ab9230c90aed",
                "rowKey": "96bd6373-3439-4ed7-b972-ab9230c90aed/y9zzv3lu"
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
                    "name": "准备物料",
                    "description": "",
                    "type": "操作",
                    "attribute": [
                      {
                        "id": 2,
                        "title": "时间",
                        "type": "NumberInput",
                        "value": null,
                        "props": {
                          "unit": "y|M|d|h|m|s",
                          "hidden": false,
                          "suffix": "h",
                          "abstract": false,
                          "required": false,
                          "precision": null,
                          "enablePrint": true
                        },
                        "key": "shi_jian",
                        "attribute_type": "single",
                        "multiple": false,
                        "description": "",
                        "rowKey": "2/peqtp7z7"
                      },
                      {
                        "id": 4,
                        "title": "质量",
                        "type": "NumberInput",
                        "value": null,
                        "props": {
                          "unit": "kg|g|L|ml",
                          "hidden": false,
                          "suffix": "g",
                          "abstract": false,
                          "required": false,
                          "precision": null,
                          "enablePrint": true
                        },
                        "key": "zhi_liang",
                        "attribute_type": "single",
                        "multiple": false,
                        "description": "",
                        "rowKey": "4/672f3oyc"
                      }
                    ],
                    "rowKey": "2/g3q16i63",
                    "key": "2/g3q16i63",
                    "title": "准备物料",
                    "operateType": "操作"
                  },
                  {
                    "id": 4,
                    "name": "粉碎",
                    "description": "",
                    "type": "物料",
                    "attribute": [
                      {
                        "id": 1,
                        "title": "原材料",
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
                          "multiple": false,
                          "required": false,
                          "expanding": false,
                          "validation": null,
                          "enablePrint": true
                        },
                        "key": "yuan_cai_liao",
                        "attribute_type": "single",
                        "multiple": false,
                        "rowKey": "1/c17oqzq0",
                        "description": ""
                      },
                      {
                        "id": 2,
                        "title": "时间",
                        "type": "NumberInput",
                        "value": null,
                        "props": {
                          "unit": "y|M|d|h|m|s",
                          "hidden": false,
                          "suffix": "h",
                          "abstract": false,
                          "required": false,
                          "precision": null,
                          "enablePrint": true
                        },
                        "key": "shi_jian",
                        "attribute_type": "single",
                        "multiple": false,
                        "description": "",
                        "rowKey": "2/rwp0wyu5"
                      },
                      {
                        "id": 4,
                        "title": "质量",
                        "type": "NumberInput",
                        "value": null,
                        "props": {
                          "unit": "kg|g|L|ml",
                          "hidden": false,
                          "suffix": "g",
                          "abstract": false,
                          "required": false,
                          "precision": null,
                          "enablePrint": true
                        },
                        "key": "zhi_liang",
                        "attribute_type": "single",
                        "multiple": false,
                        "description": "",
                        "rowKey": "4/jjisdl97"
                      }
                    ],
                    "rowKey": "4/u5ss2c5h",
                    "key": "4/u5ss2c5h",
                    "title": "粉碎",
                    "operateType": "物料"
                  }
                ],
                "id": "500cf083-fcfc-4493-add7-122cc8ec2112",
                "key": "500cf083-fcfc-4493-add7-122cc8ec2112",
                "rowKey": "500cf083-fcfc-4493-add7-122cc8ec2112/6b85fir8",
                "title": "准备操作",
                "name": "准备操作"
              },
              {
                "formItems": [
                  {
                    "id": 1,
                    "name": "添加物料",
                    "description": "",
                    "type": "物料",
                    "attribute": [
                      {
                        "id": 3,
                        "title": "物料",
                        "type": "TableList",
                        "value": null,
                        "props": {
                          "hidden": false,
                          "columns": [
                            {
                              "id": 1,
                              "key": "yuan_cai_liao",
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
                                "multiple": false,
                                "required": false,
                                "expanding": false,
                                "validation": null,
                                "enablePrint": true
                              },
                              "title": "原材料",
                              "value": null,
                              "multiple": false,
                              "attribute_type": "single"
                            },
                            {
                              "id": 4,
                              "key": "zhi_liang",
                              "type": "NumberInput",
                              "unit": null,
                              "props": {
                                "unit": "kg|g|L|ml",
                                "hidden": false,
                                "suffix": "g",
                                "abstract": false,
                                "required": false,
                                "precision": null,
                                "enablePrint": true
                              },
                              "title": "质量",
                              "value": null,
                              "multiple": false,
                              "attribute_type": "single"
                            }
                          ],
                          "maxSize": 0,
                          "abstract": false,
                          "required": false,
                          "rowLayout": true,
                          "showBorder": false,
                          "enablePrint": true,
                          "showSummary": false,
                          "summaryColumns": []
                        },
                        "key": "wu_liao",
                        "attribute_type": "single",
                        "multiple": false,
                        "description": "",
                        "rowKey": "3/dks1hoxx"
                      }
                    ],
                    "rowKey": "1/t99aojvc",
                    "key": "1/t99aojvc",
                    "title": "添加物料",
                    "operateType": "物料"
                  },
                  {
                    "id": 4,
                    "name": "粉碎",
                    "description": "",
                    "type": "物料",
                    "attribute": [
                      {
                        "id": 1,
                        "title": "原材料",
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
                          "multiple": false,
                          "required": false,
                          "expanding": false,
                          "validation": null,
                          "enablePrint": true
                        },
                        "key": "yuan_cai_liao",
                        "attribute_type": "single",
                        "multiple": false,
                        "rowKey": "1/bbkucetc",
                        "description": ""
                      },
                      {
                        "id": 2,
                        "title": "时间",
                        "type": "NumberInput",
                        "value": null,
                        "props": {
                          "unit": "y|M|d|h|m|s",
                          "hidden": false,
                          "suffix": "h",
                          "abstract": false,
                          "required": false,
                          "precision": null,
                          "enablePrint": true
                        },
                        "key": "shi_jian",
                        "attribute_type": "single",
                        "multiple": false,
                        "description": "",
                        "rowKey": "2/odrjw1z7"
                      },
                      {
                        "id": 4,
                        "title": "质量",
                        "type": "NumberInput",
                        "value": null,
                        "props": {
                          "unit": "kg|g|L|ml",
                          "hidden": false,
                          "suffix": "g",
                          "abstract": false,
                          "required": false,
                          "precision": null,
                          "enablePrint": true
                        },
                        "key": "zhi_liang",
                        "attribute_type": "single",
                        "multiple": false,
                        "description": "",
                        "rowKey": "4/d8xl9vwu"
                      }
                    ],
                    "rowKey": "4/uk0z6996",
                    "key": "4/uk0z6996",
                    "title": "粉碎",
                    "operateType": "物料"
                  }
                ],
                "id": "96bd6373-3439-4ed7-b972-ab9230c90aed",
                "key": "96bd6373-3439-4ed7-b972-ab9230c90aed",
                "rowKey": "96bd6373-3439-4ed7-b972-ab9230c90aed/y9zzv3lu",
                "title": "粉碎过程",
                "name": "粉碎过程"
              }
            ],
            "formData": {
              "500cf083-fcfc-4493-add7-122cc8ec2112": {
                "description": "",
                "2/g3q16i63": {
                  "shi_jian_unit": "y",
                  "shi_jian": "2",
                  "zhi_liang_unit": "kg",
                  "zhi_liang": "3"
                },
                "4/u5ss2c5h": {
                  "yuan_cai_liao": [
                    "2c8fc50f-fa87-4423-baba-06be739b8d07"
                  ],
                  "shi_jian_unit": "y",
                  "shi_jian": "1",
                  "zhi_liang_unit": "kg",
                  "zhi_liang": "2"
                }
              },
              "96bd6373-3439-4ed7-b972-ab9230c90aed": {
                "description": "",
                "1/t99aojvc": {
                  "wu_liao": [
                    {
                      "1": [
                        "2c8fc50f-fa87-4423-baba-06be739b8d07"
                      ],
                      "4": "1"
                    }
                  ],
                  "zhi_liang_unit": "kg"
                },
                "4/uk0z6996": {
                  "yuan_cai_liao": [
                    "2c8fc50f-fa87-4423-baba-06be739b8d07"
                  ],
                  "shi_jian_unit": "y",
                  "shi_jian": "1",
                  "zhi_liang_unit": "kg",
                  "zhi_liang": "2"
                }
              }
            },
            "stepData": {
              "500cf083-fcfc-4493-add7-122cc8ec2112": {
                "description": "",
                "2/g3q16i63": {
                  "shi_jian_unit": "y",
                  "shi_jian": "2",
                  "zhi_liang_unit": "kg",
                  "zhi_liang": "3"
                },
                "4/u5ss2c5h": {
                  "yuan_cai_liao": [
                    "2c8fc50f-fa87-4423-baba-06be739b8d07"
                  ],
                  "shi_jian_unit": "y",
                  "shi_jian": "1",
                  "zhi_liang_unit": "kg",
                  "zhi_liang": "2"
                }
              },
              "96bd6373-3439-4ed7-b972-ab9230c90aed": {
                "description": "",
                "1/t99aojvc": {
                  "wu_liao": [
                    {
                      "1": [
                        "2c8fc50f-fa87-4423-baba-06be739b8d07"
                      ],
                      "4": "1"
                    }
                  ],
                  "zhi_liang_unit": "kg"
                },
                "4/uk0z6996": {
                  "yuan_cai_liao": [
                    "2c8fc50f-fa87-4423-baba-06be739b8d07"
                  ],
                  "shi_jian_unit": "y",
                  "shi_jian": "1",
                  "zhi_liang_unit": "kg",
                  "zhi_liang": "2"
                }
              }
            }
          },
          "designResult": {
            "formData": {
              "500cf083-fcfc-4493-add7-122cc8ec2112": {
                "description": "",
                "2/g3q16i63": {
                  "shi_jian_unit": "y",
                  "shi_jian": "2",
                  "zhi_liang_unit": "kg",
                  "zhi_liang": "3"
                },
                "4/u5ss2c5h": {
                  "yuan_cai_liao": [
                    "2c8fc50f-fa87-4423-baba-06be739b8d07"
                  ],
                  "shi_jian_unit": "y",
                  "shi_jian": "1",
                  "zhi_liang_unit": "kg",
                  "zhi_liang": "2"
                }
              },
              "96bd6373-3439-4ed7-b972-ab9230c90aed": {
                "description": "",
                "1/t99aojvc": {
                  "wu_liao": [
                    {
                      "1": [
                        "2c8fc50f-fa87-4423-baba-06be739b8d07"
                      ],
                      "4": "1"
                    }
                  ],
                  "zhi_liang_unit": "kg"
                },
                "4/uk0z6996": {
                  "yuan_cai_liao": [
                    "2c8fc50f-fa87-4423-baba-06be739b8d07"
                  ],
                  "shi_jian_unit": "y",
                  "shi_jian": "1",
                  "zhi_liang_unit": "kg",
                  "zhi_liang": "2"
                }
              }
            },
            "formItems": [
              {
                "formItems": [
                  {
                    "id": 2,
                    "name": "准备物料",
                    "description": "",
                    "type": "操作",
                    "attribute": [
                      {
                        "id": 2,
                        "title": "时间",
                        "type": "NumberInput",
                        "value": null,
                        "props": {
                          "unit": "y|M|d|h|m|s",
                          "hidden": false,
                          "suffix": "h",
                          "abstract": false,
                          "required": false,
                          "precision": null,
                          "enablePrint": true
                        },
                        "key": "shi_jian",
                        "attribute_type": "single",
                        "multiple": false,
                        "description": "",
                        "rowKey": "2/peqtp7z7"
                      },
                      {
                        "id": 4,
                        "title": "质量",
                        "type": "NumberInput",
                        "value": null,
                        "props": {
                          "unit": "kg|g|L|ml",
                          "hidden": false,
                          "suffix": "g",
                          "abstract": false,
                          "required": false,
                          "precision": null,
                          "enablePrint": true
                        },
                        "key": "zhi_liang",
                        "attribute_type": "single",
                        "multiple": false,
                        "description": "",
                        "rowKey": "4/672f3oyc"
                      }
                    ],
                    "rowKey": "2/g3q16i63",
                    "key": "2/g3q16i63",
                    "title": "准备物料",
                    "operateType": "操作"
                  },
                  {
                    "id": 4,
                    "name": "粉碎",
                    "description": "",
                    "type": "物料",
                    "attribute": [
                      {
                        "id": 1,
                        "title": "原材料",
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
                          "multiple": false,
                          "required": false,
                          "expanding": false,
                          "validation": null,
                          "enablePrint": true
                        },
                        "key": "yuan_cai_liao",
                        "attribute_type": "single",
                        "multiple": false,
                        "rowKey": "1/c17oqzq0",
                        "description": ""
                      },
                      {
                        "id": 2,
                        "title": "时间",
                        "type": "NumberInput",
                        "value": null,
                        "props": {
                          "unit": "y|M|d|h|m|s",
                          "hidden": false,
                          "suffix": "h",
                          "abstract": false,
                          "required": false,
                          "precision": null,
                          "enablePrint": true
                        },
                        "key": "shi_jian",
                        "attribute_type": "single",
                        "multiple": false,
                        "description": "",
                        "rowKey": "2/rwp0wyu5"
                      },
                      {
                        "id": 4,
                        "title": "质量",
                        "type": "NumberInput",
                        "value": null,
                        "props": {
                          "unit": "kg|g|L|ml",
                          "hidden": false,
                          "suffix": "g",
                          "abstract": false,
                          "required": false,
                          "precision": null,
                          "enablePrint": true
                        },
                        "key": "zhi_liang",
                        "attribute_type": "single",
                        "multiple": false,
                        "description": "",
                        "rowKey": "4/jjisdl97"
                      }
                    ],
                    "rowKey": "4/u5ss2c5h",
                    "key": "4/u5ss2c5h",
                    "title": "粉碎",
                    "operateType": "物料"
                  }
                ],
                "id": "500cf083-fcfc-4493-add7-122cc8ec2112",
                "key": "500cf083-fcfc-4493-add7-122cc8ec2112",
                "rowKey": "500cf083-fcfc-4493-add7-122cc8ec2112/6b85fir8",
                "title": "准备操作",
                "name": "准备操作"
              },
              {
                "formItems": [
                  {
                    "id": 1,
                    "name": "添加物料",
                    "description": "",
                    "type": "物料",
                    "attribute": [
                      {
                        "id": 3,
                        "title": "物料",
                        "type": "TableList",
                        "value": null,
                        "props": {
                          "hidden": false,
                          "columns": [
                            {
                              "id": 1,
                              "key": "yuan_cai_liao",
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
                                "multiple": false,
                                "required": false,
                                "expanding": false,
                                "validation": null,
                                "enablePrint": true
                              },
                              "title": "原材料",
                              "value": null,
                              "multiple": false,
                              "attribute_type": "single"
                            },
                            {
                              "id": 4,
                              "key": "zhi_liang",
                              "type": "NumberInput",
                              "unit": null,
                              "props": {
                                "unit": "kg|g|L|ml",
                                "hidden": false,
                                "suffix": "g",
                                "abstract": false,
                                "required": false,
                                "precision": null,
                                "enablePrint": true
                              },
                              "title": "质量",
                              "value": null,
                              "multiple": false,
                              "attribute_type": "single"
                            }
                          ],
                          "maxSize": 0,
                          "abstract": false,
                          "required": false,
                          "rowLayout": true,
                          "showBorder": false,
                          "enablePrint": true,
                          "showSummary": false,
                          "summaryColumns": []
                        },
                        "key": "wu_liao",
                        "attribute_type": "single",
                        "multiple": false,
                        "description": "",
                        "rowKey": "3/dks1hoxx"
                      }
                    ],
                    "rowKey": "1/t99aojvc",
                    "key": "1/t99aojvc",
                    "title": "添加物料",
                    "operateType": "物料"
                  },
                  {
                    "id": 4,
                    "name": "粉碎",
                    "description": "",
                    "type": "物料",
                    "attribute": [
                      {
                        "id": 1,
                        "title": "原材料",
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
                          "multiple": false,
                          "required": false,
                          "expanding": false,
                          "validation": null,
                          "enablePrint": true
                        },
                        "key": "yuan_cai_liao",
                        "attribute_type": "single",
                        "multiple": false,
                        "rowKey": "1/bbkucetc",
                        "description": ""
                      },
                      {
                        "id": 2,
                        "title": "时间",
                        "type": "NumberInput",
                        "value": null,
                        "props": {
                          "unit": "y|M|d|h|m|s",
                          "hidden": false,
                          "suffix": "h",
                          "abstract": false,
                          "required": false,
                          "precision": null,
                          "enablePrint": true
                        },
                        "key": "shi_jian",
                        "attribute_type": "single",
                        "multiple": false,
                        "description": "",
                        "rowKey": "2/odrjw1z7"
                      },
                      {
                        "id": 4,
                        "title": "质量",
                        "type": "NumberInput",
                        "value": null,
                        "props": {
                          "unit": "kg|g|L|ml",
                          "hidden": false,
                          "suffix": "g",
                          "abstract": false,
                          "required": false,
                          "precision": null,
                          "enablePrint": true
                        },
                        "key": "zhi_liang",
                        "attribute_type": "single",
                        "multiple": false,
                        "description": "",
                        "rowKey": "4/d8xl9vwu"
                      }
                    ],
                    "rowKey": "4/uk0z6996",
                    "key": "4/uk0z6996",
                    "title": "粉碎",
                    "operateType": "物料"
                  }
                ],
                "id": "96bd6373-3439-4ed7-b972-ab9230c90aed",
                "key": "96bd6373-3439-4ed7-b972-ab9230c90aed",
                "rowKey": "96bd6373-3439-4ed7-b972-ab9230c90aed/y9zzv3lu",
                "title": "粉碎过程",
                "name": "粉碎过程"
              }
            ],
            "orthogonalDesign": {
              "cycleNumber": 1,
              "stepItems": []
            },
            "id": "bfb268b4-400b-4a94-9676-8687cf1905f3",
            "title": "试验设计方案-20250118184312"
          },
          "selectRows": [],
          "title": "试验记录202501181842"
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
  // editorRef && editorRef.editorInstance?.commands.setContent(jsonContent)

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
