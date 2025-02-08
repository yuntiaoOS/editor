<template>
  <div class="item-parent" style="display: flex; align-items: flex-start">
    <FormDesignRender
      v-model="_value"
      v-model:formData="_unitFormData"
      :label="label"
      :mode="mode"
      :config="config"
      style="z-index: 0;"
    >
    </FormDesignRender>
    <div class="item-children" style="padding:2px;margin-left: -10px;margin-top: -1px;z-index: 1;background-color: #fdfdfd;"
      :style="{'margin-top': config.type === 'MaterialList' ? '-1px' : '-1px'}">
      <t-icon
        v-if="['NumberInput', 'TextInput','MaterialList'].includes(config.type)"
        name="add"
        title="插入"
        style="color:var(--td-brand-color);cursor: pointer;"
        @click="addAttributes"
      ></t-icon>
      <t-icon
        v-if="['NumberInput', 'TextInput','MaterialList'].includes(config.type) && props.config.props.orthogonal "
        name="close"
        title="删除"
        style="color:red;cursor: pointer;"
        @click="deleteAttributes"
      ></t-icon>
    </div>

  </div>
</template>

<script setup lang="jsx">
import { getFieldValue, getPenultimateLayerFieldValue } from '@/utils/index'

const emits = defineEmits([
  'update:modelValue',
  'change',
  'blur',
  'enter',
  'update:attributes',
])
const props = defineProps({
  modelValue: {
    type: [String, Number, Array, Object],
    default: undefined,
    required: true,
  },
  attributes: {
    type: Array,
    default: () => [],
  },
  mode: {
    type: String,
    default: 'RESP',
  },
  config: {
    type: Object,
    required: true,
    default: () => {},
  },
  label: {
    type: String,
    default: '',
  },
  valueKey: {
    type: String,
    default: '',
  },
  valueType: {
    type: String,
    default: 'MultiLevel', // MultiLevel 多级,SingleLevel 单级
  },
  itemIndex: {
    type: Number,
    default: 0,
  },
})
const _value = computed({
  get() {
    if (props.valueType === 'MultiLevel') {
      return getFieldValue(props.valueKey, props.modelValue)
    } else {
      return props.modelValue
    }
  },
  set(val) {
    let res = val
    if (props.valueType === 'MultiLevel') {
      res = { ...props.modelValue }
      setNestedValue(res, props.valueKey, val)
    }
    emits('update:modelValue', res)
    emits('change', res)
  },
})

const _attributes = computed({
  get() {
    return props.attributes
  },
  set(val) {
    emits('update:attributes', val)
  },
})

const _unitFormData = computed({
  get() {
    if (props.valueType === 'MultiLevel') {
      return getPenultimateLayerFieldValue(props.valueKey, props.modelValue)
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
  },
})

watch(
  () => _unitFormData.value,
  (val) => {
    if (typeof data === 'object' && data !== null && !Array.isArray(data)) {
      let key = props.valueKey.split('.')
      key.pop()
      key = key.join('.')
      setNestedValue(_value.value, key, val)
    }
  },
  { deep: true, immediate: true },
)

const selectLoading = ref(false)

const addAttributes = () => {
  // console.log('----addAttributes-----',props.config,props.modelValue)
  const res = { ...props.modelValue }
  const valKey = `${props.valueKey}/${_attributes.value.length}`
  const config = {
    ...props.config,
    props: {
      ...props.config.props,
      orthogonal: true,
    },
    key: `${props.config.key}/${_attributes.value.length}`,
    rowKey: `${props.config.rowKey}${_attributes.value.length}`,
  }
  setNestedValue(res, valKey, '')
  emits('update:modelValue', res)
  // console.log('----addAttributes--44---',res,valKey,config)
  // 是否将自身属性也变为正交数据？
  _attributes.value.splice(props.itemIndex, 1, {
    ...props.config,
    props: {
      ...props.config.props,
      orthogonal: true,
    },
  })
  _attributes.value.splice(props.itemIndex + 1, 0, config)
}

const deleteAttributes = () => {
  const rootKey = props.config?.key?.split('/')[0]; // 提取根 key
  const hasRootKey = _attributes.value.filter((ele) => ele.key.split('/')[0] === rootKey)
  if (hasRootKey.length === 2) {
    const keepItem = hasRootKey.find((ele) => ele.key !== props.config.key)
    const keepItemIndex = _attributes.value.findIndex((ele) => ele.key === keepItem.key)
    _attributes.value.splice(keepItemIndex, 1, {
      ...keepItem,
      props: {
        ...keepItem.props,
        orthogonal: false,
      },
    })
  } else if (hasRootKey.length === 1){
    return
  }

  _attributes.value.splice(props.itemIndex, 1)
}

const deleteFunc = (imgUrl) => {
  const index = _value.value.findIndex((ele) => ele.url === imgUrl.url)
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
  const keys = path.split('.') // 将路径拆分为数组
  let current = obj

  keys.forEach((key, index) => {
    if (index === keys.length - 1) {
      current[key] = value // 如果是最后一个键，直接赋值
    } else {
      current[key] = current[key] || {} // 如果不是最后一个键，创建空对象
      current = current[key] // 进入下一层
    }
  })
  return current
}

onMounted(async () => {})
</script>

<style lang="less" scoped>
.item-children {
  display: none;
  //display: flex;
}
.item-parent:hover .item-children {
  display: flex;
}
</style>
