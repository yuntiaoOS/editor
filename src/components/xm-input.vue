<template>
  <div v-if="_config && _config[props.props.componentKey]">
    <template v-if="_config[props.props.componentKey] === 'TextareaInput'" >
      <t-textarea
        v-model="_value" autofocus :readonly="readonly"
        placeholder="请输入"
        name="textarea"
        :autosize="{ minRows: 3, maxRows: 5 }"
        @change="changeFunc"
        @blur="blurFunc"
      />
    </template>
    <template v-else-if="_config[props.props.componentKey] === 'NumberInput'" >
      <t-input-number
        v-model="_value" autofocus :borderless="borderless"  :auto-width="autoWidth" theme="column" :readonly="readonly"
        placeholder="请输入" @change="changeFunc"/>
    </template>
    <template v-else-if="_config[props.props.componentKey] === 'TimePicker'" >
      <t-time-picker v-model="_value" :borderless="borderless" autofocus :readonly="readonly" :auto-width="autoWidth"  placeholder="请输入" @change="changeFunc" @blur="blurFunc"/>
    </template>
    <template v-else-if="_config[props.props.componentKey] === 'DateTime'" >
      <t-date-picker v-model="_value" :borderless="borderless" autofocus :readonly="readonly" :auto-width="autoWidth"  enable-time-picker placeholder="请输入" @change="changeFunc" @blur="blurFunc"/>
    </template>
    <template v-else-if="_config[props.props.componentKey] === 'SelectPlusRadio'" >
      <t-select
        v-model="_value" :borderless="borderless" autofocus :readonly="readonly" :auto-width="autoWidth"  placeholder="请选择"  style="width: 100%;" clearable
        :loading="selectLoading" filterable @focus="selectFocusMethod(_config)" @change="changeFunc" @blur="blurFunc">
        <t-option v-for="item in selectOptions" :key="item[_config.props.valueKey]" :value="item[_config.props.valueKey]" :label="item[_config.props.labelKey]"></t-option>
      </t-select>
    </template>
    <template v-else-if="_config[props.props.componentKey] === 'SelectPlus'" >
      <t-select
        v-model="_value" multiple :borderless="borderless" autofocus :readonly="readonly" :auto-width="autoWidth"  placeholder="请选择" style="width: 100%;" clearable
        :loading="selectLoading" filterable @focus="selectFocusMethod(_config)" @change="changeFunc" @blur="blurFunc">
        <t-option v-for="item in selectOptions" :key="item[_config.props.valueKey]" :value="item[_config.props.valueKey]" :label="item[_config.props.labelKey]"></t-option>
      </t-select>
    </template>
    <template v-else-if="_config[props.props.componentKey] === 'Cascader'" >
      <t-cascader
        v-model="_value" :options="selectOptions" :multiple="_config.props.multiple" :borderless="borderless" autofocus :readonly="readonly" :auto-width="autoWidth" placeholder="请选择" clearable
        :loading="selectLoading" filterable value-mode="onlyLeaf" @change="changeFunc" @blur="blurFunc">
      </t-cascader>
    </template>
    <template v-else-if="_config[props.props.componentKey] === 'Score'" >
      <t-rate v-model="_value" show-text :default-value="4" :disabled="readonly" @change="changeFunc"/>
    </template>
    <template v-else-if="_config[props.props.componentKey] === 'ImageUpload'" >
      <t-upload
        v-model="_value"
        :action="uploadAction"
        :headers="uploadHeaders"
        name="url"
        multiple
        with-credentials
        theme="image-flow"
        @success="uploadSuccess"
        @fail="uploadFail"
      >
      <!-- 自定义文件列表，示例代码有效，勿删 -->
        <template #fileListDisplay>
          <div class="tdesign-demo-image-viewer__base">
            <t-image-viewer v-for="(imgUrl , index) in _value" :key="index" :images="fixedImageUrls(_value) ">
              <template #trigger="{ open }">
                <div class="tdesign-demo-image-viewer__ui-image">
                  <img alt="test" :src="fixedImageUrl(imgUrl.url ? imgUrl.url : imgUrl.response.data.url )" class="tdesign-demo-image-viewer__ui-image--img" />
                  <div class="tdesign-demo-image-viewer__ui-image--hover" >
                    <span @click="open"><t-icon name="browse" size="1.4em" /></span>
                    <t-divider layout="vertical" />
                    <span @click="deleteFunc(imgUrl)"><t-icon name="delete" size="1.4em" /></span>
                  </div>
                </div>
              </template>
            </t-image-viewer>
          </div>
        </template>
      </t-upload>
    </template>
    <template v-else-if="_config[props.props.componentKey] === 'UserPicker'" >
      <t-select
        v-model="_value" :multiple="_config.props.multiple" :borderless="borderless" autofocus :readonly="readonly" :auto-width="autoWidth"  placeholder="请选择" style="width: 100%;" clearable
        :loading="selectLoading" filterable @focus="selectFocusMethod(_config)" @change="changeFunc" @blur="blurFunc">
        <t-option v-for="item in selectOptions" :key="item[_config.props.valueKey]" :value="item[_config.props.valueKey]" :label="item[_config.props.labelKey]"></t-option>
      </t-select>
    </template>
    <template v-else-if="_config[props.props.componentKey] === 'VueContainer'" >
      -
    </template>
    <template v-else >
      <t-input-adornment v-if="_config.props.suffix && _config.props.suffix.length > 0" >
        <t-input v-model="_value" autofocus :borderless="borderless" :readonly="readonly" auto-width placeholder="请输入" @change="changeFunc" @blur="blurFunc">
        </t-input>
        <template #append>
          <t-input v-model="_config.props.suffix" readonly borderless auto-width placeholder="请输入" />
        </template>
      </t-input-adornment>
      <t-input v-else v-model="_value" autofocus :borderless="borderless" :readonly="readonly" :auto-width="autoWidth" placeholder="请输入" @change="changeFunc" @blur="blurFunc">
      </t-input>
    </template>

  </div>
