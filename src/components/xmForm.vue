<template>
  <t-form
    ref="formRef" :layout="_config.formConfig.layout"
    :colon="_config.formConfig.colon" :disabled="disabled"
    :label-align="_config.formConfig.labelPos"
    :label-width="_config.formConfig.labelWidth"
    :data="_formData"
    :rules="_config.formConfig.rules"
    :error-message="errorConfig === 'default' ? undefined : errorMessage"
    scroll-to-first-error="smooth"
    @reset="onReset"
    @submit="onSubmit"
  >
    <t-row :gutter="[16, 10]" justify="space-between">
      <t-col 
        v-for="formItem in _config.formItems "  :key="formItem.key"
        :xs="12" :sm="columns" :md="columns" :lg="columns" :xl="columns/2" 
        >
        <t-form-item 
          :name="formItem.key" 
          :label="formItem.title"
          :rules="formItem.rules" >
            <xm-input v-model="_formData[formItem.key]" :config="formItem" ></xm-input>
        </t-form-item>
      </t-col>
    </t-row>
    
    <t-form-item v-if="showSubmitBtn" label-width="0" style="margin-top: 8px;background-color: #fff;">
      <t-button theme="primary" type="submit" size="small">提交</t-button>
    </t-form-item>
  </t-form>
</template>
<script setup lang="ts">
const emits = defineEmits(['submit', 'reset', 'update:formData', 'update:config'])
const props = defineProps({
  config: {
    type: Object,
    default: () => ({
      "formItems": [
          {
              "id": "name",
              "key": "name",
              "icon": "iconamoon:edit",
              "name": "TextInput",
              "type": "TextInput",
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
                  "enableSuffixText": false
              },
              "title": "物料名称",
              "valueType": "String"
          },
          {
              "id": "description",
              "key": "description",
              "icon": "iconamoon:edit",
              "name": "TextInput",
              "type": "TextInput",
              "alias": "描述",
              "props": {
                  "hidden": false,
                  "abstract": false,
                  "readOnly": false,
                  "required": false,
                  "enableScan": false,
                  "validation": null,
                  "enablePrint": true,
                  "textForSuffix": "",
                  "enableSuffixText": false
              },
              "title": "描述",
              "valueType": "String"
          },
          {
            "id": "price",
            "key": "price",
            "icon": "iconamoon:edit",
            "name": "SelectPlus",
            "type": "SelectPlus",
            "alias": "价格",
            "props": {
              "hidden": false,
              "abstract": false,
              "readOnly": false,
              "required": false,
              "enableScan": false,
              "validation": null,
              "enablePrint": true,
              "valueKey": "value",
              "labelKey": "label",
              "options": [
                // 全选
                { label: 'tdesign-vue', value: 1 },
                { label: 'tdesign-react', value: 2 },
                { label: 'tdesign-miniprogram', value: 3 },
                { label: 'tdesign-angular', value: 4 },
                { label: 'tdesign-mobile-vue', value: 5 },
                { label: 'tdesign-mobile-react', value: 6 },
              ],
            },
            "title": "价格",
            "valueType": "Array",
          },
          {
            "id": "selectDynamic",
            "key": "selectDynamic",
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
              "remote": false,
              "options": [{ id: 11, name: '选项一1' }, { id: 22, name: '选项二2' }],
              "valueKey": "id",
              "labelKey": "name",
              "remoteMethod": () => {
                return new Promise((resolve) => {
                  setTimeout(() => {
                    resolve({
                      data: {
                        value: [
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
          },
      ],
      "formConfig": {
          "rules": {
            name: [
              { required: true, message: '必填', type: 'error' },
              { min: 2, message: '至少需要两个字', type: 'error', trigger: 'blur'},
            ],
            description: [
              { required: true, message: '必填', type: 'error' },
              { min: 12, message: '至少需要11两个字', type: 'error', trigger: 'blur'},
            ]
          },
          "ruleJs": "//formData: 表单数据  formMap: 表单字段id -> 字段json配置\r\nfunction doChange(formData, formMap){\r\n\t\r\n}",
          "labelPos": "left",
          "ruleType": "SIMPLE",
          "layout": "vertical",
          "columns": 2,
          "colon": true,
          "labelWidth": "80px",
          "showSubmitBtn": false,
      }
    }),
    required: true,
  },
  formData: {
    type: Object,
    default: () => ({}),
  },
  showSubmitBtn: {
    type: Boolean,
    default: true,
  },
  columns: {
    type: Number,
    default: 12,
  },
  onSubmit: {
    type: Function,
    default: () => {},
  },
  disabled: {
    type: Boolean,
    default: false,
  },

})
const errorMessage = {
  date: '${name}不正确',
  url: '${name}不正确',
  required: '请输入${name}',
  max: '${name}字符长度不能超过 ${validate} 个字符，一个中文等于两个字符',
  min: '${name}字符长度不能少于 ${validate} 个字符，一个中文等于两个字符',
  len: '${name}字符长度必须是 ${validate}',
  pattern: '${name}不正确',
  validator: '${name}有误',
};

const formRef = ref()

const _formData = computed({
  get: () => props.formData,
  set: (val:any) => {
    emits('update:formData', val)
  }
})

const _config = computed({
  get: () => props.config,
  set: (val:any) => {
    emits('update:config', val)
  }
})

defineExpose({
  formRef
})
</script>