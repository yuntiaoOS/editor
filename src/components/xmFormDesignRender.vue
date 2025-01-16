<template>
  <FormDesignRender
    v-model="_value"
    v-model:formData="_unitFormData"
    :label="label"
    :mode="mode"
    :config="config">
  </FormDesignRender>
</template>

<script setup lang="jsx">
import { getFieldValue, getPenultimateLayerFieldValue } from '@/utils/index'

const emits = defineEmits(['update:modelValue', 'change','blur','enter'])
const props = defineProps({
  modelValue: {
    type: [String, Number, Array, Object],
    default: undefined,
    required: true,
  },
  mode: {
    type: String,
    default: 'RESP'
  },
  config: {
    type: Object,
    required: true,
    default: () => {}
  },
  label: {
    type: String,
    default: ''
  },
  valueKey: {
    type: String,
    default: ''
  },
  valueType: {
    type: String,
    default: 'MultiLevel'  // MultiLevel 多级,SingleLevel 单级
  }
})
const _value = computed({
  get() {
    if (props.valueType === 'MultiLevel') {
      const value = getFieldValue( props.valueKey ,props.modelValue)
      //
      return value
    } else {
      return props.modelValue
    }
  },
  set(val) {
    let res = val
    if (props.valueType === 'MultiLevel') {
      res = {...props.modelValue}
      setNestedValue(res, props.valueKey, val)
    }
    emits('update:modelValue', res)
    emits('change', res)
  }
})

const _unitFormData = computed({
  get() {
    if (props.valueType === 'MultiLevel') {
      const value = getPenultimateLayerFieldValue( props.valueKey ,props.modelValue)
      return value
    } else {
      return props.modelValue
    }
  },
  set(val) {

    // let res = val
    // if (props.valueType === 'MultiLevel') {
    //   res = {...props.modelValue}
    //   let key = props.valueKey.split('.')
    //   key.pop()
    //   key = key.join('.')
    //   setNestedValue(res, key, val)
    //
    // }else {
    //   _value.value = val
    // }
    // emits('update:modelValue', val)
    // emits('change', val)
  }
})

watch(() => _unitFormData.value, (val) => {

  if ( typeof data === 'object' && data !== null && !Array.isArray(data) ){
    let key = props.valueKey.split('.')
    key.pop()
    key = key.join('.')
    setNestedValue(_value.value, key, val)
  }

}, { deep: true ,immediate: true})

const selectLoading = ref(false)

const deleteFunc = (imgUrl) => {
  const index = _value.value.findIndex(ele => ele.url === imgUrl.url)
  _value.value.splice(index, 1)
  changeFunc(_value.value)
}

const changeFunc = (val) => {
  emits('update:modelValue', val)
  emits('change', val)
  props.onChange(val)
}

const blurFunc = (val) => {
  // emits('update:modelValue', val)
  emits('blur', val)
}

function setNestedValue(obj, path, value) {
  const keys = path.split('.'); // 将路径拆分为数组
  let current = obj;

  keys.forEach((key, index) => {
    if (index === keys.length - 1) {
      current[key] = value; // 如果是最后一个键，直接赋值
    } else {
      current[key] = current[key] || {}; // 如果不是最后一个键，创建空对象
      current = current[key]; // 进入下一层
    }
  });
  return current;
}

onMounted( async () => {


})

</script>

<style lang="less" scoped>

</style>
