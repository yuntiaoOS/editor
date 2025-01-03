<template>
  <t-space direction="vertical" align="" style="width: 100%;">
    <div>
      <t-table
        ref="tableRef"  :loading="loading"  
        row-key="id" :data="_sampleInfo?.record_table?.table_data" :columns="_columns" resizable
      >
        <template #defaultValueSlot="slotProps">
          <div >
            <FormDesignRender style="overflow: auto;"
              v-model="slotProps.row[slotProps.col.colKey]"
              :mode=" readonly ? 'READ' : 'NORMAL'"
              :config="slotProps.row.index_type">
            </FormDesignRender>
          </div>
        </template>
        <template #topContent>
          <div style="padding: 6px 0;display: block;" v-if="!readonly">
            <t-space>
              <div>
                <t-button v-if="false" variant="outline" @click="onSaveDataFunc">保存数据</t-button>
                <!-- <span :title=" isChanged?'未保存':'已保存' " style="width: 10px; height: 10px; border-radius: 50%;" :style="{background:isChanged? 'var(--td-error-color)' : 'var(--td-success-color)'}"></span>
                <t-input v-model="_title" auto-width placeholder="请输入名称" /> -->
              </div>
              <t-space>
                <t-button v-if="false" variant="outline" @click="onAddRowFunc">新增</t-button>
                <t-button v-if="false" variant="outline" @click="onAddIndexFunc">配置指标</t-button>
                <t-button  variant="outline" @click="onAddIndexRowFunc">新增</t-button>
              </t-space>
            </t-space>
          </div>
        </template>
        <template #type-slot-operate="slotProps">
          <div style="display: flex; align-items: center;gap: 10px; ">
            <t-link theme="primary" hover="color" @click="copyRowFunc(slotProps.row)">
              复制
            </t-link>
            <t-popconfirm content="确认删除吗" @confirm="deleteRowFunc(slotProps.row)" >
              <t-button title="删除" theme="danger" shape="square" variant="text" >删除</t-button>
            </t-popconfirm>
          </div>
        </template>
      </t-table>
    </div>
  </t-space>
  <t-dialog 
    v-model:visible="select_index_visible"
    destroy-on-close 
    :close-on-overlay-click="false"
    header="选择指标属性" :cancel-btn="null"
    width="600" attach="body"
    :confirm-on-enter="true"
    :on-confirm="on_select_indexFunc"
  >
    <t-form ref="select_record_form" :rules="FORM_RULES" :data="selectTableForm" :colon="true" >
      <t-form-item label="类型" name="type">
        <t-radio-group v-model="selectTableForm.type" variant="primary-filled" @change="procedureTypeChange">
          <t-radio-button value="group">指标组</t-radio-button>
          <t-radio-button value="customer">自定义</t-radio-button>
        </t-radio-group>
      </t-form-item>
      <t-form-item label="指标属性" name="index_type">
        <t-select v-model="selectTableForm.index_type" borderless placeholder="请选择" style="width: 100%;" multiple clearable filterable >
          <t-option v-for="item in assessmentOption" :key="item.id" :value="item.id" :label="item.title"></t-option>
        </t-select>
      </t-form-item>
    </t-form>
  </t-dialog>
</template>

<script setup lang="jsx">
import { getFieldValue } from '@/utils/index';
import { cloneDeep } from 'lodash-es';
import { shortId } from '@/utils/short-id'
import { v4 as uuid } from 'uuid'
import {
  getEval_attribute_libraryListFetch,
  get_ingredient_dev_sampleListFetch,
  post_ingredient_dev_sample_fetch,
  put_ingredient_dev_sample_fetch,
  get_ingredient_dev_sample_infoFetch,
} from '@/api/experiment'
import { timeFormat } from '@/utils/time-ago'

const emits = defineEmits(['update:modelValue', 'change','blur','enter'])
const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({}),
    required: true,
  },
  viewType: {
    type: String,
    default: 'nodeView',
  },
  sample: {
    type: String,
    default: ''
  },
  readonly: {
    type: Boolean,
    default: false,
  },
})

