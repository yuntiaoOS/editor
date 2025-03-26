<template>
  <div class="box">
<!--    <div v-if="true" style="height:200px;">-->
<!--      <div v-for="(item,index) in resData " >-->
<!--        -&#45;&#45;{{item.notes}}-&#45;&#45;-->
<!--        <rich-text-editor v-model="item.notes" outputType="html"/>-->
<!--      </div>-->

<!--    </div>-->
<!--    -&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;-->
<!--    <div v-if="false" style="height:200px;">-->
<!--      <t-button @click="richTextTest">测试</t-button>-->
<!--      <rich-text-editor ref="richTextEditorRef" v-model="content1" outputType="json" @print="onPrint" @blur="onBlur"/>-->
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
const content = ref('<p>按时发放发放</p>')
const content1 = ref('<p>1111放</p>')
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

const richTextEditorRef = ref(null)
const richTextTest = () => {
  console.log('richTextTest',richTextEditorRef.value)
  richTextEditorRef.value.focus()
  return
  richTextEditorRef.value.setContent({
    "type": "doc",
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
            "text": "测试测试测试"
          }
        ]
      }
    ]
  })
}
const resData = ref([])
resData.value = [
  {
    "id": "2e9f6b11-820d-4ae7-b116-011019ccba00",
    "customer": {
      "id": "7636c683-8be0-4194-839c-18c6d98e34b6",
      "name": "奥德集团股份无限公司"
    },
    "contact": null,
    "follow_type": "QQ",
    "content": null,
    "follow_up_date": "2025-01-21 15:06:43",
    "notes": "<p>按时发放发放</p>",
    "image": null,
    "attachment": [],
    "status": "Pending",
    "follow_stage": "待跟进",
    "is_next_plan": true,
    "next_follow_up_plan": "烦烦烦",
    "next_follow_up_date": "2025-01-10 00:00:00"
  },
  {
    "id": "d2c94c19-9942-4e0f-89de-c21d49db8e4b",
    "customer": {
      "id": "7636c683-8be0-4194-839c-18c6d98e34b6",
      "name": "奥德集团股份无限公司"
    },
    "contact": null,
    "follow_type": "WeChat",
    "content": null,
    "follow_up_date": "2025-01-21 15:03:57",
    "notes": "<p>但是快捷方式开了房间</p>",
    "image": null,
    "attachment": [],
    "status": "Pending",
    "follow_stage": "待跟进",
    "is_next_plan": false,
    "next_follow_up_plan": null,
    "next_follow_up_date": "2025-01-16 00:00:00"
  },
  {
    "id": "15e401e6-d02c-4cb6-b9fc-6912766ac33b",
    "customer": {
      "id": "7636c683-8be0-4194-839c-18c6d98e34b6",
      "name": "奥德集团股份无限公司"
    },
    "contact": null,
    "follow_type": "FaceVisit",
    "content": null,
    "follow_up_date": "2025-01-21 15:01:09",
    "notes": "<p>委屈恶气呃</p>",
    "image": null,
    "attachment": [],
    "status": "Pending",
    "follow_stage": "待跟进",
    "is_next_plan": false,
    "next_follow_up_plan": null,
    "next_follow_up_date": "2025-01-16 00:00:00"
  },
  {
    "id": "b640138b-bd22-4375-adfb-962c3f91f499",
    "customer": {
      "id": "7636c683-8be0-4194-839c-18c6d98e34b6",
      "name": "奥德集团股份无限公司"
    },
    "contact": null,
    "follow_type": "QQ",
    "content": null,
    "follow_up_date": "2025-01-21 14:58:46",
    "notes": "<p>12未全额万绮雯</p>",
    "image": null,
    "attachment": [],
    "status": "Pending",
    "follow_stage": "待跟进",
    "is_next_plan": false,
    "next_follow_up_plan": null,
    "next_follow_up_date": "2025-01-16 00:00:00"
  },
  {
    "id": "a4eb750e-3c0b-4203-86a7-207f3cb2a60f",
    "customer": {
      "id": "7636c683-8be0-4194-839c-18c6d98e34b6",
      "name": "奥德集团股份无限公司"
    },
    "contact": null,
    "follow_type": "WeChat",
    "content": null,
    "follow_up_date": "2025-01-21 14:56:25",
    "notes": "<p><s>地方大师傅示范点发射点</s></p>",
    "image": null,
    "attachment": [],
    "status": "Pending",
    "follow_stage": "待跟进",
    "is_next_plan": false,
    "next_follow_up_plan": null,
    "next_follow_up_date": "2025-01-16 00:00:00"
  },
  {
    "id": "b257b0f6-8f91-4724-9ed2-7ce126269f0d",
    "customer": {
      "id": "7636c683-8be0-4194-839c-18c6d98e34b6",
      "name": "奥德集团股份无限公司"
    },
    "contact": null,
    "follow_type": "WeChat",
    "content": null,
    "follow_up_date": "2025-01-21 14:55:36",
    "notes": "<p><span style=\"font-size: 24pt\"><s><b>xlxlxlxlxllx</b></s></span></p>",
    "image": null,
    "attachment": [],
    "status": "Pending",
    "follow_stage": "待跟进",
    "is_next_plan": false,
    "next_follow_up_plan": null,
    "next_follow_up_date": null
  },
  {
    "id": "686e9cbd-bb55-4ca2-8e2f-8acfa7acb2b0",
    "customer": {
      "id": "7636c683-8be0-4194-839c-18c6d98e34b6",
      "name": "奥德集团股份无限公司"
    },
    "contact": null,
    "follow_type": "WeChat",
    "content": null,
    "follow_up_date": "2025-01-21 14:54:30",
    "notes": "<p>所说的草草草草</p>",
    "image": null,
    "attachment": [],
    "status": "Pending",
    "follow_stage": "待跟进",
    "is_next_plan": false,
    "next_follow_up_plan": null,
    "next_follow_up_date": null
  }
]

