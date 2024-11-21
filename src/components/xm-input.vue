<template>
  <div v-if="_config && _config[props.props.componentKey]">
    <template v-if="_config[props.props.componentKey] === 'TextareaInput'" >
      <t-textarea
        v-model="_value" autofocus :readonly="readonly"
        placeholder="请输入"
        name="textarea"
        :autosize="{ minRows: 3, maxRows: 5 }"
        @change="changeFunc"
      />
    </template>
    <template v-else-if="_config[props.props.componentKey] === 'NumberInput'" >
      <t-input-number 
        v-model="_value" autofocus :borderless="borderless"  :auto-width="autoWidth" theme="column" :readonly="readonly" 
        placeholder="请输入" @change="changeFunc"/>
    </template>
    <template v-else-if="_config[props.props.componentKey] === 'TimePicker'" >
      <t-time-picker v-model="_value" :borderless="borderless" autofocus :readonly="readonly" :auto-width="autoWidth"  placeholder="请输入" @change="changeFunc"/>
    </template>
    <template v-else-if="_config[props.props.componentKey] === 'DateTime'" >
      <t-date-picker v-model="_value" :borderless="borderless" autofocus :readonly="readonly" :auto-width="autoWidth"  enable-time-picker placeholder="请输入" @change="changeFunc"/>
    </template>
    <template v-else-if="_config[props.props.componentKey] === 'SelectPlusRadio'" >
      <t-select 
        v-model="_value" :borderless="borderless" autofocus :readonly="readonly" :auto-width="autoWidth"  placeholder="请选择"  style="width: 100%;" clearable
        :loading="selectLoading" filterable @focus="selectFocusMethod(_config)" @change="changeFunc">
        <t-option v-for="item in selectOptions" :key="item.value" :value="item.value" :label="item.label"></t-option>
      </t-select>
    </template>
    <template v-else-if="_config[props.props.componentKey] === 'SelectPlus'" >
      <t-select 
        v-model="_value" multiple :borderless="borderless" autofocus :readonly="readonly" :auto-width="autoWidth"  placeholder="请选择" style="width: 100%;" clearable
        :loading="selectLoading" filterable @focus="selectFocusMethod(_config)" @change="changeFunc">
        <t-option v-for="item in selectOptions" :key="item.value" :value="item.value" :label="item.label"></t-option>
      </t-select>
    </template>
    <template v-else-if="_config[props.props.componentKey] === 'Score'" >
      <t-rate v-model="_value" show-text :default-value="4" :disabled="readonly" @change="changeFunc"/>
    </template>
    <template v-else-if="_config[props.props.componentKey] === 'ImageUpload'" >
      <t-switch v-model="_value" :readonly="readonly" @change="changeFunc"/>
    </template>
    <template v-else-if="_config[props.props.componentKey] === 'UserPicker'" >
      <t-select 
        v-model="_value" :multiple="_config.props.multiple" :borderless="borderless" autofocus :readonly="readonly" :auto-width="autoWidth"  placeholder="请选择" style="width: 100%;" clearable
        :loading="selectLoading" filterable @focus="selectFocusMethod(_config)" @change="changeFunc">
        <t-option v-for="item in selectOptions" :key="item.value" :value="item" :label="item.label"></t-option>
      </t-select>
    </template>
    <template v-else-if="_config[props.props.componentKey] === 'VueContainer'" >

    </template>
    <template v-else >
      <t-input v-model="_value" autofocus :borderless="borderless" :readonly="readonly" :auto-width="autoWidth" placeholder="请输入" @change="changeFunc"/>
    </template>

  </div>
</template>

<script setup lang="jsx">
const emits = defineEmits(['update:modelValue', 'change'])
const props = defineProps({
  modelValue: {
    type: [String, Number, Array, Object],
    default: undefined,
    required: true,
  },
  readonly: {
    type: Boolean,
    default: false
  },
  config: {
    type: Object,
    required: true,
    default: () => ({
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
        "multiple": false,
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
    })
  },
  props: {
    type: Object,
    default: () => ({
      componentKey: 'type',
    })
  },
  borderless: {
    type: Boolean,
    default: true
  },
  autoWidth: {
    type: Boolean,
    default: false
  },
  onChange: {
    type: Function,
    default: () => {}
  }
})
 
const _value = ref()
if (props.modelValue) {
  _value.value = props.modelValue
} else {
  if (props.config[props.props.componentKey] === 'SelectPlusRadio') {
    _value.value = {}
  }else if (props.config[props.props.componentKey] === 'SelectPlus' || props.config[props.props.componentKey] === 'ImageUpload') {
    _value.value = []
  }else if (props.config[props.props.componentKey]=== 'Score') {
    _value.value = 0
  }else if (props.config[props.props.componentKey]=== 'UserPicker') {
    if (props.config.props.multiple) {
      _value.value = []
    }else{
      _value.value = {}
    }
  }else{
  _value.value = ''
  }
}

const selectOptions = ref([])

const _config = computed( () => props.config )

const selectLoading = ref(false)

const changeFunc = (val) => {
  emits('update:modelValue', val)
  emits('change', val)
  props.onChange(val)
}


const selectFocusMethod = async (formItem) => {
  selectLoading.value = true
  // 模拟请求，假设数据来自后台
  if (formItem.props.remote) {
    const res  = await formItem.props.remoteMethod()
    console.log('-------selectFocusMethod----------------',res)
    if (res.data.code === 2000) {
      formItem.props.options = res.data.data.map((item) => ({
        value: item[formItem.props.valueKey],
        label: item[formItem.props.labelKey],
      }))
    }
    _config.value = {...formItem}
    selectOptions.value = formItem.props.options
  }
  selectLoading.value = false
}

onMounted(() => {
  if (props.config[props.props.componentKey] === 'SelectPlusRadio' || props.config[props.props.componentKey] === 'SelectPlus') {
    if (!props.config.props.remote) {
      selectOptions.value = props.config.props.options.map((item) => ({
        value: item[props.config.props.valueKey],
        label: item[props.config.props.labelKey]
      }))
    }
  }
})

</script>

<style lang="less" scoped>

</style>