<template>
  <div class="box">
<!--    <div v-if="true" style="height:200px;">-->
<!--      <div v-for="(item,index) in resData " >-->
<!--        -&#45;&#45;{{item.notes}}-&#45;&#45;-->
<!--        <rich-text-editor v-model="item.notes" outputType="html"/>-->
<!--      </div>-->

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
const content = ref('<p>按时发放发放</p>')
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
    umo_domain: 'http://192.168.2.11:8003/api', // 'https://msyf.eva.rongzhuamao.com/api',//
    umo_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzM5NDQwMjgyLCJpYXQiOjE3MzkzNTM4ODIsImp0aSI6IjNjOWVhNTg4NTJkNzRmMDM4MjcxZjlkNTZjNjMzZjU0IiwidXNlcl9pZCI6Ijg1Mjg4NThmLTdjYjgtNDc3ZS1iZjE3LWZkZTNkMmZiYjIzZSJ9.kKovmVzXW579DwXVXO1jxLzpNJZ8fhwDlusCz14b7R0',
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
          "id": "db0e9ce2-0858-4950-9de1-b4188d13bedc",
          "updateTime": "",
          "key": "baseTitle",
          "name": "e87d20ab-c607-4f03-be05-9ae087e926d2",
          "isChanged": false,
          "title": "SY02121629",
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
          "key": "f736e1b2-4b66-4686-8d38-33b620944fef",
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
          "id": "6b116d4c-793a-4aa6-9c4e-bfea68ab6e39",
          "updateTime": "2025-02-12 16:29:43",
          "key": "raw_material_table20250212162927",
          "name": "a375c972-f43f-47aa-90a2-4ba1f3103736",
          "isChanged": false,
          "change_log": {},
          "is_integration": false,
          "table_data": [
            {
              "id": "54fe20ed-86df-420c-afa6-dc3c04c03370",
              "sn": "111",
              "cas": "1111",
              "name": "111",
              "batch": "1111",
              "brand": null,
              "price": null,
              "state": "Not-Started",
              "creator": {
                "id": "8528858f-7cb8-477e-bf17-fde3d2fbb23e",
                "name": "赵紫文",
                "avatar": "192.168.2.11:8002/media/avatar/8c51c4f5810b4bac61c5f1c4cba9c280.png"
              },
              "supplier": null,
              "is_liquid": true,
              "brand_model": null,
              "description": null,
              "create_datetime": "2025-02-08 20:24:29"
            },
            {
              "id": "43c9812b-d6f6-4164-8f98-cb64ae69f7d3",
              "sn": "222222",
              "cas": null,
              "name": "测试共达到瓦大大哇哒",
              "batch": "222222",
              "brand": null,
              "price": null,
              "state": "Not-Started",
              "creator": {
                "id": "2bd57e8e-0115-47a5-b1c8-15de24edef9c",
                "name": "白欣力1",
                "avatar": "192.168.2.11:8002/media/avatar/60576d2c-6bac-4dae-a7b9-b1856a833349.png"
              },
              "supplier": null,
              "is_liquid": false,
              "brand_model": null,
              "description": null,
              "create_datetime": "2025-01-22 16:07:28"
            },
            {
              "id": "54730f09-9ade-4967-9412-614c8df9dd79",
              "sn": "E207",
              "cas": "8001-21-6",
              "name": "葵花籽油",
              "batch": "E20725010801",
              "brand": "品牌",
              "price": 123,
              "state": "Not-Started",
              "creator": {
                "id": "8528858f-7cb8-477e-bf17-fde3d2fbb23e",
                "name": "赵紫文",
                "avatar": "192.168.2.11:8002/media/avatar/8c51c4f5810b4bac61c5f1c4cba9c280.png"
              },
              "supplier": "供应商",
              "is_liquid": false,
              "brand_model": "品牌型号",
              "description": "发士大夫大师傅",
              "create_datetime": "2025-01-20 13:59:46"
            },
            {
              "id": "cd1faf63-9d7d-4993-a314-6e566acad5ad",
              "sn": "J003",
              "cas": "128497-20-1",
              "name": "澳洲坚果油",
              "batch": "J003B24050901",
              "brand": null,
              "price": null,
              "state": "Not-Started",
              "creator": null,
              "supplier": null,
              "is_liquid": false,
              "brand_model": null,
              "description": null,
              "create_datetime": "2025-01-20 13:58:51"
            }
          ],
          "title": "SY02121629/物料01"
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
          "id": "28e759b7-23c5-451e-ad52-c4aaa6d7b79a",
          "updateTime": "",
          "key": "technology_table20250212162927",
          "name": "19020beb-d966-4ae2-a786-82c4bb23003d",
          "isChanged": false,
          "change_log": {},
          "is_integration": false,
          "table_data": [
            {
              "id": "ec555345-a7ea-4393-9926-149642a027c6",
              "form": {
                "formData": {
                  "2/thmapeoh": {
                    "shi_jian": "",
                    "zhi_liang": "",
                    "shi_jian_unit": "",
                    "zhi_liang_unit": ""
                  },
                  "4/g0rphwxk": {
                    "shi_jian": "",
                    "zhi_liang": "",
                    "shi_jian_unit": "",
                    "yuan_cai_liao": [],
                    "zhi_liang_unit": ""
                  },
                  "description": ""
                },
                "formItems": [
                  {
                    "id": 2,
                    "key": "2/thmapeoh",
                    "name": "准备物料",
                    "type": "操作",
                    "title": "准备物料",
                    "rowKey": "2/thmapeoh",
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
                        "rowKey": "2/00gpndbx",
                        "multiple": false,
                        "description": "",
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
                        "rowKey": "4/cmkygq14",
                        "multiple": false,
                        "description": "",
                        "attribute_type": "single"
                      }
                    ],
                    "description": "",
                    "operateType": "操作"
                  },
                  {
                    "id": 4,
                    "key": "4/g0rphwxk",
                    "name": "粉碎",
                    "type": "物料",
                    "title": "粉碎",
                    "rowKey": "4/g0rphwxk",
                    "attribute": [
                      {
                        "id": 1,
                        "key": "yuan_cai_liao",
                        "type": "SelectMaterial",
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
                        "rowKey": "1/kay52ekd",
                        "multiple": false,
                        "description": "",
                        "attribute_type": "single"
                      },
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
                        "rowKey": "2/wiu4z50k",
                        "multiple": false,
                        "description": "",
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
                        "rowKey": "4/ih57g9by",
                        "multiple": false,
                        "description": "",
                        "attribute_type": "single"
                      }
                    ],
                    "description": "",
                    "operateType": "物料"
                  }
                ]
              },
              "name": "准备操作",
              "type": "procedure",
              "rowKey": "ec555345-a7ea-4393-9926-149642a027c6/umty9w1k",
              "description": ""
            },
            {
              "id": "9b88ce19-2ffa-4e04-a61f-3cfc99e81c6f",
              "form": {
                "formData": {
                  "2/vgzdw3dl": {
                    "shi_jian": "",
                    "zhi_liang": "",
                    "shi_jian_unit": "",
                    "zhi_liang_unit": ""
                  },
                  "3/uikh6h09": {
                    "shi_jian": "",
                    "shi_jian_unit": "",
                    "yuan_cai_liao": []
                  },
                  "description": ""
                },
                "formItems": [
                  {
                    "id": 2,
                    "key": "2/vgzdw3dl",
                    "name": "准备物料",
                    "type": "操作",
                    "title": "准备物料",
                    "rowKey": "2/vgzdw3dl",
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
                        "rowKey": "2/6j00etej",
                        "multiple": false,
                        "description": "",
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
                        "rowKey": "4/31q9kkno",
                        "multiple": false,
                        "description": "",
                        "attribute_type": "single"
                      }
                    ],
                    "description": "",
                    "operateType": "操作"
                  },
                  {
                    "id": 3,
                    "key": "3/uikh6h09",
                    "name": "加热",
                    "type": "操作",
                    "title": "加热",
                    "rowKey": "3/uikh6h09",
                    "attribute": [
                      {
                        "id": 1,
                        "key": "yuan_cai_liao",
                        "type": "SelectMaterial",
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
                        "rowKey": "1/zt5una53",
                        "multiple": false,
                        "description": "",
                        "attribute_type": "single"
                      },
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
                        "rowKey": "2/zpmztru3",
                        "multiple": false,
                        "description": "",
                        "attribute_type": "single"
                      }
                    ],
                    "description": "",
                    "operateType": "操作"
                  }
                ]
              },
              "name": "提取物料",
              "type": "procedure",
              "rowKey": "9b88ce19-2ffa-4e04-a61f-3cfc99e81c6f/ufy08yr5",
              "description": ""
            },
            {
              "id": "ddbe2ad1-b6a8-4f55-8011-f8245f5a5025",
              "form": {
                "formData": {
                  "6/nlvt3wzh": {
                    "liao_ye_bi": []
                  },
                  "description": ""
                },
                "formItems": [
                  {
                    "id": 6,
                    "key": "6/nlvt3wzh",
                    "name": "料液比",
                    "type": "物料",
                    "title": "料液比",
                    "rowKey": "6/nlvt3wzh",
                    "attribute": [
                      {
                        "id": 6,
                        "key": "liao_ye_bi",
                        "type": "MaterialList",
                        "props": {
                          "unit": "kg|g|L|ml",
                          "hidden": false,
                          "options": [],
                          "abstract": false,
                          "required": false,
                          "enablePrint": true
                        },
                        "title": "料液比",
                        "value": null,
                        "rowKey": "6/k8h3it0h",
                        "multiple": false,
                        "description": "",
                        "attribute_type": "single"
                      }
                    ],
                    "description": "",
                    "operateType": "物料",
                    "attribute_info": [
                      {
                        "id": 6,
                        "key": "liao_ye_bi",
                        "type": "MaterialList",
                        "props": {
                          "unit": "kg|g|L|ml",
                          "hidden": false,
                          "options": [],
                          "abstract": false,
                          "required": false,
                          "enablePrint": true
                        },
                        "title": "料液比",
                        "value": null,
                        "multiple": false,
                        "attribute_type": "single"
                      }
                    ]
                  }
                ]
              },
              "name": "自定义",
              "type": "procedure",
              "rowKey": "ddbe2ad1-b6a8-4f55-8011-f8245f5a5025/555lenup",
              "description": ""
            }
          ],
          "title": "SY02121629/工艺01"
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
          "id": "facc2630-0f7c-4635-a9c1-558882221cb2",
          "updateTime": "2025-02-12 18:53:18",
          "key": "test_record_table20250212184946",
          "name": "21f6db27-c83d-4692-826f-62743fcb65b2",
          "isChanged": false,
          "customerParams": {},
          "group": "",
          "table_data": [
            {
              "id": "3d30257a-2b14-44a6-b7cd-beb0e79e88d9",
              "sample": {},
              "formData": {
                "shi_jian": "34",
                "zhi_liang": "54",
                "attachment": [],
                "shi_jian_unit": "y",
                "zhi_liang_unit": "kg"
              },
              "formItems": {
                "id": 2,
                "key": "2/thmapeoh",
                "name": "准备物料",
                "type": "操作",
                "title": "准备物料",
                "rowKey": "2/thmapeoh",
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
                    "rowKey": "2/00gpndbx",
                    "multiple": false,
                    "description": "",
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
                    "rowKey": "4/cmkygq14",
                    "multiple": false,
                    "description": "",
                    "attribute_type": "single"
                  }
                ],
                "description": "",
                "operateType": "操作"
              },
              "is_sample": false,
              "procedure": {
                "id": "ec555345-a7ea-4393-9926-149642a027c6",
                "key": "ec555345-a7ea-4393-9926-149642a027c6",
                "title": "准备操作",
                "rowKey": "ec555345-a7ea-4393-9926-149642a027c6/umty9w1k"
              },
              "description": "",
              "operateType": "操作",
              "operate_router": {
                "id": 2,
                "key": "2/thmapeoh",
                "title": "准备物料",
                "rowKey": "2/thmapeoh"
              },
              "operate_rowKey": "2/thmapeoh",
              "procedure_rowKey": "ec555345-a7ea-4393-9926-149642a027c6/umty9w1k"
            },
            {
              "id": "f605bde8-c4aa-4652-add5-900177a2c885",
              "sample": {},
              "formData": {
                "shi_jian": "45",
                "zhi_liang": "43",
                "attachment": [],
                "shi_jian_unit": "y",
                "yuan_cai_liao": "54730f09-9ade-4967-9412-614c8df9dd79",
                "zhi_liang_unit": "kg"
              },
              "formItems": {
                "id": 4,
                "key": "4/g0rphwxk",
                "name": "粉碎",
                "type": "物料",
                "title": "粉碎",
                "rowKey": "4/g0rphwxk",
                "attribute": [
                  {
                    "id": 1,
                    "key": "yuan_cai_liao",
                    "type": "SelectMaterial",
                    "props": {
                      "http": {},
                      "fixed": true,
                      "hidden": false,
                      "suffix": null,
                      "options": [
                        {
                          "group": "SY02121629/物料01",
                          "children": [
                            {
                              "label": "111/111",
                              "value": "54fe20ed-86df-420c-afa6-dc3c04c03370",
                              "is_liquid": true
                            },
                            {
                              "label": "测试共达到瓦大大哇哒/222222",
                              "value": "43c9812b-d6f6-4164-8f98-cb64ae69f7d3",
                              "is_liquid": false
                            },
                            {
                              "label": "葵花籽油/E207",
                              "value": "54730f09-9ade-4967-9412-614c8df9dd79",
                              "is_liquid": false
                            },
                            {
                              "label": "澳洲坚果油/J003",
                              "value": "cd1faf63-9d7d-4993-a314-6e566acad5ad",
                              "is_liquid": false
                            }
                          ]
                        },
                        {
                          "group": "样品",
                          "children": []
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
                    "rowKey": "1/kay52ekd",
                    "multiple": false,
                    "description": "",
                    "attribute_type": "single"
                  },
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
                    "rowKey": "2/wiu4z50k",
                    "multiple": false,
                    "description": "",
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
                    "rowKey": "4/ih57g9by",
                    "multiple": false,
                    "description": "",
                    "attribute_type": "single"
                  }
                ],
                "description": "",
                "operateType": "物料"
              },
              "is_sample": false,
              "procedure": {
                "id": "ec555345-a7ea-4393-9926-149642a027c6",
                "key": "ec555345-a7ea-4393-9926-149642a027c6",
                "title": "准备操作",
                "rowKey": "ec555345-a7ea-4393-9926-149642a027c6/umty9w1k"
              },
              "description": "",
              "operateType": "物料",
              "operate_router": {
                "id": 4,
                "key": "4/g0rphwxk",
                "title": "粉碎",
                "rowKey": "4/g0rphwxk"
              },
              "operate_rowKey": "4/g0rphwxk",
              "procedure_rowKey": "ec555345-a7ea-4393-9926-149642a027c6/umty9w1k"
            },
            {
              "id": "219ab4d1-a058-4d3c-81bc-2305053acd16",
              "params": {},
              "sample": {},
              "formData": {},
              "formItems": {
                "title": "过程描述"
              },
              "is_sample": false,
              "procedure": {
                "id": "ec555345-a7ea-4393-9926-149642a027c6",
                "key": "ec555345-a7ea-4393-9926-149642a027c6",
                "title": "准备操作",
                "rowKey": "ec555345-a7ea-4393-9926-149642a027c6/umty9w1k"
              },
              "operateType": "过程描述",
              "operate_router": {
                "title": "过程描述"
              },
              "operate_rowKey": "过程描述ci89wftg",
              "procedure_rowKey": "ec555345-a7ea-4393-9926-149642a027c6/umty9w1k"
            },
            {
              "id": "7a0f9424-95e9-46cc-a7cc-5bbce8c510c7",
              "sample": {},
              "formData": {
                "shi_jian": "23",
                "zhi_liang": "32",
                "attachment": [],
                "shi_jian/2": "54",
                "zhi_liang/4": "65",
                "shi_jian/2/3": "43",
                "shi_jian_unit": "y",
                "zhi_liang_unit": "kg",
                "shi_jian/2_unit": "y",
                "zhi_liang/4_unit": "kg",
                "shi_jian/2/3_unit": "y"
              },
              "formItems": {
                "id": 2,
                "key": "2/vgzdw3dl",
                "name": "准备物料",
                "type": "操作",
                "title": "准备物料",
                "rowKey": "2/vgzdw3dl",
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
                      "orthogonal": true,
                      "enablePrint": true
                    },
                    "title": "时间",
                    "value": null,
                    "rowKey": "2/6j00etej",
                    "multiple": false,
                    "description": "",
                    "attribute_type": "single"
                  },
                  {
                    "id": 2,
                    "key": "shi_jian/2",
                    "type": "NumberInput",
                    "props": {
                      "unit": "y|M|d|h|m|s",
                      "hidden": false,
                      "suffix": "h",
                      "abstract": false,
                      "required": false,
                      "precision": null,
                      "orthogonal": true,
                      "enablePrint": true
                    },
                    "title": "时间",
                    "value": null,
                    "rowKey": "2/6j00etej2",
                    "multiple": false,
                    "description": "",
                    "attribute_type": "single"
                  },
                  {
                    "id": 2,
                    "key": "shi_jian/2/3",
                    "type": "NumberInput",
                    "props": {
                      "unit": "y|M|d|h|m|s",
                      "hidden": false,
                      "suffix": "h",
                      "abstract": false,
                      "required": false,
                      "precision": null,
                      "orthogonal": true,
                      "enablePrint": true
                    },
                    "title": "时间",
                    "value": null,
                    "rowKey": "2/6j00etej23",
                    "multiple": false,
                    "description": "",
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
                      "orthogonal": true,
                      "enablePrint": true
                    },
                    "title": "质量",
                    "value": null,
                    "rowKey": "4/31q9kkno",
                    "multiple": false,
                    "description": "",
                    "attribute_type": "single"
                  },
                  {
                    "id": 4,
                    "key": "zhi_liang/4",
                    "type": "NumberInput",
                    "props": {
                      "unit": "kg|g|L|ml",
                      "hidden": false,
                      "suffix": "g",
                      "abstract": false,
                      "required": false,
                      "precision": null,
                      "orthogonal": true,
                      "enablePrint": true
                    },
                    "title": "质量",
                    "value": null,
                    "rowKey": "4/31q9kkno4",
                    "multiple": false,
                    "description": "",
                    "attribute_type": "single"
                  }
                ],
                "description": "",
                "operateType": "操作"
              },
              "is_sample": false,
              "procedure": {
                "id": "9b88ce19-2ffa-4e04-a61f-3cfc99e81c6f",
                "key": "9b88ce19-2ffa-4e04-a61f-3cfc99e81c6f",
                "title": "提取物料",
                "rowKey": "9b88ce19-2ffa-4e04-a61f-3cfc99e81c6f/ufy08yr5"
              },
              "description": "",
              "operateType": "操作",
              "operate_router": {
                "id": 2,
                "key": "2/vgzdw3dl",
                "title": "准备物料",
                "rowKey": "2/vgzdw3dl"
              },
              "operate_rowKey": "2/vgzdw3dl",
              "procedure_rowKey": "9b88ce19-2ffa-4e04-a61f-3cfc99e81c6f/ufy08yr5"
            },
            {
              "id": "248911cb-b295-41d3-adca-b95da34ff4e7",
              "params": [
                {
                  "id": "7a0f9424-95e9-46cc-a7cc-5bbce8c510c7",
                  "formItems": {
                    "attribute": [
                      {
                        "items": [
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
                              "orthogonal": true,
                              "enablePrint": true
                            },
                            "title": "时间",
                            "value": null,
                            "rowKey": "2/6j00etej",
                            "multiple": false,
                            "description": "",
                            "attribute_type": "single"
                          },
                          {
                            "id": 2,
                            "key": "shi_jian/2",
                            "type": "NumberInput",
                            "props": {
                              "unit": "y|M|d|h|m|s",
                              "hidden": false,
                              "suffix": "h",
                              "abstract": false,
                              "required": false,
                              "precision": null,
                              "orthogonal": true,
                              "enablePrint": true
                            },
                            "title": "时间",
                            "value": null,
                            "rowKey": "2/6j00etej2",
                            "multiple": false,
                            "description": "",
                            "attribute_type": "single"
                          },
                          {
                            "id": 2,
                            "key": "shi_jian/2/3",
                            "type": "NumberInput",
                            "props": {
                              "unit": "y|M|d|h|m|s",
                              "hidden": false,
                              "suffix": "h",
                              "abstract": false,
                              "required": false,
                              "precision": null,
                              "orthogonal": true,
                              "enablePrint": true
                            },
                            "title": "时间",
                            "value": null,
                            "rowKey": "2/6j00etej23",
                            "multiple": false,
                            "description": "",
                            "attribute_type": "single"
                          }
                        ],
                        "value": "shi_jian"
                      },
                      {
                        "items": [
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
                              "orthogonal": true,
                              "enablePrint": true
                            },
                            "title": "质量",
                            "value": null,
                            "rowKey": "4/31q9kkno",
                            "multiple": false,
                            "description": "",
                            "attribute_type": "single"
                          },
                          {
                            "id": 4,
                            "key": "zhi_liang/4",
                            "type": "NumberInput",
                            "props": {
                              "unit": "kg|g|L|ml",
                              "hidden": false,
                              "suffix": "g",
                              "abstract": false,
                              "required": false,
                              "precision": null,
                              "orthogonal": true,
                              "enablePrint": true
                            },
                            "title": "质量",
                            "value": null,
                            "rowKey": "4/31q9kkno4",
                            "multiple": false,
                            "description": "",
                            "attribute_type": "single"
                          }
                        ],
                        "value": "zhi_liang"
                      }
                    ]
                  }
                }
              ],
              "sample": {
                "id": "a903797c-b321-46b3-8cda-28dde0b1f66b",
                "sn": "3534354343",
                "name": "各部分的官方",
                "params": {
                  "is_residue": "sample"
                },
                "weight": 1,
                "description": "",
                "record_table": {
                  "id": "4434fd28-0952-498d-add2-55dc2323a470",
                  "title": "测试7t1ohqzl",
                  "params": {},
                  "columns": [
                    {
                      "cell": "type-slot-operate",
                      "title": "操作",
                      "width": 150,
                      "colKey": "operate"
                    }
                  ],
                  "table_data": [
                    {
                      "id": "1917b07f-ebd8-4838-a857-8691c271ce01",
                      "data": "65",
                      "time": "2025-02-12 18:53:18",
                      "index_type": {
                        "id": 2,
                        "key": "lab_a",
                        "type": "NumberInput",
                        "unit": null,
                        "props": {
                          "unit": "df|fg|f|fg",
                          "hidden": false,
                          "suffix": "",
                          "abstract": false,
                          "required": false,
                          "precision": null,
                          "enablePrint": true
                        },
                        "title": "LAB_A",
                        "value": null,
                        "attribute_type": "single",
                        "indicators_evaluation_option": "3"
                      },
                      "lab_a_unit": "df",
                      "description": ""
                    },
                    {
                      "id": "a8162fe6-205d-4574-a8df-ffd2ebf4699d",
                      "data": "67",
                      "time": "2025-02-12 18:53:18",
                      "index_type": {
                        "id": 3,
                        "key": "lab_b",
                        "type": "NumberInput",
                        "unit": null,
                        "props": {
                          "hidden": false,
                          "suffix": "",
                          "abstract": false,
                          "required": false,
                          "precision": null,
                          "enablePrint": true
                        },
                        "title": "LAB_B",
                        "value": null,
                        "attribute_type": "single",
                        "indicators_evaluation_option": "1"
                      },
                      "description": ""
                    }
                  ]
                },
                "really_sample": false
              },
              "formData": {},
              "formItems": [],
              "is_sample": true,
              "procedure": {
                "id": "9b88ce19-2ffa-4e04-a61f-3cfc99e81c6f",
                "key": "9b88ce19-2ffa-4e04-a61f-3cfc99e81c6f",
                "title": "提取物料",
                "rowKey": "9b88ce19-2ffa-4e04-a61f-3cfc99e81c6f/ufy08yr5"
              },
              "description": "",
              "operateType": "样品",
              "operate_router": {
                "title": "样品检测"
              },
              "operate_rowKey": "2/vgzdw3dl",
              "procedure_rowKey": "9b88ce19-2ffa-4e04-a61f-3cfc99e81c6f/ufy08yr5",
              "test_record_table": "facc2630-0f7c-4635-a9c1-558882221cb2"
            },
            {
              "id": "1aceae36-f470-46ed-acc7-531d5f99d768",
              "sample": {},
              "formData": {
                "shi_jian": "23",
                "attachment": [],
                "shi_jian_unit": "y",
                "yuan_cai_liao": "54fe20ed-86df-420c-afa6-dc3c04c03370"
              },
              "formItems": {
                "id": 3,
                "key": "3/uikh6h09",
                "name": "加热",
                "type": "操作",
                "title": "加热",
                "rowKey": "3/uikh6h09",
                "attribute": [
                  {
                    "id": 1,
                    "key": "yuan_cai_liao",
                    "type": "SelectMaterial",
                    "props": {
                      "http": {},
                      "fixed": true,
                      "hidden": false,
                      "suffix": null,
                      "options": [
                        {
                          "group": "SY02121629/物料01",
                          "children": [
                            {
                              "label": "111/111",
                              "value": "54fe20ed-86df-420c-afa6-dc3c04c03370",
                              "is_liquid": true
                            },
                            {
                              "label": "测试共达到瓦大大哇哒/222222",
                              "value": "43c9812b-d6f6-4164-8f98-cb64ae69f7d3",
                              "is_liquid": false
                            },
                            {
                              "label": "葵花籽油/E207",
                              "value": "54730f09-9ade-4967-9412-614c8df9dd79",
                              "is_liquid": false
                            },
                            {
                              "label": "澳洲坚果油/J003",
                              "value": "cd1faf63-9d7d-4993-a314-6e566acad5ad",
                              "is_liquid": false
                            }
                          ]
                        },
                        {
                          "group": "样品",
                          "children": []
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
                    "rowKey": "1/zt5una53",
                    "multiple": false,
                    "description": "",
                    "attribute_type": "single"
                  },
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
                    "rowKey": "2/zpmztru3",
                    "multiple": false,
                    "description": "",
                    "attribute_type": "single"
                  }
                ],
                "description": "",
                "operateType": "操作"
              },
              "is_sample": false,
              "procedure": {
                "id": "9b88ce19-2ffa-4e04-a61f-3cfc99e81c6f",
                "key": "9b88ce19-2ffa-4e04-a61f-3cfc99e81c6f",
                "title": "提取物料",
                "rowKey": "9b88ce19-2ffa-4e04-a61f-3cfc99e81c6f/ufy08yr5"
              },
              "description": "",
              "operateType": "操作",
              "operate_router": {
                "id": 3,
                "key": "3/uikh6h09",
                "title": "加热",
                "rowKey": "3/uikh6h09"
              },
              "operate_rowKey": "3/uikh6h09",
              "procedure_rowKey": "9b88ce19-2ffa-4e04-a61f-3cfc99e81c6f/ufy08yr5"
            },
            {
              "id": "e94e90f8-e8d2-4b17-9cda-e6fdb47a0820",
              "params": {},
              "sample": {},
              "formData": {},
              "formItems": {
                "title": "过程描述"
              },
              "is_sample": false,
              "procedure": {
                "id": "9b88ce19-2ffa-4e04-a61f-3cfc99e81c6f",
                "key": "9b88ce19-2ffa-4e04-a61f-3cfc99e81c6f",
                "title": "提取物料",
                "rowKey": "9b88ce19-2ffa-4e04-a61f-3cfc99e81c6f/ufy08yr5"
              },
              "operateType": "过程描述",
              "operate_router": {
                "title": "过程描述"
              },
              "operate_rowKey": "过程描述ouo6ebmi",
              "procedure_rowKey": "9b88ce19-2ffa-4e04-a61f-3cfc99e81c6f/ufy08yr5"
            },
            {
              "id": "c7b173f0-f1a9-436a-b2ef-abde7acc1b45",
              "sample": {},
              "formData": {
                "attachment": [],
                "liao_ye_bi": [
                  {
                    "zhi_liang": "23",
                    "yuan_cai_liao": "54fe20ed-86df-420c-afa6-dc3c04c03370"
                  },
                  {
                    "zhi_liang": "43",
                    "yuan_cai_liao": "43c9812b-d6f6-4164-8f98-cb64ae69f7d3"
                  }
                ],
                "percentages": {
                  "liao_ye_weight": [
                    65.7,
                    34.3
                  ],
                  "liao_weight": [
                    100
                  ],
                  "ye_weight": [
                    100
                  ]
                },
                "liao_ye_bi/1": [
                  {
                    "zhi_liang": "23",
                    "yuan_cai_liao": "54730f09-9ade-4967-9412-614c8df9dd79"
                  },
                  {
                    "zhi_liang": "12",
                    "yuan_cai_liao": "54fe20ed-86df-420c-afa6-dc3c04c03370"
                  }
                ],
                "zhi_liang_unit": "kg"
              },
              "formItems": {
                "id": 6,
                "key": "6/nlvt3wzh",
                "name": "料液比",
                "type": "物料",
                "title": "料液比",
                "rowKey": "6/nlvt3wzh",
                "attribute": [
                  {
                    "id": 6,
                    "key": "liao_ye_bi",
                    "type": "MaterialList",
                    "props": {
                      "unit": "kg|g|L|ml",
                      "hidden": false,
                      "options": [
                        {
                          "group": "SY02121629/物料01",
                          "children": [
                            {
                              "label": "111/111",
                              "value": "54fe20ed-86df-420c-afa6-dc3c04c03370",
                              "is_liquid": true
                            },
                            {
                              "label": "测试共达到瓦大大哇哒/222222",
                              "value": "43c9812b-d6f6-4164-8f98-cb64ae69f7d3",
                              "is_liquid": false
                            },
                            {
                              "label": "葵花籽油/E207",
                              "value": "54730f09-9ade-4967-9412-614c8df9dd79",
                              "is_liquid": false
                            },
                            {
                              "label": "澳洲坚果油/J003",
                              "value": "cd1faf63-9d7d-4993-a314-6e566acad5ad",
                              "is_liquid": false
                            }
                          ]
                        },
                        {
                          "group": "样品",
                          "children": []
                        }
                      ],
                      "abstract": false,
                      "required": false,
                      "orthogonal": true,
                      "enablePrint": true
                    },
                    "title": "料液比",
                    "value": null,
                    "rowKey": "6/k8h3it0h",
                    "multiple": false,
                    "description": "",
                    "attribute_type": "single"
                  },
                  {
                    "id": 6,
                    "key": "liao_ye_bi/1",
                    "type": "MaterialList",
                    "props": {
                      "unit": "kg|g|L|ml",
                      "hidden": false,
                      "options": [
                        {
                          "group": "SY02121629/物料01",
                          "children": [
                            {
                              "label": "111/111",
                              "value": "54fe20ed-86df-420c-afa6-dc3c04c03370",
                              "is_liquid": true
                            },
                            {
                              "label": "测试共达到瓦大大哇哒/222222",
                              "value": "43c9812b-d6f6-4164-8f98-cb64ae69f7d3",
                              "is_liquid": false
                            },
                            {
                              "label": "葵花籽油/E207",
                              "value": "54730f09-9ade-4967-9412-614c8df9dd79",
                              "is_liquid": false
                            },
                            {
                              "label": "澳洲坚果油/J003",
                              "value": "cd1faf63-9d7d-4993-a314-6e566acad5ad",
                              "is_liquid": false
                            }
                          ]
                        },
                        {
                          "group": "样品",
                          "children": []
                        }
                      ],
                      "abstract": false,
                      "required": false,
                      "orthogonal": true,
                      "enablePrint": true
                    },
                    "title": "料液比",
                    "value": null,
                    "rowKey": "6/k8h3it0h1",
                    "multiple": false,
                    "description": "",
                    "attribute_type": "single"
                  }
                ],
                "description": "",
                "operateType": "物料",
                "attribute_info": [
                  {
                    "id": 6,
                    "key": "liao_ye_bi",
                    "type": "MaterialList",
                    "props": {
                      "unit": "kg|g|L|ml",
                      "hidden": false,
                      "options": [],
                      "abstract": false,
                      "required": false,
                      "enablePrint": true
                    },
                    "title": "料液比",
                    "value": null,
                    "multiple": false,
                    "attribute_type": "single"
                  }
                ]
              },
              "is_sample": false,
              "procedure": {
                "id": "ddbe2ad1-b6a8-4f55-8011-f8245f5a5025",
                "key": "ddbe2ad1-b6a8-4f55-8011-f8245f5a5025",
                "title": "自定义",
                "rowKey": "ddbe2ad1-b6a8-4f55-8011-f8245f5a5025/555lenup"
              },
              "description": "",
              "operateType": "物料",
              "operate_router": {
                "id": 6,
                "key": "6/nlvt3wzh",
                "title": "料液比",
                "rowKey": "6/nlvt3wzh"
              },
              "operate_rowKey": "6/nlvt3wzh",
              "procedure_rowKey": "ddbe2ad1-b6a8-4f55-8011-f8245f5a5025/555lenup"
            },
            {
              "id": "15149cfa-d16f-4a9f-bc43-0029b48d9437",
              "params": [
                {
                  "id": "7a0f9424-95e9-46cc-a7cc-5bbce8c510c7",
                  "formItems": {
                    "attribute": [
                      {
                        "items": [
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
                              "orthogonal": true,
                              "enablePrint": true
                            },
                            "title": "时间",
                            "value": null,
                            "rowKey": "2/6j00etej",
                            "multiple": false,
                            "description": "",
                            "attribute_type": "single"
                          },
                          {
                            "id": 2,
                            "key": "shi_jian/2",
                            "type": "NumberInput",
                            "props": {
                              "unit": "y|M|d|h|m|s",
                              "hidden": false,
                              "suffix": "h",
                              "abstract": false,
                              "required": false,
                              "precision": null,
                              "orthogonal": true,
                              "enablePrint": true
                            },
                            "title": "时间",
                            "value": null,
                            "rowKey": "2/6j00etej2",
                            "multiple": false,
                            "description": "",
                            "attribute_type": "single"
                          },
                          {
                            "id": 2,
                            "key": "shi_jian/2/3",
                            "type": "NumberInput",
                            "props": {
                              "unit": "y|M|d|h|m|s",
                              "hidden": false,
                              "suffix": "h",
                              "abstract": false,
                              "required": false,
                              "precision": null,
                              "orthogonal": true,
                              "enablePrint": true
                            },
                            "title": "时间",
                            "value": null,
                            "rowKey": "2/6j00etej23",
                            "multiple": false,
                            "description": "",
                            "attribute_type": "single"
                          }
                        ],
                        "value": "shi_jian/2/3"
                      },
                      {
                        "items": [
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
                              "orthogonal": true,
                              "enablePrint": true
                            },
                            "title": "质量",
                            "value": null,
                            "rowKey": "4/31q9kkno",
                            "multiple": false,
                            "description": "",
                            "attribute_type": "single"
                          },
                          {
                            "id": 4,
                            "key": "zhi_liang/4",
                            "type": "NumberInput",
                            "props": {
                              "unit": "kg|g|L|ml",
                              "hidden": false,
                              "suffix": "g",
                              "abstract": false,
                              "required": false,
                              "precision": null,
                              "orthogonal": true,
                              "enablePrint": true
                            },
                            "title": "质量",
                            "value": null,
                            "rowKey": "4/31q9kkno4",
                            "multiple": false,
                            "description": "",
                            "attribute_type": "single"
                          }
                        ],
                        "value": "zhi_liang/4"
                      }
                    ]
                  }
                },
                {
                  "id": "c7b173f0-f1a9-436a-b2ef-abde7acc1b45",
                  "formItems": {
                    "attribute": [
                      {
                        "items": [
                          {
                            "id": 6,
                            "key": "liao_ye_bi",
                            "type": "MaterialList",
                            "props": {
                              "unit": "kg|g|L|ml",
                              "hidden": false,
                              "options": [
                                {
                                  "group": "SY02121629/物料01",
                                  "children": [
                                    {
                                      "label": "111/111",
                                      "value": "54fe20ed-86df-420c-afa6-dc3c04c03370",
                                      "is_liquid": true
                                    },
                                    {
                                      "label": "测试共达到瓦大大哇哒/222222",
                                      "value": "43c9812b-d6f6-4164-8f98-cb64ae69f7d3",
                                      "is_liquid": false
                                    },
                                    {
                                      "label": "葵花籽油/E207",
                                      "value": "54730f09-9ade-4967-9412-614c8df9dd79",
                                      "is_liquid": false
                                    },
                                    {
                                      "label": "澳洲坚果油/J003",
                                      "value": "cd1faf63-9d7d-4993-a314-6e566acad5ad",
                                      "is_liquid": false
                                    }
                                  ]
                                },
                                {
                                  "group": "样品",
                                  "children": []
                                }
                              ],
                              "abstract": false,
                              "required": false,
                              "orthogonal": true,
                              "enablePrint": true
                            },
                            "title": "料液比",
                            "value": null,
                            "rowKey": "6/k8h3it0h",
                            "multiple": false,
                            "description": "",
                            "attribute_type": "single"
                          },
                          {
                            "id": 6,
                            "key": "liao_ye_bi/1",
                            "type": "MaterialList",
                            "props": {
                              "unit": "kg|g|L|ml",
                              "hidden": false,
                              "options": [
                                {
                                  "group": "SY02121629/物料01",
                                  "children": [
                                    {
                                      "label": "111/111",
                                      "value": "54fe20ed-86df-420c-afa6-dc3c04c03370",
                                      "is_liquid": true
                                    },
                                    {
                                      "label": "测试共达到瓦大大哇哒/222222",
                                      "value": "43c9812b-d6f6-4164-8f98-cb64ae69f7d3",
                                      "is_liquid": false
                                    },
                                    {
                                      "label": "葵花籽油/E207",
                                      "value": "54730f09-9ade-4967-9412-614c8df9dd79",
                                      "is_liquid": false
                                    },
                                    {
                                      "label": "澳洲坚果油/J003",
                                      "value": "cd1faf63-9d7d-4993-a314-6e566acad5ad",
                                      "is_liquid": false
                                    }
                                  ]
                                },
                                {
                                  "group": "样品",
                                  "children": []
                                }
                              ],
                              "abstract": false,
                              "required": false,
                              "orthogonal": true,
                              "enablePrint": true
                            },
                            "title": "料液比",
                            "value": null,
                            "rowKey": "6/k8h3it0h1",
                            "multiple": false,
                            "description": "",
                            "attribute_type": "single"
                          }
                        ],
                        "value": "liao_ye_bi/1"
                      }
                    ]
                  }
                }
              ],
              "sample": {
                "id": "421f4cdc-1f84-4918-be78-4c2c5944c96b",
                "sn": "S202502123",
                "name": "各部分的豆腐干反对",
                "params": {
                  "is_residue": "sample"
                },
                "weight": 1,
                "description": "",
                "record_table": {
                  "id": "9de79b91-9888-4c3a-bce0-74d0a6f615a4",
                  "title": "测试7n9suapc",
                  "params": {},
                  "columns": [
                    {
                      "cell": "type-slot-operate",
                      "title": "操作",
                      "width": 150,
                      "colKey": "operate"
                    }
                  ],
                  "table_data": [
                    {
                      "id": "c2d27b56-76ae-41d4-b1f7-76dd450595db",
                      "data": "23",
                      "time": "2025-02-12 18:53:03",
                      "index_type": {
                        "id": 1,
                        "key": "lab_l",
                        "type": "NumberInput",
                        "unit": null,
                        "props": {
                          "unit": "k|gre|bf|gfd",
                          "hidden": false,
                          "suffix": "",
                          "abstract": false,
                          "required": false,
                          "precision": null,
                          "enablePrint": true
                        },
                        "title": "LAB_L",
                        "value": null,
                        "attribute_type": "single",
                        "indicators_evaluation_option": "3"
                      },
                      "lab_l_unit": "k",
                      "description": ""
                    },
                    {
                      "id": "a4eb8dca-8baa-446f-a8e8-a38611301539",
                      "data": "34",
                      "time": "2025-02-12 18:53:03",
                      "index_type": {
                        "id": 2,
                        "key": "lab_a",
                        "type": "NumberInput",
                        "unit": null,
                        "props": {
                          "unit": "df|fg|f|fg",
                          "hidden": false,
                          "suffix": "",
                          "abstract": false,
                          "required": false,
                          "precision": null,
                          "enablePrint": true
                        },
                        "title": "LAB_A",
                        "value": null,
                        "attribute_type": "single",
                        "indicators_evaluation_option": "3"
                      },
                      "lab_a_unit": "df",
                      "description": ""
                    },
                    {
                      "id": "550ed633-dad0-45f7-acd2-55e3e6b39988",
                      "data": "54",
                      "time": "2025-02-12 18:53:03",
                      "index_type": {
                        "id": 3,
                        "key": "lab_b",
                        "type": "NumberInput",
                        "unit": null,
                        "props": {
                          "hidden": false,
                          "suffix": "",
                          "abstract": false,
                          "required": false,
                          "precision": null,
                          "enablePrint": true
                        },
                        "title": "LAB_B",
                        "value": null,
                        "attribute_type": "single",
                        "indicators_evaluation_option": "1"
                      },
                      "description": ""
                    }
                  ]
                },
                "really_sample": true
              },
              "formData": {},
              "formItems": [],
              "is_sample": true,
              "procedure": {
                "id": "ddbe2ad1-b6a8-4f55-8011-f8245f5a5025",
                "key": "ddbe2ad1-b6a8-4f55-8011-f8245f5a5025",
                "title": "自定义",
                "rowKey": "ddbe2ad1-b6a8-4f55-8011-f8245f5a5025/555lenup"
              },
              "description": "",
              "operateType": "样品",
              "operate_router": {
                "title": "样品检测"
              },
              "operate_rowKey": "6/nlvt3wzh",
              "procedure_rowKey": "ddbe2ad1-b6a8-4f55-8011-f8245f5a5025/555lenup",
              "test_record_table": "facc2630-0f7c-4635-a9c1-558882221cb2"
            },
            {
              "id": "7721b3c6-4493-48c6-a806-c85326044e29",
              "params": [
                {
                  "id": "7a0f9424-95e9-46cc-a7cc-5bbce8c510c7",
                  "formItems": {
                    "attribute": [
                      {
                        "items": [
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
                              "orthogonal": true,
                              "enablePrint": true
                            },
                            "title": "时间",
                            "value": null,
                            "rowKey": "2/6j00etej",
                            "multiple": false,
                            "description": "",
                            "attribute_type": "single"
                          },
                          {
                            "id": 2,
                            "key": "shi_jian/2",
                            "type": "NumberInput",
                            "props": {
                              "unit": "y|M|d|h|m|s",
                              "hidden": false,
                              "suffix": "h",
                              "abstract": false,
                              "required": false,
                              "precision": null,
                              "orthogonal": true,
                              "enablePrint": true
                            },
                            "title": "时间",
                            "value": null,
                            "rowKey": "2/6j00etej2",
                            "multiple": false,
                            "description": "",
                            "attribute_type": "single"
                          },
                          {
                            "id": 2,
                            "key": "shi_jian/2/3",
                            "type": "NumberInput",
                            "props": {
                              "unit": "y|M|d|h|m|s",
                              "hidden": false,
                              "suffix": "h",
                              "abstract": false,
                              "required": false,
                              "precision": null,
                              "orthogonal": true,
                              "enablePrint": true
                            },
                            "title": "时间",
                            "value": null,
                            "rowKey": "2/6j00etej23",
                            "multiple": false,
                            "description": "",
                            "attribute_type": "single"
                          }
                        ],
                        "value": "shi_jian"
                      },
                      {
                        "items": [
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
                              "orthogonal": true,
                              "enablePrint": true
                            },
                            "title": "质量",
                            "value": null,
                            "rowKey": "4/31q9kkno",
                            "multiple": false,
                            "description": "",
                            "attribute_type": "single"
                          },
                          {
                            "id": 4,
                            "key": "zhi_liang/4",
                            "type": "NumberInput",
                            "props": {
                              "unit": "kg|g|L|ml",
                              "hidden": false,
                              "suffix": "g",
                              "abstract": false,
                              "required": false,
                              "precision": null,
                              "orthogonal": true,
                              "enablePrint": true
                            },
                            "title": "质量",
                            "value": null,
                            "rowKey": "4/31q9kkno4",
                            "multiple": false,
                            "description": "",
                            "attribute_type": "single"
                          }
                        ],
                        "value": "zhi_liang"
                      }
                    ]
                  }
                },
                {
                  "id": "c7b173f0-f1a9-436a-b2ef-abde7acc1b45",
                  "formItems": {
                    "attribute": [
                      {
                        "items": [
                          {
                            "id": 6,
                            "key": "liao_ye_bi",
                            "type": "MaterialList",
                            "props": {
                              "unit": "kg|g|L|ml",
                              "hidden": false,
                              "options": [
                                {
                                  "group": "SY02121629/物料01",
                                  "children": [
                                    {
                                      "label": "111/111",
                                      "value": "54fe20ed-86df-420c-afa6-dc3c04c03370",
                                      "is_liquid": true
                                    },
                                    {
                                      "label": "测试共达到瓦大大哇哒/222222",
                                      "value": "43c9812b-d6f6-4164-8f98-cb64ae69f7d3",
                                      "is_liquid": false
                                    },
                                    {
                                      "label": "葵花籽油/E207",
                                      "value": "54730f09-9ade-4967-9412-614c8df9dd79",
                                      "is_liquid": false
                                    },
                                    {
                                      "label": "澳洲坚果油/J003",
                                      "value": "cd1faf63-9d7d-4993-a314-6e566acad5ad",
                                      "is_liquid": false
                                    }
                                  ]
                                },
                                {
                                  "group": "样品",
                                  "children": []
                                }
                              ],
                              "abstract": false,
                              "required": false,
                              "orthogonal": true,
                              "enablePrint": true
                            },
                            "title": "料液比",
                            "value": null,
                            "rowKey": "6/k8h3it0h",
                            "multiple": false,
                            "description": "",
                            "attribute_type": "single"
                          },
                          {
                            "id": 6,
                            "key": "liao_ye_bi/1",
                            "type": "MaterialList",
                            "props": {
                              "unit": "kg|g|L|ml",
                              "hidden": false,
                              "options": [
                                {
                                  "group": "SY02121629/物料01",
                                  "children": [
                                    {
                                      "label": "111/111",
                                      "value": "54fe20ed-86df-420c-afa6-dc3c04c03370",
                                      "is_liquid": true
                                    },
                                    {
                                      "label": "测试共达到瓦大大哇哒/222222",
                                      "value": "43c9812b-d6f6-4164-8f98-cb64ae69f7d3",
                                      "is_liquid": false
                                    },
                                    {
                                      "label": "葵花籽油/E207",
                                      "value": "54730f09-9ade-4967-9412-614c8df9dd79",
                                      "is_liquid": false
                                    },
                                    {
                                      "label": "澳洲坚果油/J003",
                                      "value": "cd1faf63-9d7d-4993-a314-6e566acad5ad",
                                      "is_liquid": false
                                    }
                                  ]
                                },
                                {
                                  "group": "样品",
                                  "children": []
                                }
                              ],
                              "abstract": false,
                              "required": false,
                              "orthogonal": true,
                              "enablePrint": true
                            },
                            "title": "料液比",
                            "value": null,
                            "rowKey": "6/k8h3it0h1",
                            "multiple": false,
                            "description": "",
                            "attribute_type": "single"
                          }
                        ],
                        "value": "liao_ye_bi"
                      }
                    ]
                  }
                }
              ],
              "sample": {
                "id": "08c591db-9378-43c6-bb3b-cf118ee8ac90",
                "sn": "35343543432224",
                "name": "各部分的官方滤渣",
                "params": {
                  "is_residue": "residue"
                },
                "weight": 1,
                "description": "",
                "record_table": {
                  "id": "b6ee39fb-a367-46d3-b8b7-b4f77114471b",
                  "title": "测试ptigk9kv",
                  "params": {},
                  "columns": [
                    {
                      "cell": "type-slot-operate",
                      "title": "操作",
                      "width": 150,
                      "colKey": "operate"
                    }
                  ],
                  "table_data": []
                },
                "really_sample": false
              },
              "formData": {},
              "formItems": [],
              "is_sample": true,
              "procedure": {
                "id": "ddbe2ad1-b6a8-4f55-8011-f8245f5a5025",
                "key": "ddbe2ad1-b6a8-4f55-8011-f8245f5a5025",
                "title": "自定义",
                "rowKey": "ddbe2ad1-b6a8-4f55-8011-f8245f5a5025/555lenup"
              },
              "description": "",
              "operateType": "样品",
              "operate_router": {
                "title": "样品检测"
              },
              "operate_rowKey": "6/nlvt3wzh",
              "procedure_rowKey": "ddbe2ad1-b6a8-4f55-8011-f8245f5a5025/555lenup",
              "test_record_table": "facc2630-0f7c-4635-a9c1-558882221cb2"
            },
            {
              "id": "d93006bd-1143-4889-a1c5-f27f8ffba554",
              "params": [
                {
                  "id": "7a0f9424-95e9-46cc-a7cc-5bbce8c510c7",
                  "formItems": {
                    "attribute": [
                      {
                        "items": [
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
                              "orthogonal": true,
                              "enablePrint": true
                            },
                            "title": "时间",
                            "value": null,
                            "rowKey": "2/6j00etej",
                            "multiple": false,
                            "description": "",
                            "attribute_type": "single"
                          },
                          {
                            "id": 2,
                            "key": "shi_jian/2",
                            "type": "NumberInput",
                            "props": {
                              "unit": "y|M|d|h|m|s",
                              "hidden": false,
                              "suffix": "h",
                              "abstract": false,
                              "required": false,
                              "precision": null,
                              "orthogonal": true,
                              "enablePrint": true
                            },
                            "title": "时间",
                            "value": null,
                            "rowKey": "2/6j00etej2",
                            "multiple": false,
                            "description": "",
                            "attribute_type": "single"
                          },
                          {
                            "id": 2,
                            "key": "shi_jian/2/3",
                            "type": "NumberInput",
                            "props": {
                              "unit": "y|M|d|h|m|s",
                              "hidden": false,
                              "suffix": "h",
                              "abstract": false,
                              "required": false,
                              "precision": null,
                              "orthogonal": true,
                              "enablePrint": true
                            },
                            "title": "时间",
                            "value": null,
                            "rowKey": "2/6j00etej23",
                            "multiple": false,
                            "description": "",
                            "attribute_type": "single"
                          }
                        ],
                        "value": "shi_jian"
                      },
                      {
                        "items": [
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
                              "orthogonal": true,
                              "enablePrint": true
                            },
                            "title": "质量",
                            "value": null,
                            "rowKey": "4/31q9kkno",
                            "multiple": false,
                            "description": "",
                            "attribute_type": "single"
                          },
                          {
                            "id": 4,
                            "key": "zhi_liang/4",
                            "type": "NumberInput",
                            "props": {
                              "unit": "kg|g|L|ml",
                              "hidden": false,
                              "suffix": "g",
                              "abstract": false,
                              "required": false,
                              "precision": null,
                              "orthogonal": true,
                              "enablePrint": true
                            },
                            "title": "质量",
                            "value": null,
                            "rowKey": "4/31q9kkno4",
                            "multiple": false,
                            "description": "",
                            "attribute_type": "single"
                          }
                        ],
                        "value": "zhi_liang"
                      }
                    ]
                  }
                },
                {
                  "id": "c7b173f0-f1a9-436a-b2ef-abde7acc1b45",
                  "formItems": {
                    "attribute": [
                      {
                        "items": [
                          {
                            "id": 6,
                            "key": "liao_ye_bi",
                            "type": "MaterialList",
                            "props": {
                              "unit": "kg|g|L|ml",
                              "hidden": false,
                              "options": [
                                {
                                  "group": "SY02121629/物料01",
                                  "children": [
                                    {
                                      "label": "111/111",
                                      "value": "54fe20ed-86df-420c-afa6-dc3c04c03370",
                                      "is_liquid": true
                                    },
                                    {
                                      "label": "测试共达到瓦大大哇哒/222222",
                                      "value": "43c9812b-d6f6-4164-8f98-cb64ae69f7d3",
                                      "is_liquid": false
                                    },
                                    {
                                      "label": "葵花籽油/E207",
                                      "value": "54730f09-9ade-4967-9412-614c8df9dd79",
                                      "is_liquid": false
                                    },
                                    {
                                      "label": "澳洲坚果油/J003",
                                      "value": "cd1faf63-9d7d-4993-a314-6e566acad5ad",
                                      "is_liquid": false
                                    }
                                  ]
                                },
                                {
                                  "group": "样品",
                                  "children": []
                                }
                              ],
                              "abstract": false,
                              "required": false,
                              "orthogonal": true,
                              "enablePrint": true
                            },
                            "title": "料液比",
                            "value": null,
                            "rowKey": "6/k8h3it0h",
                            "multiple": false,
                            "description": "",
                            "attribute_type": "single"
                          },
                          {
                            "id": 6,
                            "key": "liao_ye_bi/1",
                            "type": "MaterialList",
                            "props": {
                              "unit": "kg|g|L|ml",
                              "hidden": false,
                              "options": [
                                {
                                  "group": "SY02121629/物料01",
                                  "children": [
                                    {
                                      "label": "111/111",
                                      "value": "54fe20ed-86df-420c-afa6-dc3c04c03370",
                                      "is_liquid": true
                                    },
                                    {
                                      "label": "测试共达到瓦大大哇哒/222222",
                                      "value": "43c9812b-d6f6-4164-8f98-cb64ae69f7d3",
                                      "is_liquid": false
                                    },
                                    {
                                      "label": "葵花籽油/E207",
                                      "value": "54730f09-9ade-4967-9412-614c8df9dd79",
                                      "is_liquid": false
                                    },
                                    {
                                      "label": "澳洲坚果油/J003",
                                      "value": "cd1faf63-9d7d-4993-a314-6e566acad5ad",
                                      "is_liquid": false
                                    }
                                  ]
                                },
                                {
                                  "group": "样品",
                                  "children": []
                                }
                              ],
                              "abstract": false,
                              "required": false,
                              "orthogonal": true,
                              "enablePrint": true
                            },
                            "title": "料液比",
                            "value": null,
                            "rowKey": "6/k8h3it0h1",
                            "multiple": false,
                            "description": "",
                            "attribute_type": "single"
                          }
                        ],
                        "value": "liao_ye_bi/1"
                      }
                    ]
                  }
                }
              ],
              "sample": {
                "id": "25b57fae-edd8-492a-9c0f-b883a90fd942",
                "sn": "353435434322",
                "name": "各部分的官方提取液",
                "params": {
                  "is_residue": "extractionSolution"
                },
                "weight": 1,
                "description": "",
                "record_table": {
                  "id": "79ba631b-8aaf-4946-bf42-2debd4067e0c",
                  "title": "测试u707wrnt",
                  "params": {},
                  "columns": [
                    {
                      "cell": "type-slot-operate",
                      "title": "操作",
                      "width": 150,
                      "colKey": "operate"
                    }
                  ],
                  "table_data": []
                },
                "really_sample": false
              },
              "formData": {},
              "formItems": [],
              "is_sample": true,
              "procedure": {
                "id": "ddbe2ad1-b6a8-4f55-8011-f8245f5a5025",
                "key": "ddbe2ad1-b6a8-4f55-8011-f8245f5a5025",
                "title": "自定义",
                "rowKey": "ddbe2ad1-b6a8-4f55-8011-f8245f5a5025/555lenup"
              },
              "description": "",
              "operateType": "样品",
              "operate_router": {
                "title": "样品检测"
              },
              "operate_rowKey": "6/nlvt3wzh",
              "procedure_rowKey": "ddbe2ad1-b6a8-4f55-8011-f8245f5a5025/555lenup",
              "test_record_table": "facc2630-0f7c-4635-a9c1-558882221cb2"
            },
            {
              "id": "d9d780cf-7dea-4901-842e-d8cff23e22af",
              "params": {},
              "sample": {},
              "formData": {},
              "formItems": {
                "title": "过程描述"
              },
              "is_sample": false,
              "procedure": {
                "id": "ddbe2ad1-b6a8-4f55-8011-f8245f5a5025",
                "key": "ddbe2ad1-b6a8-4f55-8011-f8245f5a5025",
                "title": "自定义",
                "rowKey": "ddbe2ad1-b6a8-4f55-8011-f8245f5a5025/555lenup"
              },
              "operateType": "过程描述",
              "operate_router": {
                "title": "过程描述"
              },
              "operate_rowKey": "过程描述vugn0vgr",
              "procedure_rowKey": "ddbe2ad1-b6a8-4f55-8011-f8245f5a5025/555lenup"
            }
          ],
          "designParams": "28e759b7-23c5-451e-ad52-c4aaa6d7b79a",
          "designResult": {
            "id": "d6024e1b-1368-4c47-ba4c-7552690f4d0c",
            "title": "试验设计方案-20250212185041",
            "formData": {
              "9b88ce19-2ffa-4e04-a61f-3cfc99e81c6f": {
                "2/vgzdw3dl": {
                  "shi_jian": "23",
                  "zhi_liang": "32",
                  "shi_jian/2": "54",
                  "zhi_liang/4": "65",
                  "shi_jian/2/3": "43",
                  "shi_jian_unit": "y",
                  "zhi_liang_unit": "kg",
                  "shi_jian/2_unit": "y",
                  "zhi_liang/4_unit": "kg",
                  "shi_jian/2/3_unit": "y"
                },
                "3/uikh6h09": {
                  "shi_jian": "23",
                  "shi_jian_unit": "y",
                  "yuan_cai_liao": "54fe20ed-86df-420c-afa6-dc3c04c03370"
                },
                "description": ""
              },
              "ddbe2ad1-b6a8-4f55-8011-f8245f5a5025": {
                "6/nlvt3wzh": {
                  "liao_ye_bi": [
                    {
                      "zhi_liang": "23",
                      "yuan_cai_liao": "54fe20ed-86df-420c-afa6-dc3c04c03370"
                    },
                    {
                      "zhi_liang": "43",
                      "yuan_cai_liao": "43c9812b-d6f6-4164-8f98-cb64ae69f7d3"
                    }
                  ],
                  "percentages": {
                    "ye_weight": [
                      100
                    ],
                    "liao_weight": [
                      100
                    ],
                    "liao_ye_weight": [
                      65.7,
                      34.3
                    ]
                  },
                  "liao_ye_bi/1": [
                    {
                      "zhi_liang": "23",
                      "yuan_cai_liao": "54730f09-9ade-4967-9412-614c8df9dd79"
                    },
                    {
                      "zhi_liang": "12",
                      "yuan_cai_liao": "54fe20ed-86df-420c-afa6-dc3c04c03370"
                    }
                  ],
                  "zhi_liang_unit": "kg"
                },
                "description": ""
              },
              "ec555345-a7ea-4393-9926-149642a027c6": {
                "2/thmapeoh": {
                  "shi_jian": "34",
                  "zhi_liang": "54",
                  "shi_jian_unit": "y",
                  "zhi_liang_unit": "kg"
                },
                "4/g0rphwxk": {
                  "shi_jian": "45",
                  "zhi_liang": "43",
                  "shi_jian_unit": "y",
                  "yuan_cai_liao": "54730f09-9ade-4967-9412-614c8df9dd79",
                  "zhi_liang_unit": "kg"
                },
                "description": ""
              }
            },
            "formItems": [
              {
                "id": "ec555345-a7ea-4393-9926-149642a027c6",
                "key": "ec555345-a7ea-4393-9926-149642a027c6",
                "name": "准备操作",
                "title": "准备操作",
                "rowKey": "ec555345-a7ea-4393-9926-149642a027c6/umty9w1k",
                "formItems": [
                  {
                    "id": 2,
                    "key": "2/thmapeoh",
                    "name": "准备物料",
                    "type": "操作",
                    "title": "准备物料",
                    "rowKey": "2/thmapeoh",
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
                        "rowKey": "2/00gpndbx",
                        "multiple": false,
                        "description": "",
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
                        "rowKey": "4/cmkygq14",
                        "multiple": false,
                        "description": "",
                        "attribute_type": "single"
                      }
                    ],
                    "description": "",
                    "operateType": "操作"
                  },
                  {
                    "id": 4,
                    "key": "4/g0rphwxk",
                    "name": "粉碎",
                    "type": "物料",
                    "title": "粉碎",
                    "rowKey": "4/g0rphwxk",
                    "attribute": [
                      {
                        "id": 1,
                        "key": "yuan_cai_liao",
                        "type": "SelectMaterial",
                        "props": {
                          "http": {},
                          "fixed": true,
                          "hidden": false,
                          "suffix": null,
                          "options": [
                            {
                              "group": "SY02121629/物料01",
                              "children": [
                                {
                                  "label": "111/111",
                                  "value": "54fe20ed-86df-420c-afa6-dc3c04c03370",
                                  "is_liquid": true
                                },
                                {
                                  "label": "测试共达到瓦大大哇哒/222222",
                                  "value": "43c9812b-d6f6-4164-8f98-cb64ae69f7d3",
                                  "is_liquid": false
                                },
                                {
                                  "label": "葵花籽油/E207",
                                  "value": "54730f09-9ade-4967-9412-614c8df9dd79",
                                  "is_liquid": false
                                },
                                {
                                  "label": "澳洲坚果油/J003",
                                  "value": "cd1faf63-9d7d-4993-a314-6e566acad5ad",
                                  "is_liquid": false
                                }
                              ]
                            },
                            {
                              "group": "样品",
                              "children": []
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
                        "rowKey": "1/kay52ekd",
                        "multiple": false,
                        "description": "",
                        "attribute_type": "single"
                      },
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
                        "rowKey": "2/wiu4z50k",
                        "multiple": false,
                        "description": "",
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
                        "rowKey": "4/ih57g9by",
                        "multiple": false,
                        "description": "",
                        "attribute_type": "single"
                      }
                    ],
                    "description": "",
                    "operateType": "物料"
                  }
                ]
              },
              {
                "id": "9b88ce19-2ffa-4e04-a61f-3cfc99e81c6f",
                "key": "9b88ce19-2ffa-4e04-a61f-3cfc99e81c6f",
                "name": "提取物料",
                "title": "提取物料",
                "rowKey": "9b88ce19-2ffa-4e04-a61f-3cfc99e81c6f/ufy08yr5",
                "formItems": [
                  {
                    "id": 2,
                    "key": "2/vgzdw3dl",
                    "name": "准备物料",
                    "type": "操作",
                    "title": "准备物料",
                    "rowKey": "2/vgzdw3dl",
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
                          "orthogonal": true,
                          "enablePrint": true
                        },
                        "title": "时间",
                        "value": null,
                        "rowKey": "2/6j00etej",
                        "multiple": false,
                        "description": "",
                        "attribute_type": "single"
                      },
                      {
                        "id": 2,
                        "key": "shi_jian/2",
                        "type": "NumberInput",
                        "props": {
                          "unit": "y|M|d|h|m|s",
                          "hidden": false,
                          "suffix": "h",
                          "abstract": false,
                          "required": false,
                          "precision": null,
                          "orthogonal": true,
                          "enablePrint": true
                        },
                        "title": "时间",
                        "value": null,
                        "rowKey": "2/6j00etej2",
                        "multiple": false,
                        "description": "",
                        "attribute_type": "single"
                      },
                      {
                        "id": 2,
                        "key": "shi_jian/2/3",
                        "type": "NumberInput",
                        "props": {
                          "unit": "y|M|d|h|m|s",
                          "hidden": false,
                          "suffix": "h",
                          "abstract": false,
                          "required": false,
                          "precision": null,
                          "orthogonal": true,
                          "enablePrint": true
                        },
                        "title": "时间",
                        "value": null,
                        "rowKey": "2/6j00etej23",
                        "multiple": false,
                        "description": "",
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
                          "orthogonal": true,
                          "enablePrint": true
                        },
                        "title": "质量",
                        "value": null,
                        "rowKey": "4/31q9kkno",
                        "multiple": false,
                        "description": "",
                        "attribute_type": "single"
                      },
                      {
                        "id": 4,
                        "key": "zhi_liang/4",
                        "type": "NumberInput",
                        "props": {
                          "unit": "kg|g|L|ml",
                          "hidden": false,
                          "suffix": "g",
                          "abstract": false,
                          "required": false,
                          "precision": null,
                          "orthogonal": true,
                          "enablePrint": true
                        },
                        "title": "质量",
                        "value": null,
                        "rowKey": "4/31q9kkno4",
                        "multiple": false,
                        "description": "",
                        "attribute_type": "single"
                      }
                    ],
                    "description": "",
                    "operateType": "操作"
                  },
                  {
                    "id": 3,
                    "key": "3/uikh6h09",
                    "name": "加热",
                    "type": "操作",
                    "title": "加热",
                    "rowKey": "3/uikh6h09",
                    "attribute": [
                      {
                        "id": 1,
                        "key": "yuan_cai_liao",
                        "type": "SelectMaterial",
                        "props": {
                          "http": {},
                          "fixed": true,
                          "hidden": false,
                          "suffix": null,
                          "options": [
                            {
                              "group": "SY02121629/物料01",
                              "children": [
                                {
                                  "label": "111/111",
                                  "value": "54fe20ed-86df-420c-afa6-dc3c04c03370",
                                  "is_liquid": true
                                },
                                {
                                  "label": "测试共达到瓦大大哇哒/222222",
                                  "value": "43c9812b-d6f6-4164-8f98-cb64ae69f7d3",
                                  "is_liquid": false
                                },
                                {
                                  "label": "葵花籽油/E207",
                                  "value": "54730f09-9ade-4967-9412-614c8df9dd79",
                                  "is_liquid": false
                                },
                                {
                                  "label": "澳洲坚果油/J003",
                                  "value": "cd1faf63-9d7d-4993-a314-6e566acad5ad",
                                  "is_liquid": false
                                }
                              ]
                            },
                            {
                              "group": "样品",
                              "children": []
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
                        "rowKey": "1/zt5una53",
                        "multiple": false,
                        "description": "",
                        "attribute_type": "single"
                      },
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
                        "rowKey": "2/zpmztru3",
                        "multiple": false,
                        "description": "",
                        "attribute_type": "single"
                      }
                    ],
                    "description": "",
                    "operateType": "操作"
                  }
                ]
              },
              {
                "id": "ddbe2ad1-b6a8-4f55-8011-f8245f5a5025",
                "key": "ddbe2ad1-b6a8-4f55-8011-f8245f5a5025",
                "name": "自定义",
                "title": "自定义",
                "rowKey": "ddbe2ad1-b6a8-4f55-8011-f8245f5a5025/555lenup",
                "formItems": [
                  {
                    "id": 6,
                    "key": "6/nlvt3wzh",
                    "name": "料液比",
                    "type": "物料",
                    "title": "料液比",
                    "rowKey": "6/nlvt3wzh",
                    "attribute": [
                      {
                        "id": 6,
                        "key": "liao_ye_bi",
                        "type": "MaterialList",
                        "props": {
                          "unit": "kg|g|L|ml",
                          "hidden": false,
                          "options": [
                            {
                              "group": "SY02121629/物料01",
                              "children": [
                                {
                                  "label": "111/111",
                                  "value": "54fe20ed-86df-420c-afa6-dc3c04c03370",
                                  "is_liquid": true
                                },
                                {
                                  "label": "测试共达到瓦大大哇哒/222222",
                                  "value": "43c9812b-d6f6-4164-8f98-cb64ae69f7d3",
                                  "is_liquid": false
                                },
                                {
                                  "label": "葵花籽油/E207",
                                  "value": "54730f09-9ade-4967-9412-614c8df9dd79",
                                  "is_liquid": false
                                },
                                {
                                  "label": "澳洲坚果油/J003",
                                  "value": "cd1faf63-9d7d-4993-a314-6e566acad5ad",
                                  "is_liquid": false
                                }
                              ]
                            },
                            {
                              "group": "样品",
                              "children": []
                            }
                          ],
                          "abstract": false,
                          "required": false,
                          "orthogonal": true,
                          "enablePrint": true
                        },
                        "title": "料液比",
                        "value": null,
                        "rowKey": "6/k8h3it0h",
                        "multiple": false,
                        "description": "",
                        "attribute_type": "single"
                      },
                      {
                        "id": 6,
                        "key": "liao_ye_bi/1",
                        "type": "MaterialList",
                        "props": {
                          "unit": "kg|g|L|ml",
                          "hidden": false,
                          "options": [
                            {
                              "group": "SY02121629/物料01",
                              "children": [
                                {
                                  "label": "111/111",
                                  "value": "54fe20ed-86df-420c-afa6-dc3c04c03370",
                                  "is_liquid": true
                                },
                                {
                                  "label": "测试共达到瓦大大哇哒/222222",
                                  "value": "43c9812b-d6f6-4164-8f98-cb64ae69f7d3",
                                  "is_liquid": false
                                },
                                {
                                  "label": "葵花籽油/E207",
                                  "value": "54730f09-9ade-4967-9412-614c8df9dd79",
                                  "is_liquid": false
                                },
                                {
                                  "label": "澳洲坚果油/J003",
                                  "value": "cd1faf63-9d7d-4993-a314-6e566acad5ad",
                                  "is_liquid": false
                                }
                              ]
                            },
                            {
                              "group": "样品",
                              "children": []
                            }
                          ],
                          "abstract": false,
                          "required": false,
                          "orthogonal": true,
                          "enablePrint": true
                        },
                        "title": "料液比",
                        "value": null,
                        "rowKey": "6/k8h3it0h1",
                        "multiple": false,
                        "description": "",
                        "attribute_type": "single"
                      }
                    ],
                    "description": "",
                    "operateType": "物料",
                    "attribute_info": [
                      {
                        "id": 6,
                        "key": "liao_ye_bi",
                        "type": "MaterialList",
                        "props": {
                          "unit": "kg|g|L|ml",
                          "hidden": false,
                          "options": [],
                          "abstract": false,
                          "required": false,
                          "enablePrint": true
                        },
                        "title": "料液比",
                        "value": null,
                        "multiple": false,
                        "attribute_type": "single"
                      }
                    ]
                  }
                ]
              }
            ],
            "orthogonalDesign": {
              "stepItems": [],
              "cycleNumber": 1
            }
          },
          "selectRows": [],
          "title": "SY02121629/试验记录01"
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
        "type": "sample_table",
        "attrs": {
          "id": "5b7af54c-80a5-4464-98eb-6a80059a5bc3",
          "updateTime": "2025-02-12 19:22:21",
          "key": "sample_table20250212185221",
          "name": "8984658c-397b-4281-8c54-a592d2334d6d",
          "isChanged": false,
          "group": "",
          "designParams": [],
          "title": "SY02121629/样品01"
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
        "type": "sample_test_comparison",
        "attrs": {
          "id": "7b5b68aa-9be5-45e3-80b4-84eba2b199a0",
          "updateTime": "",
          "key": "undefined20250212185328",
          "name": "21e1bdb8-fb03-40a1-b77f-49aa83bb2965",
          "isChanged": false,
          "selectSamples": [
            "a903797c-b321-46b3-8cda-28dde0b1f66b",
            "421f4cdc-1f84-4918-be78-4c2c5944c96b"
          ],
          "params": {},
          "title": "SY02121629/样品试验对比01"
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
          "key": "f736e1b2-4b66-4686-8d38-33b620944fef",
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
              "id": "1o8wuv",
              "data-toc-id": "1o8wuv",
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