const _value = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emits('update:modelValue', val)
  }
})

const _sampleInfo = computed({
  get() {
    return _value.value?.sample
  },
  set(val) {
    _value.value.sample = val
  }
})

watch(() => _sampleInfo.value?.record_table?.table_data, (val) => {
  if (val) {
    emits('change', _sampleInfo.value)
  }
}, { deep: true, immediate: true})

const _columns = [
  {
    title: '日期',
    width: 120,
    colKey: 'time',
  },
  {
    title: '指标',
    width: 120,
    colKey: 'index_type.title',
  },
  {
    title: '数据',
    width: 200,
    colKey: 'data',
    cell: 'defaultValueSlot'
  },
  {
    colKey: 'description',
    title: '记录',
    ellipsis: true,
    width: 220,
    edit: {
      // 1. 支持任意组件。需保证组件包含 `value` 和 `onChange` 两个属性，且 onChange 的第一个参数值为 new value。
      // 2. 如果希望支持校验，组件还需包含 `status` 和 `tips` 属性。具体 API 含义参考 Input 组件
      component: TTextarea,
      // props, 透传全部属性到 Input 组件
      props: {
        clearable: true,
        autofocus: true,
        // autoWidth: true,
        autosize: true,
      },
      // 校验规则，此处同 Form 表单
      rules: [
        {
          required: false,
          message: '不能为空',
        },
      ],
      showEditIcon: true,
      abortEditOnEvent: ['onEnter', 'onBlur'],
      onEdited: (context) => {
        const newData = [..._sampleInfo.value.record_table.table_data]
        // updateTime.value = timeFormat(null, 'yyyy-mm-dd hh:MM:ss')
        newData.splice(context.rowIndex, 1, context.newRowData)
        _sampleInfo.value.record_table.table_data = newData
        emits('change', _sampleInfo.value)
        useMessage('success', 'Success')
      },
      // 触发校验的时机（when to validate)
      validateTrigger: 'change',
      // 透传给 component: Input 的事件（也可以在 edit.props 中添加）
      on: (editContext) => ({
        onBlur: (ctx) => {
          console.log('失去焦点', editContext)
          ctx?.e?.preventDefault()
        },
        onEnter: (ctx) => {
          ctx?.e?.preventDefault()
          console.log('onEnter', ctx)
        },
        // 默认是否为编辑状态
        defaultEditable: true,
      }),
    },
  },
  {
    title: '操作栏',
    colKey: 'operate',
    width: 100,
    cell: 'type-slot-operate',
  },
]
//   computed(() => {
//   return props.readonly ? _sampleInfo.value?.record_table.columns.filter(ele => ele.colKey !== 'operate') : _sampleInfo.value?.record_table.columns
// })

const select_index_visible = ref(false);
const assessmentOption = ref([])
const select_record_form = ref()

const suffixColumns = [
  {
    title: '操作栏',
    colKey: 'operate',
    width: 100,
    cell: 'type-slot-operate',
  },
]

const pagination = ref({
  limit: 20,
  total: 0,
  page: 1,
});

const selectTableForm = ref({
  type: 'group',
  index_type: [] ,  
  experimental_design:[]
})
const FORM_RULES = {
  experimental_design: [{ required: true, message: '必填' ,trigger: ['change'] }] ,
  index_type: [{ required: true, message: '必填' ,trigger: ['change'] }]
};

const getNodeFullColKey = (node) => {
  const parents = node.getParents()
  
  // console.info('树结构数据:--------',node, parents);
  if (!parents) {
    return ''
  } 
  const keys = []
  parents.forEach(item => {
    keys.unshift(item.data.key)
  })
  if (parents[0].data.type && parents[0].data.type === "FieldsGroup") {
    keys.push(node.data.key)
  }else{
    keys.push(node.data.key)
  }
  
  const keyStr = keys.join('.')
  // console.log('keys:-----204---', keyStr);
  return keyStr? keyStr : ''
}

