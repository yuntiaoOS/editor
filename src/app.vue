<template>
  <div class="box">
    <!-- <TTitle>What is TDesign</TTitle>
    <TText mark>
      TDesign is an enterprise-level design system accumulated by Tencent's
      various business teams.
    </TText> -->
    <!-- <xm-form v-model:form-data="xmValue" /> -->
    <!-- <UmoEditor ref="editorRef" v-bind="options" /> -->
    <UmoSimpleEditor ref="editorRef" v-bind="options" @change="changeEdit" />
  </div>
</template>

<script setup lang="ts">
import { shortId } from '@/utils/short-id'
import { multiply } from 'lodash-unified';
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
      "category_label_option": [
        {
          "id": "3d2735f8-205a-44ff-a946-8316e4e0b973",
          "label": "配方相",
          "value": "1",
          "parent": "029a3213-1706-4087-a484-8a7a176c0b12",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "758d4cd4-9dac-4254-b7a0-7ca91325e029",
          "label": "配方标注",
          "value": "2",
          "parent": "029a3213-1706-4087-a484-8a7a176c0b12",
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
            "efficacy_eval"
          ]
        }
      ],
      "field_type": [
        {
          "id": "1ca18f8c-0da1-41b9-b5b8-6894d26169e7",
          "label": "部门选择",
          "value": "DeptPicker",
          "parent": "087cd6fc-15d6-4133-8d36-aa99557a9c1f",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "22ff527a-69a1-4405-9669-390e7e7bb23c",
          "label": "多选框",
          "value": "MultipleSelect",
          "parent": "087cd6fc-15d6-4133-8d36-aa99557a9c1f",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "23f16e88-5496-4dcf-9960-e8bcb1c765f6",
          "label": "单行文本",
          "value": "TextInput",
          "parent": "087cd6fc-15d6-4133-8d36-aa99557a9c1f",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "44223e4f-b5c2-44a7-8f34-f6ccd73c5175",
          "label": "人员选择",
          "value": "UserPicker",
          "parent": "087cd6fc-15d6-4133-8d36-aa99557a9c1f",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "46c9fe8c-dbed-4e36-9fb4-6101cc0fa429",
          "label": "引用",
          "value": "ReferencePicker",
          "parent": "087cd6fc-15d6-4133-8d36-aa99557a9c1f",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "5023f240-6ac4-4cbf-b4d2-640bb237b4e8",
          "label": "日期时间",
          "value": "DateTime",
          "parent": "087cd6fc-15d6-4133-8d36-aa99557a9c1f",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "720b44e9-26d0-4806-b7d8-fd37309c904c",
          "label": "多选",
          "value": "SelectPlus",
          "parent": "087cd6fc-15d6-4133-8d36-aa99557a9c1f",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "874c59df-3212-4dc9-b4db-ad5c34f2deb3",
          "label": "时间选择",
          "value": "TimePicker",
          "parent": "087cd6fc-15d6-4133-8d36-aa99557a9c1f",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "8c554e3e-0f3a-4b05-b2cd-a5361d686d94",
          "label": "数字输入",
          "value": "NumberInput",
          "parent": "087cd6fc-15d6-4133-8d36-aa99557a9c1f",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "99a35141-63de-4948-8cd8-9f8c494a0ec6",
          "label": "时间区间",
          "value": "DateTimeRange",
          "parent": "087cd6fc-15d6-4133-8d36-aa99557a9c1f",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "a27a4c02-dfad-4dfc-9145-30e565acc612",
          "label": "评分",
          "value": "Score",
          "parent": "087cd6fc-15d6-4133-8d36-aa99557a9c1f",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "a37f46dd-faad-4aaf-83ac-5b2f726f160f",
          "label": "上传附件",
          "value": "FileUpload",
          "parent": "087cd6fc-15d6-4133-8d36-aa99557a9c1f",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "a4daf4cb-c12f-4270-8a12-5a765c9c98c2",
          "label": "流程关联",
          "value": "ProcessIndex",
          "parent": "087cd6fc-15d6-4133-8d36-aa99557a9c1f",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "b3c23f8c-eff0-4aa5-ba12-4558f1712af0",
          "label": "金额输入",
          "value": "AmountInput",
          "parent": "087cd6fc-15d6-4133-8d36-aa99557a9c1f",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "be346954-9581-4b81-9b73-8f78d2afe967",
          "label": "时间范围",
          "value": "TimeRangePicker",
          "parent": "087cd6fc-15d6-4133-8d36-aa99557a9c1f",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "c23ea4d3-fbb4-45ce-b4c1-4159d27913cc",
          "label": "多行文本",
          "value": "TextareaInput",
          "parent": "087cd6fc-15d6-4133-8d36-aa99557a9c1f",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "c9b4dc75-ca80-4387-877a-f7b403d26a36",
          "label": "单选",
          "value": "SelectPlusRadio",
          "parent": "087cd6fc-15d6-4133-8d36-aa99557a9c1f",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "cf2b7b86-27c5-4492-a690-640edab2f8bf",
          "label": "编号/单号",
          "value": "SNInput",
          "parent": "087cd6fc-15d6-4133-8d36-aa99557a9c1f",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "cf3ff8df-02f9-41c4-89ad-369a5f365807",
          "label": "单选框",
          "value": "SelectInput",
          "parent": "087cd6fc-15d6-4133-8d36-aa99557a9c1f",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "dafaa6e0-b663-4c70-a56e-71dd9a558be0",
          "label": "上传图片",
          "value": "ImageUpload",
          "parent": "087cd6fc-15d6-4133-8d36-aa99557a9c1f",
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
            "efficacy_eval"
          ]
        }
      ],
      "audit": [
        {
          "id": "1829da45-22aa-4c08-a4d2-c442f880289c",
          "label": "驳回",
          "value": "4",
          "parent": "0b857cf0-b750-4b87-a175-590752ba59fb",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "6e523bf9-bb6f-4a6a-8c3d-0d07d0e3d384",
          "label": "已审核",
          "value": "2",
          "parent": "0b857cf0-b750-4b87-a175-590752ba59fb",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "bfd47c05-2699-4f8c-b3a3-0413f2d2219c",
          "label": "待审核",
          "value": "1",
          "parent": "0b857cf0-b750-4b87-a175-590752ba59fb",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "de89f5cc-2da2-4fa9-8992-1fd1a49cca68",
          "label": "审核失败",
          "value": "3",
          "parent": "0b857cf0-b750-4b87-a175-590752ba59fb",
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
            "efficacy_eval"
          ]
        }
      ],
      "test_conditions": [
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
            "efficacy_eval"
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
            "efficacy_eval"
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
            "efficacy_eval"
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
            "efficacy_eval"
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
            "efficacy_eval"
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
            "efficacy_eval"
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
            "efficacy_eval"
          ]
        }
      ],
      "product_category": [
        {
          "id": "56046d5f-bcef-46e2-8035-4bf8738e0dc7",
          "label": "淋洗类",
          "value": "leaching_type",
          "parent": "0fc0d044-d7c4-49a1-929f-a049b30697cb",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "dd30fc6e-470f-43d8-8cf2-4aab5609211d",
          "label": "驻留类",
          "value": "resident_type",
          "parent": "0fc0d044-d7c4-49a1-929f-a049b30697cb",
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
            "efficacy_eval"
          ]
        }
      ],
      "forbidden_type": [
        {
          "id": "82220f0f-9c72-42d6-88d1-ead455cb09f6",
          "label": "动植物",
          "value": "propagation",
          "parent": "17d1c120-d895-4ec3-a00a-983d189691b3",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "be8d9577-0fc9-4d6d-8c7a-676b2a688cb8",
          "label": "组分",
          "value": "component",
          "parent": "17d1c120-d895-4ec3-a00a-983d189691b3",
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
            "efficacy_eval"
          ]
        }
      ],
      "process_listener": [
        {
          "id": "1ea465f0-7866-4d5b-9efd-5c68bb4cd370",
          "label": "当流程离开节点时",
          "value": "leave",
          "parent": "1ba8a707-9a46-4f1e-b76d-9e04dbcab91d",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "68d9002e-5f36-4d5b-9fd2-3a364ba127d6",
          "label": "当流程被撤销时",
          "value": "cancel",
          "parent": "1ba8a707-9a46-4f1e-b76d-9e04dbcab91d",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "6b0914c4-3e4c-4e87-883c-1ed3ebbfe442",
          "label": "当流程被驳回时",
          "value": "refuse",
          "parent": "1ba8a707-9a46-4f1e-b76d-9e04dbcab91d",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "71e20f80-a3fc-4b5f-a2bb-f9176b385062",
          "label": "当流程进入节点时",
          "value": "enter",
          "parent": "1ba8a707-9a46-4f1e-b76d-9e04dbcab91d",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "866b7e44-a849-4d5a-a422-bb9af38aab3a",
          "label": "当流程审批通过时",
          "value": "pass",
          "parent": "1ba8a707-9a46-4f1e-b76d-9e04dbcab91d",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "884b5b97-4fd7-48fb-9f94-3351b30e985d",
          "label": "当流程启动时",
          "value": "start",
          "parent": "1ba8a707-9a46-4f1e-b76d-9e04dbcab91d",
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
            "efficacy_eval"
          ]
        }
      ],
      "exposure_pathway": [
        {
          "id": "8513de0f-5fcc-477c-9b89-d787d57d58f9",
          "label": "经皮途径",
          "value": "经皮途径",
          "parent": "222b0a28-a448-4145-8557-d5a1fb237bba",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 1,
          "remark": null,
          "default": false,
          "app_category": []
        },
        {
          "id": "36947ee4-b897-46e7-bf20-684784b5dc23",
          "label": "经囗途径",
          "value": "经囗途径",
          "parent": "222b0a28-a448-4145-8557-d5a1fb237bba",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 2,
          "remark": null,
          "default": false,
          "app_category": null
        },
        {
          "id": "d92d402c-aea9-4f73-822a-575b9b1e8cb4",
          "label": "吸入途径",
          "value": "吸入途径",
          "parent": "222b0a28-a448-4145-8557-d5a1fb237bba",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 3,
          "remark": null,
          "default": false,
          "app_category": null
        }
      ],
      "report_state": [
        {
          "id": "c593501c-b074-44f8-871c-9b6a2f1886c5",
          "label": "停用",
          "value": "false",
          "parent": "2b2ef738-be9d-45c6-9764-a5258e8e35af",
          "type": 6,
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
            "efficacy_eval"
          ]
        },
        {
          "id": "d0fb5b41-d582-48f1-9d5d-852e69543bc2",
          "label": "启用",
          "value": "true",
          "parent": "2b2ef738-be9d-45c6-9764-a5258e8e35af",
          "type": 6,
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
            "efficacy_eval"
          ]
        }
      ],
      "dosage_form": [
        {
          "id": "ebfbb465-c8a9-4386-aa09-bcfa99f7e2ba",
          "label": "其他",
          "value": "其他",
          "parent": "37ce1c98-29d6-42a6-b5b7-01c8908cf85d",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 1,
          "remark": "不属于以下范围的",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "455a3bba-7d86-4d0f-92e8-3cb516fd0ca6",
          "label": "膏霜乳",
          "value": "膏霜乳",
          "parent": "37ce1c98-29d6-42a6-b5b7-01c8908cf85d",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 2,
          "remark": "膏、霜、蜜、脂、乳、乳液、奶、奶液等",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "edf7de3e-66fb-4481-9482-1bad31f5fac9",
          "label": "液体",
          "value": "液体",
          "parent": "37ce1c98-29d6-42a6-b5b7-01c8908cf85d",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 3,
          "remark": "露、液、水、油、油水分离等",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "1179f2ed-6d0a-47fb-bb6d-1d4f534dc1bd",
          "label": "凝胶",
          "value": "凝胶",
          "parent": "37ce1c98-29d6-42a6-b5b7-01c8908cf85d",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 4,
          "remark": "啫喱、胶等",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "83e36b94-afa7-4252-9d43-70f3fae0c146",
          "label": "粉剂",
          "value": "粉剂",
          "parent": "37ce1c98-29d6-42a6-b5b7-01c8908cf85d",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 5,
          "remark": "散粉、颗粒等",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "af6b72a6-1bc0-4865-9b09-17bfc792e6cd",
          "label": "块状",
          "value": "块状",
          "parent": "37ce1c98-29d6-42a6-b5b7-01c8908cf85d",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 6,
          "remark": "块状粉、大块固体等",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "8c9312df-deb1-4b83-8069-84d5c4ad09e6",
          "label": "泥",
          "value": "泥",
          "parent": "37ce1c98-29d6-42a6-b5b7-01c8908cf85d",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 7,
          "remark": "泥状固体等",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "be51a93a-6066-4341-aef8-995086f00c28",
          "label": "蜡基",
          "value": "蜡基",
          "parent": "37ce1c98-29d6-42a6-b5b7-01c8908cf85d",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 8,
          "remark": "以蜡为主要基料的",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "df622bb4-c025-448f-9909-71a21eaed63a",
          "label": "喷雾剂",
          "value": "喷雾剂",
          "parent": "37ce1c98-29d6-42a6-b5b7-01c8908cf85d",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 9,
          "remark": "不含推进剂",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "fbcfee95-c0eb-4d1b-861a-c5e0dfcaf13c",
          "label": "气雾剂",
          "value": "气雾剂",
          "parent": "37ce1c98-29d6-42a6-b5b7-01c8908cf85d",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 10,
          "remark": "含推进剂",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "5f42832d-2f29-4059-b31b-65ceaf70547e",
          "label": "贴、膜、含基材",
          "value": "贴、膜、含基材",
          "parent": "37ce1c98-29d6-42a6-b5b7-01c8908cf85d",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 11,
          "remark": "贴、膜、含配合化妆品使用的基材的",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "cabc2bb2-aaa5-45cc-ac6e-ebd20c6d58a4",
          "label": "冻干",
          "value": "冻干",
          "parent": "37ce1c98-29d6-42a6-b5b7-01c8908cf85d",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 12,
          "remark": "冻干粉、冻干片等",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "888952c5-45a1-4fa9-985b-8cbd02d80cf3",
          "label": "唇膏",
          "value": "唇膏",
          "parent": "37ce1c98-29d6-42a6-b5b7-01c8908cf85d",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 13,
          "remark": null,
          "default": false,
          "app_category": null
        },
        {
          "id": "19095ce4-1552-4f09-b1da-56885ce3fff5",
          "label": "涂敷面膜",
          "value": "涂敷面膜",
          "parent": "37ce1c98-29d6-42a6-b5b7-01c8908cf85d",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 14,
          "remark": null,
          "default": false,
          "app_category": null
        },
        {
          "id": "a61331fe-6b4f-4548-a07e-894307aba519",
          "label": "发用定型化妆品",
          "value": "发用定型化妆品",
          "parent": "37ce1c98-29d6-42a6-b5b7-01c8908cf85d",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 15,
          "remark": null,
          "default": false,
          "app_category": null
        },
        {
          "id": "50f57236-f5b7-42c6-bb00-d71a93b65ed0",
          "label": "防晒化妆品",
          "value": "防晒化妆品",
          "parent": "37ce1c98-29d6-42a6-b5b7-01c8908cf85d",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 16,
          "remark": null,
          "default": false,
          "app_category": null
        }
      ],
      "inbound_products_type": [
        {
          "id": "1613e9be-7677-4f2a-ae7d-b34fe7645e7f",
          "label": "样品",
          "value": "1",
          "parent": "3e7a4b8c-7d43-4827-9494-e4f4de7de1cb",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "8e4123ab-b5f5-4d41-8516-57491add18bb",
          "label": "原料",
          "value": "2",
          "parent": "3e7a4b8c-7d43-4827-9494-e4f4de7de1cb",
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
            "efficacy_eval"
          ]
        }
      ],
      "product_source": [
        {
          "id": "42db6710-34de-4b25-a405-035088d40fdc",
          "label": "客供",
          "value": "customer_provide",
          "parent": "404a90e2-f1ca-49d2-9e66-c64b87518986",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "bf3a62cd-c5cf-45d9-8fba-79df66d2d61d",
          "label": "自研",
          "value": "self_provide",
          "parent": "404a90e2-f1ca-49d2-9e66-c64b87518986",
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
            "efficacy_eval"
          ]
        }
      ],
      "device_status": [
        {
          "id": "197ccd78-43fc-41ac-b708-b1445d394223",
          "label": "报废",
          "value": "1",
          "parent": "459f5299-355e-4a80-94a1-37563ed3d9e2",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "71fd52d6-a148-43d9-8671-b73da98c165e",
          "label": "维修",
          "value": "2",
          "parent": "459f5299-355e-4a80-94a1-37563ed3d9e2",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "e2d305ad-2706-484f-b5f7-1a1e16aabb09",
          "label": "正常",
          "value": "0",
          "parent": "459f5299-355e-4a80-94a1-37563ed3d9e2",
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
            "efficacy_eval"
          ]
        }
      ],
      "sn_type": [
        {
          "id": "0654ff22-965b-4109-a503-5de5670de92d",
          "label": "项目编号",
          "value": "2",
          "parent": "48916b4d-5535-4c4e-8d48-c15f2abbc150",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "29821096-20f4-4116-8e10-64ef515c46ed",
          "label": "志愿者编号",
          "value": "3",
          "parent": "48916b4d-5535-4c4e-8d48-c15f2abbc150",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "30b312a0-9cd3-417f-9559-37f03960b608",
          "label": "样品编号",
          "value": "4",
          "parent": "48916b4d-5535-4c4e-8d48-c15f2abbc150",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "832d3675-37e3-464f-8721-4fae5ae7322e",
          "label": "配方编号",
          "value": "8",
          "parent": "48916b4d-5535-4c4e-8d48-c15f2abbc150",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "8ed0feb9-0681-43cd-8cf1-984fae149d55",
          "label": "生产编号",
          "value": "12",
          "parent": "48916b4d-5535-4c4e-8d48-c15f2abbc150",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "c7a8643c-21bb-4111-8ebe-dca2785ad2ff",
          "label": "出库编号",
          "value": "11",
          "parent": "48916b4d-5535-4c4e-8d48-c15f2abbc150",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "d66ec3b8-8b18-48ca-a556-5dc73f995abd",
          "label": "库存编号",
          "value": "10",
          "parent": "48916b4d-5535-4c4e-8d48-c15f2abbc150",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "e24742ab-8f70-42e2-9072-9c4d8de56cbc",
          "label": "未知",
          "value": "6",
          "parent": "48916b4d-5535-4c4e-8d48-c15f2abbc150",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "ec9f6062-04df-4f67-9bc7-84a02d88023e",
          "label": "报告编号",
          "value": "5",
          "parent": "48916b4d-5535-4c4e-8d48-c15f2abbc150",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "f01a83ff-0ecb-4e22-8fd3-ddfb37b0e30f",
          "label": "原料编号",
          "value": "7",
          "parent": "48916b4d-5535-4c4e-8d48-c15f2abbc150",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "f6236200-d95e-49f5-926c-370a7e786bf5",
          "label": "合同编号",
          "value": "1",
          "parent": "48916b4d-5535-4c4e-8d48-c15f2abbc150",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "f8bf8607-4581-4a6a-91f9-f21751cc4ab2",
          "label": "入库编号",
          "value": "9",
          "parent": "48916b4d-5535-4c4e-8d48-c15f2abbc150",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "9eec8cb5-5a9d-49f7-846d-110b132c4455",
          "label": "备案标号",
          "value": "13",
          "parent": "48916b4d-5535-4c4e-8d48-c15f2abbc150",
          "type": 1,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 13,
          "remark": "",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "4bb6394a-d293-4408-955e-bb85de9d1593",
          "label": "客户编号",
          "value": "14",
          "parent": "48916b4d-5535-4c4e-8d48-c15f2abbc150",
          "type": 1,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 14,
          "remark": "",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "8a318722-cc52-4685-9f5d-e8381ae556c8",
          "label": "产品编号",
          "value": "15",
          "parent": "48916b4d-5535-4c4e-8d48-c15f2abbc150",
          "type": 1,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 15,
          "remark": "",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        }
      ],
      "category_status_stage_option": [
        {
          "id": "7b4dc252-dbd5-4761-a9ef-9908cd655ad6",
          "label": "项目",
          "value": "projects",
          "parent": "5c2118da-be25-4aae-94b3-44d1b741e121",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "e7e717c4-3de0-4f1a-bb38-1d51af4b3b54",
          "label": "样品",
          "value": "samples",
          "parent": "5c2118da-be25-4aae-94b3-44d1b741e121",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "a198f11c-c7fb-4683-a298-fa5263343a89",
          "label": "原料",
          "value": "material_information",
          "parent": "5c2118da-be25-4aae-94b3-44d1b741e121",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "dcd248e1-904e-4039-8357-761414ef23ed",
          "label": "配方",
          "value": "elegance_lab_formula_version",
          "parent": "5c2118da-be25-4aae-94b3-44d1b741e121",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "37321c23-887c-4308-a8ff-4bf7ec312797",
          "label": "设备",
          "value": "cees_device",
          "parent": "5c2118da-be25-4aae-94b3-44d1b741e121",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "735ecadf-befd-44bb-842c-3efc3eb499b9",
          "label": "订单",
          "value": "order",
          "parent": "5c2118da-be25-4aae-94b3-44d1b741e121",
          "type": 1,
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
            "efficacy_eval"
          ]
        },
        {
          "id": "e5488830-8b2e-4a3d-aabf-0bda6ecb2433",
          "label": "合同",
          "value": "contract",
          "parent": "5c2118da-be25-4aae-94b3-44d1b741e121",
          "type": 1,
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
            "efficacy_eval"
          ]
        },
        {
          "id": "a89ca2c9-a072-4a74-89e4-f3c098a6bf26",
          "label": "产品",
          "value": "elegancelab_product",
          "parent": "5c2118da-be25-4aae-94b3-44d1b741e121",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 8,
          "remark": "",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "26121242-a817-4970-a1e5-2c14a6e30d31",
          "label": "评测",
          "value": "evaluator",
          "parent": "5c2118da-be25-4aae-94b3-44d1b741e121",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 10,
          "remark": "",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "242c0112-e0ef-4c70-9ad7-834c202fdbfe",
          "label": "产品迭代",
          "value": "product_demand_iternation",
          "parent": "5c2118da-be25-4aae-94b3-44d1b741e121",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 11,
          "remark": "",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "442a45e8-0a57-4669-84e0-da4d92e7c466",
          "label": "产品需求",
          "value": "product_demand",
          "parent": "5c2118da-be25-4aae-94b3-44d1b741e121",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 11,
          "remark": "",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "46753288-6687-4e4f-aa17-b5c939788078",
          "label": "项目需求",
          "value": "project_requirement",
          "parent": "5c2118da-be25-4aae-94b3-44d1b741e121",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 13,
          "remark": "",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "ed2882f3-03e5-4fad-a8ec-f375d2396f77",
          "label": "打样状态",
          "value": "sample_making_application",
          "parent": "5c2118da-be25-4aae-94b3-44d1b741e121",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 13,
          "remark": "",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        }
      ],
      "generate_rule": [
        {
          "id": "56290873-1a9c-4cc3-88ca-fc38c8c35919",
          "label": "日期+类型+序号",
          "value": "3",
          "parent": "60072a26-6350-4163-825f-c1eb981eb8de",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "8ea5165f-0314-4b33-a2ea-b82fc8d88243",
          "label": "序号",
          "value": "2",
          "parent": "60072a26-6350-4163-825f-c1eb981eb8de",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "ab0ca386-e951-4668-9346-665e71c0811a",
          "label": "时间+序号",
          "value": "1",
          "parent": "60072a26-6350-4163-825f-c1eb981eb8de",
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
            "efficacy_eval"
          ]
        }
      ],
      "ware_hourse_type": [
        {
          "id": "02477a26-ebef-4348-bd44-f51b3cfc8d77",
          "label": "采购入库",
          "value": "1",
          "parent": "6038922c-8b52-4478-b0d2-99f2dcc40e2a",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "87b83e4b-a426-49f5-85e7-f221604fe734",
          "label": "退货入库",
          "value": "3",
          "parent": "6038922c-8b52-4478-b0d2-99f2dcc40e2a",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "af3e0a03-44e2-4caa-9634-5c0a6cc8fdaf",
          "label": "外协入库",
          "value": "2",
          "parent": "6038922c-8b52-4478-b0d2-99f2dcc40e2a",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "eec45912-df2d-4fd8-82d7-c76002f3e318",
          "label": "实时入库",
          "value": "4",
          "parent": "6038922c-8b52-4478-b0d2-99f2dcc40e2a",
          "type": 1,
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
            "efficacy_eval"
          ]
        }
      ],
      "ware_hourse_category": [
        {
          "id": "c6be3331-bd02-4491-8a9a-cff30bd69e6b",
          "label": "样品",
          "value": "1",
          "parent": "63c25a43-c0d6-4e8a-a761-de377fc5dc7e",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "f163f01f-ec6e-4d7f-ad4b-5a2ec37d1e82",
          "label": "原料",
          "value": "2",
          "parent": "63c25a43-c0d6-4e8a-a761-de377fc5dc7e",
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
            "efficacy_eval"
          ]
        }
      ],
      "affect_purpose": [
        {
          "id": "0932a317-1b51-47ad-8697-05e4b0fc7749",
          "label": "抗衰",
          "value": "抗衰",
          "parent": "65ab27f5-854d-46a8-b62e-f53fa449f1a8",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "0fa3c520-413a-42bc-a499-3a2afb152d23",
          "label": "助防腐",
          "value": "助防腐",
          "parent": "65ab27f5-854d-46a8-b62e-f53fa449f1a8",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "5c363d55-ada1-44d3-bcb9-63fd981d3479",
          "label": "修护",
          "value": "修护",
          "parent": "65ab27f5-854d-46a8-b62e-f53fa449f1a8",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "6475a907-71b3-4391-a9f7-612fac7a87da",
          "label": "抗菌",
          "value": "抗菌",
          "parent": "65ab27f5-854d-46a8-b62e-f53fa449f1a8",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "70ea0802-b745-4292-a7e6-a70ae24d19a0",
          "label": "防脱发剂",
          "value": "防脱发剂",
          "parent": "65ab27f5-854d-46a8-b62e-f53fa449f1a8",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "75262af1-7c54-450a-a1a7-f8d7f7ec8609",
          "label": "抑菌剂",
          "value": "抑菌剂",
          "parent": "65ab27f5-854d-46a8-b62e-f53fa449f1a8",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "81cade2c-333e-4e11-bc1a-a8ba42bca2a2",
          "label": "抗冻剂",
          "value": "抗冻剂",
          "parent": "65ab27f5-854d-46a8-b62e-f53fa449f1a8",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "98ac9a93-aefb-4e78-a192-842f71470b75",
          "label": "表面活性剂",
          "value": "表面活性剂",
          "parent": "65ab27f5-854d-46a8-b62e-f53fa449f1a8",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "9adeb783-a61d-43d8-9f76-b700179cb290",
          "label": "活性物助剂",
          "value": "活性物助剂",
          "parent": "65ab27f5-854d-46a8-b62e-f53fa449f1a8",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "a512f5c1-ab61-40f1-b76f-9cd66adc55d4",
          "label": "清洁剂",
          "value": "清洁剂",
          "parent": "65ab27f5-854d-46a8-b62e-f53fa449f1a8",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 1,
          "remark": "清洁剂",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "aa39c9ad-cf78-4592-85ff-08e0f3eefd79",
          "label": "舒缓",
          "value": "舒缓",
          "parent": "65ab27f5-854d-46a8-b62e-f53fa449f1a8",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "abe990de-1749-4ecb-959c-d4996504ca61",
          "label": "抗炎剂",
          "value": "抗炎剂",
          "parent": "65ab27f5-854d-46a8-b62e-f53fa449f1a8",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "ce0e91e5-022b-4c53-b4a0-32a071a7be5d",
          "label": "修复",
          "value": "修复",
          "parent": "65ab27f5-854d-46a8-b62e-f53fa449f1a8",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "d0a27d1c-156a-49ef-b3f6-e9de9ba25920",
          "label": "抗衰老",
          "value": "抗衰老",
          "parent": "65ab27f5-854d-46a8-b62e-f53fa449f1a8",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "d9ebdf86-5405-4679-b817-58e9e549ed92",
          "label": "抗过敏",
          "value": "抗过敏",
          "parent": "65ab27f5-854d-46a8-b62e-f53fa449f1a8",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "e26fc1fa-5cdc-48a2-b23b-5770d9d2a854",
          "label": "抑菌",
          "value": "抑菌",
          "parent": "65ab27f5-854d-46a8-b62e-f53fa449f1a8",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "e2e53ce4-3dcc-439f-853c-4dc254b19a8f",
          "label": "祛皱剂",
          "value": "祛皱剂",
          "parent": "65ab27f5-854d-46a8-b62e-f53fa449f1a8",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "e480c11f-4674-4f7f-9a51-1dad94077c6a",
          "label": "促渗剂",
          "value": "促渗剂",
          "parent": "65ab27f5-854d-46a8-b62e-f53fa449f1a8",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "ebc73362-22c6-488a-a7c9-02aa4240b960",
          "label": "祛痘",
          "value": "祛痘",
          "parent": "65ab27f5-854d-46a8-b62e-f53fa449f1a8",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "c18ed57a-f29d-4339-81f2-c382b6ecb201",
          "label": "定型剂",
          "value": "定型剂",
          "parent": "65ab27f5-854d-46a8-b62e-f53fa449f1a8",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 2,
          "remark": "定型剂",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "8f446e1f-c9ab-4a07-96b2-46132b812e38",
          "label": "祛斑剂",
          "value": "祛斑剂",
          "parent": "65ab27f5-854d-46a8-b62e-f53fa449f1a8",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 3,
          "remark": "祛斑剂",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "0724448d-538f-4e03-9439-e606c88c2a54",
          "label": "溶剂",
          "value": "溶剂",
          "parent": "65ab27f5-854d-46a8-b62e-f53fa449f1a8",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 4,
          "remark": "溶剂",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "88aef8ad-a5f5-4089-bc5e-df173516546e",
          "label": "防腐剂",
          "value": "防腐剂",
          "parent": "65ab27f5-854d-46a8-b62e-f53fa449f1a8",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 5,
          "remark": "防腐剂",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "e827e82e-36e8-47ac-acf9-6c1c93b678ff",
          "label": "粘度控制剂",
          "value": "粘度控制剂",
          "parent": "65ab27f5-854d-46a8-b62e-f53fa449f1a8",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 6,
          "remark": "粘度控剂",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "b3f32598-d218-4dcc-911a-189db3a73ddd",
          "label": "缓冲剂",
          "value": "缓冲剂",
          "parent": "65ab27f5-854d-46a8-b62e-f53fa449f1a8",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 7,
          "remark": "缓冲剂",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "e1639fc1-d7c9-4bbc-bdf5-5b29de226463",
          "label": "脱毛剂",
          "value": "脱毛剂",
          "parent": "65ab27f5-854d-46a8-b62e-f53fa449f1a8",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 8,
          "remark": "脱毛剂",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "0b22b27d-3702-4cdd-92f2-2022625979a8",
          "label": "抗皱剂",
          "value": "抗皱剂",
          "parent": "65ab27f5-854d-46a8-b62e-f53fa449f1a8",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 9,
          "remark": "抗皱剂",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "5b1e49b3-00cc-42e2-b79b-5908366dba40",
          "label": "成膜剂",
          "value": "成膜剂",
          "parent": "65ab27f5-854d-46a8-b62e-f53fa449f1a8",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 10,
          "remark": "成膜剂",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "da54a4b3-19d7-4777-b989-3628a133b68e",
          "label": "推进剂",
          "value": "推进剂",
          "parent": "65ab27f5-854d-46a8-b62e-f53fa449f1a8",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 11,
          "remark": "推进剂",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "958a2437-5426-4fb1-99fb-19d12741b200",
          "label": "烫发剂",
          "value": "烫发剂",
          "parent": "65ab27f5-854d-46a8-b62e-f53fa449f1a8",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 12,
          "remark": "烫发剂",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "20c83061-084e-4b26-b2ef-5084a67059a2",
          "label": "稳泡剂",
          "value": "稳泡剂",
          "parent": "65ab27f5-854d-46a8-b62e-f53fa449f1a8",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 13,
          "remark": "稳泡剂",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "a26fd233-c4e7-4e4c-8ee2-6322e2fc1eb5",
          "label": "抑汗剂",
          "value": "抑汗剂",
          "parent": "65ab27f5-854d-46a8-b62e-f53fa449f1a8",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 14,
          "remark": "抑汗剂",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "9ffe9405-3022-47cd-a4f0-16c8e95d22cb",
          "label": "乳浊剂",
          "value": "乳浊剂",
          "parent": "65ab27f5-854d-46a8-b62e-f53fa449f1a8",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 15,
          "remark": "乳浊剂",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "305ea66e-2e4a-4bbc-8963-0e21aa2089a1",
          "label": "增溶剂",
          "value": "增溶剂",
          "parent": "65ab27f5-854d-46a8-b62e-f53fa449f1a8",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 16,
          "remark": "增溶剂",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "3eaeadd4-0b5a-4490-b58b-2257a17ac579",
          "label": "变性剂",
          "value": "变性剂",
          "parent": "65ab27f5-854d-46a8-b62e-f53fa449f1a8",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 17,
          "remark": "变性剂",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "f390d680-d578-45f9-99f7-569412ae0242",
          "label": "乳化稳定剂",
          "value": "乳化稳定剂",
          "parent": "65ab27f5-854d-46a8-b62e-f53fa449f1a8",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 18,
          "remark": "乳化稳剂",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "5b22a669-d64d-47b6-99b9-a6fa4447ca40",
          "label": "吸收剂",
          "value": "吸收剂",
          "parent": "65ab27f5-854d-46a8-b62e-f53fa449f1a8",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 20,
          "remark": "吸收剂",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "e33dd3c4-2a6f-4d27-bbb6-9baba6ff69b4",
          "label": "睫毛调剂",
          "value": "睫毛调剂",
          "parent": "65ab27f5-854d-46a8-b62e-f53fa449f1a8",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 21,
          "remark": "睫毛调剂",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "d8d83fc4-ae78-4d95-bcba-6c326a0cb0f4",
          "label": "消泡剂",
          "value": "消泡剂",
          "parent": "65ab27f5-854d-46a8-b62e-f53fa449f1a8",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 22,
          "remark": "消泡剂",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "8649039d-13f6-4e72-9318-30dc5aaf275e",
          "label": "螯合剂",
          "value": "螯合剂",
          "parent": "65ab27f5-854d-46a8-b62e-f53fa449f1a8",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 23,
          "remark": "螯合剂",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "1cc7ed05-d6be-4e01-a0ed-c8af371dd560",
          "label": "还原剂",
          "value": "还原剂",
          "parent": "65ab27f5-854d-46a8-b62e-f53fa449f1a8",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 24,
          "remark": "还原剂",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "d66715d3-f957-4e3d-8dda-d027600091d6",
          "label": "珠光剂",
          "value": "珠光剂",
          "parent": "65ab27f5-854d-46a8-b62e-f53fa449f1a8",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 25,
          "remark": "珠光剂",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "87e9bbe3-23c9-4451-b9b0-2d138e5d8763",
          "label": "助滑剂",
          "value": "助滑剂",
          "parent": "65ab27f5-854d-46a8-b62e-f53fa449f1a8",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 26,
          "remark": "助滑剂",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "baa67811-9bb3-426d-bd43-435c6db083a2",
          "label": "着色剂",
          "value": "着色剂",
          "parent": "65ab27f5-854d-46a8-b62e-f53fa449f1a8",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 27,
          "remark": "着色剂",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "09640793-9c84-404a-a3ae-1bb9d0dc889c",
          "label": "美黑剂",
          "value": "美黑剂",
          "parent": "65ab27f5-854d-46a8-b62e-f53fa449f1a8",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 28,
          "remark": "美黑剂",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "78a4736a-ca90-4b93-a636-9fddd9f7f171",
          "label": "表面改剂",
          "value": "表面改剂",
          "parent": "65ab27f5-854d-46a8-b62e-f53fa449f1a8",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 29,
          "remark": "表面改剂",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "14925891-8038-4727-82ff-beca882decce",
          "label": "指甲调理剂",
          "value": "指甲调理剂",
          "parent": "65ab27f5-854d-46a8-b62e-f53fa449f1a8",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 30,
          "remark": "指甲调剂",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "fd89b87a-08d9-4fd5-81e6-4568a2a1bb05",
          "label": "发用定型剂",
          "value": "发用定型剂",
          "parent": "65ab27f5-854d-46a8-b62e-f53fa449f1a8",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 31,
          "remark": "发用定剂",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "9234ae1c-f956-4351-8bc4-42f9e210730d",
          "label": "抗结块剂",
          "value": "抗结块剂",
          "parent": "65ab27f5-854d-46a8-b62e-f53fa449f1a8",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 32,
          "remark": "抗结块",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "8f15a93e-c52a-406c-ad4d-6aca17110ac5",
          "label": "巴斯消",
          "value": "巴斯消",
          "parent": "65ab27f5-854d-46a8-b62e-f53fa449f1a8",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 33,
          "remark": "巴斯消",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "4ea45cad-181a-4f1f-9703-7fff39df5d0e",
          "label": "悬浮剂",
          "value": "悬浮剂",
          "parent": "65ab27f5-854d-46a8-b62e-f53fa449f1a8",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 34,
          "remark": "悬浮剂",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "3466c4e2-92bb-48e3-82f4-915278c305e8",
          "label": "磨砂剂",
          "value": "磨砂剂",
          "parent": "65ab27f5-854d-46a8-b62e-f53fa449f1a8",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 35,
          "remark": "磨砂剂",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "66dc1a3c-8704-46ad-a19b-1d1af0d47d96",
          "label": "pH调节剂",
          "value": "pH调节剂",
          "parent": "65ab27f5-854d-46a8-b62e-f53fa449f1a8",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 36,
          "remark": "pH调剂",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "3d4afe9c-42e3-41be-aa60-4cfe8e40126f",
          "label": "起泡剂",
          "value": "起泡剂",
          "parent": "65ab27f5-854d-46a8-b62e-f53fa449f1a8",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 37,
          "remark": "起泡剂",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "29898983-6d7d-409b-a8c7-1fba6dff04d0",
          "label": "保湿剂",
          "value": "保湿剂",
          "parent": "65ab27f5-854d-46a8-b62e-f53fa449f1a8",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 38,
          "remark": "保湿剂",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "5814c5eb-3f10-4c80-8887-8004c51707d9",
          "label": "抗静电剂",
          "value": "抗静电剂",
          "parent": "65ab27f5-854d-46a8-b62e-f53fa449f1a8",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 39,
          "remark": "抗静电",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "eecb8706-161b-4947-8240-d63ea0169f72",
          "label": "填充剂",
          "value": "填充剂",
          "parent": "65ab27f5-854d-46a8-b62e-f53fa449f1a8",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 40,
          "remark": "填充剂",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "7156595c-fce3-417e-bfbd-eca0826c8b0c",
          "label": "吸附剂",
          "value": "吸附剂",
          "parent": "65ab27f5-854d-46a8-b62e-f53fa449f1a8",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 41,
          "remark": "吸附剂",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "44169059-cb45-4219-8232-b123c693f95e",
          "label": "控油剂",
          "value": "控油剂",
          "parent": "65ab27f5-854d-46a8-b62e-f53fa449f1a8",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 42,
          "remark": "控油剂",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "e4556a2b-ea59-4a38-a909-5f87daaecb27",
          "label": "粘度调节剂",
          "value": "粘度调节剂",
          "parent": "65ab27f5-854d-46a8-b62e-f53fa449f1a8",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 43,
          "remark": "粘度调剂",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "fc7e7aa0-a9ef-4931-bd2e-767c6dbb1da3",
          "label": "角质剥落剂",
          "value": "角质剥落剂",
          "parent": "65ab27f5-854d-46a8-b62e-f53fa449f1a8",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 44,
          "remark": "角质剥剂",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "89406820-5628-433d-81b1-e648076ff3f7",
          "label": "皮肤调理剂",
          "value": "皮肤调理剂",
          "parent": "65ab27f5-854d-46a8-b62e-f53fa449f1a8",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 45,
          "remark": "皮肤调剂",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "9b1ec080-5242-44e4-a83c-23c5931f0c13",
          "label": "乳化剂",
          "value": "乳化剂",
          "parent": "65ab27f5-854d-46a8-b62e-f53fa449f1a8",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 46,
          "remark": "乳化剂",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "56554cb4-5e8d-4f27-b671-7c96923ef690",
          "label": "润肤剂",
          "value": "润肤剂",
          "parent": "65ab27f5-854d-46a8-b62e-f53fa449f1a8",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 47,
          "remark": "润肤剂",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "d08b2d1a-991b-4f62-ac99-49725fbb6c13",
          "label": "收敛剂",
          "value": "收敛剂",
          "parent": "65ab27f5-854d-46a8-b62e-f53fa449f1a8",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 48,
          "remark": "收敛剂",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "5ef43348-7210-46f6-ba20-e5684a2eddd1",
          "label": "美白剂",
          "value": "美白剂",
          "parent": "65ab27f5-854d-46a8-b62e-f53fa449f1a8",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 49,
          "remark": "美白剂",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "11902524-7292-4d7f-b363-ebf000dd4f5a",
          "label": "增稠剂",
          "value": "增稠剂",
          "parent": "65ab27f5-854d-46a8-b62e-f53fa449f1a8",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 50,
          "remark": "增稠剂",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "fe5574b2-ba5f-4d17-9d5d-0aaeeca81e97",
          "label": "柔顺剂",
          "value": "柔顺剂",
          "parent": "65ab27f5-854d-46a8-b62e-f53fa449f1a8",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 51,
          "remark": "柔顺剂",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "55640b3d-71ac-4020-9398-65d1e09230fa",
          "label": "去屑剂",
          "value": "去屑剂",
          "parent": "65ab27f5-854d-46a8-b62e-f53fa449f1a8",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 52,
          "remark": "去屑剂",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "c78cea48-7b03-4b1c-9d44-2be30bdbd8be",
          "label": "防晒剂",
          "value": "防晒剂",
          "parent": "65ab27f5-854d-46a8-b62e-f53fa449f1a8",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 53,
          "remark": "防晒剂",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "ea789a4d-20ec-4cc4-a0d1-74ec2c626e79",
          "label": "裂解剂",
          "value": "裂解剂",
          "parent": "65ab27f5-854d-46a8-b62e-f53fa449f1a8",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 54,
          "remark": "裂解剂",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "c6dbe5ae-c0ed-42ca-a80d-843c55f2b4c9",
          "label": "封闭剂",
          "value": "封闭剂",
          "parent": "65ab27f5-854d-46a8-b62e-f53fa449f1a8",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 55,
          "remark": "封闭剂",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "4e12cdb5-0246-4af9-a70d-f331de264842",
          "label": "柔润剂",
          "value": "柔润剂",
          "parent": "65ab27f5-854d-46a8-b62e-f53fa449f1a8",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 56,
          "remark": "柔润剂",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "c1c354dd-fe0a-4740-bc9b-1dc83c12434b",
          "label": "防脱发",
          "value": "防脱发",
          "parent": "65ab27f5-854d-46a8-b62e-f53fa449f1a8",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 57,
          "remark": "防脱发",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "c961d4ab-d4d0-4594-a3bb-0916a30734f2",
          "label": "增塑剂",
          "value": "增塑剂",
          "parent": "65ab27f5-854d-46a8-b62e-f53fa449f1a8",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 58,
          "remark": "增塑剂",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "1df813e6-ae69-48cd-a82d-804fc836baa7",
          "label": "清凉剂",
          "value": "清凉剂",
          "parent": "65ab27f5-854d-46a8-b62e-f53fa449f1a8",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 59,
          "remark": "清凉剂",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "fca3714b-36ff-4c70-a436-37c941fa2692",
          "label": "拔毛剂",
          "value": "拔毛剂",
          "parent": "65ab27f5-854d-46a8-b62e-f53fa449f1a8",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 60,
          "remark": "拔毛剂",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "4ba45c81-7f63-4e35-96e5-abb92d66041c",
          "label": "肤感调节剂",
          "value": "肤感调节剂",
          "parent": "65ab27f5-854d-46a8-b62e-f53fa449f1a8",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 61,
          "remark": "肤感调剂",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "4e8e0153-67e6-4d43-987b-60cfade846a8",
          "label": "角质软化剂",
          "value": "角质软化剂",
          "parent": "65ab27f5-854d-46a8-b62e-f53fa449f1a8",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 62,
          "remark": "角质软剂",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "2d2b4dfa-0948-40c9-94ac-191aa82be62b",
          "label": "稳定剂",
          "value": "稳定剂",
          "parent": "65ab27f5-854d-46a8-b62e-f53fa449f1a8",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 63,
          "remark": "稳定剂",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "4be0a9e1-d20b-40ee-8376-a84e252b8b71",
          "label": "氧化剂",
          "value": "氧化剂",
          "parent": "65ab27f5-854d-46a8-b62e-f53fa449f1a8",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 64,
          "remark": "氧化剂",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "b9a67a39-8454-4f9f-8b70-24888c6acbe6",
          "label": "粘合剂",
          "value": "粘合剂",
          "parent": "65ab27f5-854d-46a8-b62e-f53fa449f1a8",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 65,
          "remark": "粘合剂",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "487a9043-d37b-4a5f-96fe-4af93853cd7b",
          "label": "溶助剂",
          "value": "溶助剂",
          "parent": "65ab27f5-854d-46a8-b62e-f53fa449f1a8",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 66,
          "remark": "溶助剂",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "5c499830-c67f-4082-af6d-e12e012c5e3d",
          "label": "发用调理剂",
          "value": "发用调理剂",
          "parent": "65ab27f5-854d-46a8-b62e-f53fa449f1a8",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 67,
          "remark": "发用调剂",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "924ccc4d-e371-4604-85c6-400c7268f03f",
          "label": "抗氧化剂",
          "value": "抗氧化剂",
          "parent": "65ab27f5-854d-46a8-b62e-f53fa449f1a8",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 68,
          "remark": "抗氧化",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "edcba802-cd7b-4bd4-8b95-3f3c31bd767c",
          "label": "遮光剂",
          "value": "遮光剂",
          "parent": "65ab27f5-854d-46a8-b62e-f53fa449f1a8",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 69,
          "remark": "遮光剂",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "d4b36e13-7b3b-415f-9f2b-0249ba8319ef",
          "label": "禁用",
          "value": "禁用",
          "parent": "65ab27f5-854d-46a8-b62e-f53fa449f1a8",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 70,
          "remark": "禁用",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "f1825c17-aa7f-4c01-b6df-116c83cd5f8b",
          "label": "分散剂",
          "value": "分散剂",
          "parent": "65ab27f5-854d-46a8-b62e-f53fa449f1a8",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 71,
          "remark": "分散剂",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "f33502db-bf10-45a8-8b36-d63c9a1759be",
          "label": "头发调理剂",
          "value": "头发调理剂",
          "parent": "65ab27f5-854d-46a8-b62e-f53fa449f1a8",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 72,
          "remark": "头发调剂",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "42010a49-8f55-4760-9a28-1bcf362d089f",
          "label": "杀毒液",
          "value": "杀毒液",
          "parent": "65ab27f5-854d-46a8-b62e-f53fa449f1a8",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 73,
          "remark": "杀毒液",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "2536dc68-b39b-4a26-9e07-605165bb270f",
          "label": "染发剂",
          "value": "染发剂",
          "parent": "65ab27f5-854d-46a8-b62e-f53fa449f1a8",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 74,
          "remark": "染发剂",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "298d4aa8-1694-49b7-b31b-953a1be6e7d1",
          "label": "光稳定剂",
          "value": "光稳定剂",
          "parent": "65ab27f5-854d-46a8-b62e-f53fa449f1a8",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 75,
          "remark": "光稳定",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "2bcd2e8c-3739-4ee6-aeb4-8f456e11b9b5",
          "label": "赋脂剂",
          "value": "赋脂剂",
          "parent": "65ab27f5-854d-46a8-b62e-f53fa449f1a8",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 76,
          "remark": "赋脂剂",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "aba3897a-20cc-45b1-bc0f-ebee8ea70e25",
          "label": "皮肤保护剂",
          "value": "皮肤保护剂",
          "parent": "65ab27f5-854d-46a8-b62e-f53fa449f1a8",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 77,
          "remark": "皮肤保剂",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "54c97843-ae89-4511-a3d9-3ad8ca8fc896",
          "label": "遮盖剂",
          "value": "遮盖剂",
          "parent": "65ab27f5-854d-46a8-b62e-f53fa449f1a8",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 78,
          "remark": "遮盖剂",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "801bc804-b9e0-4184-97cc-df1e9cb045a2",
          "label": "芳香剂",
          "value": "芳香剂",
          "parent": "65ab27f5-854d-46a8-b62e-f53fa449f1a8",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 79,
          "remark": "芳香剂",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "d6c8fa4e-9a14-4a16-b122-1de871284adb",
          "label": "除臭剂",
          "value": "除臭剂",
          "parent": "65ab27f5-854d-46a8-b62e-f53fa449f1a8",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 80,
          "remark": "除臭剂",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "60a268ce-b832-4da1-ae2b-8ab9e2ede680",
          "label": "其它",
          "value": "其它",
          "parent": "65ab27f5-854d-46a8-b62e-f53fa449f1a8",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 81,
          "remark": "其它",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        }
      ],
      "evaluation_category": [
        {
          "id": "09389f38-a8e3-4361-8233-cb15ee370451",
          "label": "理化评价",
          "value": "7",
          "parent": "65cfeddc-aa5c-48af-9008-a90516a6b7d4",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "0b55b211-f7b6-409e-acca-ed7297153841",
          "label": "稳定性评价",
          "value": "3",
          "parent": "65cfeddc-aa5c-48af-9008-a90516a6b7d4",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "5db2e47b-5879-48b2-8193-80a2bf929e68",
          "label": "性能评价",
          "value": "6",
          "parent": "65cfeddc-aa5c-48af-9008-a90516a6b7d4",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "8a25aeb3-a63f-4c80-894c-46fec0cad030",
          "label": "功效评价",
          "value": "1",
          "parent": "65cfeddc-aa5c-48af-9008-a90516a6b7d4",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "91accc29-f26f-4eca-be62-1dd46014f321",
          "label": "感官评价",
          "value": "5",
          "parent": "65cfeddc-aa5c-48af-9008-a90516a6b7d4",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "ca21f959-603e-42d8-b143-e0956eabb17c",
          "label": "法规遵从性评价",
          "value": "4",
          "parent": "65cfeddc-aa5c-48af-9008-a90516a6b7d4",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "fa1129b2-78e6-4cc5-9252-5943ae6bf0d8",
          "label": "卫生指标评价",
          "value": "2",
          "parent": "65cfeddc-aa5c-48af-9008-a90516a6b7d4",
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
            "efficacy_eval"
          ]
        }
      ],
      "evaluator_type": [
        {
          "id": "91b9c2f1-9078-479f-9d9f-b2eaa88db6e3",
          "label": "样品",
          "value": "1",
          "parent": "6ebfcd70-3ada-4000-8a8b-cc11458f9ede",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "c4bde0d8-6531-4699-b610-7669e5096b39",
          "label": "配方",
          "value": "2",
          "parent": "6ebfcd70-3ada-4000-8a8b-cc11458f9ede",
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
            "efficacy_eval"
          ]
        }
      ],
      "use_part": [
        {
          "id": "2290505d-7388-464a-a9dd-a14aa1963c45",
          "label": "头发",
          "value": "头发",
          "parent": "745a9037-a76c-4a81-b32c-7038b579bada",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "2290505d-7388-464a-a9dd-a14aa1963c46",
          "label": "体毛",
          "value": "体毛",
          "parent": "745a9037-a76c-4a81-b32c-7038b579bada",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "2290505d-7388-464a-a9dd-a14aa1963c47",
          "label": "面部",
          "value": "面部",
          "parent": "745a9037-a76c-4a81-b32c-7038b579bada",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "2290505d-7388-464a-a9dd-a14aa1963c48",
          "label": "头部",
          "value": "头部",
          "parent": "745a9037-a76c-4a81-b32c-7038b579bada",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "2290505d-7388-464a-a9dd-a14aa1963c52",
          "label": "躯干部位",
          "value": "躯干部位",
          "parent": "745a9037-a76c-4a81-b32c-7038b579bada",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "2290505d-7388-464a-a9dd-a14aa1963c53",
          "label": "眼部",
          "value": "眼部",
          "parent": "745a9037-a76c-4a81-b32c-7038b579bada",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "2290505d-7388-464a-a9dd-a14aa1963c54",
          "label": "口唇",
          "value": "口唇",
          "parent": "745a9037-a76c-4a81-b32c-7038b579bada",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "2290505d-7388-464a-a9dd-a14aa1963c55",
          "label": "手足",
          "value": "手足",
          "parent": "745a9037-a76c-4a81-b32c-7038b579bada",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 8,
          "remark": "",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "2290505d-7388-464a-a9dd-a14aa1963c59",
          "label": "全身皮肤",
          "value": "全身皮肤",
          "parent": "745a9037-a76c-4a81-b32c-7038b579bada",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 9,
          "remark": "",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "2290505d-7388-464a-a9dd-a14aa1963c58",
          "label": "指（趾）甲",
          "value": "指（趾）甲",
          "parent": "745a9037-a76c-4a81-b32c-7038b579bada",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 10,
          "remark": "",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "981cf5d3-517d-4792-9df8-b398dccd617b",
          "label": "颈部",
          "value": "颈部",
          "parent": "745a9037-a76c-4a81-b32c-7038b579bada",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 11,
          "remark": null,
          "default": false,
          "app_category": null
        }
      ],
      "dictionary_data_type": [
        {
          "id": "198133cb-45c7-4c6e-8fd1-04e0b6a7431a",
          "label": "date",
          "value": "2",
          "parent": "76fd5cc6-93ab-4d7b-8052-b231468283c7",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "42a3e4ae-23a4-4592-b5ab-7547b6ec39f5",
          "label": "files",
          "value": "5",
          "parent": "76fd5cc6-93ab-4d7b-8052-b231468283c7",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "67358f8e-9e31-4441-8ced-d5305bd80dec",
          "label": "images",
          "value": "7",
          "parent": "76fd5cc6-93ab-4d7b-8052-b231468283c7",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "9625b1dd-d9d9-4799-9ada-a7f4569a5661",
          "label": "boolean",
          "value": "6",
          "parent": "76fd5cc6-93ab-4d7b-8052-b231468283c7",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "ad3245ae-0a89-4b89-87f1-c3871df3cba3",
          "label": "text",
          "value": "0",
          "parent": "76fd5cc6-93ab-4d7b-8052-b231468283c7",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "dc0de5f8-632e-4823-b708-cc60ffd23ae3",
          "label": "dateTime",
          "value": "3",
          "parent": "76fd5cc6-93ab-4d7b-8052-b231468283c7",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "e96706fd-aa79-40b6-87ff-afddbc830e54",
          "label": "number",
          "value": "1",
          "parent": "76fd5cc6-93ab-4d7b-8052-b231468283c7",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "ebd25a03-96c1-4696-aaac-c713ae8e417d",
          "label": "time",
          "value": "4",
          "parent": "76fd5cc6-93ab-4d7b-8052-b231468283c7",
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
            "efficacy_eval"
          ]
        }
      ],
      "project_term_type": [
        {
          "id": "877a15f9-0de0-476c-95a6-09a5435dde74",
          "label": "普通",
          "value": "default",
          "parent": "7749814f-61e8-486b-aef4-077d7af9897f",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "5738443f-817f-45e1-9945-b2b80ece580e",
          "label": "研发类型",
          "value": "research",
          "parent": "7749814f-61e8-486b-aef4-077d7af9897f",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "11e7a83e-b429-4429-997b-af5f61fc5ab1",
          "label": "测试",
          "value": "test",
          "parent": "7749814f-61e8-486b-aef4-077d7af9897f",
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
            "efficacy_eval"
          ]
        }
      ],
      "QMS": [
        {
          "id": "84b66a20-9205-4675-bbe8-5b0f507e24ed",
          "label": "逐批检验",
          "value": "逐批检验",
          "parent": "7a76919a-46b3-4514-99bd-e6c9ec6e7e05",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "8c5f8b63-2193-40da-b48f-197abb842edb",
          "label": "型式检验一年一检",
          "value": "型式检验一年一检",
          "parent": "7a76919a-46b3-4514-99bd-e6c9ec6e7e05",
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
            "efficacy_eval"
          ]
        }
      ],
      "product_exist_type": [
        {
          "id": "2afd3711-8322-4856-baf3-ea8931703f06",
          "label": "已有产品",
          "value": "1",
          "parent": "7ac96224-1965-4917-a1f0-c6c1b7bdf114",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "eed8b786-ed3b-4b7c-a36c-bde2f30cc0b2",
          "label": "新产品",
          "value": "2",
          "parent": "7ac96224-1965-4917-a1f0-c6c1b7bdf114",
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
            "efficacy_eval"
          ]
        }
      ],
      "sample_operation": [
        {
          "id": "011009ae-6795-473d-a52c-14dad63c3236",
          "label": "暂未操作",
          "value": "1",
          "parent": "7dda5757-32ee-4310-9d0d-3f658e5807e6",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "5be9a0d6-5739-4b84-9a08-6591e02f1d3c",
          "label": "出库",
          "value": "3",
          "parent": "7dda5757-32ee-4310-9d0d-3f658e5807e6",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "5d750466-e57f-47cc-9656-17990c504f70",
          "label": "检测",
          "value": "4",
          "parent": "7dda5757-32ee-4310-9d0d-3f658e5807e6",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "79c8d3bc-4996-4833-901d-3d3c9467f1c9",
          "label": "入库",
          "value": "2",
          "parent": "7dda5757-32ee-4310-9d0d-3f658e5807e6",
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
            "efficacy_eval"
          ]
        }
      ],
      "safety_evaluation_type": [
        {
          "id": "0a269c39-bbf4-46d7-a24a-98a83f393f52",
          "label": "化妆品安评报告",
          "value": "化妆品安评报告",
          "parent": "806f223f-a68c-4e12-aeb0-56efbf50e7ac",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "cc902c9d-1730-485d-88dc-653533c49e59",
          "label": "已使用原料安评报告",
          "value": "已使用原料安评报告",
          "parent": "806f223f-a68c-4e12-aeb0-56efbf50e7ac",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "9adc53e1-6099-4bd8-9685-c2492f75fb7b",
          "label": "新原料安评报告",
          "value": "新原料安评报告",
          "parent": "806f223f-a68c-4e12-aeb0-56efbf50e7ac",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "4a1372d2-61b7-4d69-8ab0-07c0212819bc",
          "label": "配方初步安评报告",
          "value": "配方初步安评报告",
          "parent": "806f223f-a68c-4e12-aeb0-56efbf50e7ac",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "a64690cf-9301-4a90-8464-0fcba68838a9",
          "label": "新原料安全评价综述报告",
          "value": "新原料安全评价综述报告",
          "parent": "806f223f-a68c-4e12-aeb0-56efbf50e7ac",
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
            "efficacy_eval"
          ]
        }
      ],
      "use_users": [
        {
          "id": "f47dcb53-3bab-40be-a9fc-2b240172bfb5",
          "label": "成人",
          "value": "成人",
          "parent": "87515787-4f26-4444-b960-43ee77850387",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "06c9fb6d-a7f6-46f2-bd6b-6636497fed86",
          "label": "儿童",
          "value": "儿童",
          "parent": "87515787-4f26-4444-b960-43ee77850387",
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
            "efficacy_eval"
          ]
        }
      ],
      "priority": [
        {
          "id": "ef2d7884-a49c-4601-887f-229fbe71f661",
          "label": "紧急",
          "value": "1",
          "parent": "879333bd-126d-4a3b-91b8-3eac0fcac649",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "4c06487a-da2f-445e-853f-3be352fba72c",
          "label": "高",
          "value": "2",
          "parent": "879333bd-126d-4a3b-91b8-3eac0fcac649",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "cced037f-a070-4e56-875f-285d5ca0fa8a",
          "label": "中",
          "value": "3",
          "parent": "879333bd-126d-4a3b-91b8-3eac0fcac649",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "ebc87233-6ebf-4787-8059-85be1c984645",
          "label": "低",
          "value": "4",
          "parent": "879333bd-126d-4a3b-91b8-3eac0fcac649",
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
            "efficacy_eval"
          ]
        }
      ],
      "level": [
        {
          "id": "24a16307-968a-48b9-b0be-efc73991d41c",
          "label": "大客户",
          "value": "2",
          "parent": "889d1c0c-7393-47d1-8aa8-119e602825fb",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "9c4dbf89-c68c-45c1-8224-8c14ddf0b1ca",
          "label": "普通客户",
          "value": "1",
          "parent": "889d1c0c-7393-47d1-8aa8-119e602825fb",
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
            "efficacy_eval"
          ]
        }
      ],
      "inspection_results_type": [
        {
          "id": "4cac1e0b-f7c7-41b8-a131-f986304a55c3",
          "label": "自检",
          "value": "self_check",
          "parent": "8beb3241-f4ae-4412-aef4-4ed58cf4d548",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "e18c6b1e-755f-4950-b745-f12f9c1e8798",
          "label": "第三方",
          "value": "other_check",
          "parent": "8beb3241-f4ae-4412-aef4-4ed58cf4d548",
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
            "efficacy_eval"
          ]
        }
      ],
      "sample_testType": [
        {
          "id": "0f05d2cb-d165-4f51-aba4-5306dfaf2420",
          "label": "小试",
          "value": "1",
          "parent": "9439a301-2b85-4da9-9f60-7ab978152ed1",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "a1210b37-83d9-4bb5-b800-ebc01f20cf2e",
          "label": "中试",
          "value": "2",
          "parent": "9439a301-2b85-4da9-9f60-7ab978152ed1",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "1d61bf35-1295-4b3a-9bd3-55d3f796eb14",
          "label": "实验试",
          "value": "5",
          "parent": "9439a301-2b85-4da9-9f60-7ab978152ed1",
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
            "efficacy_eval"
          ]
        }
      ],
      "sample_type": [
        {
          "id": "34f6e4d5-25a0-40bf-bc0b-93fe9016bd65",
          "label": "固体",
          "value": "ada9213d-e842-4163-805c-acdeb45ec17a",
          "parent": "972ab0d7-c615-41d9-92f2-31250836e08c",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "a49a149d-fc35-488e-8ad6-0e3ff55f6716",
          "label": "有毒",
          "value": "af55f74e-ae72-4124-94da-79e5dd6b188b",
          "parent": "972ab0d7-c615-41d9-92f2-31250836e08c",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "d5d1c4b0-5d6e-43fe-ab85-d3de0dc069ca",
          "label": "液体",
          "value": "86d9fe98-b83a-46f4-979e-d2f594ea7334",
          "parent": "972ab0d7-c615-41d9-92f2-31250836e08c",
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
            "efficacy_eval"
          ]
        }
      ],
      "evaluationstandard_type": [
        {
          "id": "9629c7d3-f00e-4f7b-bf2f-0efbe468f7ad",
          "label": "行业标准",
          "value": "industry",
          "parent": "9eb9c617-bb33-4187-acef-9188159596bb",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "b5dbf0be-daa9-4248-ace1-7e0752cef852",
          "label": "自定义标准",
          "value": "custom",
          "parent": "9eb9c617-bb33-4187-acef-9188159596bb",
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
            "efficacy_eval"
          ]
        }
      ],
      "exposure_method": [
        {
          "id": "ecb23483-abc5-4494-a649-b3893d150caa",
          "label": "经皮吸收",
          "value": "经皮吸收",
          "parent": "a3fc189b-53bf-4f69-a4f2-f8e5e92736fb",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 1,
          "remark": null,
          "default": false,
          "app_category": null
        },
        {
          "id": "e24eeaf7-43e4-4834-a712-42f45c449b1a",
          "label": "黏膜吸收",
          "value": "黏膜吸收",
          "parent": "a3fc189b-53bf-4f69-a4f2-f8e5e92736fb",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 2,
          "remark": null,
          "default": false,
          "app_category": null
        }
      ],
      "whether_or_not": [
        {
          "id": "5b49874e-0d0e-4e2c-9d14-e49396ec20d3",
          "label": "否",
          "value": "0",
          "parent": "b3f51585-c16a-46ad-816e-69cab3c3e1c8",
          "type": 6,
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
            "efficacy_eval"
          ]
        },
        {
          "id": "78e5912a-e2c6-456e-bcc6-719f44aba682",
          "label": "是",
          "value": "1",
          "parent": "b3f51585-c16a-46ad-816e-69cab3c3e1c8",
          "type": 6,
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
            "efficacy_eval"
          ]
        }
      ],
      "packing_type": [
        {
          "id": "dd6ce383-4e69-40e8-ba6d-83eca26dd44e",
          "label": "克(g)",
          "value": "2",
          "parent": "b521b578-22a2-4e94-b8b2-65a32b9531ef",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "fa139f31-1c51-46c1-85bb-ef23f5e6fb6f",
          "label": "毫升(ml)",
          "value": "1",
          "parent": "b521b578-22a2-4e94-b8b2-65a32b9531ef",
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
            "efficacy_eval"
          ]
        }
      ],
      "safety_evaluation_template": [
        {
          "id": "544a7416-41c9-47d9-842e-e220cb45cd5a",
          "label": "水",
          "value": "水",
          "parent": "b66dea6d-43f3-4a0f-8d47-0b5abf63c394",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "59ee09b0-a68a-453b-bbfa-d34beb5019e8",
          "label": "准用防晒剂",
          "value": "准用防晒剂",
          "parent": "b66dea6d-43f3-4a0f-8d47-0b5abf63c394",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "a19ea8b3-efaa-42bc-b408-72d6fde556c8",
          "label": "准用染发剂",
          "value": "准用染发剂",
          "parent": "b66dea6d-43f3-4a0f-8d47-0b5abf63c394",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "c36ba6f7-bf06-4027-897f-fc0e2b1c3fd0",
          "label": "限用组分",
          "value": "限用组分",
          "parent": "b66dea6d-43f3-4a0f-8d47-0b5abf63c394",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "ed2c622f-2c70-46b3-84de-50f50f618c29",
          "label": "准用防腐剂",
          "value": "准用防腐剂",
          "parent": "b66dea6d-43f3-4a0f-8d47-0b5abf63c394",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "f864ea12-673a-4b2b-8eea-23bb6901ade4",
          "label": "芳香剂",
          "value": "芳香剂",
          "parent": "b66dea6d-43f3-4a0f-8d47-0b5abf63c394",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "f9c78a74-0e75-404d-862f-7617427803a5",
          "label": "着色剂",
          "value": "着色剂",
          "parent": "b66dea6d-43f3-4a0f-8d47-0b5abf63c394",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "880f878c-2c35-44de-85b8-b07adfdc4af1",
          "label": "已上市产品",
          "value": "已上市产品",
          "parent": "b66dea6d-43f3-4a0f-8d47-0b5abf63c394",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "8fccb120-1249-4e1b-8788-2076f6a010cd",
          "label": "CIR",
          "value": "CIR",
          "parent": "b66dea6d-43f3-4a0f-8d47-0b5abf63c394",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "ef69b2b9-356b-4c7c-90b9-f5c4ba54b922",
          "label": "未知",
          "value": "未知",
          "parent": "b66dea6d-43f3-4a0f-8d47-0b5abf63c394",
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
            "efficacy_eval"
          ]
        }
      ],
      "motify_modele": [
        {
          "id": "0075a99a-64b8-42cc-8727-1e1551e48152",
          "label": "系统",
          "value": "1",
          "parent": "bb268be1-0db9-42f0-b7a8-27ab3c422df1",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "2c855702-23af-4778-bb33-90bcdab7a6f5",
          "label": "其他",
          "value": "4",
          "parent": "bb268be1-0db9-42f0-b7a8-27ab3c422df1",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "8f21f801-23c4-4845-9d5f-335d936c4c99",
          "label": "任务",
          "value": "3",
          "parent": "bb268be1-0db9-42f0-b7a8-27ab3c422df1",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "e86f6fc8-19ff-41fa-962c-106e84688e92",
          "label": "项目",
          "value": "2",
          "parent": "bb268be1-0db9-42f0-b7a8-27ab3c422df1",
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
            "efficacy_eval"
          ]
        }
      ],
      "collect_stateOption": [
        {
          "id": "0d3014ae-56f1-4153-a231-5fd6eac7f70d",
          "label": "开封",
          "value": "2",
          "parent": "c357b922-db5c-4052-aa3a-940fe324faf7",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "51646f9e-195a-4e87-8afc-11e8c1e184dd",
          "label": "密封",
          "value": "1",
          "parent": "c357b922-db5c-4052-aa3a-940fe324faf7",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "69d07437-a388-4faa-9abb-9e0d29d23826",
          "label": "损坏",
          "value": "3",
          "parent": "c357b922-db5c-4052-aa3a-940fe324faf7",
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
            "efficacy_eval"
          ]
        }
      ],
      "oxidation_type": [
        {
          "id": "0ecac0ce-1f12-42f9-9b2c-4eae7550b11c",
          "label": "非氧化型",
          "value": "0",
          "parent": "c9100663-0bb6-45ed-b151-ccd5a735be54",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "ba58b909-d43a-402d-b054-c8edc8fddb16",
          "label": "氧化型",
          "value": "1",
          "parent": "c9100663-0bb6-45ed-b151-ccd5a735be54",
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
            "efficacy_eval"
          ]
        }
      ],
      "customer_status": [
        {
          "id": "214a7a3e-77a2-4b8c-b540-36622945e8f8",
          "label": "停用",
          "value": "false",
          "parent": "d11b6e90-a063-417e-847b-68cb30b670e8",
          "type": 6,
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
            "efficacy_eval"
          ]
        },
        {
          "id": "9711ce9e-0df5-4152-885f-7acc3b34f79a",
          "label": "启用",
          "value": "true",
          "parent": "d11b6e90-a063-417e-847b-68cb30b670e8",
          "type": 6,
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
            "efficacy_eval"
          ]
        }
      ],
      "product_testing_type": [
        {
          "id": "10cdd87a-0de9-456b-872b-50c4e10bfae2",
          "label": "稳定性测试",
          "value": "0",
          "parent": "d2b48c9c-1b60-4c71-99d0-95978cf0d783",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 0,
          "remark": "",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "a163a594-4703-49b8-930f-9445b51a253f",
          "label": "料体稳定性测试",
          "value": "1",
          "parent": "d2b48c9c-1b60-4c71-99d0-95978cf0d783",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "afd8e02b-2ef4-480b-99d7-9bb640430e90",
          "label": "包材兼容性测试",
          "value": "2",
          "parent": "d2b48c9c-1b60-4c71-99d0-95978cf0d783",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "2d501c76-e9c6-401f-a61e-f73cf7105551",
          "label": "防腐挑战性测试",
          "value": "3",
          "parent": "d2b48c9c-1b60-4c71-99d0-95978cf0d783",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "67c89b95-b8b8-4057-82f7-3d04878c4823",
          "label": "人体功效测试",
          "value": "4",
          "parent": "d2b48c9c-1b60-4c71-99d0-95978cf0d783",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "f57764b5-dd41-4733-a054-d94de26670a1",
          "label": "皮肤斑贴测试",
          "value": "5",
          "parent": "d2b48c9c-1b60-4c71-99d0-95978cf0d783",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "32a8a8c5-eebb-4ea8-98ff-28224084f14e",
          "label": "毒理性测试",
          "value": "6",
          "parent": "d2b48c9c-1b60-4c71-99d0-95978cf0d783",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "8cd13dc6-4731-4ca2-9283-8caabe642324",
          "label": "急性眼刺激测试",
          "value": "7",
          "parent": "d2b48c9c-1b60-4c71-99d0-95978cf0d783",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "fec14548-e0a2-4a40-a835-9b4f90e328fb",
          "label": "安全评估",
          "value": "8",
          "parent": "d2b48c9c-1b60-4c71-99d0-95978cf0d783",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 8,
          "remark": "",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        }
      ],
      "version_type_tab_options": [
        {
          "id": "00127353-6f23-4978-ac07-8db845eb8ac5",
          "label": "全部",
          "value": "all",
          "parent": "d473c62b-2d00-4db9-8b1a-e80925eece02",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "761d56f0-2d2e-4dcb-b52e-4b2d0c73c46c",
          "label": "主版本",
          "value": "master",
          "parent": "d473c62b-2d00-4db9-8b1a-e80925eece02",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "491f934f-eb33-4bef-8d22-6533734eec06",
          "label": "测试版本",
          "value": "test",
          "parent": "d473c62b-2d00-4db9-8b1a-e80925eece02",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "e76025ee-0d7b-4ae1-a899-864046af4051",
          "label": "开发版本",
          "value": "develop",
          "parent": "d473c62b-2d00-4db9-8b1a-e80925eece02",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "9991dd1f-7e35-4115-856f-4d887f9b9efc",
          "label": "修订版本",
          "value": "autosave",
          "parent": "d473c62b-2d00-4db9-8b1a-e80925eece02",
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
            "efficacy_eval"
          ]
        }
      ],
      "safety_evaluation_product_type": [
        {
          "id": "ffe81890-ec9e-4796-bc6b-8cd67d38c61f",
          "label": "沐浴露",
          "value": "沐浴露",
          "parent": "db551705-4d17-4eeb-b036-a941bc1ee937",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 1,
          "remark": null,
          "default": false,
          "app_category": null
        },
        {
          "id": "4e78ec5d-e28a-4214-9f8c-06ecc46de48b",
          "label": "香波",
          "value": "香波",
          "parent": "db551705-4d17-4eeb-b036-a941bc1ee937",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 2,
          "remark": null,
          "default": false,
          "app_category": null
        },
        {
          "id": "ac38379b-6b48-43b5-af21-08cc9894d316",
          "label": "护发素",
          "value": "护发素",
          "parent": "db551705-4d17-4eeb-b036-a941bc1ee937",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 3,
          "remark": null,
          "default": false,
          "app_category": null
        },
        {
          "id": "1998a6ca-bb8d-476c-841f-e39315a389f9",
          "label": "发用定型产品",
          "value": "发用定型产品",
          "parent": "db551705-4d17-4eeb-b036-a941bc1ee937",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 4,
          "remark": null,
          "default": false,
          "app_category": null
        },
        {
          "id": "74deb262-20cb-407c-ac17-25aa59c8ad5f",
          "label": "化妆水",
          "value": "化妆水",
          "parent": "db551705-4d17-4eeb-b036-a941bc1ee937",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 5,
          "remark": null,
          "default": false,
          "app_category": null
        },
        {
          "id": "8982595c-2b7b-4492-bf8c-c3496a1195cb",
          "label": "乳液",
          "value": "乳液",
          "parent": "db551705-4d17-4eeb-b036-a941bc1ee937",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 6,
          "remark": null,
          "default": false,
          "app_category": null
        },
        {
          "id": "cf196f68-5d80-4c90-9863-36795a654f62",
          "label": "精华液",
          "value": "精华液",
          "parent": "db551705-4d17-4eeb-b036-a941bc1ee937",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 7,
          "remark": null,
          "default": false,
          "app_category": []
        },
        {
          "id": "dddd16ba-b67c-4c6f-bc6e-ab33a49f775c",
          "label": "面霜",
          "value": "面霜",
          "parent": "db551705-4d17-4eeb-b036-a941bc1ee937",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 8,
          "remark": null,
          "default": false,
          "app_category": null
        },
        {
          "id": "41b80bfa-9dc4-41b7-ad7e-ffdaf6654503",
          "label": "身体乳",
          "value": "身体乳",
          "parent": "db551705-4d17-4eeb-b036-a941bc1ee937",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 9,
          "remark": null,
          "default": false,
          "app_category": null
        },
        {
          "id": "a23a5794-4734-4f18-852b-6a15b4d2f605",
          "label": "护手霜",
          "value": "护手霜",
          "parent": "db551705-4d17-4eeb-b036-a941bc1ee937",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 10,
          "remark": null,
          "default": false,
          "app_category": null
        },
        {
          "id": "8cc280ab-f876-43f6-be2f-d7cc1db2e674",
          "label": "面贴膜",
          "value": "面贴膜",
          "parent": "db551705-4d17-4eeb-b036-a941bc1ee937",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 11,
          "remark": null,
          "default": false,
          "app_category": null
        },
        {
          "id": "4c2303d9-a502-423b-ac86-37b3a3803d26",
          "label": "粉底液",
          "value": "粉底液",
          "parent": "db551705-4d17-4eeb-b036-a941bc1ee937",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 12,
          "remark": null,
          "default": false,
          "app_category": null
        },
        {
          "id": "8c7f0105-3b36-4fb7-b51a-2ae5880d214a",
          "label": "唇膏",
          "value": "唇膏",
          "parent": "db551705-4d17-4eeb-b036-a941bc1ee937",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 13,
          "remark": null,
          "default": false,
          "app_category": null
        },
        {
          "id": "7591e5e2-a0a0-4caa-b777-f1b592231d02",
          "label": "卸妆产品",
          "value": "卸妆产品",
          "parent": "db551705-4d17-4eeb-b036-a941bc1ee937",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 14,
          "remark": null,
          "default": false,
          "app_category": null
        },
        {
          "id": "568a2af3-23c7-4e39-918c-ea8aad2a7ab3",
          "label": "眉毛产品",
          "value": "眉毛产品",
          "parent": "db551705-4d17-4eeb-b036-a941bc1ee937",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 15,
          "remark": null,
          "default": false,
          "app_category": null
        },
        {
          "id": "13d6c474-acfb-4c8b-ade3-a8679e837fa8",
          "label": "眼影",
          "value": "眼影",
          "parent": "db551705-4d17-4eeb-b036-a941bc1ee937",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 16,
          "remark": null,
          "default": false,
          "app_category": null
        },
        {
          "id": "12af16c0-2327-4448-b8d8-14132b1c945b",
          "label": "睫毛膏",
          "value": "睫毛膏",
          "parent": "db551705-4d17-4eeb-b036-a941bc1ee937",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 17,
          "remark": null,
          "default": false,
          "app_category": null
        },
        {
          "id": "cab42889-14c5-41cf-bd00-d37734f97984",
          "label": "眼线",
          "value": "眼线",
          "parent": "db551705-4d17-4eeb-b036-a941bc1ee937",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 18,
          "remark": null,
          "default": false,
          "app_category": null
        },
        {
          "id": "e167a097-732a-4cef-befb-dd4103b970e9",
          "label": "扑面粉",
          "value": "扑面粉",
          "parent": "db551705-4d17-4eeb-b036-a941bc1ee937",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 19,
          "remark": null,
          "default": false,
          "app_category": null
        },
        {
          "id": "5495041f-f79d-4fc0-a7c2-9447481915d0",
          "label": "隔离霜",
          "value": "隔离霜",
          "parent": "db551705-4d17-4eeb-b036-a941bc1ee937",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 20,
          "remark": null,
          "default": false,
          "app_category": null
        },
        {
          "id": "65027e54-4b6b-4044-9063-732e1e380d1d",
          "label": "防晒产品",
          "value": "防晒产品",
          "parent": "db551705-4d17-4eeb-b036-a941bc1ee937",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 21,
          "remark": null,
          "default": false,
          "app_category": null
        },
        {
          "id": "4f00237a-2c5f-4b47-b982-5f300335e259",
          "label": "牙膏",
          "value": "牙膏",
          "parent": "db551705-4d17-4eeb-b036-a941bc1ee937",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 22,
          "remark": null,
          "default": false,
          "app_category": null
        },
        {
          "id": "9b70a30d-93f4-4feb-9663-f67f614194cd",
          "label": "漱口水",
          "value": "漱口水",
          "parent": "db551705-4d17-4eeb-b036-a941bc1ee937",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 23,
          "remark": null,
          "default": false,
          "app_category": null
        },
        {
          "id": "2ab390bd-3db2-421c-a430-27428c705486",
          "label": "非喷雾剂型除臭剂",
          "value": "非喷雾剂型除臭剂",
          "parent": "db551705-4d17-4eeb-b036-a941bc1ee937",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 24,
          "remark": null,
          "default": false,
          "app_category": null
        },
        {
          "id": "2f0bc8aa-1b28-46c3-ac8a-6286fd899167",
          "label": "喷雾剂型除臭剂",
          "value": "喷雾剂型除臭剂",
          "parent": "db551705-4d17-4eeb-b036-a941bc1ee937",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 25,
          "remark": null,
          "default": false,
          "app_category": null
        },
        {
          "id": "bc124376-ad67-4210-b54a-ff33a9cbecd1",
          "label": "气雾除臭剂（乙醇基）",
          "value": "气雾除臭剂（乙醇基）",
          "parent": "db551705-4d17-4eeb-b036-a941bc1ee937",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 26,
          "remark": null,
          "default": false,
          "app_category": null
        },
        {
          "id": "7dd823a2-fa88-4e12-98d5-44c1db6153ce",
          "label": "面部清洁产品",
          "value": "面部清洁产品",
          "parent": "db551705-4d17-4eeb-b036-a941bc1ee937",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 27,
          "remark": null,
          "default": false,
          "app_category": null
        },
        {
          "id": "b22eeda2-0cdf-4523-8178-a71ee50f1c49",
          "label": "身体清洁产品",
          "value": "身体清洁产品",
          "parent": "db551705-4d17-4eeb-b036-a941bc1ee937",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 28,
          "remark": null,
          "default": false,
          "app_category": null
        },
        {
          "id": "dca3a3ee-26b5-4550-9022-09bc0d3a8426",
          "label": "尿布区域产品",
          "value": "尿布区域产品",
          "parent": "db551705-4d17-4eeb-b036-a941bc1ee937",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 29,
          "remark": null,
          "default": false,
          "app_category": []
        }
      ],
      "button_status_bool": [
        {
          "id": "e415226d-dc4b-449d-8bc5-b21c2d95546c",
          "label": "启用",
          "value": "true",
          "parent": "de6443d8-59ff-4333-9f11-132bdea1f515",
          "type": 6,
          "color": "success",
          "is_value": true,
          "status": true,
          "sort": 1,
          "remark": null,
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "f73777fd-1128-4ac2-928a-6dba7171755e",
          "label": "禁用",
          "value": "false",
          "parent": "de6443d8-59ff-4333-9f11-132bdea1f515",
          "type": 6,
          "color": "danger",
          "is_value": true,
          "status": true,
          "sort": 2,
          "remark": null,
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        }
      ],
      "colorant_type": [
        {
          "id": "4af43e14-b6a6-4c97-9a22-111cc457eab4",
          "label": "除眼部化妆品之外的其他化妆品",
          "value": "除眼部化妆品之外的其他化妆品",
          "parent": "dee3e0d0-6675-40fc-8348-04a497e21086",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "71cea05a-6abf-413d-af54-c3ba0cc9aaf1",
          "label": "专用于不与粘膜接触的化妆品",
          "value": "专用于不与粘膜接触的化妆品",
          "parent": "dee3e0d0-6675-40fc-8348-04a497e21086",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "821e23a5-02b7-44c0-9f6e-a9e568ff8c90",
          "label": "各种化妆品",
          "value": "各种化妆品",
          "parent": "dee3e0d0-6675-40fc-8348-04a497e21086",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "f474e6ab-f7e6-4fce-9132-ff1b0c3f5ce0",
          "label": "专用于仅和皮肤暂时接触的化妆品",
          "value": "专用于仅和皮肤暂时接触的化妆品",
          "parent": "dee3e0d0-6675-40fc-8348-04a497e21086",
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
            "efficacy_eval"
          ]
        }
      ],
      "reportType": [
        {
          "id": "01cb1ee4-04ce-490d-a195-dadc68e6cf5d",
          "label": "生产配方表",
          "value": "1",
          "parent": "e0f7cb28-9528-4de5-b60e-a53c4822d2ca",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "072ba2cf-b452-494a-b073-72aa34331da5",
          "label": "实验配方记录表",
          "value": "3",
          "parent": "e0f7cb28-9528-4de5-b60e-a53c4822d2ca",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "07f506c7-e3d5-4cdb-bb29-e3eb8e8e4a4f",
          "label": "生产工艺单",
          "value": "2",
          "parent": "e0f7cb28-9528-4de5-b60e-a53c4822d2ca",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "2f03ac89-c671-4470-975f-ce3850c44b37",
          "label": "半成品内控标准",
          "value": "5",
          "parent": "e0f7cb28-9528-4de5-b60e-a53c4822d2ca",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "353e2da9-bbf9-418f-a791-5c8a4e29d76d",
          "label": "备案配方表",
          "value": "4",
          "parent": "e0f7cb28-9528-4de5-b60e-a53c4822d2ca",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "36ea1900-da0f-46bc-8633-e6269ee5a64e",
          "label": "产品测试记录表",
          "value": "7",
          "parent": "e0f7cb28-9528-4de5-b60e-a53c4822d2ca",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "4bb6ea72-a3c2-4a7c-b4bf-840adaa2e4c3",
          "label": "全成分背标信息",
          "value": "6",
          "parent": "e0f7cb28-9528-4de5-b60e-a53c4822d2ca",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "523f7e58-cbba-4223-a55e-5f423e8f22fb",
          "label": "市场推广配方表",
          "value": "11",
          "parent": "e0f7cb28-9528-4de5-b60e-a53c4822d2ca",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "a0f24898-e0d4-4641-90b0-55ee1bae31f2",
          "label": "配方成分分析表",
          "value": "9",
          "parent": "e0f7cb28-9528-4de5-b60e-a53c4822d2ca",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "c37ecdae-5060-46f4-bc6b-4b833c02d171",
          "label": "原料采购计划表",
          "value": "8",
          "parent": "e0f7cb28-9528-4de5-b60e-a53c4822d2ca",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "fb3bc89f-cec9-47d7-85ad-0dddbc7c5306",
          "label": "生产工艺单",
          "value": "10",
          "parent": "e0f7cb28-9528-4de5-b60e-a53c4822d2ca",
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
            "efficacy_eval"
          ]
        }
      ],
      "category_page_option": [
        {
          "id": "9a0717ba-6051-4cd3-affd-927cf3af21a6",
          "label": "产品分类",
          "value": "1",
          "parent": "e8139065-051f-42da-a36e-f0ade75c551f",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "817333d4-8803-45cb-8f6d-eb851469c8d8",
          "label": "原料作用或使用目的",
          "value": "2",
          "parent": "e8139065-051f-42da-a36e-f0ade75c551f",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "352f9224-4fb7-43fa-a9cc-7af00196c3ed",
          "label": "化妆品功效",
          "value": "3",
          "parent": "e8139065-051f-42da-a36e-f0ade75c551f",
          "type": 1,
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
            "efficacy_eval"
          ]
        },
        {
          "id": "124793e2-c862-4486-bfc3-13110cba3aee",
          "label": "样品类型",
          "value": "4",
          "parent": "e8139065-051f-42da-a36e-f0ade75c551f",
          "type": 1,
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
            "efficacy_eval"
          ]
        }
      ],
      "outbound_sn_type": [
        {
          "id": "9060c4e2-edd8-4dd3-b76f-ef914e55a447",
          "label": "调拨出库",
          "value": "6",
          "parent": "e81e3c5b-dd4e-4238-9d84-ddef2231cb13",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "c575d172-efb2-450d-a45e-b68b1b65d0bc",
          "label": "外协出库",
          "value": "5",
          "parent": "e81e3c5b-dd4e-4238-9d84-ddef2231cb13",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "d828441e-aadf-435d-947a-ea5fc63c6a54",
          "label": "销售出库",
          "value": "4",
          "parent": "e81e3c5b-dd4e-4238-9d84-ddef2231cb13",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "3d5e012a-ed58-4a48-859c-0eb741a79159",
          "label": "实时出库",
          "value": "7",
          "parent": "e81e3c5b-dd4e-4238-9d84-ddef2231cb13",
          "type": 1,
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
            "efficacy_eval"
          ]
        }
      ],
      "applicable_type": [
        {
          "id": "7d09a22e-73e2-46ed-9f40-14045e934784",
          "label": "着色剂",
          "value": "colorant",
          "parent": "e9d612c1-9f85-4144-a878-f41942913193",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "8d2a5ffc-ab9c-40e5-a25d-a8b053f267be",
          "label": "准用防腐剂",
          "value": "preservative",
          "parent": "e9d612c1-9f85-4144-a878-f41942913193",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "96ac44c6-1c5c-4c41-93c4-33cd39643d56",
          "label": "限用组分",
          "value": "restrict_component",
          "parent": "e9d612c1-9f85-4144-a878-f41942913193",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "e6ca326a-7549-4814-9cfd-fa04d316fe8f",
          "label": "准用防晒剂",
          "value": "sunscreen",
          "parent": "e9d612c1-9f85-4144-a878-f41942913193",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "f9d5651b-bab8-4b8b-87af-3223a81c0a2b",
          "label": "准用染发剂",
          "value": "hair_dye",
          "parent": "e9d612c1-9f85-4144-a878-f41942913193",
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
            "efficacy_eval"
          ]
        }
      ],
      "scene_type": [
        {
          "id": "17262ab0-528c-4db1-9501-2fb3f1704536",
          "label": "驻留",
          "value": "resident_type",
          "parent": "f3de580a-e58d-4958-b3de-f4ffb1319693",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "fe5a8d28-dab9-4529-8935-ac868f0284bb",
          "label": "淋洗",
          "value": "leaching_type",
          "parent": "f3de580a-e58d-4958-b3de-f4ffb1319693",
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
            "efficacy_eval"
          ]
        }
      ],
      "indicators_evaluation_option": [
        {
          "id": "0dfc7a6f-48cf-4a66-b048-12199aeb2790",
          "label": "卫生指标",
          "value": "7",
          "parent": "fd71da55-f1af-47b1-a8ba-83f91215b631",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "0dfc7a6f-48cf-4a66-b048-12199aeb2791",
          "label": "性能指标",
          "value": "8",
          "parent": "fd71da55-f1af-47b1-a8ba-83f91215b631",
          "type": 1,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 1,
          "remark": null,
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "269e72fa-f8b4-46aa-8115-58f76971c4cd",
          "label": "功效指标",
          "value": "5",
          "parent": "fd71da55-f1af-47b1-a8ba-83f91215b631",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "6c07abaa-fbf3-49f3-839b-0b3a33fcfc69",
          "label": "稳定性指标",
          "value": "3",
          "parent": "fd71da55-f1af-47b1-a8ba-83f91215b631",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "6e3b7e60-6028-4e56-b529-9a6714aaee1c",
          "label": "安全性指标",
          "value": "4",
          "parent": "fd71da55-f1af-47b1-a8ba-83f91215b631",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "8202e380-b2af-48a8-be67-89785bbedf14",
          "label": "理化指标",
          "value": "2",
          "parent": "fd71da55-f1af-47b1-a8ba-83f91215b631",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "b11900a9-5009-4535-8b86-845095be5131",
          "label": "感官指标",
          "value": "1",
          "parent": "fd71da55-f1af-47b1-a8ba-83f91215b631",
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
            "efficacy_eval"
          ]
        }
      ],
      "material_source": [
        {
          "id": "0a7534b1-7bbb-4438-a4d2-6d6128d25c53",
          "label": "合成、植物（直接来源）、植物（间接来源）、动物（间接来源）",
          "value": "76",
          "parent": "fe7bd23f-1e2d-420f-8423-95874b5be7f9",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "17ac9009-868c-4989-9ca5-932cd2885a2f",
          "label": "合成、矿物",
          "value": "23",
          "parent": "fe7bd23f-1e2d-420f-8423-95874b5be7f9",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "1d48cffb-6e3a-4365-bafd-3178487746c9",
          "label": "未知",
          "value": "1",
          "parent": "fe7bd23f-1e2d-420f-8423-95874b5be7f9",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 1,
          "remark": "未知",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "2059a75b-4a86-435a-9462-4c889a6258da",
          "label": "合成、其他、植物(直接来源)",
          "value": "57",
          "parent": "fe7bd23f-1e2d-420f-8423-95874b5be7f9",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "21d3c423-2e5e-403c-a170-8b06d953ece1",
          "label": "纯绿色植物来源",
          "value": "13",
          "parent": "fe7bd23f-1e2d-420f-8423-95874b5be7f9",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "23f4feb8-dd20-4601-9e23-2cca172915f0",
          "label": "植物（间接来源），动物（间接来源）",
          "value": "11",
          "parent": "fe7bd23f-1e2d-420f-8423-95874b5be7f9",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "2cadf52e-ce8e-45a2-bbfa-d03531985a82",
          "label": "植物（间接来源）、植物（直接来源）",
          "value": "14",
          "parent": "fe7bd23f-1e2d-420f-8423-95874b5be7f9",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "2e467d08-3126-4079-aece-280edbd73436",
          "label": "植物（间接来源）",
          "value": "9",
          "parent": "fe7bd23f-1e2d-420f-8423-95874b5be7f9",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "2e6e11e2-205f-4c86-815e-1b3a8fbbd6de",
          "label": "合成、植物(直接来源)、植物(间接来源)、动物(直接来源)",
          "value": "75",
          "parent": "fe7bd23f-1e2d-420f-8423-95874b5be7f9",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "2ebd6541-9526-49e8-8ab2-795d0705eb9e",
          "label": "植物（直接来源）、细菌、真菌或其他单细胞生物",
          "value": "74",
          "parent": "fe7bd23f-1e2d-420f-8423-95874b5be7f9",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "395b2683-5f5c-4be5-9110-8ca5091e1d28",
          "label": "植物（间接来源）、矿物",
          "value": "40",
          "parent": "fe7bd23f-1e2d-420f-8423-95874b5be7f9",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "3beba458-4405-4974-80b2-c0a83d12c248",
          "label": "合成、其他",
          "value": "66",
          "parent": "fe7bd23f-1e2d-420f-8423-95874b5be7f9",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "50c4264a-021c-4886-b59a-d4f5e448a2b9",
          "label": "天然来源的复合提取物",
          "value": "15",
          "parent": "fe7bd23f-1e2d-420f-8423-95874b5be7f9",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "5626c6fb-dfee-4914-920e-eada6550294f",
          "label": "合成、植物（直接来源）、细菌、真菌或 其他单细胞生物",
          "value": "53",
          "parent": "fe7bd23f-1e2d-420f-8423-95874b5be7f9",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "563c5e2c-c8f7-47da-b04f-5503b9f74f41",
          "label": "植物（直接来 源）、细菌、 真菌或其他单 细胞生物、合 成",
          "value": "22",
          "parent": "fe7bd23f-1e2d-420f-8423-95874b5be7f9",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "5e4fb78b-0b4d-4cd4-bcb7-f8c75fe0a044",
          "label": "植物（间接来源）、植物（直接来源）、矿物",
          "value": "73",
          "parent": "fe7bd23f-1e2d-420f-8423-95874b5be7f9",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "7dd4f56b-d966-4f6f-9083-fe6e6fdfb00f",
          "label": "藻类和大型真菌(间接来源）",
          "value": "18",
          "parent": "fe7bd23f-1e2d-420f-8423-95874b5be7f9",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "7e94b7ff-439a-4e54-9e9d-0f40bb774a5f",
          "label": "植物（直接来源）",
          "value": "24",
          "parent": "fe7bd23f-1e2d-420f-8423-95874b5be7f9",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "8420e6dc-a3e4-4f9b-88c1-ff36afcee89e",
          "label": "藻类和大型真菌（直接来源）",
          "value": "50",
          "parent": "fe7bd23f-1e2d-420f-8423-95874b5be7f9",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "88b44b04-6523-4b6d-a0e9-2c2546215a89",
          "label": "植物（间接来源）、藻类和大型真菌（直接来源）",
          "value": "69",
          "parent": "fe7bd23f-1e2d-420f-8423-95874b5be7f9",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "8eeeea76-d3cb-4e55-93e7-3d3cdd3b6462",
          "label": "合成、植物(间接来源)、其他",
          "value": "62",
          "parent": "fe7bd23f-1e2d-420f-8423-95874b5be7f9",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "92cdc747-1638-4aaa-aa3b-098762f342c0",
          "label": "菌种发酵",
          "value": "16",
          "parent": "fe7bd23f-1e2d-420f-8423-95874b5be7f9",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "9560b0d0-c2fe-44ed-86f7-5504a0d0ea97",
          "label": "植物(直接来源)、植物(间接来源)",
          "value": "49",
          "parent": "fe7bd23f-1e2d-420f-8423-95874b5be7f9",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "9f5b9c34-6de0-44ff-8fb5-88447477085f",
          "label": "合成、植物 （直接来源）、 藻类和大型真 菌（直接来源）",
          "value": "55",
          "parent": "fe7bd23f-1e2d-420f-8423-95874b5be7f9",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "a349f7cf-084a-43be-9859-34f8280b1299",
          "label": "合成、植物(间接来源)、矿物、其他",
          "value": "65",
          "parent": "fe7bd23f-1e2d-420f-8423-95874b5be7f9",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "a3890d52-d064-4eae-a4a4-18f826c0855d",
          "label": "蔬菜/合成",
          "value": "12",
          "parent": "fe7bd23f-1e2d-420f-8423-95874b5be7f9",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "a8584ae5-6dae-4de5-a302-36d8816c57ba",
          "label": "化学合成",
          "value": "8",
          "parent": "fe7bd23f-1e2d-420f-8423-95874b5be7f9",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "a8759790-f6f7-4538-a558-a6007a5b0ffb",
          "label": "合成、植物 （直接来源）、 植物（间接来源）",
          "value": "38",
          "parent": "fe7bd23f-1e2d-420f-8423-95874b5be7f9",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "aa07b308-2cb5-4ab0-a7c9-c24dcbd11ab0",
          "label": "其他、细菌、真菌或其他单细胞生物",
          "value": "59",
          "parent": "fe7bd23f-1e2d-420f-8423-95874b5be7f9",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "aaf906a4-b97b-41a2-a9ec-40aed95daa01",
          "label": "其他",
          "value": "36",
          "parent": "fe7bd23f-1e2d-420f-8423-95874b5be7f9",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "aee56bf1-252d-4199-824f-c2da29373af7",
          "label": "合成、植物（间接来源）",
          "value": "19",
          "parent": "fe7bd23f-1e2d-420f-8423-95874b5be7f9",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "afa389a0-b155-4634-8d9c-6dc1dc3e6ef7",
          "label": "细菌、真菌或其他单细胞生物",
          "value": "20",
          "parent": "fe7bd23f-1e2d-420f-8423-95874b5be7f9",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "b576b706-425c-45b9-b71d-ce430a2cf486",
          "label": "动物（直接来源）",
          "value": "39",
          "parent": "fe7bd23f-1e2d-420f-8423-95874b5be7f9",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "b8eef6b2-a86c-4f95-886b-c7a0ba705916",
          "label": "细菌、真菌或其他单细胞生物、其他、合成",
          "value": "68",
          "parent": "fe7bd23f-1e2d-420f-8423-95874b5be7f9",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "cfd4b439-4818-4b4a-812f-e8128443e9c7",
          "label": "蔬菜/合成",
          "value": "17",
          "parent": "fe7bd23f-1e2d-420f-8423-95874b5be7f9",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "d6acb5ee-3966-4ddf-9be6-f20877659765",
          "label": "合成、植物（间接来源）、矿物",
          "value": "60",
          "parent": "fe7bd23f-1e2d-420f-8423-95874b5be7f9",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "da5f13a3-23bd-4816-873b-dfc3e2618176",
          "label": "矿物",
          "value": "37",
          "parent": "fe7bd23f-1e2d-420f-8423-95874b5be7f9",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "da956b7c-909a-42b2-935d-8dae4ab3dc46",
          "label": "合成、植物(间接来源)、其他",
          "value": "72",
          "parent": "fe7bd23f-1e2d-420f-8423-95874b5be7f9",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "db3b1f0c-dc64-492e-8544-a838d2ca4aec",
          "label": "合成、其他、植物(直接来源)",
          "value": "54",
          "parent": "fe7bd23f-1e2d-420f-8423-95874b5be7f9",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "dee94e8c-19e2-47c5-ad5b-d7ff416439ab",
          "label": "藻类和大型真菌(间接来源）、植物(间接来源)",
          "value": "21",
          "parent": "fe7bd23f-1e2d-420f-8423-95874b5be7f9",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "e35a89b9-ce85-49d3-95b4-8746f930a2e6",
          "label": "植物（直接来源）、其他",
          "value": "52",
          "parent": "fe7bd23f-1e2d-420f-8423-95874b5be7f9",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "f397fe6b-bc99-4ef5-abd1-fa525ad7aef4",
          "label": "合成、矿物、 其他",
          "value": "70",
          "parent": "fe7bd23f-1e2d-420f-8423-95874b5be7f9",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "f415b76c-2f1e-4cac-b28a-3fe60e4ab8db",
          "label": "合成、植物 （直接来源）",
          "value": "7",
          "parent": "fe7bd23f-1e2d-420f-8423-95874b5be7f9",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "f5e55153-4d04-45a9-8911-a9b83d6d7cb8",
          "label": "动物（间接来源）",
          "value": "10",
          "parent": "fe7bd23f-1e2d-420f-8423-95874b5be7f9",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "f855ac7d-35d9-4013-8757-25088fdd5636",
          "label": "植物（直接来 源）、藻类和大型真菌（直接来源）",
          "value": "25",
          "parent": "fe7bd23f-1e2d-420f-8423-95874b5be7f9",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "fa361ef9-ad89-413b-8721-13b11d92dba5",
          "label": "植物(间接来源)、细菌、真菌或其他单细胞生物、合成",
          "value": "61",
          "parent": "fe7bd23f-1e2d-420f-8423-95874b5be7f9",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "fd6868da-690f-474b-a2e5-a6b5c2267f87",
          "label": "植物（间接来源）、合成、动物（间接来源）",
          "value": "56",
          "parent": "fe7bd23f-1e2d-420f-8423-95874b5be7f9",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "ff1cf99f-82a9-426e-a828-ee59250a76aa",
          "label": "藻类和大型真菌（间接来源） 、其他",
          "value": "64",
          "parent": "fe7bd23f-1e2d-420f-8423-95874b5be7f9",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "fb488bb3-ff6b-4749-b9f7-3dce9cc89ef0",
          "label": "矿物质",
          "value": "2",
          "parent": "fe7bd23f-1e2d-420f-8423-95874b5be7f9",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 2,
          "remark": "矿物质",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "494e7bb7-e7b1-4a4b-bce8-b7261db5b443",
          "label": "植物提取物",
          "value": "3",
          "parent": "fe7bd23f-1e2d-420f-8423-95874b5be7f9",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 3,
          "remark": "植物提取物",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "97ce7b09-a032-4864-a008-c7a58e300009",
          "label": "果实和种子",
          "value": "4",
          "parent": "fe7bd23f-1e2d-420f-8423-95874b5be7f9",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 4,
          "remark": "果实和种子",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "d34a1380-0ce9-4d21-8585-06670759324a",
          "label": "合成",
          "value": "5",
          "parent": "fe7bd23f-1e2d-420f-8423-95874b5be7f9",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 5,
          "remark": "合成",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "cb2b126f-5d7c-4d9f-8e80-b78c7db87c87",
          "label": "动物来源",
          "value": "6",
          "parent": "fe7bd23f-1e2d-420f-8423-95874b5be7f9",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 6,
          "remark": "动物来源",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        }
      ],
      "system_button": [
        {
          "id": "6d0f2a0a-0a43-4045-b979-17bb06c0ad82",
          "label": "新增",
          "value": "Create",
          "parent": "a3840a99-0534-4444-9c02-85ba1629e8eb",
          "type": 0,
          "color": "success",
          "is_value": true,
          "status": true,
          "sort": 1,
          "remark": null,
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "6ef52494-ef87-4785-a3d0-52c98993aa14",
          "label": "编辑",
          "value": "Update",
          "parent": "a3840a99-0534-4444-9c02-85ba1629e8eb",
          "type": 0,
          "color": "primary",
          "is_value": true,
          "status": true,
          "sort": 2,
          "remark": null,
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "3136286d-5347-4376-857d-ef872e14cbc3",
          "label": "删除",
          "value": "Delete",
          "parent": "a3840a99-0534-4444-9c02-85ba1629e8eb",
          "type": 0,
          "color": "danger",
          "is_value": true,
          "status": true,
          "sort": 3,
          "remark": null,
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "16d09812-6438-44da-94ac-d98172813190",
          "label": "详情",
          "value": "Retrieve",
          "parent": "a3840a99-0534-4444-9c02-85ba1629e8eb",
          "type": 0,
          "color": "info",
          "is_value": true,
          "status": true,
          "sort": 4,
          "remark": null,
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "0a8e398d-029c-4289-8111-cf270535772f",
          "label": "查询",
          "value": "Search",
          "parent": "a3840a99-0534-4444-9c02-85ba1629e8eb",
          "type": 0,
          "color": "warning",
          "is_value": true,
          "status": true,
          "sort": 5,
          "remark": null,
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "3986a7a3-10f7-41ce-80a5-05b95d2d9423",
          "label": "保存",
          "value": "Save",
          "parent": "a3840a99-0534-4444-9c02-85ba1629e8eb",
          "type": 0,
          "color": "success",
          "is_value": true,
          "status": true,
          "sort": 6,
          "remark": null,
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "73bad037-9ef1-429a-b67e-51905ac2344c",
          "label": "导入",
          "value": "Import",
          "parent": "a3840a99-0534-4444-9c02-85ba1629e8eb",
          "type": 0,
          "color": "primary",
          "is_value": true,
          "status": true,
          "sort": 7,
          "remark": null,
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "f2741d7d-db5d-49da-aa74-6b19cba9517b",
          "label": "导出",
          "value": "Export",
          "parent": "a3840a99-0534-4444-9c02-85ba1629e8eb",
          "type": 0,
          "color": "warning",
          "is_value": true,
          "status": true,
          "sort": 8,
          "remark": null,
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        }
      ],
      "material_unit": [
        {
          "id": "8fe8de06-52e1-4563-8c59-a87b68f216a6",
          "label": "袋",
          "value": "1",
          "parent": "d91f3d04-ca26-4437-9d46-720e634a97e5",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "549b144e-e9b0-4ca6-bfb3-0e06bb7a3517",
          "label": "瓶",
          "value": "2",
          "parent": "d91f3d04-ca26-4437-9d46-720e634a97e5",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "c587dfec-7cb4-479a-85e2-3dfa015ed023",
          "label": "桶",
          "value": "3",
          "parent": "d91f3d04-ca26-4437-9d46-720e634a97e5",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "347e6de3-b57a-4399-af7d-37759366ce0f",
          "label": "盒",
          "value": "4",
          "parent": "d91f3d04-ca26-4437-9d46-720e634a97e5",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "8dc4ce12-9835-44cf-ba70-91bf4894aedf",
          "label": "听",
          "value": "5",
          "parent": "d91f3d04-ca26-4437-9d46-720e634a97e5",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "1e152f3f-02b9-4f66-9860-0421b3b22bf0",
          "label": "箱",
          "value": "6",
          "parent": "d91f3d04-ca26-4437-9d46-720e634a97e5",
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
            "efficacy_eval"
          ]
        }
      ],
      "button_status_number": [
        {
          "id": "7e3902c0-ac25-4342-a1e1-2e3f781e7414",
          "label": "启用",
          "value": "1",
          "parent": "30de2197-c949-4729-b464-4bc1c1e006d7",
          "type": 1,
          "color": "success",
          "is_value": true,
          "status": true,
          "sort": 1,
          "remark": null,
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "13dbc0a3-d797-470f-a659-631b243dbeb4",
          "label": "禁用",
          "value": "0",
          "parent": "30de2197-c949-4729-b464-4bc1c1e006d7",
          "type": 1,
          "color": "danger",
          "is_value": true,
          "status": true,
          "sort": 2,
          "remark": null,
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        }
      ],
      "material_shap": [
        {
          "id": "8ebf5b84-b402-4b80-a45b-dd5426907c8e",
          "label": "花丝",
          "value": "8",
          "parent": "49687e05-171f-4d20-bd3b-7500d7aae324",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "a80b2fea-eec4-43ff-9d39-d3c5560e93dd",
          "label": "液体",
          "value": "1",
          "parent": "49687e05-171f-4d20-bd3b-7500d7aae324",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "34ac62f0-d809-4e11-9a68-60ac0fd8fcbe",
          "label": "粉状",
          "value": "2",
          "parent": "49687e05-171f-4d20-bd3b-7500d7aae324",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "11a1f0b5-f766-4ee6-8076-2f97ef214c7e",
          "label": "固体",
          "value": "3",
          "parent": "49687e05-171f-4d20-bd3b-7500d7aae324",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "20405f4f-cd10-4ae8-a5c0-427de89beda9",
          "label": "膏体",
          "value": "4",
          "parent": "49687e05-171f-4d20-bd3b-7500d7aae324",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "83538f45-2ba3-4569-841b-0d3ee7a65b2e",
          "label": "半固体",
          "value": "5",
          "parent": "49687e05-171f-4d20-bd3b-7500d7aae324",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "8816f704-712f-44ee-bd0c-7f8ad01b0392",
          "label": "凝胶",
          "value": "6",
          "parent": "49687e05-171f-4d20-bd3b-7500d7aae324",
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
            "efficacy_eval"
          ]
        }
      ],
      "button_whether_bool": [
        {
          "id": "9e9d4a00-12a7-4d64-94bf-186247a9e93e",
          "label": "是",
          "value": "true",
          "parent": "02e120c6-808e-4083-9c34-e1498719bc01",
          "type": 6,
          "color": "success",
          "is_value": true,
          "status": true,
          "sort": 1,
          "remark": null,
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "0e142235-b03e-4ea1-bbfb-d4665c43992f",
          "label": "否",
          "value": "false",
          "parent": "02e120c6-808e-4083-9c34-e1498719bc01",
          "type": 6,
          "color": "danger",
          "is_value": true,
          "status": true,
          "sort": 2,
          "remark": null,
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        }
      ],
      "product_type": [],
      "button_whether_number": [
        {
          "id": "f44efb35-4904-47cc-b988-e881dfee3f25",
          "label": "是",
          "value": "1",
          "parent": "28e326dd-fce5-44dc-bc20-8d2971f031c4",
          "type": 1,
          "color": "success",
          "is_value": true,
          "status": true,
          "sort": 1,
          "remark": null,
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "6ea0021f-ab2c-4367-8ff4-29674fa7ecd7",
          "label": "否",
          "value": "2",
          "parent": "28e326dd-fce5-44dc-bc20-8d2971f031c4",
          "type": 1,
          "color": "danger",
          "is_value": true,
          "status": true,
          "sort": 2,
          "remark": null,
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        }
      ],
      "product_effect": [
        {
          "id": "47e328f2-096f-48d6-b493-f3e9aabb37be",
          "label": "保湿",
          "value": "1",
          "parent": "4dd94df7-7d7b-4a31-a734-3f4aaddec857",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 1,
          "remark": "保湿",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "acc7015a-8cc0-4901-9ac5-ded15a167673",
          "label": "清洁",
          "value": "2",
          "parent": "4dd94df7-7d7b-4a31-a734-3f4aaddec857",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 2,
          "remark": "清洁",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "1a096957-3c74-4e4b-b0c1-d06be4119539",
          "label": "芳香",
          "value": "3",
          "parent": "4dd94df7-7d7b-4a31-a734-3f4aaddec857",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 3,
          "remark": "芳香",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "58ebd1ff-18c2-447e-bd70-9fe51606a79d",
          "label": "美容修饰",
          "value": "4",
          "parent": "4dd94df7-7d7b-4a31-a734-3f4aaddec857",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 4,
          "remark": "美容修饰",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "e08293e3-97bf-4bf3-ae8f-51a558394448",
          "label": "卸妆",
          "value": "5",
          "parent": "4dd94df7-7d7b-4a31-a734-3f4aaddec857",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 5,
          "remark": "卸妆",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "01e3a211-2dc2-4652-840b-6b50419f6003",
          "label": "祛痘",
          "value": "6",
          "parent": "4dd94df7-7d7b-4a31-a734-3f4aaddec857",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 6,
          "remark": "祛痘",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "d0afd6e3-1a28-40ef-a9a6-6f60d30378d5",
          "label": "滋养",
          "value": "7",
          "parent": "4dd94df7-7d7b-4a31-a734-3f4aaddec857",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 7,
          "remark": "滋养",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "e9d0c766-65ed-485a-a3a9-cccb74ffa12b",
          "label": "修护",
          "value": "8",
          "parent": "4dd94df7-7d7b-4a31-a734-3f4aaddec857",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 8,
          "remark": "修护",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "0cbe944e-a049-42b4-9930-bc3b68751ea5",
          "label": "去屑",
          "value": "9",
          "parent": "4dd94df7-7d7b-4a31-a734-3f4aaddec857",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 9,
          "remark": "去屑",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "65c64f3d-eef0-4883-84d5-1c81fcf2ed67",
          "label": "抗皱",
          "value": "10",
          "parent": "4dd94df7-7d7b-4a31-a734-3f4aaddec857",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 10,
          "remark": "抗皱",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "d1a33fbd-cc8f-4806-be97-3a733b6cb92d",
          "label": "紧致",
          "value": "11",
          "parent": "4dd94df7-7d7b-4a31-a734-3f4aaddec857",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 11,
          "remark": "紧致",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "af46fb74-9361-4960-a8a8-69b2519a6eba",
          "label": "舒缓",
          "value": "12",
          "parent": "4dd94df7-7d7b-4a31-a734-3f4aaddec857",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 12,
          "remark": "舒缓",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "dae67cac-37a0-44e1-8818-b83fd2d1f1f3",
          "label": "控油",
          "value": "13",
          "parent": "4dd94df7-7d7b-4a31-a734-3f4aaddec857",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 13,
          "remark": "控油",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "83fe843a-1061-438d-a116-ff9b235fd555",
          "label": "去角质",
          "value": "14",
          "parent": "4dd94df7-7d7b-4a31-a734-3f4aaddec857",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 14,
          "remark": "去角质",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "599223df-5d88-4e16-8e8c-3bc3d6053529",
          "label": "护发",
          "value": "15",
          "parent": "4dd94df7-7d7b-4a31-a734-3f4aaddec857",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 15,
          "remark": "护发",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "dc1639a6-4904-4ed1-8d6d-fefeadec862e",
          "label": "防断发",
          "value": "16",
          "parent": "4dd94df7-7d7b-4a31-a734-3f4aaddec857",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 16,
          "remark": "防断发",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "012432d6-f9e3-4c38-b1f9-7c8cdf94b7e6",
          "label": "祛斑美白",
          "value": "17",
          "parent": "4dd94df7-7d7b-4a31-a734-3f4aaddec857",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 17,
          "remark": "祛斑美白",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "10dbbbc0-e1c2-46b0-b5bc-afe79d915247",
          "label": "防晒",
          "value": "18",
          "parent": "4dd94df7-7d7b-4a31-a734-3f4aaddec857",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 18,
          "remark": "防晒",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "e2aa0341-38b0-4b5b-a8c8-4d278360f731",
          "label": "爽身",
          "value": "19",
          "parent": "4dd94df7-7d7b-4a31-a734-3f4aaddec857",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 19,
          "remark": "爽身",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "ffeb4537-5d22-44a2-8c1b-b724515cf976",
          "label": "防脱发",
          "value": "20",
          "parent": "4dd94df7-7d7b-4a31-a734-3f4aaddec857",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 20,
          "remark": "防脱发",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "89693603-a258-41fa-a009-5be8a8720bd1",
          "label": "除臭",
          "value": "21",
          "parent": "4dd94df7-7d7b-4a31-a734-3f4aaddec857",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 21,
          "remark": "除臭",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "0a277b7f-c74b-4814-915a-1318e58dec1c",
          "label": "发色护理",
          "value": "22",
          "parent": "4dd94df7-7d7b-4a31-a734-3f4aaddec857",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 22,
          "remark": "发色护理",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "54e7ee7c-1de7-49b2-8003-444d5882bc0c",
          "label": "脱毛",
          "value": "23",
          "parent": "4dd94df7-7d7b-4a31-a734-3f4aaddec857",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 23,
          "remark": "脱毛",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "e9a93da8-5743-469d-a844-4c041b47d7a6",
          "label": "辅助剃须、剃毛",
          "value": "24",
          "parent": "4dd94df7-7d7b-4a31-a734-3f4aaddec857",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 24,
          "remark": "辅助剃须、剃毛",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "57180fe3-27f1-437b-a9ac-0f33dfcff848",
          "label": "染发",
          "value": "25",
          "parent": "4dd94df7-7d7b-4a31-a734-3f4aaddec857",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 25,
          "remark": "染发",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "7f76c0d0-0a81-4143-bc8d-b9d969031d0e",
          "label": "烫发",
          "value": "26",
          "parent": "4dd94df7-7d7b-4a31-a734-3f4aaddec857",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 26,
          "remark": "烫发",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "b9a9b382-e022-47cb-ab8d-6577be0f4a7a",
          "label": "新功效",
          "value": "27",
          "parent": "4dd94df7-7d7b-4a31-a734-3f4aaddec857",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 27,
          "remark": "新功效",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        }
      ],
      "product_dosage_form": [
        {
          "id": "2c5e34ca-dbc0-4b4d-8147-d917fce21910",
          "label": "身体乳",
          "value": "10008",
          "parent": "589e9478-fd73-40fa-a52b-69206b6e0571",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 1,
          "remark": "身体乳",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "2c5e34ca-dbc0-4b4d-8147-d917fce21921",
          "label": "身体乳（儿童）",
          "value": "身体乳（儿童）",
          "parent": "589e9478-fd73-40fa-a52b-69206b6e0571",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 1,
          "remark": "身体乳（儿童）",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "2c5e34ca-dbc0-4b4d-8147-d917fce2199d",
          "label": "面霜",
          "value": "面霜",
          "parent": "589e9478-fd73-40fa-a52b-69206b6e0571",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 1,
          "remark": "面霜",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "63f7a503-9206-4313-8037-04349a97af11",
          "label": "洁面膏",
          "value": "洁面膏",
          "parent": "589e9478-fd73-40fa-a52b-69206b6e0571",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 1,
          "remark": "洁面膏",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "63f7a503-9206-4313-8037-04349a97af22",
          "label": "尿布区域",
          "value": "10016",
          "parent": "589e9478-fd73-40fa-a52b-69206b6e0571",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 1,
          "remark": "尿布区域",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "63f7a503-9206-4313-8037-04349a97af7b",
          "label": "精华液",
          "value": "10002",
          "parent": "589e9478-fd73-40fa-a52b-69206b6e0571",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 1,
          "remark": "精华液",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "746dffaf-8ec9-46c4-aae4-90fe00ece40c",
          "label": "化妆水",
          "value": "10003",
          "parent": "589e9478-fd73-40fa-a52b-69206b6e0571",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 1,
          "remark": "化妆水",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "746dffaf-8ec9-46c4-aae4-90fe00ece412",
          "label": "防晒产品",
          "value": "10010",
          "parent": "589e9478-fd73-40fa-a52b-69206b6e0571",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 1,
          "remark": "防晒产品",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "746dffaf-8ec9-46c4-aae4-90fe00ece423",
          "label": "尿布区域产品",
          "value": "10017",
          "parent": "589e9478-fd73-40fa-a52b-69206b6e0571",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 1,
          "remark": "尿布区域产品",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "8284386f-b9dd-4a6d-a5b1-c4b7ae995413",
          "label": "护发素",
          "value": "10011",
          "parent": "589e9478-fd73-40fa-a52b-69206b6e0571",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 1,
          "remark": "护发素",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "8284386f-b9dd-4a6d-a5b1-c4b7ae995424",
          "label": "洗沐二合一（儿童）",
          "value": "10018",
          "parent": "589e9478-fd73-40fa-a52b-69206b6e0571",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 1,
          "remark": "洗沐二合一（儿童）",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "8284386f-b9dd-4a6d-a5b1-c4b7ae99547e",
          "label": "面贴膜",
          "value": "面贴膜",
          "parent": "589e9478-fd73-40fa-a52b-69206b6e0571",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 1,
          "remark": "面贴膜",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "a5025243-4ae3-4e98-bb2b-e6e0556e7b14",
          "label": "眼霜",
          "value": "10012",
          "parent": "589e9478-fd73-40fa-a52b-69206b6e0571",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 1,
          "remark": "眼霜",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "a5025243-4ae3-4e98-bb2b-e6e0556e7b25",
          "label": "面霜（儿童）",
          "value": "面霜（儿童）",
          "parent": "589e9478-fd73-40fa-a52b-69206b6e0571",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 1,
          "remark": "面霜（儿童）",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "a5025243-4ae3-4e98-bb2b-e6e0556e7b99",
          "label": "洗发水",
          "value": "洗发水",
          "parent": "589e9478-fd73-40fa-a52b-69206b6e0571",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 1,
          "remark": "洗发水",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "a63aaf25-2dfb-47d7-9f5a-775ffc358e15",
          "label": "沐浴露",
          "value": "沐浴露",
          "parent": "589e9478-fd73-40fa-a52b-69206b6e0571",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 1,
          "remark": "沐浴露",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "a63aaf25-2dfb-47d7-9f5a-775ffc358e26",
          "label": "凝胶",
          "value": "凝胶",
          "parent": "589e9478-fd73-40fa-a52b-69206b6e0571",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 1,
          "remark": "凝胶",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "a63aaf25-2dfb-47d7-9f5a-775ffc358e31",
          "label": "洗手液",
          "value": "洗手液",
          "parent": "589e9478-fd73-40fa-a52b-69206b6e0571",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 1,
          "remark": "洗手液",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "a63aaf25-2dfb-47d7-9f5a-775ffc358ed3",
          "label": "涂抹面膜",
          "value": "涂抹面膜",
          "parent": "589e9478-fd73-40fa-a52b-69206b6e0571",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 1,
          "remark": "涂抹面膜",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "cf9ab35b-77a5-4987-ab82-9bb9ed482715",
          "label": "喷雾产品",
          "value": "喷雾产品",
          "parent": "589e9478-fd73-40fa-a52b-69206b6e0571",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 1,
          "remark": "喷雾产品",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "cf9ab35b-77a5-4987-ab82-9bb9ed482727",
          "label": "头部精华液",
          "value": "头部精华液",
          "parent": "589e9478-fd73-40fa-a52b-69206b6e0571",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 1,
          "remark": "头部精华液",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "cf9ab35b-77a5-4987-ab82-9bb9ed482732",
          "label": "粉剂",
          "value": "粉剂",
          "parent": "589e9478-fd73-40fa-a52b-69206b6e0571",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 1,
          "remark": "粉剂",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "cf9ab35b-77a5-4987-ab82-9bb9ed48274d",
          "label": "乳液",
          "value": "乳液",
          "parent": "589e9478-fd73-40fa-a52b-69206b6e0571",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 1,
          "remark": "乳液",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        }
      ],
      "user_type": [
        {
          "id": "9b44cc6c-5564-42f2-9c21-8e6b38d46195",
          "label": "后台用户",
          "value": "0",
          "parent": "8df3524f-5dec-48b2-b3a8-93909af0ae81",
          "type": 1,
          "color": null,
          "is_value": true,
          "status": true,
          "sort": 1,
          "remark": null,
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "22945c30-9dc5-4b21-946e-f6a630e2ca47",
          "label": "前台用户",
          "value": "1",
          "parent": "8df3524f-5dec-48b2-b3a8-93909af0ae81",
          "type": 1,
          "color": null,
          "is_value": true,
          "status": true,
          "sort": 2,
          "remark": null,
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        }
      ],
      "config_form_type": [
        {
          "id": "2fecab10-ae20-4b7b-a603-57c491c9263c",
          "label": "number",
          "value": "10",
          "parent": "20981ae4-e904-46c5-b398-cb404232c4df",
          "type": 1,
          "color": "",
          "is_value": true,
          "status": true,
          "sort": 0,
          "remark": null,
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "a2737177-32ac-4b5c-9261-63ccf2f8fe5d",
          "label": "textarea",
          "value": "3",
          "parent": "20981ae4-e904-46c5-b398-cb404232c4df",
          "type": 1,
          "color": "",
          "is_value": true,
          "status": true,
          "sort": 0,
          "remark": null,
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "e08542e7-b205-49f0-803f-1619d24c7b41",
          "label": "text",
          "value": "0",
          "parent": "20981ae4-e904-46c5-b398-cb404232c4df",
          "type": 1,
          "color": null,
          "is_value": true,
          "status": true,
          "sort": 0,
          "remark": null,
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "01de37bf-eac7-4c96-842b-8eaf9a42e6e2",
          "label": "datetime",
          "value": "1",
          "parent": "20981ae4-e904-46c5-b398-cb404232c4df",
          "type": 1,
          "color": null,
          "is_value": true,
          "status": true,
          "sort": 1,
          "remark": null,
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "7e5c66e0-07d7-4bfa-8cc5-825a9d9dedc4",
          "label": "date",
          "value": "2",
          "parent": "20981ae4-e904-46c5-b398-cb404232c4df",
          "type": 1,
          "color": null,
          "is_value": true,
          "status": true,
          "sort": 2,
          "remark": null,
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "4d5d4a1f-b89f-4d35-8f21-3d677bc832ed",
          "label": "time",
          "value": "15",
          "parent": "20981ae4-e904-46c5-b398-cb404232c4df",
          "type": 1,
          "color": "",
          "is_value": true,
          "status": true,
          "sort": 3,
          "remark": null,
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "4642807d-31d6-414b-8f60-15e645de85f7",
          "label": "select",
          "value": "4",
          "parent": "20981ae4-e904-46c5-b398-cb404232c4df",
          "type": 1,
          "color": null,
          "is_value": true,
          "status": true,
          "sort": 4,
          "remark": null,
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "3e6d89fb-0b1b-4cd1-8682-1ae10500b04e",
          "label": "checkbox",
          "value": "5",
          "parent": "20981ae4-e904-46c5-b398-cb404232c4df",
          "type": 1,
          "color": null,
          "is_value": true,
          "status": true,
          "sort": 5,
          "remark": null,
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "18826040-6c1b-49a0-8a52-793b81f71d92",
          "label": "switch",
          "value": "9",
          "parent": "20981ae4-e904-46c5-b398-cb404232c4df",
          "type": 1,
          "color": "",
          "is_value": true,
          "status": true,
          "sort": 6,
          "remark": null,
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "c37df22d-acd0-4d32-8105-3b2c2ead9ceb",
          "label": "radio",
          "value": "6",
          "parent": "20981ae4-e904-46c5-b398-cb404232c4df",
          "type": 1,
          "color": null,
          "is_value": true,
          "status": true,
          "sort": 6,
          "remark": null,
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "acc3944b-4499-4e20-85a7-0472e38c6327",
          "label": "文件附件",
          "value": "8",
          "parent": "20981ae4-e904-46c5-b398-cb404232c4df",
          "type": 1,
          "color": "",
          "is_value": true,
          "status": true,
          "sort": 7,
          "remark": null,
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "5cf46b2a-d5ee-404c-ab46-5fd3dde4cb84",
          "label": "图片(单张)",
          "value": "7",
          "parent": "20981ae4-e904-46c5-b398-cb404232c4df",
          "type": 1,
          "color": "",
          "is_value": true,
          "status": true,
          "sort": 8,
          "remark": null,
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "c2ff1024-da4b-47ce-9149-6ec5933a2913",
          "label": "图片(多张)",
          "value": "12",
          "parent": "20981ae4-e904-46c5-b398-cb404232c4df",
          "type": 1,
          "color": "",
          "is_value": true,
          "status": true,
          "sort": 9,
          "remark": null,
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "b33333de-f3c8-4c63-8cfd-67f9666cbecc",
          "label": "数组",
          "value": "11",
          "parent": "20981ae4-e904-46c5-b398-cb404232c4df",
          "type": 1,
          "color": "",
          "is_value": true,
          "status": true,
          "sort": 11,
          "remark": null,
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "02fa020a-7d26-406c-8ae0-3470524cf7cd",
          "label": "关联表",
          "value": "13",
          "parent": "20981ae4-e904-46c5-b398-cb404232c4df",
          "type": 1,
          "color": "",
          "is_value": true,
          "status": true,
          "sort": 13,
          "remark": null,
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "f382f6a7-9fec-4cf6-8562-53988b56b454",
          "label": "关联表(多选)",
          "value": "14",
          "parent": "20981ae4-e904-46c5-b398-cb404232c4df",
          "type": 1,
          "color": "",
          "is_value": true,
          "status": true,
          "sort": 14,
          "remark": null,
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        }
      ],
      "gender": [
        {
          "id": "58613b74-0980-47f0-add1-03861939646b",
          "label": "未知",
          "value": "0",
          "parent": "0894cde5-e67e-4ab4-9ee9-25c7a8de71c3",
          "type": 1,
          "color": null,
          "is_value": true,
          "status": true,
          "sort": 0,
          "remark": null,
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "9a68cc63-0a6f-41da-9d38-3f4fa6d2b8a8",
          "label": "男",
          "value": "1",
          "parent": "0894cde5-e67e-4ab4-9ee9-25c7a8de71c3",
          "type": 1,
          "color": null,
          "is_value": true,
          "status": true,
          "sort": 1,
          "remark": null,
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "5a38b601-85fd-489e-85ad-bdf2459ff3d2",
          "label": "女",
          "value": "2",
          "parent": "0894cde5-e67e-4ab4-9ee9-25c7a8de71c3",
          "type": 1,
          "color": null,
          "is_value": true,
          "status": true,
          "sort": 2,
          "remark": null,
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        }
      ],
      "lead_into_source": [
        {
          "id": "160a5acb-a996-48ed-8af1-daf750f6780b",
          "label": "工程师",
          "value": "1",
          "parent": "15d2f1fa-483c-424d-a15f-8abf1f591e42",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "6c38467a-5922-439b-b11a-9e1bd4042b25",
          "label": "客户",
          "value": "2",
          "parent": "15d2f1fa-483c-424d-a15f-8abf1f591e42",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "49ba14dd-d941-4dc4-8d29-9cf86ae8cbca",
          "label": "其他",
          "value": "3",
          "parent": "15d2f1fa-483c-424d-a15f-8abf1f591e42",
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
            "efficacy_eval"
          ]
        }
      ],
      "material_type": [
        {
          "id": "ccea6d21-5915-4885-b90d-4f6876ea812d",
          "label": "自有",
          "value": "1",
          "parent": "620e2d5c-8500-4b5c-b6fa-57f245229d0b",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "72b451e8-0d9c-4e77-85ed-a9a534f65a98",
          "label": "客供",
          "value": "2",
          "parent": "620e2d5c-8500-4b5c-b6fa-57f245229d0b",
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
            "efficacy_eval"
          ]
        }
      ],
      "contact_way": [
        {
          "id": "d676505b-232c-46cc-9df0-dfa4e63c7e0c",
          "label": "手机号",
          "value": "1",
          "parent": "bbdfbb17-16b0-4c72-af40-dbfbff1ad2ef",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "cfe9a3de-9f43-4ede-be13-b3c26cb22ec4",
          "label": "微信",
          "value": "2",
          "parent": "bbdfbb17-16b0-4c72-af40-dbfbff1ad2ef",
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
            "efficacy_eval"
          ]
        }
      ],
      "project_type": [
        {
          "id": "780c477e-4c94-4a24-b5e8-4c55c481ab85",
          "label": "研发项目",
          "value": "1",
          "parent": "a97bb97f-ab07-462b-a2b6-b82c27c7e5b7",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "540a301f-b2d8-4547-bd38-7e694ab5c142",
          "label": "实验室项目",
          "value": "2",
          "parent": "a97bb97f-ab07-462b-a2b6-b82c27c7e5b7",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "d505e26f-de9e-4076-ae25-f21437a5dd36",
          "label": "评测机构项目",
          "value": "3",
          "parent": "a97bb97f-ab07-462b-a2b6-b82c27c7e5b7",
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
            "efficacy_eval"
          ]
        }
      ],
      "task_ident": [
        {
          "id": "0b4f8ac2-5691-4f3f-ad40-5b7825ad4447",
          "label": "需求",
          "value": "1",
          "parent": "7af3d37f-88ec-4e07-bc07-5312c3461343",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "135eddf3-f8ad-43ee-aab2-2d47dd26e636",
          "label": "缺陷",
          "value": "2",
          "parent": "7af3d37f-88ec-4e07-bc07-5312c3461343",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "cb746eef-cf69-4172-86fa-d61f33f00697",
          "label": "任务",
          "value": "3",
          "parent": "7af3d37f-88ec-4e07-bc07-5312c3461343",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "c8f201cf-245f-47e4-b74f-8be8ddc916f3",
          "label": "自定义",
          "value": "4",
          "parent": "7af3d37f-88ec-4e07-bc07-5312c3461343",
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
            "efficacy_eval"
          ]
        }
      ],
      "task_category": [],
      "task_priority": [
        {
          "id": "668ed1e4-baa8-4723-8ffb-170b0aef7fd5",
          "label": "较低",
          "value": "1",
          "parent": "5b04c7bd-708d-406b-a302-5bfd74ab1f2a",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "18da568d-8d61-4a87-b6fd-bee1484c05f9",
          "label": "普通",
          "value": "2",
          "parent": "5b04c7bd-708d-406b-a302-5bfd74ab1f2a",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "415a5b3d-c059-48f9-892f-7eed3e4a14d4",
          "label": "紧急",
          "value": "3",
          "parent": "5b04c7bd-708d-406b-a302-5bfd74ab1f2a",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "474e3d93-cf1d-4a01-96d2-1c19badfe492",
          "label": "非常紧急",
          "value": "4",
          "parent": "5b04c7bd-708d-406b-a302-5bfd74ab1f2a",
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
            "efficacy_eval"
          ]
        }
      ],
      "evaluating_type": [
        {
          "id": "35ff3e9e-a97b-43e2-ba74-033266c0de71",
          "label": "料体稳定性测试",
          "value": "1",
          "parent": "592e70cc-df7f-4037-aad7-857543b4a42c",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "d22f3121-aa21-4f01-8f2a-5968f5e2f02c",
          "label": "包材兼容性测试",
          "value": "2",
          "parent": "592e70cc-df7f-4037-aad7-857543b4a42c",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "5b49c228-44e4-44c5-92d8-06310209aa14",
          "label": "防腐挑战性测试",
          "value": "3",
          "parent": "592e70cc-df7f-4037-aad7-857543b4a42c",
          "type": 1,
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
            "efficacy_eval"
          ]
        },
        {
          "id": "edac0fcb-5480-4a5b-bbb9-139373699162",
          "label": "人体功效测试",
          "value": "4",
          "parent": "592e70cc-df7f-4037-aad7-857543b4a42c",
          "type": 1,
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
            "efficacy_eval"
          ]
        },
        {
          "id": "60cb4470-d65f-4b20-94e5-24ff302c3a2d",
          "label": "皮肤斑贴测试",
          "value": "5",
          "parent": "592e70cc-df7f-4037-aad7-857543b4a42c",
          "type": 1,
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
            "efficacy_eval"
          ]
        },
        {
          "id": "84c70b49-2403-4967-a219-abf7c9e793b0",
          "label": "毒理性测试",
          "value": "6",
          "parent": "592e70cc-df7f-4037-aad7-857543b4a42c",
          "type": 1,
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
            "efficacy_eval"
          ]
        },
        {
          "id": "16078ccc-b495-484e-bb6f-89e67493e16c",
          "label": "急性眼刺激测试",
          "value": "7",
          "parent": "592e70cc-df7f-4037-aad7-857543b4a42c",
          "type": 1,
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
            "efficacy_eval"
          ]
        },
        {
          "id": "24bb1cae-195c-4897-b40a-d0234d59c9bb",
          "label": "安全评估",
          "value": "8",
          "parent": "592e70cc-df7f-4037-aad7-857543b4a42c",
          "type": 1,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 8,
          "remark": "",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        },
        {
          "id": "66226b4b-8eb8-48b8-9faa-b4eac910bdf3",
          "label": "执行标准内控测试",
          "value": "9",
          "parent": "592e70cc-df7f-4037-aad7-857543b4a42c",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 9,
          "remark": "",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval"
          ]
        }
      ],
      "evaluating_square": [
        {
          "id": "5b71d4cf-c0b8-41c8-b18d-319ba47f8d24",
          "label": "自测",
          "value": "1",
          "parent": "1ae2f855-139a-4852-8869-cf0b033e0854",
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
            "efficacy_eval"
          ]
        },
        {
          "id": "418f1b7a-d511-40f0-b4d1-b31033e11bf3",
          "label": "第三方",
          "value": "2",
          "parent": "1ae2f855-139a-4852-8869-cf0b033e0854",
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
            "efficacy_eval"
          ]
        }
      ],
      "evaluating_test_period": [
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
            "efficacy_eval"
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
            "efficacy_eval"
          ]
        }
      ]
    },
    experiment_theme: {
      "id": "27cb4fd5-7c15-43e3-a240-9ae2950ee85d",
      "modifier_name": "zzw",
      "dept_belong_id": null,
      "creator_name": "zzw",
      "create_datetime": "2024-12-02 15:53:03",
      "update_datetime": "2024-12-02 15:53:03",
      "liked": false,
      "description": null,
      "creator": "63aed191-f093-4e9d-b4ef-4a159ffa3938",
      "modifier": "63aed191-f093-4e9d-b4ef-4a159ffa3938",
      "title": "JL120215520002",
      "sn": null,
      "start_time": null,
      "end_time": null,
      "experiment_design": null,
      "sample_number": null,
      "version": 1,
      "document_attachments": null,
      "json_data": {},
      "experiment_theme": "27cb4fd5-7c15-43e3-a240-9ae2950ee85d",
      "previous_record": null,
      "catalog": null,
      "experimenter": []
    },
    experiment_record: {
      "id": "90eff14c-9327-4745-8302-729a2ed3398b",
      "modifier_name": "zzw",
      "dept_belong_id": null,
      "creator_name": "zzw",
      "create_datetime": "2024-12-02 15:29:43",
      "update_datetime": "2024-12-02 16:01:48",
      "liked": true,
      "description": null,
      "creator": "63aed191-f093-4e9d-b4ef-4a159ffa3938",
      "modifier": "63aed191-f093-4e9d-b4ef-4a159ffa3938",
      "title": "JL120215290001",
      "sn": "as546654654",
      "start_time": "2024-12-19 00:00:00",
      "end_time": "2024-12-29 00:00:00",
      "experiment_design": null,
      "sample_number": null,
      "version": 1,
      "document_attachments": null,
      "experiment_theme": "27cb4fd5-7c15-43e3-a240-9ae2950ee85d",
      "previous_record": null,
      "catalog": null,
      "experimenter": []
    },
    umo_domain: 'http://id.zw.rzm.com',
    umo_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzMzNzk2MzUxLCJpYXQiOjE3MzM3MDk5NTEsImp0aSI6ImUzNDAxZDM0OGVlYjRlZTc4MTIzMmE4NTgyMzJlNThjIiwidXNlcl9pZCI6IjYzYWVkMTkxLWYwOTMtNGU5ZC1iNGVmLTRhMTU5ZmZhMzkzOCJ9.-JC2lnTa9wOLTBWLHQl_p-zcpdl-2Y2cqmS62WOkJ0s',
  },
  document: {
    placeholder: '测试文档',
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
    localStorage.setItem('document.content', document.content)
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
    const res = await attachments_fileFetch({ url: file})
    console.log('-------res-----1111111111111----', res)
    if (res.data.code === 2000) {
      return res.data.data
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
          "data": [{
            "description": "jdkgfklhf",
            "ident": "dsjfdskj",
            "category": "fjaskfbjasl",
            "color": "fhjasgfkh",
            "icon": "hjsdgfkj",
            "title": "sdhjfbdkjsfbh"
          }, {
            "description": "jdkgfklhf",
            "ident": "dsjfdskj",
            "category": "fjaskfbjasl",
            "color": "fhjasgfkh",
            "icon": "hjsdgfkj",
            "title": "3243243"
          }]
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
          "data": [{
            "description": "jdkgfklhf",
            "ident": "dsjfdskj",
            "category": "fjaskfbjasl",
            "color": "fhjasgfkh",
            "icon": "hjsdgfkj",
            "title": "sdhjfbdkjsfbh"
          }]
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
      // {
      //   "type": "xmTitle",
      //   "attrs": {
      //     "id": "b6be422d-defc-4b0f-b490-a321cb3c7aae",
      //     "key": "baseTitle",
      //     "name": "2476efd3-63bc-4788-9f8a-b496d8d1c8f6",
      //     "title": "JL11271610",
      //     "isChanged": false,
      //     "updateTime": "",
      //     "showSubTitle": true
      //   }
      // },
      // {
      //   "type": "xmForm",
      //   "attrs": {
      //     "id": "b6be422d-defc-4b0f-b490-a321cb3c7aae",
      //     "key": "baseInfo",
      //     "name": "82177d83-e226-4205-922f-659506c8a4a7",
      //     "config": {
      //       "formItems": [
      //         {
      //           "id": "sn",
      //           "key": "sn",
      //           "icon": "iconamoon:edit",
      //           "name": "TextInput",
      //           "type": "TextInput",
      //           "alias": "实验编号",
      //           "props": {
      //             "hidden": false,
      //             "abstract": false,
      //             "readOnly": false,
      //             "required": true,
      //             "enableScan": false,
      //             "validation": null,
      //             "enablePrint": true,
      //             "textForSuffix": "",
      //             "enableSuffixText": false
      //           },
      //           "title": "实验编号",
      //           "valueType": "String"
      //         },
      //         {
      //           "id": "experimenter",
      //           "key": "experimenter",
      //           "icon": "iconamoon:edit",
      //           "name": "UserPicker",
      //           "type": "UserPicker",
      //           "alias": "实验参与人",
      //           "props": {
      //             "hidden": false,
      //             "remote": true,
      //             "options": [
      //               {
      //                 "id": "63aed191-f093-4e9d-b4ef-4a159ffa3938",
      //                 "name": "白欣力"
      //               },
      //               {
      //                 "id": "63aed191-f093-4e9d-b4ef-4a159ffa39381",
      //                 "name": "白欣力"
      //               },
      //               {
      //                 "id": "d56402a2-9c9a-4674-a682-e4086e884ac1",
      //                 "name": "董鑫龙"
      //               },
      //               {
      //                 "id": "8218a663-e9a6-43d5-a0f1-d68a5509e366",
      //                 "name": "赵紫文"
      //               }
      //             ],
      //             "abstract": false,
      //             "labelKey": "name",
      //             "multiply": false,
      //             "readOnly": false,
      //             "required": false,
      //             "valueKey": "id",
      //             "enableScan": false,
      //             "validation": null,
      //             "enablePrint": true,
      //             "textForSuffix": "",
      //             "enableSuffixText": false
      //           },
      //           "title": "实验参与人",
      //           "valueType": "String"
      //         },
      //         {
      //           "id": "start_time",
      //           "key": "start_time",
      //           "icon": "iconamoon:edit",
      //           "name": "DateTime",
      //           "type": "DateTime",
      //           "alias": "开始时间",
      //           "props": {
      //             "hidden": false,
      //             "abstract": false,
      //             "readOnly": false,
      //             "required": false,
      //             "enableScan": false,
      //             "validation": null,
      //             "enablePrint": true,
      //             "enableTimePicker": false
      //           },
      //           "title": "开始时间",
      //           "valueType": "String"
      //         },
      //         {
      //           "id": "end_time",
      //           "key": "end_time",
      //           "icon": "iconamoon:edit",
      //           "name": "DateTime",
      //           "type": "DateTime",
      //           "alias": "结束时间",
      //           "props": {
      //             "hidden": false,
      //             "abstract": false,
      //             "readOnly": false,
      //             "required": false,
      //             "enableScan": false,
      //             "validation": null,
      //             "enablePrint": true,
      //             "enableTimePicker": false
      //           },
      //           "title": "结束时间",
      //           "valueType": "String"
      //         }
      //       ],
      //       "formConfig": {
      //         "colon": true,
      //         "rules": {
      //           "name": [
      //             {
      //               "type": "error",
      //               "message": "必填",
      //               "required": true
      //             },
      //             {
      //               "min": 2,
      //               "type": "error",
      //               "message": "至少需要两个字",
      //               "trigger": "blur"
      //             }
      //           ],
      //           "description": [
      //             {
      //               "type": "error",
      //               "message": "必填",
      //               "required": true
      //             },
      //             {
      //               "min": 12,
      //               "type": "error",
      //               "message": "至少需要11两个字",
      //               "trigger": "blur"
      //             }
      //           ]
      //         },
      //         "layout": "vertical",
      //         "ruleJs": "//formData: 表单数据  formMap: 表单字段id -> 字段json配置\r\nfunction doChange(formData, formMap){\r\n\t\r\n}",
      //         "columns": 2,
      //         "labelPos": "left",
      //         "ruleType": "SIMPLE",
      //         "labelWidth": "80px",
      //         "showSubmitBtn": false
      //       }
      //     },
      //     "formData": {
      //       "sn": "dw5456546",
      //       "title": "JL11271610",
      //       "end_time": "2024-11-30 00:00:00",
      //       "start_time": "2024-11-22 00:00:00",
      //       "experimenter": "d56402a2-9c9a-4674-a682-e4086e884ac1"
      //     },
      //     "isChanged": false,
      //     "updateTime": ""
      //   }
      // },
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
                "text": "试验目的：",
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
                "text": "目的asdddddddddddddddddddddddddddddd",
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
                "text": "sadsadadsadsad",
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
                "text": "dsadsadsadsadsadsd",
                "type": "text"
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
        "type": "heading",
        "attrs": {
          "id": "uymrqs",
          "level": 1,
          "indent": null,
          "margin": {},
          "textAlign": "left",
          "lineHeight": 1.5,
          "data-toc-id": "uymrqs"
        },
        "content": [
          {
            "text": "原材料：",
            "type": "text"
          }
        ]
      },
      {
        "type": "raw_material_table",
        "attrs": {
          "id": "26f11180-12d1-40d4-be5a-503a1b76327c",
          "updateTime": "2024-12-09 18:53:43",
          "key": "raw_material_table20241209185335",
          "name": "9786db35-3ced-4b5f-9d7b-ca17237c1c79",
          "isChanged": false,
          "change_log": {
            "change_log": "d63bd5ee-c0b6-48d1-90af-a52a54a26b3b"
          },
          "is_integration": true,
          "table_data": [
            {
              "id": "098973f9-a550-4220-88bc-18af6bc89996",
              "experiment_material": "a12ca520-d4d0-41e3-a2bf-ba6a3daeb70c",
              "experiment_material_name": "YCL12021526",
              "description": null,
              "experiment_material_state": "",
              "change_log": "d63bd5ee-c0b6-48d1-90af-a52a54a26b3b",
              "experiment_material_sn": "SN-1733124379373",
              "experiment_material_batch": "BT-1733124379373",
              "experiment_material_price": "23.00",
              "experiment_material_supplier": "大锅饭的师傅"
            },
            {
              "id": "8ae07816-fd7b-40df-8c72-d539f2db13e9",
              "experiment_material": "681e59cd-23b1-48c1-bd68-d3d257cfe487",
              "experiment_material_name": "YCL12021527",
              "description": null,
              "experiment_material_state": "",
              "change_log": "d63bd5ee-c0b6-48d1-90af-a52a54a26b3b",
              "experiment_material_sn": "SN-1733124429469",
              "experiment_material_batch": "BT-1733124429469",
              "experiment_material_price": "32.00",
              "experiment_material_supplier": "个的风格大方"
            },
            {
              "id": "adba60a6-d2a2-4938-bac6-3d274089a4a2",
              "experiment_material": "c5da9760-00dc-43d5-850d-76ef71919e62",
              "experiment_material_name": "YCL12021527",
              "description": null,
              "experiment_material_state": "",
              "change_log": "d63bd5ee-c0b6-48d1-90af-a52a54a26b3b",
              "experiment_material_sn": "SN-1733290926736",
              "experiment_material_batch": "BT-1733290926737",
              "experiment_material_price": "32.00",
              "experiment_material_supplier": "个的风格大方"
            }
          ],
          "title": "原材料202412091853"
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
        "type": "heading",
        "attrs": {
          "id": "qbi2pk",
          "level": 1,
          "indent": null,
          "margin": {},
          "textAlign": "left",
          "lineHeight": 1.5,
          "data-toc-id": "qbi2pk"
        },
        "content": [
          {
            "text": "g工艺：",
            "type": "text"
          }
        ]
      },
      {
        "type": "technology_table",
        "attrs": {
          "id": "dfdb602b-11a2-4346-887f-ff872325b52e",
          "updateTime": "2024-12-09 21:24:27",
          "key": "technology_table20241209194406",
          "name": "b98cb4b4-5ab2-489d-bdfa-e0f27acf261f",
          "isChanged": false,
          "change_log": {
            "change_log": "b19e377f-b413-4ed5-bf90-69e600ef7ff2"
          },
          "is_integration": false,
          "table_data": [
            {
              "id": "955e6c3c-7bfa-443a-b740-25585e50c2fe",
              "name": "复旦复华",
              "description": "工艺描述冻干粉红色根据地好",
              "step_type": "processes",
              "sequence": 0,
              "duration": null,
              "key": "955e6c3c-7bfa-443a-b740-25585e50c2fe",
              "children": [
                {
                  "id": "e427df63-4ec8-4f15-9f5f-540e48eda549",
                  "attribute": 9,
                  "value": "233",
                  "attribute_type": "single",
                  "name": "额为了我",
                  "description": "操作1，很棒",
                  "step_type": "operation",
                  "duration": null,
                  "parent": "955e6c3c-7bfa-443a-b740-25585e50c2fe",
                  "props": {
                    "suffix": "kg",
                    "abstract": false,
                    "required": false,
                    "enableScan": false,
                    "enablePrint": true
                  },
                  "key": "quality-y1xv2dqu",
                  "type": "TextInput",
                  "unit": "kg",
                  "group": []
                },
                {
                  "id": "d4af5178-6c70-426e-b3b5-0086b1e484cf",
                  "attribute": 11,
                  "value": {
                    "quality": "12",
                    "xm_raw_material": [
                      "098973f9-a550-4220-88bc-18af6bc89996",
                      "8ae07816-fd7b-40df-8c72-d539f2db13e9"
                    ]
                  },
                  "attribute_type": "compound",
                  "name": "热二恶烷",
                  "description": "操作二加油",
                  "step_type": "operation",
                  "duration": null,
                  "parent": "955e6c3c-7bfa-443a-b740-25585e50c2fe",
                  "props": {},
                  "key": "Raw_material_weighing-ncnu7j8c",
                  "type": "",
                  "unit": null,
                  "group": [
                    {
                      "id": 8,
                      "name": "原材料",
                      "type": "VueContainer",
                      "props": {
                        "abstract": false,
                        "required": false,
                        "enableScan": false,
                        "enablePrint": true
                      },
                      "key": "xm_raw_material",
                      "value": null,
                      "unit": null,
                      "attribute_type": "single"
                    },
                    {
                      "id": 9,
                      "name": "质量",
                      "type": "TextInput",
                      "props": {
                        "suffix": "kg",
                        "abstract": false,
                        "required": false,
                        "enableScan": false,
                        "enablePrint": true
                      },
                      "key": "quality",
                      "value": null,
                      "unit": "kg",
                      "attribute_type": "single"
                    }
                  ]
                }
              ]
            },
            {
              "id": "ad868b21-6cdf-4bb1-ad39-f639f1a797cf",
              "name": "地方撒还打算",
              "description": "工艺还记得施工方电饭锅和",
              "step_type": "processes",
              "sequence": 1,
              "duration": null,
              "key": "ad868b21-6cdf-4bb1-ad39-f639f1a797cf",
              "children": [
                {
                  "id": "5de8a79f-1444-4f78-b96c-b78cc9799762",
                  "attribute": 8,
                  "value": "",
                  "attribute_type": "single",
                  "name": "原材料",
                  "description": "操作原材料活动结束后好",
                  "step_type": "operation",
                  "duration": null,
                  "parent": "ad868b21-6cdf-4bb1-ad39-f639f1a797cf",
                  "props": {
                    "abstract": false,
                    "required": false,
                    "enableScan": false,
                    "enablePrint": true
                  },
                  "key": "xm_raw_material-qy8rcqui",
                  "type": "VueContainer",
                  "unit": null,
                  "group": []
                },
                {
                  "id": "1f64b23b-72c9-45be-8a23-9f2ccf2ef734",
                  "attribute": 9,
                  "value": "34",
                  "attribute_type": "single",
                  "name": "质量",
                  "description": "操作指令质量客户端框架设计",
                  "step_type": "operation",
                  "duration": null,
                  "parent": "ad868b21-6cdf-4bb1-ad39-f639f1a797cf",
                  "props": {
                    "suffix": "kg",
                    "abstract": false,
                    "required": false,
                    "enableScan": false,
                    "enablePrint": true
                  },
                  "key": "quality-ffomlxv0",
                  "type": "TextInput",
                  "unit": "kg",
                  "group": []
                }
              ]
            }
          ],
          "title": "工艺202412091944"
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
        "type": "sample_table",
        "attrs": {
          "id": "57a48f7b-5f54-4608-80b3-b7d95beff945",
          "updateTime": "",
          "key": "sample_table20241209201827",
          "name": "71795720-f249-492c-90a9-f8e65ec16e48",
          "isChanged": false,
          "group": "3d2f2bde-492b-49b7-9984-eeecdee7706d",
          "table_data": [
            {
              "id": "e3fc7ca6-04bd-471c-867b-f156aa062877",
              "modifier_name": "赵紫文",
              "dept_belong_id": null,
              "creator_name": "赵紫文",
              "create_datetime": "2024-12-09 20:18:25",
              "update_datetime": "2024-12-09 20:18:25",
              "param": [
                {
                  "id": "cc7c14ca-9765-417a-a70d-441e7a9c6368",
                  "value": {
                    "quality": "36.0",
                    "xm_raw_material": [
                      "098973f9-a550-4220-88bc-18af6bc89996",
                      "8ae07816-fd7b-40df-8c72-d539f2db13e9"
                    ]
                  },
                  "step_attribute_id": "328dd3d2-2330-4baf-a424-40e11fb43fb1",
                  "step_attribute_name": "热二恶烷",
                  "step_attribute_value": "{\"quality\":\"12\"}",
                  "step_attribute_attribute_type": "compound"
                },
                {
                  "id": "e17ee124-b187-4300-afd8-bc9ba39b7d94",
                  "value": "257.0",
                  "step_attribute_id": "821445fd-9cfc-4d9e-a869-3b0a243c601c",
                  "step_attribute_name": "额为了我",
                  "step_attribute_value": "233",
                  "step_attribute_attribute_type": "single"
                }
              ],
              "description": null,
              "creator": "63aed191-f093-4e9d-b4ef-4a159ffa3938",
              "modifier": "63aed191-f093-4e9d-b4ef-4a159ffa3938",
              "name": "样品-20241209201824",
              "sn": "S2024120941",
              "batch": "2024120941",
              "count": 1,
              "group": "3d2f2bde-492b-49b7-9984-eeecdee7706d",
              "experiment_theme": "27cb4fd5-7c15-43e3-a240-9ae2950ee85d",
              "record": "90eff14c-9327-4745-8302-729a2ed3398b"
            },
            {
              "id": "4240cad1-2ae8-4536-b927-143340a96514",
              "modifier_name": "赵紫文",
              "dept_belong_id": null,
              "creator_name": "赵紫文",
              "create_datetime": "2024-12-09 20:18:25",
              "update_datetime": "2024-12-09 20:18:25",
              "param": [
                {
                  "id": "0406f036-2512-4ea9-bdd9-249b1cb83323",
                  "value": "245.0",
                  "step_attribute_id": "821445fd-9cfc-4d9e-a869-3b0a243c601c",
                  "step_attribute_name": "额为了我",
                  "step_attribute_value": "233",
                  "step_attribute_attribute_type": "single"
                },
                {
                  "id": "65bc6372-10c8-4c1f-8712-075b5cf2aa60",
                  "value": {
                    "quality": "24.0",
                    "xm_raw_material": [
                      "098973f9-a550-4220-88bc-18af6bc89996",
                      "8ae07816-fd7b-40df-8c72-d539f2db13e9"
                    ]
                  },
                  "step_attribute_id": "328dd3d2-2330-4baf-a424-40e11fb43fb1",
                  "step_attribute_name": "热二恶烷",
                  "step_attribute_value": "{\"quality\":\"12\"}",
                  "step_attribute_attribute_type": "compound"
                }
              ],
              "description": null,
              "creator": "63aed191-f093-4e9d-b4ef-4a159ffa3938",
              "modifier": "63aed191-f093-4e9d-b4ef-4a159ffa3938",
              "name": "样品-20241209201824",
              "sn": "S2024120940",
              "batch": "2024120940",
              "count": 1,
              "group": "3d2f2bde-492b-49b7-9984-eeecdee7706d",
              "experiment_theme": "27cb4fd5-7c15-43e3-a240-9ae2950ee85d",
              "record": "90eff14c-9327-4745-8302-729a2ed3398b"
            },
            {
              "id": "b977ff1c-bb59-43d2-b84a-f544e8d0995a",
              "modifier_name": "赵紫文",
              "dept_belong_id": null,
              "creator_name": "赵紫文",
              "create_datetime": "2024-12-09 20:18:25",
              "update_datetime": "2024-12-09 20:18:25",
              "param": [
                {
                  "id": "4856d936-175f-4e73-8cad-9bcca2509fee",
                  "value": "233.0",
                  "step_attribute_id": "821445fd-9cfc-4d9e-a869-3b0a243c601c",
                  "step_attribute_name": "额为了我",
                  "step_attribute_value": "233",
                  "step_attribute_attribute_type": "single"
                },
                {
                  "id": "5bdc30f0-ee10-4344-aa0f-da53f37d83c3",
                  "value": {
                    "quality": "12.0",
                    "xm_raw_material": [
                      "098973f9-a550-4220-88bc-18af6bc89996",
                      "8ae07816-fd7b-40df-8c72-d539f2db13e9"
                    ]
                  },
                  "step_attribute_id": "328dd3d2-2330-4baf-a424-40e11fb43fb1",
                  "step_attribute_name": "热二恶烷",
                  "step_attribute_value": "{\"quality\":\"12\"}",
                  "step_attribute_attribute_type": "compound"
                }
              ],
              "description": null,
              "creator": "63aed191-f093-4e9d-b4ef-4a159ffa3938",
              "modifier": "63aed191-f093-4e9d-b4ef-4a159ffa3938",
              "name": "样品-20241209201824",
              "sn": "S2024120939",
              "batch": "2024120939",
              "count": 1,
              "group": "3d2f2bde-492b-49b7-9984-eeecdee7706d",
              "experiment_theme": "27cb4fd5-7c15-43e3-a240-9ae2950ee85d",
              "record": "90eff14c-9327-4745-8302-729a2ed3398b"
            }
          ],
          "designParams": [
            {
              "id": "821445fd-9cfc-4d9e-a869-3b0a243c601c",
              "attribute": 9,
              "value": "233",
              "attribute_type": "single",
              "name": "额为了我",
              "description": "",
              "step_type": "operation",
              "duration": null,
              "parent": "ba1d0964-0d5f-4e52-b995-f26674f491d4",
              "props": {
                "suffix": "kg",
                "abstract": false,
                "required": false,
                "enableScan": false,
                "enablePrint": true
              },
              "key": "quality-y1xv2dqu",
              "type": "TextInput",
              "unit": "kg",
              "group": [],
              "raw_material": "d63bd5ee-c0b6-48d1-90af-a52a54a26b3b",
              "technology": "736cfefe-d514-4602-acf7-dae524c63530",
              "step": "12",
              "check": true
            },
            {
              "id": "328dd3d2-2330-4baf-a424-40e11fb43fb1",
              "attribute": 11,
              "value": {
                "quality": "12",
                "xm_raw_material": [
                  "098973f9-a550-4220-88bc-18af6bc89996",
                  "8ae07816-fd7b-40df-8c72-d539f2db13e9"
                ]
              },
              "attribute_type": "compound",
              "name": "热二恶烷",
              "description": "",
              "step_type": "operation",
              "duration": null,
              "parent": "ba1d0964-0d5f-4e52-b995-f26674f491d4",
              "props": {},
              "key": "Raw_material_weighing-ncnu7j8c",
              "type": "",
              "unit": null,
              "group": [
                {
                  "id": 8,
                  "name": "原材料",
                  "type": "SelectPlus",
                  "props": {
                    "abstract": false,
                    "required": false,
                    "enableScan": false,
                    "enablePrint": true,
                    "labelKey": "name",
                    "valueKey": "id",
                    "options": [
                      {
                        "id": "098973f9-a550-4220-88bc-18af6bc89996",
                        "experiment_material": "a12ca520-d4d0-41e3-a2bf-ba6a3daeb70c",
                        "experiment_material_name": "YCL12021526",
                        "description": null,
                        "experiment_material_state": "",
                        "change_log": "d63bd5ee-c0b6-48d1-90af-a52a54a26b3b",
                        "experiment_material_sn": "SN-1733124379373",
                        "experiment_material_batch": "BT-1733124379373",
                        "experiment_material_price": "23.00",
                        "experiment_material_supplier": "大锅饭的师傅",
                        "name": "YCL12021526/SN-1733124379373"
                      },
                      {
                        "id": "8ae07816-fd7b-40df-8c72-d539f2db13e9",
                        "experiment_material": "681e59cd-23b1-48c1-bd68-d3d257cfe487",
                        "experiment_material_name": "YCL12021527",
                        "description": null,
                        "experiment_material_state": "",
                        "change_log": "d63bd5ee-c0b6-48d1-90af-a52a54a26b3b",
                        "experiment_material_sn": "SN-1733124429469",
                        "experiment_material_batch": "BT-1733124429469",
                        "experiment_material_price": "32.00",
                        "experiment_material_supplier": "个的风格大方",
                        "name": "YCL12021527/SN-1733124429469"
                      },
                      {
                        "id": "adba60a6-d2a2-4938-bac6-3d274089a4a2",
                        "experiment_material": "c5da9760-00dc-43d5-850d-76ef71919e62",
                        "experiment_material_name": "YCL12021527",
                        "description": null,
                        "experiment_material_state": "",
                        "change_log": "d63bd5ee-c0b6-48d1-90af-a52a54a26b3b",
                        "experiment_material_sn": "SN-1733290926736",
                        "experiment_material_batch": "BT-1733290926737",
                        "experiment_material_price": "32.00",
                        "experiment_material_supplier": "个的风格大方",
                        "name": "YCL12021527/SN-1733290926736"
                      }
                    ]
                  },
                  "key": "xm_raw_material",
                  "value": 8,
                  "unit": null,
                  "attribute_type": "single",
                  "step": "",
                  "check": true,
                  "label": "原材料"
                },
                {
                  "id": 9,
                  "name": "质量",
                  "type": "TextInput",
                  "props": {
                    "suffix": "kg",
                    "abstract": false,
                    "required": false,
                    "enableScan": false,
                    "enablePrint": true
                  },
                  "key": "quality",
                  "value": null,
                  "unit": "kg",
                  "attribute_type": "single"
                }
              ],
              "raw_material": "d63bd5ee-c0b6-48d1-90af-a52a54a26b3b",
              "technology": "736cfefe-d514-4602-acf7-dae524c63530",
              "step": {
                "quality": "12"
              },
              "check": true
            }
          ],
          "title": "样品202412092018"
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
        }
      },
    ]
  }
  editorRef.editorInstance?.commands.setContent(jsonContent)

  const contentD = [
    {
        "type": "xmForm",
        "attrs": {
          "id": "b6be422d-defc-4b0f-b490-a321cb3c7aae",
          "key": "baseInfo",
          "name": "82177d83-e226-4205-922f-659506c8a4a7",
          "config": {
            "formItems": [
              {
                "id": "sn",
                "key": "sn",
                "icon": "iconamoon:edit",
                "name": "TextInput",
                "type": "TextInput",
                "alias": "实验编号",
                "props": {
                  "hidden": false,
                  "abstract": false,
                  "readOnly": false,
                  "required": true,
                  "enableScan": false,
                  "validation": null,
                  "enablePrint": true,
                  "textForSuffix": "",
                  "enableSuffixText": false
                },
                "title": "实验编号",
                "valueType": "String"
              },
              {
                "id": "experimenter",
                "key": "experimenter",
                "icon": "iconamoon:edit",
                "name": "UserPicker",
                "type": "UserPicker",
                "alias": "实验参与人",
                "props": {
                  "hidden": false,
                  "remote": true,
                  "options": [
                    {
                      "id": "63aed191-f093-4e9d-b4ef-4a159ffa3938",
                      "name": "白欣力"
                    },
                    {
                      "id": "63aed191-f093-4e9d-b4ef-4a159ffa39381",
                      "name": "白欣力"
                    },
                    {
                      "id": "d56402a2-9c9a-4674-a682-e4086e884ac1",
                      "name": "董鑫龙"
                    },
                    {
                      "id": "8218a663-e9a6-43d5-a0f1-d68a5509e366",
                      "name": "赵紫文"
                    }
                  ],
                  "abstract": false,
                  "labelKey": "name",
                  "multiply": false,
                  "readOnly": false,
                  "required": false,
                  "valueKey": "id",
                  "enableScan": false,
                  "validation": null,
                  "enablePrint": true,
                  "textForSuffix": "",
                  "enableSuffixText": false
                },
                "title": "实验参与人",
                "valueType": "String"
              },
              {
                "id": "start_time",
                "key": "start_time",
                "icon": "iconamoon:edit",
                "name": "DateTime",
                "type": "DateTime",
                "alias": "开始时间",
                "props": {
                  "hidden": false,
                  "abstract": false,
                  "readOnly": false,
                  "required": false,
                  "enableScan": false,
                  "validation": null,
                  "enablePrint": true,
                  "enableTimePicker": false
                },
                "title": "开始时间",
                "valueType": "String"
              },
              {
                "id": "end_time",
                "key": "end_time",
                "icon": "iconamoon:edit",
                "name": "DateTime",
                "type": "DateTime",
                "alias": "结束时间",
                "props": {
                  "hidden": false,
                  "abstract": false,
                  "readOnly": false,
                  "required": false,
                  "enableScan": false,
                  "validation": null,
                  "enablePrint": true,
                  "enableTimePicker": false
                },
                "title": "结束时间",
                "valueType": "String"
              }
            ],
            "formConfig": {
              "colon": true,
              "rules": {
                "name": [
                  {
                    "type": "error",
                    "message": "必填",
                    "required": true
                  },
                  {
                    "min": 2,
                    "type": "error",
                    "message": "至少需要两个字",
                    "trigger": "blur"
                  }
                ],
                "description": [
                  {
                    "type": "error",
                    "message": "必填",
                    "required": true
                  },
                  {
                    "min": 12,
                    "type": "error",
                    "message": "至少需要11两个字",
                    "trigger": "blur"
                  }
                ]
              },
              "layout": "vertical",
              "ruleJs": "//formData: 表单数据  formMap: 表单字段id -> 字段json配置\r\nfunction doChange(formData, formMap){\r\n\t\r\n}",
              "columns": 2,
              "labelPos": "left",
              "ruleType": "SIMPLE",
              "labelWidth": "80px",
              "showSubmitBtn": false
            }
          },
          "formData": {
            "sn": "dw5456546",
            "title": "JL11271610",
            "end_time": "2024-11-30 00:00:00",
            "start_time": "2024-11-22 00:00:00",
            "experimenter": "d56402a2-9c9a-4674-a682-e4086e884ac1"
          },
          "isChanged": false,
          "updateTime": ""
        }
      }
  ]

  // editorRef.editorInstance?.commands.setContent(contentD)

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
