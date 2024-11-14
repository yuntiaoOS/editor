<template>
  <div v-if="_config && _config[props.props.componentKey]">
    <template v-if="_config[props.props.componentKey] === 'TextareaInput'" >
      <t-textarea
        v-model="_value"
        placeholder="请输入"
        name="textarea"
        :autosize="{ minRows: 3, maxRows: 5 }"
      />
    </template>
    <template v-else-if="_config[props.props.componentKey] === 'NumberInput'" >
      <t-input-number v-model="_value" :borderless="borderless"  :auto-width="autoWidth" theme="column" placeholder="请输入"/>
    </template>
    <template v-else-if="_config[props.props.componentKey] === 'TimePicker'" >
      <t-time-picker v-model="_value" :borderless="borderless"  :auto-width="autoWidth"  placeholder="请输入"/>
    </template>
    <template v-else-if="_config[props.props.componentKey] === 'DateTime'" >
      <t-date-picker v-model="_value" :borderless="borderless"  :auto-width="autoWidth"  enable-time-picker placeholder="请输入" />
    </template>
    <template v-else-if="_config[props.props.componentKey] === 'SelectPlusRadio'" >
      <t-select 
        v-model="_value" :borderless="borderless"  :auto-width="autoWidth"  placeholder="请选择"  style="width: 100%;" clearable
        :loading="selectLoading" filterable @focus="selectFocusMethod(_config)">
        <t-option v-for="item in selectOptions" :key="item.value" :value="item.value" :label="item.label"></t-option>
      </t-select>
    </template>
    <template v-else-if="_config[props.props.componentKey] === 'SelectPlus'" >
      <t-select 
        v-model="_value" multiple :borderless="borderless"  :auto-width="autoWidth"  placeholder="请选择" style="width: 100%;" clearable
        :loading="selectLoading" filterable @focus="selectFocusMethod(_config)">
        <t-option v-for="item in selectOptions" :key="item.value" :value="item.value" :label="item.label"></t-option>
      </t-select>
    </template>
    <template v-else-if="_config[props.props.componentKey] === 'Score'" >
      <t-rate v-model="_value" show-text :default-value="4" />
    </template>
    <template v-else-if="_config[props.props.componentKey] === 'VueContainer'" >

    </template>
    <template v-else >
      <t-input v-model="_value" :borderless="borderless" :auto-width="autoWidth" placeholder="请输入"/>
    </template>

  </div>
</template>

<script setup lang="jsx">
const emits = defineEmits(['update:modelValue'])
const props = defineProps({
  modelValue: {
    type: [String, Array, Object],
    default: undefined,
    required: true,
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
  }
})
 
const _value = computed({
  get: () => {
    const value = props.modelValue
    if (value) {
      return value
    }else{
      if (props.config[props.props.componentKey] === 'SelectPlusRadio') {
        return {}
      }else if (props.config[props.props.componentKey] === 'SelectPlus') {
        return []
      }else if (props.config[props.props.componentKey]=== 'Score') {
        return 0
      }else{
        return ''
      }
    }
  },
  set: (val) => {
    emits('update:modelValue', val)
  }
}) 

const selectOptions = ref([])

const _config = computed( () => props.config )

const selectLoading = ref(false)


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