</template>

<script setup lang="jsx">
import { getOrg_memberFetch } from '@/api/index'
import { get_experiment_record_visitorListFetch } from '@/api/experiment'
import { fixedImageUrls, fixedImageUrl } from '@/utils/index'

const emits = defineEmits(['update:modelValue', 'change','blur','enter'])
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

const $key_data = JSON.parse(localStorage.getItem('key_data') ?? '{}')
const experiment_record = computed(() => $key_data?.experiment_record)
const experiment_theme = computed(() => $key_data?.experiment_theme)

const _value = ref()
if (props.modelValue) {
  _value.value = props.modelValue
  if ( (props.config[props.props.componentKey] === 'SelectPlus' || props.config[props.props.componentKey] === 'ImageUpload') &&  !Array.isArray(props.modelValue) ) {
    _value.value = []
  }
} else if (props.config[props.props.componentKey] === 'Cascader'){
  if (props.config.props.multiple) {
    _value.value = []
  }else{
    _value.value = ''
  }
}else {
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
      _value.value = ''
    }
  }else{
  _value.value = ''
  }
}
const uploadAction = ref('')
const uploadHeaders = ref({})
const selectOptions = ref([])

const fileList = ref('')

const _config = computed( () => props.config )

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

const uploadFail = ({ file }) => {
  MessagePlugin.error(`文件 ${file.name} 上传失败`);
};

const uploadSuccess = ({response}) => {
  console.log('success', response,_value.value);
  const files = _value.value.filter(file=> !file.response || ( file.response && file.response.code === 2000 ) ).map(file =>{ return file.response? file.response.data : file });
  changeFunc(files)
  MessagePlugin.success('上传成功');
};