const onSaveDataFunc = () => {
  putIngredientDevSampleFunc(_value.value).then(res=>{
    if (res.data.code === 2000) {
      emits('change', _sampleInfo.value)
    }
  }).catch(err=>{
    console.log(err, '--------on_select_indexFunc--------593--------')
  })
}

const onAddRowFunc = () => {
  makerecordDataFunc()
  putIngredientDevSampleFunc(_value.value).then(res=>{
    if (res.data.code === 2000) {
      emits('change', _sampleInfo.value)
    }
  }).catch(err=>{
    console.log(err, '--------on_select_indexFunc--------593--------')
  })
}

const deleteRowFunc = (row) => {
  const index = _sampleInfo.value.record_table.table_data.findIndex(ele => ele.id === row.id)
  _sampleInfo.value.record_table.table_data.splice(index, 1)
  putIngredientDevSampleFunc(_value.value).then(res=>{
    if (res.data.code === 2000) {
      emits('change', _sampleInfo.value)
    }
  }).catch(err=>{
    console.log(err, '--------on_select_indexFunc--------593--------')
  })
}

const copyRowFunc = (row) => {
  const newRow = cloneDeep(row)
  newRow.id = uuid()
  _sampleInfo.value.record_table.table_data.push(newRow)
  putIngredientDevSampleFunc(_value.value).then(res=>{
    if (res.data.code === 2000) {
      emits('change', _sampleInfo.value)
      select_index_visible.value = false
    }
  }).catch(err=>{
    console.log(err, '--------on_select_indexFunc--------593--------')
  })
}

const putIngredientDevSampleFunc = (sampleInfo) => {
  return new Promise((resolve, reject) => {
    put_ingredient_dev_sample_fetch(props.sample , {value:sampleInfo.value}).then(res=>{
      resolve(res)
    }).catch(err=>{
      reject(err)
    })
  })
}

const onAddIndexFunc = ()=>{
  select_index_visible.value = true
}

const onAddIndexRowFunc = ()=>{
  select_index_visible.value = true
}

const on_select_indexFunc = ()=>{
  console.log('--------on_select_indexFunc--------590--------',_sampleInfo.value,selectTableForm.value )
  select_record_form.value?.validate({ showErrorMessage: true }).then((validateResult) => {
    if (validateResult && Object.keys(validateResult).length) {
      const firstError = Object.values(validateResult)[0]?.[0]?.message;
      useMessage('warning',firstError)
    }else{
      function processValueItems(items) {
        const valueC = {};

        items.forEach(eleI => {
          if (['SelectInput', 'TimeRangePicker', 'DeptPicker', 'TableList', 'Attachment', 'SelectMaterial'].includes(eleI.type)) {
            valueC[eleI.key] = [];
          } else if (['FieldsGroup'].includes(eleI.type)) {
            valueC[eleI.key] = processValueItems(eleI.props.items); // 递归处理嵌套的 items
          } else {
            valueC[eleI.key] = '';
          }
        });

        return valueC;
      }
      const indexTypeOs = assessmentOption.value.filter(ele=> selectTableForm.value.index_type.includes(ele.id))
      console.log('--------on_select_indexFunc--------336--------',indexTypeOs )
      indexTypeOs.forEach(ele=>{
        let valueC = '';
        if (['SelectInput', 'TimeRangePicker', 'DeptPicker', 'TableList', 'Attachment', 'SelectMaterial'].includes(ele.type)) {
          valueC = [];
        } else if (['FieldsGroup'].includes(ele.type)) {
          valueC = processValueItems(ele.props.items); // 调用递归函数处理嵌套的 items
        }
        const rowData = {
          id: uuid(),
          index_type: ele,
          time: timeFormat(null, 'yyyy-mm-dd hh:MM:ss'),
          data: valueC,
          description: ''
        }
        console.log('--------on_select_indexFunc--------343--------',rowData )
        _sampleInfo.value.record_table.table_data.push(rowData)
      })
      emits('change', _sampleInfo.value)
      select_index_visible.value = false



      return
      const indexTypes = assessmentOption.value.filter(ele=> selectTableForm.value.index_type.includes(ele.id))
      const paramsColumns = []
      const descriptionCol = {"key":"description","icon":"","type":"TextareaInput","props":{"abstract":true,"required":false,"enableScan":false,"enablePrint":true},"title":"描述","valueType":""}
      indexTypes.push(descriptionCol)
      indexTypes.forEach(ele=>{
        const paramsColumn = {
          title: ele.title,
          colKey: ele.key,
          attrs: ele,
          minWidth: 100,
          cell: 'defaultValueSlot',
        }
        paramsColumns.push(paramsColumn)
      })
      console.log('--------on_select_indexFunc--------593--------',paramsColumns )

      _sampleInfo.value.record_table.columns = [...paramsColumns, ...suffixColumns]
      _sampleInfo.value.record_table.params = cloneDeep(indexTypes)
      

      makerecordDataFunc(true)
      putIngredientDevSampleFunc(_value.value).then(res=>{
        if (res.data.code === 2000) {
          emits('change', _sampleInfo.value)
          select_index_visible.value = false
        }
      }).catch(err=>{
        console.log(err, '--------on_select_indexFunc--------593--------')
      })

    }
  })
  
}