const onPrint = ({myHtml,printing}:any) => {
  richTextEditorRef.value.printHtmlString(myHtml)
  printing.value = false
}

const onBlur = (val:any)=>{
  console.log('------onBlur-----------',val)
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
      "id": "dfaf5eed-fdf1-43bc-a402-bbff15ab7c7c",
      "modifier_name": "赵紫文",
      "dept_belong_id": null,
      "creator_name": "赵紫文",
      "create_datetime": "2024-12-19 16:23:20",
      "update_datetime": "2024-12-19 17:41:51",
      "is_collect": false,
      "person_in_charge": {
        "id": "8528858f-7cb8-477e-bf17-fde3d2fbb23e",
        "user_id": "8528858f-7cb8-477e-bf17-fde3d2fbb23e",
        "name": "赵紫文",
        "is_owner": true,
        "avatar": "http://192.168.2.11:8002/media/avatar/8c51c4f5810b4bac61c5f1c4cba9c280_riejexI.jpg"
      },
      "participants": [
        {
          "id": "15d99c30-13b7-4794-a3be-1c26be2b7577",
          "user_id": "15d99c30-13b7-4794-a3be-1c26be2b7577",
          "name": "孙佳兴",
          "is_owner": true,
          "avatar": "http://192.168.2.11:8002/media/avatar/d11ff4ca-1921-42f9-819b-a45f347e59bb.png"
        },
        {
          "id": "964a5926-317b-4acd-bfcc-31d6bbfb6242",
          "user_id": "964a5926-317b-4acd-bfcc-31d6bbfb6242",
          "name": "董",
          "is_owner": false,
          "avatar": "http://192.168.2.11:8002/media/avatar/b8550976b630a34fb53dd5edc173a0ba.png"
        },
        {
          "id": "2bd57e8e-0115-47a5-b1c8-15de24edef9c",
          "user_id": "2bd57e8e-0115-47a5-b1c8-15de24edef9c",
          "name": "白欣力",
          "is_owner": true,
          "avatar": "http://192.168.2.11:8002/media/avatar/d15c4ed8-5e8a-471c-b86c-400e4950ea97.png"
        }
      ],
      "description": "wdewd了了了2柔柔弱弱柔柔弱弱柔柔弱弱揉揉揉呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃",
      "creator": "63aed191-f093-4e9d-b4ef-4a159ffa3938",
      "modifier": "63aed191-f093-4e9d-b4ef-4a159ffa3938",
      "name": "实验02251558",
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
      "id": "d4e44063-b7e9-45f6-affa-42cbe28335e0",
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
      "title": "SY02251559",
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
    umo_domain: 'http://192.168.2.11:8003/api', // 'https://msyf.eva.rongzhuamao.com/api',//
    umo_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQyODY4NjU4LCJpYXQiOjE3NDI3ODIyNTgsImp0aSI6IjdhMWY5YmMzMWFlZjRjODhiOTUyNzVjZTg0NjJjODY1IiwidXNlcl9pZCI6Ijg1Mjg4NThmLTdjYjgtNDc3ZS1iZjE3LWZkZTNkMmZiYjIzZSJ9.e0V7JSe-vMu3k2nqwL4_rSQiF_MFEwYwc7iFVhHWHHA',
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
          "id": "97bc2fa0-cc7f-4113-904c-4b3dd635ec28",
          "updateTime": "",
          "key": "baseTitle",
          "name": "925f4fc9-9fdf-486b-a1c5-663f7ee41c63",
          "isChanged": false,
          "title": "发生发撒",
          "sn": "",
          "showSubTitle": true
        }
      },
      {
        "type": "paragraph",
        "attrs": {
          "indent": null,
          "textAlign": null,
          "lineHeight": 1.5,
          "margin": {}
        }
      },
      {
        "type": "paragraph",
        "attrs": {
          "indent": null,
          "textAlign": null,
          "lineHeight": 1.5,
          "margin": {}
        }
      },
      {
        "type": "xmTitleContent",
        "attrs": {
          "key": "81d4d47d-3734-4b82-9d6d-9578a9ec311e",
          "content": "目的",
          "title": "试验目的："
        },
        "content": [
          {
            "type": "heading",
            "attrs": {
              "indent": null,
              "textAlign": "left",
              "lineHeight": 1.5,
              "margin": {},
              "id": "elm5s8",
              "data-toc-id": "elm5s8",
              "level": 2
            },
            "content": [
              {
                "type": "text",
                "text": "试验目的："
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
            },
            "content": [
              {
                "type": "text",
                "text": "目的"
              }
            ]
          }
        ]
      },
      {
        "type": "raw_material_table",
        "attrs": {
          "id": "770a2fe0-fa5f-4ada-99bc-eddf5c51f224",
          "updateTime": "2025-03-24 15:26:16",
          "key": "raw_material_table20250324152609",
          "name": "f104f5a9-f936-440c-881d-12a37d4c4293",
          "isChanged": false,
          "change_log": {},
          "is_integration": false,
          "table_data": [
            {
              "id": "edc4ea79-6a5e-4bba-ab4b-0e7e772ff63d",
              "name": "12314532q35",
              "sn": "1213123",
              "batch": "1",
              "cas": "123123",
              "brand": null,
              "brand_model": null,
              "create_datetime": "2025-03-18 10:31:35",
              "creator": {
                "id": "2bd57e8e-0115-47a5-b1c8-15de24edef9c",
                "name": "白欣力",
                "avatar": "http://192.168.2.11:8002/media/avatar/d15c4ed8-5e8a-471c-b86c-400e4950ea97.png"
              },
              "price": null,
              "description": null,
              "state_id": "",
              "supplier": null,
              "is_liquid": true,
              "margin_unit": null,
              "shelf_life": null,
              "state": null
            },
            {
              "id": "d9e4d7ca-66f7-4438-b2c4-11463d1494fe",
              "name": "吐温80（聚山梨醇酯80，化妆品级）",
              "sn": "20250314151402357",
              "batch": "nan",
              "cas": "9005-65-6",
              "brand": "nan",
              "brand_model": "nan",
              "create_datetime": "2025-03-14 15:14:02",
              "creator": null,
              "price": 0,
              "description": "nan",
              "state_id": "",
              "supplier": "北京华誉德润科技有限公司",
              "is_liquid": false,
              "margin_unit": "g",
              "shelf_life": null,
              "state": null
            },
            {
              "id": "496591d0-9895-4e16-9aeb-0440395c3081",
              "name": "吐温80（聚山梨醇酯80，药辅级）",
              "sn": "20250314151402356",
              "batch": "20240401",
              "cas": "9005-65-6",
              "brand": "nan",
              "brand_model": "nan",
              "create_datetime": "2025-03-14 15:14:02",
              "creator": null,
              "price": 0,
              "description": "nan",
              "state_id": "",
              "supplier": "天津市",
              "is_liquid": false,
              "margin_unit": "g",
              "shelf_life": null,
              "state": null
            },
            {
              "id": "51e470a9-39a1-48e1-8f6c-7411ebed85cd",
              "name": "二水合磷酸二氢钠（AR）",
              "sn": "20250314151402355",
              "batch": "B2202241",
              "cas": "13472-35-1",
              "brand": "nan",
              "brand_model": "nan",
              "create_datetime": "2025-03-14 15:14:02",
              "creator": null,
              "price": 0,
              "description": "nan",
              "state_id": "",
              "supplier": "佛山西陇化工有限公司",
              "is_liquid": false,
              "margin_unit": "g",
              "shelf_life": null,
              "state": null
            }
          ],
          "title": "发生发撒/物料01"
        }
      },
      {
        "type": "paragraph",
        "attrs": {
          "indent": null,
          "textAlign": null,
          "lineHeight": 1.5,
          "margin": {}
        }
      },
      {
        "type": "paragraph",
        "attrs": {
          "indent": null,
          "textAlign": null,
          "lineHeight": 1.5,
          "margin": {}
        }
      },
      {
        "type": "paragraph",
        "attrs": {
          "indent": null,
          "textAlign": null,
          "lineHeight": 1.5,
          "margin": {}
        }
      },
      {
        "type": "technology_table",
        "attrs": {
          "id": "211565b2-1845-4b92-b404-df52419284d3",
          "updateTime": "",
          "key": "technology_table20250324152609",
          "name": "ec050beb-35bb-48c8-995f-a513901d18ea",
          "isChanged": false,
          "change_log": {},
          "is_integration": false,
          "table_data": [
            {
              "id": "c994c2f2-f16b-48cd-bd4a-c2530fb7ad7a",
              "rowKey": "c994c2f2-f16b-48cd-bd4a-c2530fb7ad7a/lbe7qml0",
              "name": "准备操作",
              "type": "procedure",
              "description": "",
              "form": {
                "formItems": [
                  {
                    "id": 1,
                    "name": "添加物料",
                    "type": "物料",
                    "attribute": [
                      {
                        "id": 3,
                        "key": "wu_liao",
                        "type": "TableList",
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
                        "title": "物料",
                        "value": null,
                        "multiple": false,
                        "attribute_type": "single",
                        "description": "",
                        "rowKey": "3/7uwe4q32"
                      }
                    ],
                    "description": "",
                    "attribute_info": [
                      {
                        "id": 3,
                        "key": "wu_liao",
                        "type": "TableList",
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
                        "title": "物料",
                        "value": null,
                        "multiple": false,
                        "attribute_type": "single"
                      }
                    ],
                    "rowKey": "1/5l4kkwyq",
                    "key": "1/5l4kkwyq",
                    "title": "添加物料",
                    "operateType": "物料"
                  },
                  {
                    "id": 2,
                    "name": "准备物料",
                    "type": "操作",
                    "attribute": [
                      {
                        "id": 2,
                        "key": "shi_jian",
                        "type": "NumberInput",
                        "props": {
                          "unit": "y|M|d|h|m|s",
                          "hidden": false,
                          "suffix": "h",
                          "abstract": false,
                          "required": false,
                          "precision": null,
                          "enablePrint": true
                        },
                        "title": "时间",
                        "value": null,
                        "multiple": false,
                        "attribute_type": "single",
                        "description": "",
                        "rowKey": "2/i4obqx13"
                      },
                      {
                        "id": 4,
                        "key": "zhi_liang",
                        "type": "NumberInput",
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
                        "attribute_type": "single",
                        "description": "",
                        "rowKey": "4/flxrcukb"
                      }
                    ],
                    "description": "",
                    "attribute_info": [
                      {
                        "id": 2,
                        "key": "shi_jian",
                        "type": "NumberInput",
                        "props": {
                          "unit": "y|M|d|h|m|s",
                          "hidden": false,
                          "suffix": "h",
                          "abstract": false,
                          "required": false,
                          "precision": null,
                          "enablePrint": true
                        },
                        "title": "时间",
                        "value": null,
                        "multiple": false,
                        "attribute_type": "single"
                      },
                      {
                        "id": 4,
                        "key": "zhi_liang",
                        "type": "NumberInput",
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
                    "rowKey": "2/xgeppx5d",
                    "key": "2/xgeppx5d",
                    "title": "准备物料",
                    "operateType": "操作"
                  }
                ],
                "formData": {
                  "description": "",
                  "1/5l4kkwyq": {
                    "wu_liao": []
                  },
                  "2/xgeppx5d": {
                    "shi_jian_unit": "",
                    "shi_jian": "",
                    "zhi_liang_unit": "",
                    "zhi_liang": ""
                  }
                }
              }
            }
          ],
          "title": "发生发撒/工艺01"
        }
      },
      {
        "type": "paragraph",
        "attrs": {
          "indent": null,
          "textAlign": null,
          "lineHeight": 1.5,
          "margin": {}
        }
      },
      {
        "type": "paragraph",
        "attrs": {
          "indent": null,
          "textAlign": null,
          "lineHeight": 1.5,
          "margin": {}
        }
      },
      {
        "type": "test_record_table",
        "attrs": {
          "id": "b3276132-6464-4a4e-9bde-d87169b4857b",
          "updateTime": "",
          "key": "test_record_table20250324152637",
          "name": "0eb0ee6a-da01-4f4e-a83c-3f84ea9d7eb3",
          "isChanged": false,
          "customerParams": {},
          "group": "",
          "table_data": [],
          "designParams": "211565b2-1845-4b92-b404-df52419284d3",
          "designResult": {},
          "selectRows": [],
          "title": "发生发撒/试验记录01"
        }
      },
      {
        "type": "paragraph",
        "attrs": {
          "indent": null,
          "textAlign": null,
          "lineHeight": 1.5,
          "margin": {}
        },
        "content": [
          {
            "type": "text",
            "text": "ffd"
          }
        ]
      },
      {
        "type": "paragraph",
        "attrs": {
          "indent": null,
          "textAlign": null,
          "lineHeight": 1.5,
          "margin": {}
        }
      },
      {
        "type": "paragraph",
        "attrs": {
          "indent": null,
          "textAlign": null,
          "lineHeight": 1.5,
          "margin": {}
        }
      },
      {
        "type": "paragraph",
        "attrs": {
          "indent": null,
          "textAlign": null,
          "lineHeight": 1.5,
          "margin": {}
        }
      },
      {
        "type": "paragraph",
        "attrs": {
          "indent": null,
          "textAlign": null,
          "lineHeight": 1.5,
          "margin": {}
        }
      },
      {
        "type": "paragraph",
        "attrs": {
          "indent": null,
          "textAlign": null,
          "lineHeight": 1.5,
          "margin": {}
        }
      },
      {
        "type": "xmTitleContent",
        "attrs": {
          "key": "81d4d47d-3734-4b82-9d6d-9578a9ec311e",
          "content": "结论",
          "title": "试验结论："
        },
        "content": [
          {
            "type": "heading",
            "attrs": {
              "indent": null,
              "textAlign": "left",
              "lineHeight": 1.5,
              "margin": {},
              "id": "41cs72",
              "data-toc-id": "41cs72",
              "level": 2
            },
            "content": [
              {
                "type": "text",
                "text": "试验结论："
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
            },
            "content": [
              {
                "type": "text",
                "text": "结论"
              }
            ]
          }
        ]
      },
      {
        "type": "paragraph",
        "attrs": {
          "indent": null,
          "textAlign": null,
          "lineHeight": 1.5,
          "margin": {}
        }
      },
      {
        "type": "paragraph",
        "attrs": {
          "indent": null,
          "textAlign": null,
          "lineHeight": 1.5,
          "margin": {}
        }
      },
      {
        "type": "paragraph",
        "attrs": {
          "indent": null,
          "textAlign": null,
          "lineHeight": 1.5,
          "margin": {}
        }
      }
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
