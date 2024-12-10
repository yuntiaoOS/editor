<template>
  <t-dialog 
    v-model:visible="add_dialog_visible"
    header="新增" destroy-on-close
    width="70%" attach="body"
    :confirm-on-enter="true"
    :on-confirm="onSubmit"
  >
    <t-form
      ref="xmformRef" 
      label-align="left"
      label-width="120px"
      :data="formData" colon
      :rules="form_config.rules"
      :error-message="errorConfig === 'default' ? undefined : errorMessage"
      scroll-to-first-error="smooth"
      @submit="onSubmit"
    >
      <div>
        <t-row :gutter="[5, 5]" justify="space-between">
          <t-col 
            v-for="formItem in form_config.formItems "  :key="formItem.key"
            :xs="12" :sm="12" :md="12" :lg="12" :xl="12" 
            >
            <t-form-item 
              :name="formItem.key" 
              :label="formItem.title?formItem.title:formItem.name"
              :rules="formItem.rules" >
                <div v-if="formItem.attribute_type === 'single'" >
                  <xm-input v-model="formData[formItem.key]" :config="formItem" ></xm-input>
                </div>
                <div v-else>
                  <xm-form ref="xmformSubRef" v-model:form-data="formData[formItem.key]" :config="getConfig('form',formItem)" :show-submit-btn="false" />
                </div>
            </t-form-item>
          </t-col>
        </t-row>
      </div>
    </t-form>
  </t-dialog>
  
</template>

<script setup>
import { v4 as uuid } from 'uuid'
import { timeFormat } from '@/utils/time-ago'

const emits = defineEmits(['onSubmit','update:dialogVisible'])
const props = defineProps({
  dialogVisible: {
    type: Boolean,
    default: false,
  },
  designParams: {
    type: Object,
    default: () => ({})
  },
  type: {
    type: String,
    default: 'add',
  },

});


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
const add_dialog_visible = computed({
  get: () => props.dialogVisible,
  set: (val) => {
    emits('update:dialogVisible', val);
  }
});
const _designParams = computed(() => {
  if (props.designParams) {
    return [...props.designParams];
  }else {
    return [];
  }
});
const xmformRef = ref();
const formData = ref({});
const form_config = ref({
  formItems: [],
  formConfig: {
    rules: {
      name: [
        { required: true, message: '必填', type: 'error', trigger: 'blur' },
      ],
      description: [
        { required: false, message: '必填', type: 'error', trigger: ['blur'] },
      ]
    },
    ruleJs: "//formData: 表单数据  formMap: 表单字段id -> 字段json配置\r\nfunction doChange(formData, formMap){\r\n\t\r\n}",
    labelPos: "left",
    ruleType: "SIMPLE",
    layout: "vertical",
    columns: 1,
    colon: true,
    labelWidth: "80px",
    showSubmitBtn: false,
  }
});

const getConfig = (type,row,rowType) => {
  const config = {
    formItems: [],
    formConfig: {
      rules: {
        name: [
          { required: true, message: '必填', type: 'error', trigger: 'blur' },
        ],
        description: [
          { required: false, message: '必填', type: 'error', trigger: ['blur'] },
        ]
      },
      ruleJs: "//formData: 表单数据  formMap: 表单字段id -> 字段json配置\r\nfunction doChange(formData, formMap){\r\n\t\r\n}",
      labelPos: "left",
      ruleType: "SIMPLE",
      layout: "vertical",
      columns: 1,
      colon: true,
      labelWidth: "80px",
      showSubmitBtn: false,
    }
  }
  if (row.attribute_type === 'compound' && row.group) {
    if (rowType === 'step') {
      config.formItems = row.group.filter(ele=>!ele.key.includes(XM_raw_material_key))
    }else{
      config.formItems = row.group
    }
  }

  return config
}

const onSubmit = () => {
  console.log('-------formData----------',_designParams.value, xmformRef.value,formData.value);
  xmformRef.value.validate({ showErrorMessage: true }).then((validateResult) => {
    if (validateResult && Object.keys(validateResult).length) {
      const firstError = Object.values(validateResult)[0]?.[0]?.message;
      useMessage('warning',firstError)
    }else{
      add_dialog_visible.value = false;
      const newData = { ...formData.value,id: uuid(), check: true };
      newData['name'] = `样品-${timeFormat(null,'yyyymmddhhMMss')}`
      _designParams.value.forEach((item) => {
        if ( !item.key.includes(XM_raw_material_key) ){
          newData[`${item.key }_id`] = item.id
        }else{
          newData[`${item.key }_id`] = item.id
          newData['name'] = item.props.options?.filter(eleO => item.step.includes(eleO.id))?.map(eleO => eleO.name)?.join("/") 
        }
        newData['raw_material'] = item.raw_material 
        newData['technology'] = item.technology 
        console.log('-------316----obj----------',newData)
      })
      emits('onSubmit', newData)
    }
  })

}

const initial = ()=>{
  formData.value = {}
  form_config.value.formItems = _designParams.value.map((item) => { 
    const obj = {
      ...item, 
      title: item.name,
      [item.key]:item.value ,
    }
    return obj
  });
  console.log('-------onAdd-----275-----', form_config.value,_designParams.value);
  _designParams.value.forEach((designItem) =>{
    form_config.value.formConfig.rules[designItem.key] = [
      { required: true, message: '必填', type: 'error', trigger: ['blur','change'] },
    ]
    if (designItem.attribute_type === 'compound' && designItem.group) {
      formData.value[designItem.key] = designItem.value ?{ ...designItem.value} : {}
    }else{
      formData.value[designItem.key] =  designItem.value ? designItem.value : ''
    }

  })
  console.log('-------onAdd-----275-----', form_config.value,formData.value);

}

onMounted(() => {
  initial()
})
</script>

<style>

</style>