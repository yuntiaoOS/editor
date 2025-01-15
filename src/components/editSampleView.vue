<template>
  <t-dialog
    v-model:visible="add_dialog_visible"
    header="新增" destroy-on-close
    width="70%" attach="body"
    :confirm-on-enter="true"
    :on-confirm="onSubmit"
  >
    <t-space direction="vertical">
      <div v-for="(formItem, indexF) in _designParams.formItems" :key="indexF">
        <t-divider align="left">{{formItem.title}}</t-divider>
        <div >
          <template v-for="(item, index) in formItem.formItems" :key="index">
            <FormDesignRender
              v-model="_designParams.formData[formItem.key][item.key]"
              v-model:formData="_designParams.formData[formItem.key]"
              style="overflow: auto;"
              :label="item.title"
              :mode=" 'RESP'"
              :config="item">
            </FormDesignRender>
          </template>
        </div>
      </div>
    </t-space>

  </t-dialog>

</template>

<script setup>
import { v4 as uuid } from 'uuid'
import { timeFormat } from '@/utils/time-ago'

const emits = defineEmits(['onSubmit','update:dialogVisible','update:designParams'])
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
const _designParams = computed({
  get: () => props.designParams,
  set: (val) => {
    emits('update:designParams', val);
  }
});
const xmformRef = ref();
const formData = ref({});



const onSubmit = () => {
  console.log('-------formData----------',_designParams.value, xmformRef.value,formData.value);
  // xmformRef.value.validate({ showErrorMessage: true }).then((validateResult) => {
  //   if (validateResult && Object.keys(validateResult).length) {
  //     const firstError = Object.values(validateResult)[0]?.[0]?.message;
  //     useMessage('warning',firstError)
  //   }else{
      add_dialog_visible.value = false;
      const newData = { ..._designParams.value.formData,id: uuid(), check: true };
      newData['name'] = `样品-${timeFormat(null,'yyyymmddhhMMss')}`
      emits('onSubmit', newData)
  //   }
  // })

}

const initial = ()=>{

}

onMounted(() => {
  initial()
})
</script>

<style>

</style>
