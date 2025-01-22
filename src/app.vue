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
    umo_domain: 'http://192.168.2.11:8003/api',
    umo_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzM3NjEzMzUwLCJpYXQiOjE3Mzc1MjY5NTAsImp0aSI6ImVjZWJjZTU4ZTNiOTRhODk5MzNmYjhiZDRjOWUxNTgwIiwidXNlcl9pZCI6Ijg1Mjg4NThmLTdjYjgtNDc3ZS1iZjE3LWZkZTNkMmZiYjIzZSJ9.2QVwyMfbet3-0gexp4n5xHXZDh8CH102xwyA9EUCLWs',
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
          "id": "7d8af8cb-c036-4d34-a112-b3de70d20350",
          "updateTime": "",
          "key": "baseTitle",
          "name": "8512fc73-5f68-4790-8465-f7772473f415",
          "isChanged": false,
          "title": "那个地方法规的",
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
          "key": "5cfe86e2-3c5c-43d1-930c-628176d40bb9",
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
          "id": "5f8a193d-ea9c-4f68-8e83-a0c6c1aff2c7",
          "updateTime": "2025-01-21 20:01:14",
          "key": "raw_material_table20250121200104",
          "name": "c53b4f58-631f-4bd6-b22e-9a3744079395",
          "isChanged": false,
          "change_log": {},
          "is_integration": false,
          "table_data": [
            {
              "id": "61cc6b7c-ecad-4e33-a2a8-b3f044c1075c",
              "material": "cd1faf63-9d7d-4993-a314-6e566acad5ad",
              "batch": "J003B24050901",
              "name": "澳洲坚果油",
              "price": null,
              "sn": "J003",
              "state": {
                "id": "8330f570-6742-4d43-b743-d01d1574c253",
                "name": "草稿",
                "color": "#e7e7e7",
                "type_id": 1
              },
              "supplier": null,
              "description": ""
            },
            {
              "id": "0b1e2e9b-9a89-4520-815b-96c6ce78a6d5",
              "material": "1794a71f-c1b4-4a62-9774-8e5f79aba756",
              "batch": "J065A24122601",
              "name": "琉璃苣油",
              "price": null,
              "sn": "J065",
              "state": {
                "id": "8330f570-6742-4d43-b743-d01d1574c253",
                "name": "草稿",
                "color": "#e7e7e7",
                "type_id": 1
              },
              "supplier": null,
              "description": ""
            },
            {
              "id": "a9b4d562-9236-412d-8817-afcec7ad6029",
              "material": "720a331b-ebff-47f9-a8a4-694583634da1",
              "batch": "J064A24122701",
              "name": "小麦胚芽油",
              "price": null,
              "sn": "J064",
              "state": {
                "id": "8330f570-6742-4d43-b743-d01d1574c253",
                "name": "草稿",
                "color": "#e7e7e7",
                "type_id": 1
              },
              "supplier": null,
              "description": ""
            },
            {
              "id": "d8c9e1a4-2168-4119-84cb-7d08116de01b",
              "material": "a5eef8d5-3530-4617-8b67-27990eb33530",
              "batch": "J065A24122601",
              "name": "琉璃苣油",
              "price": null,
              "sn": "xx",
              "state": {
                "id": "63e1c32f-f9f6-4caf-a698-631443950b93",
                "name": "待审核",
                "color": "#0052d9",
                "type_id": 0
              },
              "supplier": null,
              "description": ""
            }
          ],
          "title": "原材料202501212001"
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
          "id": "daf11de8-70ec-414e-842a-e854e66ac046",
          "updateTime": "",
          "key": "technology_table20250121200104",
          "name": "6a29d5ce-2d85-4eff-95f6-c94641a6d372",
          "isChanged": false,
          "change_log": {},
          "is_integration": false,
          "table_data": [
            {
              "id": "b41eb919-7a02-407a-b951-d7ce92b0c61c",
              "rowKey": "b41eb919-7a02-407a-b951-d7ce92b0c61c/5oy0z6qa",
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
                        "rowKey": "2/jlost0sf"
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
                        "rowKey": "4/xcio7lls"
                      }
                    ],
                    "rowKey": "2/94ttvzbb",
                    "key": "2/94ttvzbb",
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
                              "group": "原材料202501212001",
                              "children": [
                                {
                                  "value": "61cc6b7c-ecad-4e33-a2a8-b3f044c1075c",
                                  "label": "澳洲坚果油/J003"
                                },
                                {
                                  "value": "0b1e2e9b-9a89-4520-815b-96c6ce78a6d5",
                                  "label": "琉璃苣油/J065"
                                },
                                {
                                  "value": "a9b4d562-9236-412d-8817-afcec7ad6029",
                                  "label": "小麦胚芽油/J064"
                                },
                                {
                                  "value": "d8c9e1a4-2168-4119-84cb-7d08116de01b",
                                  "label": "琉璃苣油/xx"
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
                        "rowKey": "1/c7m5e6x1",
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
                        "rowKey": "2/eanfyxua"
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
                        "rowKey": "4/o4v4ypbm"
                      }
                    ],
                    "rowKey": "4/j3aohyck",
                    "key": "4/j3aohyck",
                    "title": "粉碎",
                    "operateType": "物料"
                  }
                ],
                "formData": {
                  "description": "",
                  "2/94ttvzbb": {
                    "shi_jian_unit": "",
                    "shi_jian": "",
                    "zhi_liang_unit": "",
                    "zhi_liang": ""
                  },
                  "4/j3aohyck": {
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
              "id": "7494f4ff-12fe-4bca-84f5-d7ba668081de",
              "rowKey": "7494f4ff-12fe-4bca-84f5-d7ba668081de/hyeqcful",
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
                        "rowKey": "3/8c26x9f2"
                      }
                    ],
                    "rowKey": "1/le0igko0",
                    "key": "1/le0igko0",
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
                              "group": "原材料202501212001",
                              "children": [
                                {
                                  "value": "61cc6b7c-ecad-4e33-a2a8-b3f044c1075c",
                                  "label": "澳洲坚果油/J003"
                                },
                                {
                                  "value": "0b1e2e9b-9a89-4520-815b-96c6ce78a6d5",
                                  "label": "琉璃苣油/J065"
                                },
                                {
                                  "value": "a9b4d562-9236-412d-8817-afcec7ad6029",
                                  "label": "小麦胚芽油/J064"
                                },
                                {
                                  "value": "d8c9e1a4-2168-4119-84cb-7d08116de01b",
                                  "label": "琉璃苣油/xx"
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
                        "rowKey": "1/dbpfhozj",
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
                        "rowKey": "2/v19sdjmt"
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
                        "rowKey": "4/jxz4aphg"
                      }
                    ],
                    "rowKey": "4/nqjvpuza",
                    "key": "4/nqjvpuza",
                    "title": "粉碎",
                    "operateType": "物料"
                  }
                ],
                "formData": {
                  "description": "",
                  "1/le0igko0": {
                    "wu_liao": []
                  },
                  "4/nqjvpuza": {
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
          "title": "工艺202501212001"
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
          "id": "6daeceb7-6789-4239-ab28-03cbc648ff76",
          "updateTime": "2025-01-21 20:03:16",
          "key": "test_record_table20250121200133",
          "name": "12383c1f-e627-4f81-9f25-0869d493ab20",
          "isChanged": false,
          "customerParams": {},
          "group": "",
          "table_data": [
            {
              "id": "1a97acad-e541-4199-aaca-433f878771c0",
              "procedure_rowKey": "b41eb919-7a02-407a-b951-d7ce92b0c61c/5oy0z6qa",
              "operate_rowKey": "2/94ttvzbb",
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
                    "rowKey": "2/jlost0sf"
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
                    "rowKey": "4/xcio7lls"
                  }
                ],
                "rowKey": "2/94ttvzbb",
                "key": "2/94ttvzbb",
                "title": "准备物料",
                "operateType": "操作"
              },
              "description": "",
              "procedure": {
                "id": "b41eb919-7a02-407a-b951-d7ce92b0c61c",
                "title": "准备操作",
                "key": "b41eb919-7a02-407a-b951-d7ce92b0c61c",
                "rowKey": "b41eb919-7a02-407a-b951-d7ce92b0c61c/5oy0z6qa"
              },
              "is_sample": false,
              "sample": {},
              "operate_router": {
                "id": 2,
                "title": "准备物料",
                "key": "2/94ttvzbb",
                "rowKey": "2/94ttvzbb"
              }
            },
            {
              "id": "184fe00e-bca5-4880-89c7-8c42ad286bfa",
              "procedure_rowKey": "b41eb919-7a02-407a-b951-d7ce92b0c61c/5oy0z6qa",
              "operate_rowKey": "4/j3aohyck",
              "operateType": "物料",
              "formData": {
                "yuan_cai_liao": [
                  "61cc6b7c-ecad-4e33-a2a8-b3f044c1075c"
                ],
                "shi_jian_unit": "y",
                "shi_jian": "3",
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
                          "group": "原材料202501212001",
                          "children": [
                            {
                              "value": "61cc6b7c-ecad-4e33-a2a8-b3f044c1075c",
                              "label": "澳洲坚果油/J003"
                            },
                            {
                              "value": "0b1e2e9b-9a89-4520-815b-96c6ce78a6d5",
                              "label": "琉璃苣油/J065"
                            },
                            {
                              "value": "a9b4d562-9236-412d-8817-afcec7ad6029",
                              "label": "小麦胚芽油/J064"
                            },
                            {
                              "value": "d8c9e1a4-2168-4119-84cb-7d08116de01b",
                              "label": "琉璃苣油/xx"
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
                    "rowKey": "1/c7m5e6x1",
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
                    "rowKey": "2/eanfyxua"
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
                    "rowKey": "4/o4v4ypbm"
                  }
                ],
                "rowKey": "4/j3aohyck",
                "key": "4/j3aohyck",
                "title": "粉碎",
                "operateType": "物料"
              },
              "description": "",
              "procedure": {
                "id": "b41eb919-7a02-407a-b951-d7ce92b0c61c",
                "title": "准备操作",
                "key": "b41eb919-7a02-407a-b951-d7ce92b0c61c",
                "rowKey": "b41eb919-7a02-407a-b951-d7ce92b0c61c/5oy0z6qa"
              },
              "is_sample": false,
              "sample": {},
              "operate_router": {
                "id": 4,
                "title": "粉碎",
                "key": "4/j3aohyck",
                "rowKey": "4/j3aohyck"
              }
            },
            {
              "id": "22331c96-b33b-40d5-8f78-b783fd344c2c",
              "procedure_rowKey": "b41eb919-7a02-407a-b951-d7ce92b0c61c/5oy0z6qa",
              "operate_rowKey": "4/j3aohyck",
              "operateType": "样品",
              "test_record_table": "6daeceb7-6789-4239-ab28-03cbc648ff76",
              "formData": {},
              "formItems": [],
              "description": "",
              "procedure": {
                "id": "b41eb919-7a02-407a-b951-d7ce92b0c61c",
                "title": "准备操作",
                "key": "b41eb919-7a02-407a-b951-d7ce92b0c61c",
                "rowKey": "b41eb919-7a02-407a-b951-d7ce92b0c61c/5oy0z6qa"
              },
              "is_sample": true,
              "operate_router": {
                "title": "样品检测"
              },
              "sample": {
                "id": "ab9ca178-a9f4-4f24-8a6a-f88db817f8ac",
                "name": "样品-202501212003f1",
                "sn": "S202501211",
                "weight": 1,
                "record_table": {
                  "id": "ac0caf50-154e-40ec-8c35-34917ce0bd4c",
                  "title": "测试edru8ynv",
                  "table_data": [],
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
              "id": "57528b00-36e3-4dd7-9295-6d948fc4d154",
              "procedure_rowKey": "b41eb919-7a02-407a-b951-d7ce92b0c61c/5oy0z6qa",
              "operate_rowKey": "过程描述qk2700cb",
              "operateType": "过程描述",
              "formData": {},
              "formItems": {
                "title": "过程描述"
              },
              "procedure": {
                "id": "b41eb919-7a02-407a-b951-d7ce92b0c61c",
                "title": "准备操作",
                "key": "b41eb919-7a02-407a-b951-d7ce92b0c61c",
                "rowKey": "b41eb919-7a02-407a-b951-d7ce92b0c61c/5oy0z6qa"
              },
              "is_sample": false,
              "sample": {},
              "operate_router": {
                "title": "过程描述"
              }
            },
            {
              "id": "2acdb69d-e05b-4d7f-a0ed-7804f9b27b49",
              "procedure_rowKey": "7494f4ff-12fe-4bca-84f5-d7ba668081de/hyeqcful",
              "operate_rowKey": "1/le0igko0",
              "operateType": "物料",
              "formData": {
                "wu_liao": [
                  {
                    "1": [
                      "a9b4d562-9236-412d-8817-afcec7ad6029"
                    ],
                    "4": "4"
                  },
                  {
                    "1": [
                      "d8c9e1a4-2168-4119-84cb-7d08116de01b"
                    ],
                    "4": "3"
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
                                "group": "原材料202501212001",
                                "children": [
                                  {
                                    "value": "61cc6b7c-ecad-4e33-a2a8-b3f044c1075c",
                                    "label": "澳洲坚果油/J003"
                                  },
                                  {
                                    "value": "0b1e2e9b-9a89-4520-815b-96c6ce78a6d5",
                                    "label": "琉璃苣油/J065"
                                  },
                                  {
                                    "value": "a9b4d562-9236-412d-8817-afcec7ad6029",
                                    "label": "小麦胚芽油/J064"
                                  },
                                  {
                                    "value": "d8c9e1a4-2168-4119-84cb-7d08116de01b",
                                    "label": "琉璃苣油/xx"
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
                    "rowKey": "3/8c26x9f2"
                  }
                ],
                "rowKey": "1/le0igko0",
                "key": "1/le0igko0",
                "title": "添加物料",
                "operateType": "物料"
              },
              "description": "",
              "procedure": {
                "id": "7494f4ff-12fe-4bca-84f5-d7ba668081de",
                "title": "粉碎过程",
                "key": "7494f4ff-12fe-4bca-84f5-d7ba668081de",
                "rowKey": "7494f4ff-12fe-4bca-84f5-d7ba668081de/hyeqcful"
              },
              "is_sample": false,
              "sample": {},
              "operate_router": {
                "id": 1,
                "title": "添加物料",
                "key": "1/le0igko0",
                "rowKey": "1/le0igko0"
              }
            },
            {
              "id": "4e4dbe04-07f4-449b-913f-b68ff6c34ca2",
              "procedure_rowKey": "7494f4ff-12fe-4bca-84f5-d7ba668081de/hyeqcful",
              "operate_rowKey": "1/le0igko0",
              "operateType": "样品",
              "formData": {},
              "formItems": [],
              "test_record_table": "6daeceb7-6789-4239-ab28-03cbc648ff76",
              "description": "",
              "procedure": {
                "id": "7494f4ff-12fe-4bca-84f5-d7ba668081de",
                "title": "粉碎过程",
                "key": "7494f4ff-12fe-4bca-84f5-d7ba668081de",
                "rowKey": "7494f4ff-12fe-4bca-84f5-d7ba668081de/hyeqcful"
              },
              "is_sample": true,
              "operate_router": {
                "title": "样品检测"
              },
              "sample": {
                "id": "c15eea8f-3e83-4c1b-9111-da233ab13e4c",
                "name": "样品-20250121200265",
                "sn": "S202501212",
                "weight": 1,
                "record_table": {
                  "id": "2752883d-7dab-4665-a13e-b7d6743b1e7d",
                  "title": "测试n9fobo8o",
                  "table_data": [
                    {
                      "id": "23f2fa5c-cde9-461d-8ff6-17468b77c219",
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
                      "time": "2025-01-21 20:02:49",
                      "data": "3",
                      "description": "",
                      "lab_l_unit": "k"
                    },
                    {
                      "id": "e5033e6a-227b-415c-9761-316ea50e38a0",
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
                      "time": "2025-01-21 20:02:49",
                      "data": "45",
                      "description": "",
                      "lab_a_unit": "df"
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
              "id": "c610b306-c44b-4231-8502-dd1f62a9f072",
              "procedure_rowKey": "7494f4ff-12fe-4bca-84f5-d7ba668081de/hyeqcful",
              "operate_rowKey": "4/nqjvpuza",
              "operateType": "物料",
              "formData": {
                "yuan_cai_liao": [
                  "0b1e2e9b-9a89-4520-815b-96c6ce78a6d5"
                ],
                "shi_jian_unit": "y",
                "shi_jian": "4",
                "zhi_liang_unit": "kg",
                "zhi_liang": "6"
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
                          "group": "原材料202501212001",
                          "children": [
                            {
                              "value": "61cc6b7c-ecad-4e33-a2a8-b3f044c1075c",
                              "label": "澳洲坚果油/J003"
                            },
                            {
                              "value": "0b1e2e9b-9a89-4520-815b-96c6ce78a6d5",
                              "label": "琉璃苣油/J065"
                            },
                            {
                              "value": "a9b4d562-9236-412d-8817-afcec7ad6029",
                              "label": "小麦胚芽油/J064"
                            },
                            {
                              "value": "d8c9e1a4-2168-4119-84cb-7d08116de01b",
                              "label": "琉璃苣油/xx"
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
                    "rowKey": "1/dbpfhozj",
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
                    "rowKey": "2/v19sdjmt"
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
                    "rowKey": "4/jxz4aphg"
                  }
                ],
                "rowKey": "4/nqjvpuza",
                "key": "4/nqjvpuza",
                "title": "粉碎",
                "operateType": "物料"
              },
              "description": "",
              "procedure": {
                "id": "7494f4ff-12fe-4bca-84f5-d7ba668081de",
                "title": "粉碎过程",
                "key": "7494f4ff-12fe-4bca-84f5-d7ba668081de",
                "rowKey": "7494f4ff-12fe-4bca-84f5-d7ba668081de/hyeqcful"
              },
              "is_sample": false,
              "sample": {},
              "operate_router": {
                "id": 4,
                "title": "粉碎",
                "key": "4/nqjvpuza",
                "rowKey": "4/nqjvpuza"
              }
            },
            {
              "id": "0dd83694-d58f-499c-9049-4272f595ffb8",
              "procedure_rowKey": "7494f4ff-12fe-4bca-84f5-d7ba668081de/hyeqcful",
              "operate_rowKey": "过程描述8xceehqs",
              "operateType": "过程描述",
              "formData": {},
              "formItems": {
                "title": "过程描述"
              },
              "procedure": {
                "id": "7494f4ff-12fe-4bca-84f5-d7ba668081de",
                "title": "粉碎过程",
                "key": "7494f4ff-12fe-4bca-84f5-d7ba668081de",
                "rowKey": "7494f4ff-12fe-4bca-84f5-d7ba668081de/hyeqcful"
              },
              "is_sample": false,
              "sample": {},
              "operate_router": {
                "title": "过程描述"
              }
            }
          ],
          "designParams": "daf11de8-70ec-414e-842a-e854e66ac046",
          "designResult": {
            "formData": {
              "b41eb919-7a02-407a-b951-d7ce92b0c61c": {
                "description": "",
                "2/94ttvzbb": {
                  "shi_jian_unit": "y",
                  "shi_jian": "2",
                  "zhi_liang_unit": "kg",
                  "zhi_liang": "3"
                },
                "4/j3aohyck": {
                  "yuan_cai_liao": [
                    "61cc6b7c-ecad-4e33-a2a8-b3f044c1075c"
                  ],
                  "shi_jian_unit": "y",
                  "shi_jian": "3",
                  "zhi_liang_unit": "kg",
                  "zhi_liang": "2"
                }
              },
              "7494f4ff-12fe-4bca-84f5-d7ba668081de": {
                "description": "",
                "1/le0igko0": {
                  "wu_liao": [
                    {
                      "1": [
                        "a9b4d562-9236-412d-8817-afcec7ad6029"
                      ],
                      "4": "4"
                    },
                    {
                      "1": [
                        "d8c9e1a4-2168-4119-84cb-7d08116de01b"
                      ],
                      "4": "3"
                    }
                  ],
                  "zhi_liang_unit": "kg"
                },
                "4/nqjvpuza": {
                  "yuan_cai_liao": [
                    "0b1e2e9b-9a89-4520-815b-96c6ce78a6d5"
                  ],
                  "shi_jian_unit": "y",
                  "shi_jian": "4",
                  "zhi_liang_unit": "kg",
                  "zhi_liang": "6"
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
                        "rowKey": "2/jlost0sf"
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
                        "rowKey": "4/xcio7lls"
                      }
                    ],
                    "rowKey": "2/94ttvzbb",
                    "key": "2/94ttvzbb",
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
                              "group": "原材料202501212001",
                              "children": [
                                {
                                  "value": "61cc6b7c-ecad-4e33-a2a8-b3f044c1075c",
                                  "label": "澳洲坚果油/J003"
                                },
                                {
                                  "value": "0b1e2e9b-9a89-4520-815b-96c6ce78a6d5",
                                  "label": "琉璃苣油/J065"
                                },
                                {
                                  "value": "a9b4d562-9236-412d-8817-afcec7ad6029",
                                  "label": "小麦胚芽油/J064"
                                },
                                {
                                  "value": "d8c9e1a4-2168-4119-84cb-7d08116de01b",
                                  "label": "琉璃苣油/xx"
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
                        "rowKey": "1/c7m5e6x1",
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
                        "rowKey": "2/eanfyxua"
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
                        "rowKey": "4/o4v4ypbm"
                      }
                    ],
                    "rowKey": "4/j3aohyck",
                    "key": "4/j3aohyck",
                    "title": "粉碎",
                    "operateType": "物料"
                  }
                ],
                "id": "b41eb919-7a02-407a-b951-d7ce92b0c61c",
                "key": "b41eb919-7a02-407a-b951-d7ce92b0c61c",
                "rowKey": "b41eb919-7a02-407a-b951-d7ce92b0c61c/5oy0z6qa",
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
                                    "group": "原材料202501212001",
                                    "children": [
                                      {
                                        "value": "61cc6b7c-ecad-4e33-a2a8-b3f044c1075c",
                                        "label": "澳洲坚果油/J003"
                                      },
                                      {
                                        "value": "0b1e2e9b-9a89-4520-815b-96c6ce78a6d5",
                                        "label": "琉璃苣油/J065"
                                      },
                                      {
                                        "value": "a9b4d562-9236-412d-8817-afcec7ad6029",
                                        "label": "小麦胚芽油/J064"
                                      },
                                      {
                                        "value": "d8c9e1a4-2168-4119-84cb-7d08116de01b",
                                        "label": "琉璃苣油/xx"
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
                        "rowKey": "3/8c26x9f2"
                      }
                    ],
                    "rowKey": "1/le0igko0",
                    "key": "1/le0igko0",
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
                              "group": "原材料202501212001",
                              "children": [
                                {
                                  "value": "61cc6b7c-ecad-4e33-a2a8-b3f044c1075c",
                                  "label": "澳洲坚果油/J003"
                                },
                                {
                                  "value": "0b1e2e9b-9a89-4520-815b-96c6ce78a6d5",
                                  "label": "琉璃苣油/J065"
                                },
                                {
                                  "value": "a9b4d562-9236-412d-8817-afcec7ad6029",
                                  "label": "小麦胚芽油/J064"
                                },
                                {
                                  "value": "d8c9e1a4-2168-4119-84cb-7d08116de01b",
                                  "label": "琉璃苣油/xx"
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
                        "rowKey": "1/dbpfhozj",
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
                        "rowKey": "2/v19sdjmt"
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
                        "rowKey": "4/jxz4aphg"
                      }
                    ],
                    "rowKey": "4/nqjvpuza",
                    "key": "4/nqjvpuza",
                    "title": "粉碎",
                    "operateType": "物料"
                  }
                ],
                "id": "7494f4ff-12fe-4bca-84f5-d7ba668081de",
                "key": "7494f4ff-12fe-4bca-84f5-d7ba668081de",
                "rowKey": "7494f4ff-12fe-4bca-84f5-d7ba668081de/hyeqcful",
                "title": "粉碎过程",
                "name": "粉碎过程"
              }
            ],
            "orthogonalDesign": {
              "cycleNumber": 1,
              "stepItems": []
            },
            "id": "8a014576-e1d8-4d6f-934a-3138412b63f0",
            "title": "试验设计方案-20250121200224"
          },
          "selectRows": [],
          "title": "试验记录202501212001"
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
          "id": "28f9faf7-bb88-4cf4-9c2b-b38a6d0013d3",
          "updateTime": "2025-01-21 20:03:37",
          "key": "sample_table20250121200233",
          "name": "ed24fc32-aae8-4c95-b184-eacbe23779b4",
          "isChanged": false,
          "group": "",
          "designParams": [],
          "title": "样品202501212002"
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
        "type": "evaluating_table",
        "attrs": {
          "id": "f0d6c3d2-f083-47d1-9e7f-fe99a0f133a9",
          "updateTime": "",
          "key": "evaluating_table20250121200411",
          "name": "aa0ab23f-2611-49bf-81ad-f6d53d0ff9d5",
          "isChanged": false,
          "table_data": [],
          "columns": [],
          "group": "",
          "designParams": {}
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
          "key": "5cfe86e2-3c5c-43d1-930c-628176d40bb9",
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
              "id": "0iwpv4",
              "data-toc-id": "0iwpv4",
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