const makerecordDataFunc = (init=false)=>{
  console.log('--------makerecordDataFunc--------590--------',_sampleInfo.value,selectTableForm.value )
  const rowD = {id:uuid(),name: _sampleInfo.value.name}
  // 递归函数，处理嵌套的 FieldsGroup 和 SelectMaterial
  function processValueItems(items) {
    const valueC = {};

    items.forEach(eleI => {
      if (['SelectInput', 'TimeRangePicker', 'DeptPicker', 'TableList', 'Attachment', 'SelectMaterial'].includes(eleI.type)) {
        valueC[eleI.key] = [];
      } else if (['FieldsGroup'].includes(eleI.type)) {
        valueC[eleI.key] = processValueItems(eleI.props.items); // 递归处理嵌套的 items
      } else {
        valueC[eleI.key] = '';
      }
    });

    return valueC;
  }
  // 主逻辑
  _sampleInfo.value.record_table.params.forEach(ele => {
    let valueC = '';

    if (['SelectInput', 'TimeRangePicker', 'DeptPicker', 'TableList', 'Attachment', 'SelectMaterial'].includes(ele.type)) {
      valueC = [];
    } else if (['FieldsGroup'].includes(ele.type)) {
      valueC = processValueItems(ele.props.items); // 调用递归函数处理嵌套的 items
    }
    rowD[ele.key] = valueC;
  });
  if (init) {
    _sampleInfo.value.record_table.table_data = [rowD]
  }else{
    _sampleInfo.value.record_table.table_data.push(rowD)
  }
}

const getAssessmentOptionFunc = async (page=1) => {
  const res = await getEval_attribute_libraryListFetch({page,limit:9999})
  console.log(res, '-------------488------------assessmentOption.value')
  let resD = {}
  if (true) {
    resD = res.data
  }else {
    resD = res.data.value ? res.data.value : res.data
  }
  if (resD.code === 2000) {
    if (page === 1) {
      assessmentOption.value = [...resD.data]
    } else {
      assessmentOption.value = [...assessmentOption.value, ...resD.data]
    }
    pagination.value.total = resD.total
    console.log(assessmentOption.value, '-------------502------------assessmentOption.value')
  }
  
}

const getSampleInfoFunc = async () => {
  const res = await get_ingredient_dev_sample_infoFetch(props.sample)
  console.log(res, '-------------488------------getSampleInfoFunc')
  let resD = {}
  if (true) {
    resD = res.data
  }else {
    resD = res.data.value ? res.data.value : res.data
  }
  if (resD.code === 2000) {
    _value.value = resD.data
  }

}

onMounted( async () => {
  await getAssessmentOptionFunc()
  // 暂时停止使用接口获取样品试验记录数据
  if (props.sample && false) {
    await getSampleInfoFunc()
  }

})

</script>

<style lang="less" scoped>

</style>