const selectFocusMethod = async (formItem) => {
  selectLoading.value = true
  // 模拟请求，假设数据来自后台
  if (formItem.props.remote) {
    let res =  undefined
    if (formItem.props.remoteMethod) {
      res = await formItem.props.remoteMethod()
    } else if ( props.config[props.props.componentKey] === 'UserPicker' ) {

      res = experiment_theme.value?.participants ? {data:{ code : 2000 ,data: experiment_theme.value.participants }} : await getOrg_memberFetch()
    }
    console.log('-------selectFocusMethod----------------',props.config[props.props.componentKey],res,experiment_theme.value)
    if (res && res.data.code === 2000) {
      formItem.props.options = res.data.data.map((item) => ({
        [formItem.props.valueKey]: item[formItem.props.valueKey],
        [formItem.props.labelKey]: item[formItem.props.labelKey],
      }))
    }
    _config.value = {...formItem}
    selectOptions.value = formItem.props.options
  }
  selectLoading.value = false
}

onMounted( async () => {
  if (props.config[props.props.componentKey] === 'SelectPlusRadio' || props.config[props.props.componentKey] === 'Cascader' || props.config[props.props.componentKey] === 'SelectPlus' || props.config[props.props.componentKey] === 'UserPicker') {
    if (!props.config.props.remote) {
      selectOptions.value = props.config.props.options.map((item) => ({
        [props.config.props.valueKey]: item[props.config.props.valueKey],
        [props.config.props.labelKey]: item[props.config.props.labelKey]
      }))
    }else{
      if (props.config[props.props.componentKey] === 'UserPicker' && _config.value.props.remote && !_config.value.props.remoteMethod) {
        _config.value.props.remoteMethod = experiment_theme.value?.participants ? ()=> ({ data:{ code : 2000 , data: experiment_theme.value.participants }}) : getOrg_memberFetch
      }
      await selectFocusMethod(_config.value)
    }
  }
  uploadAction.value = `${localStorage.getItem('BASE_URL')}/api/attachments/file/`

  const token = localStorage.getItem('mzyc_token');
  uploadHeaders.value = { Authorization: `JWT ${token}` }

})

</script>

<style lang="less" scoped>
:deep(.umo-upload__flow){
  min-width: 90px;
  width: 100%;
}
:deep(.umo-upload__card-content){
  width: 100%;
  min-width: 80px;
}

:deep(.umo-upload__flow-card-area){
  padding: 0;
}

:deep(.tdesign-demo-image-viewer__ui-image) {
  width: 80px;
  height: 80px;
  display: inline-flex;
  position: relative;
  justify-content: center;
  align-items: center;
  border-radius: var(--td-radius-small);
  overflow: hidden;
  //margin: 2px;
  //border: 4px solid var(--td-bg-color-secondarycontainer);
}

:deep(.tdesign-demo-image-viewer__ui-image--hover) {
  width: 80px;
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  gap: 4px;
  left: 0;
  top: 0;
  opacity: 0;
  background-color: rgba(0, 0, 0, 0.6);
  color: var(--td-text-color-anti);
  line-height: 22px;
  transition: 0.2s;
}

:deep(.tdesign-demo-image-viewer__ui-image:hover .tdesign-demo-image-viewer__ui-image--hover) {
  opacity: 1;
  cursor: pointer;
}

:deep(.tdesign-demo-image-viewer__ui-image--img) {
  width: 80px;
  height: 80px;
  cursor: pointer;
  position: absolute;
}

:deep(.tdesign-demo-image-viewer__ui-image--footer) {
  padding: 0 16px;
  height: 36px;
  width: 100%;
  text-align: center;
  line-height: 36px;
  font-size: 16px;
  position: absolute;
  bottom: 0;
  color: var(--td-text-color-anti);
  background-image: linear-gradient(0deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0) 100%);
  display: flex;
  box-sizing: border-box;
}

:deep(.tdesign-demo-image-viewer__ui-image--title) {
  flex: 1;
}

:deep(.tdesign-demo-popup__reference) {
  margin-left: 16px;
}

:deep(.tdesign-demo-image-viewer__ui-image--icons .tdesign-demo-icon) {
  cursor: pointer;
}

:deep(.tdesign-demo-image-viewer__base) {
  width: 100%;
  min-width: 80px;
  height: auto;
}
</style>
