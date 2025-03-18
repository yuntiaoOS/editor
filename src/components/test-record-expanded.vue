<template>
  <t-space direction="vertical" align="" style="width: 100%">
    <div v-if="_formData">
      <!--      <FormDesignRender style="overflow: auto;"-->
      <!--                        v-model="_formData['attachment']"-->
      <!--                        v-model:formData="_formData"-->
      <!--                        :mode=" readonly ? 'READ' : 'NORMAL'"-->
      <!--                        :config="attachmentFormItem">-->
      <!--      </FormDesignRender>-->
      <UploadFile
        v-model="_formData['attachment']"
        :multiple="true"
        :maxNumber="999"
        type="file"
      ></UploadFile>
    </div>
    <div v-if="_value.is_sample">
      <t-space direction="vertical" style="width: 100%">
        <t-table
          v-if="props.viewType === 'test_record_table'"
          row-key="id"
          :data="sampleTableData"
          :columns="sampleColumns"
          :showHeader="false"
          lazy-load
        >
          <template #type-slot-operate="slotProps">
            <div style="display: flex; align-items: center; gap: 10px">
              <t-link
                theme="primary"
                hover="color"
                @click="showTechnologyFunc(slotProps.row)"
              >
                工艺
              </t-link>
            </div>
          </template>
        </t-table>
        <t-table
          v-if="_value.sample && _value.sample.params?.is_residue === 'sample'"
          ref="tableRef"
          :loading="loading"
          row-key="id"
          :data="record_table_data"
          :columns="_columns"
          resizable
        >
          <template #defaultValueSlot="slotProps">
            <div>
              <FormDesignRender
                v-model="slotProps.row[slotProps.col.colKey]"
                v-model:formData="slotProps.row"
                style="overflow: auto"
                :mode="readonly ? 'READ' : 'NORMAL'"
                :config="slotProps.row.index_type"
              >
              </FormDesignRender>
            </div>
          </template>
          <template #topContent>
            <div style="padding: 6px 0; display: block" v-if="!readonly">
              <t-space>
                <div>
                  <t-tag
                    theme="default"
                    v-if="props.viewType === 'test_record_table'"
                    >试验数据</t-tag
                  >
                  <t-button size="small"
                    v-if="false"
                    variant="outline"
                    @click="onSaveDataFunc"
                    >保存数据</t-button
                  >
                  <!-- <span :title=" isChanged?'未保存':'已保存' " style="width: 10px; height: 10px; border-radius: 50%;" :style="{background:isChanged? 'var(--td-error-color)' : 'var(--td-success-color)'}"></span>
                  <t-input v-model="_title" auto-width placeholder="请输入名称" /> -->
                </div>
                <t-space>
                  <t-button size="small" v-if="false" variant="outline" @click="onAddRowFunc"
                    >新增</t-button
                  >
                  <t-button size="small"
                    v-if="false"
                    variant="outline"
                    @click="onAddIndexFunc"
                    >配置指标</t-button
                  >
                  <t-button size="small" variant="outline" @click="onAddIndexRowFunc"
                    >新增</t-button
                  >
                </t-space>
              </t-space>
            </div>
          </template>
          <template #type-slot-operate="slotProps">
            <div style="display: flex; align-items: center; gap: 10px">
              <t-link
                theme="primary"
                hover="color"
                @click="copyRowFunc(slotProps.row)"
              >
                复制
              </t-link>
              <t-popconfirm
                content="确认删除吗"
                @confirm="deleteRowFunc(slotProps.row)"
              >
                <t-button size="small"
                  title="删除"
                  theme="danger"
                  shape="square"
                  variant="text"
                  >删除</t-button
                >
              </t-popconfirm>
            </div>
          </template>
        </t-table>
      </t-space>
    </div>
  </t-space>
  <t-dialog
    destroyOnClose
    v-model:visible="technologyInfoVisible"
    header="工艺详情"
    :footer="false"
    width="70%"
    attach="body"
  >
    <t-table
      v-if="selectRow"
      :rowspan-and-colspan="rowspanAndColspan"
      ref="tableRef"
      :loading="loading"
      table-layout="auto"
      :expandIcon="false"
      row-key="id"
      :data="selectRow.formItems"
      :columns="technologyColumns"
    >
      <template #type-slot-operate-router="{ col, row, rowIndex }">
        <div class="operate-router-class">
          <div v-if="row.operateType === '样品'">
            <div>
              <span>{{ row.sample.name }} ：{{ row.sample.sn }}</span>
            </div>
          </div>
          <t-space v-else-if="row.operateType !== '过程描述'">
            <template v-for="(item, index) in row.formItems.attribute">
              <FormDesignRender
                v-model="row.formData[item.key]"
                v-model:formData="row.formData"
                style="overflow: auto"
                :label="item.title + '：'"
                :mode="'READ'"
                :config="item"
                @changed="onUpdateModelValue"
              >
              </FormDesignRender>
            </template>
          </t-space>
          <div v-else-if="row.operateType === '过程描述'">
            <t-textarea
              v-model="row.description"
              placeholder="请输入过程描述"
              readonly
              name="description"
              :autosize="true"
            />
          </div>
        </div>
      </template>
    </t-table>
  </t-dialog>
  <t-dialog
    v-model:visible="select_index_visible"
    destroy-on-close
    :close-on-overlay-click="false"
    header="选择指标属性"
    :cancel-btn="null"
    width="600"
    attach="body"
    :confirm-on-enter="true"
    :on-confirm="on_select_indexFunc"
  >
    <t-form
      ref="select_record_form"
      :rules="FORM_RULES"
      :data="selectTableForm"
      :colon="true"
    >
      <t-form-item label="类型" name="type" v-if="false">
        <t-radio-group
          v-model="selectTableForm.type"
          variant="primary-filled"
          @change="procedureTypeChange"
        >
          <t-radio-button value="group">指标组</t-radio-button>
          <t-radio-button value="customer">自定义</t-radio-button>
        </t-radio-group>
      </t-form-item>
      <t-form-item label="指标属性" name="index_type">
        <t-select
          v-model="selectTableForm.index_type"
          borderless
          placeholder="请选择"
          style="width: 100%"
          multiple
          clearable
          filterable
        >
          <t-option-group
            v-for="(list, index) in assessmentAllOption"
            :key="index"
            :label="
              typeof list.group === 'object' ? list.group.title : list.group
            "
            divider
          >
            <t-option
              v-for="item in list.children"
              :key="item.id"
              :value="item.id"
              :label="item.title"
            >
              {{ item.title }}
            </t-option>
          </t-option-group>
        </t-select>
      </t-form-item>
    </t-form>
  </t-dialog>
</template>

<script setup lang="jsx">
import { getFieldValue } from '@/utils/index'
import { cloneDeep } from 'lodash-es'
import { shortId } from '@/utils/short-id'
import { v4 as uuid } from 'uuid'
import {
  getEval_attribute_libraryListFetch,
  get_ingredient_dev_sampleListFetch,
  post_ingredient_dev_sample_fetch,
  getIndexTypeGroupsFetch,
  put_ingredient_dev_sample_fetch,
  get_ingredient_dev_sample_infoFetch,
} from '@/api/experiment'
import { timeFormat } from '@/utils/time-ago'
import Template from '@/components/menus/toolbar/insert/template.vue'

const emits = defineEmits(['update:modelValue', 'change', 'blur', 'enter'])
const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({}),
    required: true,
  },
  viewType: {
    type: String,
    default: 'sample_table',
  },
  sample: {
    type: String,
    default: '',
  },
  readonly: {
    type: Boolean,
    default: false,
  },
  docJson: {
    type: Object,
    default: () => ({}),
  },
})
const { refreshNode } = useStore()
const attachmentFormItem = {
  title: '附件',
  type: 'Attachment',
  icon: 'carbon:attachment',
  key: 'attachment',
  value_type: 'Array',
  props: {
    required: false,
    enablePrint: true,
    placeholder:
      '直接上传用于本地文件上传至系统，文件库用于选择系统已存在的文件',
    onlyRead: false,
    maxSize: 100,
    maxNumber: 10,
    multiple: true,
    type: 'image',
    fileTypes: [],
    abstract: false,
    hidden: false,
  },
}

let isInit = ref(false)

const _value = computed({
  get() {
    console.log('---_value--195---', refreshNode, props.modelValue)
    let data = cloneDeep(props.modelValue)
    if (props.modelValue?.id) {
      data = refreshNode.data[props.modelValue?.id] ?? props.modelValue
    }
    return data
  },
  set(val) {
    // console.log('---_value--147---', val,props.viewType)
    nextTick(() => {
      refreshNode.type =
        props.viewType === 'sample_table'
          ? 'record_sample_table'
          : 'sample_table'
      refreshNode.selectId = val.id
      refreshNode.data = {
        ...refreshNode.data,
        [val.id]: val,
      }
      emits('change', val)
    })
  },
})

const onUpdateModelValue = (val) => {
  console.log('---onUpdateModelValue1111111111111111--', val)
  _value.value = {
    ..._value.value,
    sample: {
      ..._value.value.sample,
      record_table: {
        ..._value.value.sample.record_table,
        table_data: record_table_data.value,
      },
    },
  }
}

const _sampleInfo = computed({
  get() {
    return _value.value?.sample
  },
  set(val) {
    // console.log('---_value--162---', val)
    _value.value = { ..._value.value, sample: val }
  },
})

const _formData = computed({
  get() {
    return _value.value?.formData ?? {}
  },
  set(val) {
    // console.log('---_value--172---', val)
    _value.value = { ..._value.value, formData: val }
  },
})

const record_table_data = computed({
  get() {
    return _value.value?.sample?.record_table?.table_data ?? []
  },
  set(val) {
    // console.log('---_value--182---', val)
    _value.value = {
      ..._value.value,
      sample: {
        ..._value.value.sample,
        record_table: { ..._value.value.sample.record_table, table_data: val },
      },
    }
  },
})

// watch(
//   () => record_table_data.value,
//   (val, oldValue) => {
//     if (val && oldValue && !isInit) {
//       console.log('--------_sampleInfo--167--------',val,oldValue,isInit)
//       isInit = false
//       const valD = cloneDeep(_value.value)
//       emits('change', { ...valD, sample: { ...valD.sample, record_table : {...valD.sample.record_table,table_data: val   }  } })
//     }
//   },
//   { deep: true, immediate: true },
// )

const sampleTableData = computed(() => {
  return _sampleInfo.value ? [_sampleInfo.value] : []
})

// watch(
//   () => _sampleInfo.value?.record_table?.table_data,
//   (val, oldValue) => {
//     // console.log('--------_sampleInfo--167--------',val,oldValue)
//     if (val && val !== oldValue) {
//       emits('change', cloneDeep(_value.value))
//     }
//   },
//   { deep: true, immediate: true },
// )

const sampleColumns = ref([
  {
    colKey: 'name',
    title: '名称',
    width: 200,
  },
  {
    colKey: 'sn',
    title: '编号',
    width: 170,
  },
  {
    colKey: 'weight',
    title: '质量(g)',
    width: 100,
  },
  {
    colKey: 'description',
    title: '描述',
    minWidth: 120,
  },
  {
    title: '操作',
    colKey: 'operate',
    width: 50,
    cell: 'type-slot-operate',
  },
])

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
    title: '检测结果',
    width: 200,
    colKey: 'data',
    cell: 'defaultValueSlot',
  },
  {
    colKey: 'description',
    title: '备注',
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
        const newData = [...record_table_data.value]
        // updateTime.value = timeFormat(null, 'yyyy-mm-dd hh:MM:ss')
        newData.splice(context.rowIndex, 1, context.newRowData)
        record_table_data.value = newData
        // emits('change', cloneDeep(_value.value))
        useMessage('success', 'Success')
      },
      // 触发校验的时机（when to validate)
      validateTrigger: 'change',
      // 透传给 component: Input 的事件（也可以在 edit.props 中添加）
      on: (editContext) => ({
        onBlur: (ctx) => {
          ctx?.e?.preventDefault()
        },
        onEnter: (ctx) => {
          ctx?.e?.preventDefault()
        },
        // 默认是否为编辑状态
        defaultEditable: true,
      }),
    },
  },
  {
    title: '操作',
    colKey: 'operate',
    width: 100,
    cell: 'type-slot-operate',
  },
]
//   computed(() => {
//   return props.readonly ? _sampleInfo.value?.record_table.columns.filter(ele => ele.colKey !== 'operate') : _sampleInfo.value?.record_table.columns
// })

const select_index_visible = ref(false)
const assessmentOption = ref([])
const assessmentAllOption = ref([])
const assessmentGroupOption = ref([])
const select_record_form = ref()

const technologyInfoVisible = ref(false)
const selectRow = ref()
const technologyColumns = ref([
  {
    title: '工序',
    colKey: 'procedure',
    width: 100,
    cell: (h, { row }) => {
      return row.procedure.title
    },
  },
  {
    colKey: 'operate_router',
    title: '工艺线路',
    width: 140,
    cell: (h, { row }) => {
      const theme =
        row.operateType === '物料'
          ? 'primary'
          : row.operateType === '样品'
            ? 'warning'
            : 'success'
      return (
        <div>
          {row.operateType !== '过程描述' && [
            <t-tag size="small" style="margin-right:6px;" theme={theme}>
              {row.operateType}
            </t-tag>,
          ]}
          <span>{row.operate_router.title}</span>
        </div>
      )
    },
  },
  {
    colKey: 'formItems',
    title: '工艺要求',
    minWidth: 220,
    cell: 'type-slot-operate-router',
  },
  {
    colKey: 'description',
    title: '实验记录',
    minWidth: 220,
  },
])

const showTechnologyFunc = (row) => {
  console.log('---showTechnologyFunc--', row, _value.value)
  onTechnology(_value.value)
}

const onTechnology = (row) => {
  selectRow.value = row
  const docD = props.docJson
  if (docD && docD.content) {
    // 物料表
    const test_record_table = docD.content?.filter(
      (ele) => ele.type === 'test_record_table',
    )
    if (test_record_table.length === 0) {
      TMessagePlugin.warning('请先在试验数据表中出样')
      return // 物料表不存在，返回
    }
    const test_record = test_record_table.find(
      (ele) => ele.attrs.id === row.test_record_table,
    )
    if (test_record) {
      const table_data = test_record.attrs.table_data.filter(
        (ele) => ele.operateType !== '样品' && ele.operateType !== '过程描述',
      )
      const index = table_data.findIndex(
        (ele) =>
          ele.procedure_rowKey === row.procedure_rowKey &&
          ele.operate_rowKey === row.operate_rowKey,
      )
      selectRow.value.formItems = table_data.slice(0, index + 1).map((ele) => {
        if (row.params && row.params.length > 0) {
          const rowD = row.params.find((item) => item.id === ele.id)
          if (rowD) {
            const rowD_ids = rowD.formItems.attribute.map((item) => item.value)
            ele.formItems.attribute = ele.formItems.attribute.filter((item) =>
              rowD_ids.includes(item.key),
            )
          }
        }

        return ele
      })
    }
    console.log(
      'selectRow-----------487-------',
      test_record,
      test_record_table,
      selectRow.value,
      row,
    )
  }
  technologyInfoVisible.value = true
}

const suffixColumns = [
  {
    title: '操作',
    colKey: 'operate',
    width: 100,
    cell: 'type-slot-operate',
  },
]

const pagination = ref({
  limit: 20,
  total: 0,
  page: 1,
})

const selectTableForm = ref({
  type: 'group',
  index_type: [],
  experimental_design: [],
})
const FORM_RULES = {
  experimental_design: [
    { required: true, message: '必填', trigger: ['change'] },
  ],
  index_type: [{ required: true, message: '必填', trigger: ['change'] }],
}

const getNodeFullColKey = (node) => {
  const parents = node.getParents()

  // console.info('树结构数据:--------',node, parents);
  if (!parents) {
    return ''
  }
  const keys = []
  parents.forEach((item) => {
    keys.unshift(item.data.key)
  })
  if (parents[0].data.type && parents[0].data.type === 'FieldsGroup') {
    keys.push(node.data.key)
  } else {
    keys.push(node.data.key)
  }

  const keyStr = keys.join('.')
  //
  return keyStr ? keyStr : ''
}

const onSaveDataFunc = () => {
  putIngredientDevSampleFunc(_value.value)
    .then((res) => {
      if (res.data.code === 2000) {
        emits('change', cloneDeep(_value.value))
      }
    })
    .catch((err) => {})
}

const onAddRowFunc = () => {
  makerecordDataFunc()
  putIngredientDevSampleFunc(_value.value)
    .then((res) => {
      if (res.data.code === 2000) {
        emits('change', cloneDeep(_value.value))
      }
    })
    .catch((err) => {})
}

const deleteRowFunc = (row) => {
  const index = record_table_data.value.findIndex((ele) => ele.id === row.id)
  record_table_data.value.splice(index, 1)
  putIngredientDevSampleFunc(_value.value)
    .then((res) => {
      if (res.data.code === 2000) {
        emits('change', cloneDeep(_value.value))
      }
    })
    .catch((err) => {})
}

const copyRowFunc = (row) => {
  const newRow = cloneDeep(row)
  newRow.id = uuid()
  record_table_data.value.push(newRow)
  putIngredientDevSampleFunc(_value.value)
    .then((res) => {
      if (res.data.code === 2000) {
        emits('change', cloneDeep(_value.value))
        select_index_visible.value = false
      }
    })
    .catch((err) => {})
}

const putIngredientDevSampleFunc = (sampleInfo) => {
  return new Promise((resolve, reject) => {
    put_ingredient_dev_sample_fetch(props.sample, { value: sampleInfo.value })
      .then((res) => {
        resolve(res)
      })
      .catch((err) => {
        reject(err)
      })
  })
}

const onAddIndexFunc = () => {
  select_index_visible.value = true
}

const onAddIndexRowFunc = () => {
  if (record_table_data.value.length > 0) {
    selectTableForm.value.index_type = record_table_data.value.map(
      (ele) => ele.index_type.id,
    )
  }
  select_index_visible.value = true
}

const on_select_indexFunc = () => {
  select_record_form.value
    ?.validate({ showErrorMessage: true })
    .then((validateResult) => {
      if (validateResult && Object.keys(validateResult).length) {
        const firstError = Object.values(validateResult)[0]?.[0]?.message
        useMessage('warning', firstError)
      } else {
        function processValueItems(items) {
          const valueC = {}

          items.forEach((eleI) => {
            if (
              [
                'SelectInput',
                'TimeRangePicker',
                'DeptPicker',
                'TableList',
                'Attachment',
                'SelectMaterial',
              ].includes(eleI.type)
            ) {
              valueC[eleI.key] = []
            } else if (['FieldsGroup'].includes(eleI.type)) {
              valueC[eleI.key] = processValueItems(eleI.props.items) // 递归处理嵌套的 items
            } else {
              valueC[eleI.key] = ''
            }
          })

          return valueC
        }

        const indexTypeOs = []
        selectTableForm.value.index_type.forEach((ele) => {
          if (String(ele).includes('/G')) {
            const group = assessmentGroupOption.value.find(
              (item) => item.id == ele.replace('/G', ''),
            )
            group?.attribute?.forEach((item) => {
              if (!indexTypeOs.some((eleI) => eleI.id == item.id)) {
                indexTypeOs.push(item)
              }
            })
          } else {
            const attribute = assessmentOption.value.find(
              (item) => item.id == ele,
            )
            if (attribute) {
              if (! indexTypeOs.some(eleI=> eleI.id == attribute.id )) {
                indexTypeOs.push(attribute)
              }
            }
          }
        })
        const record_table_dataC = []
        indexTypeOs.forEach((ele) => {
          let valueC = ''
          if (
            [
              'SelectInput',
              'TimeRangePicker',
              'DeptPicker',
              'TableList',
              'Attachment',
              'SelectMaterial',
            ].includes(ele.type)
          ) {
            valueC = []
          } else if (['FieldsGroup'].includes(ele.type)) {
            valueC = processValueItems(ele.props.items) // 调用递归函数处理嵌套的 items
          }
          const rowData = {
            id: uuid(),
            index_type: ele,
            time: timeFormat(null, 'yyyy-mm-dd hh:MM:ss'),
            data: valueC,
            description: '',
          }
          console.log('---on_select_indexFunc--', record_table_dataC)
          record_table_dataC.push(rowData)
        })
        record_table_data.value =
          record_table_data.value.concat(record_table_dataC)
        // emits('change', cloneDeep(_value.value))
        select_index_visible.value = false

        return
        const indexTypes = assessmentOption.value.filter((ele) =>
          selectTableForm.value.index_type.includes(ele.id),
        )
        const paramsColumns = []
        const descriptionCol = {
          key: 'description',
          icon: '',
          type: 'TextareaInput',
          props: {
            abstract: true,
            required: false,
            enableScan: false,
            enablePrint: true,
          },
          title: '描述',
          valueType: '',
        }
        indexTypes.push(descriptionCol)
        indexTypes.forEach((ele) => {
          const paramsColumn = {
            title: ele.title,
            colKey: ele.key,
            attrs: ele,
            minWidth: 100,
            cell: 'defaultValueSlot',
          }
          paramsColumns.push(paramsColumn)
        })

        _sampleInfo.value.record_table.columns = [
          ...paramsColumns,
          ...suffixColumns,
        ]
        _sampleInfo.value.record_table.params = cloneDeep(indexTypes)

        makerecordDataFunc(true)
        putIngredientDevSampleFunc(_value.value)
          .then((res) => {
            if (res.data.code === 2000) {
              emits('change', cloneDeep(_value.value))
              select_index_visible.value = false
            }
          })
          .catch((err) => {})
      }
    })
}

const makerecordDataFunc = (init = false) => {
  const rowD = { id: uuid(), name: _sampleInfo.value.name }
  // 递归函数，处理嵌套的 FieldsGroup 和 SelectMaterial
  function processValueItems(items) {
    const valueC = {}

    items.forEach((eleI) => {
      if (
        [
          'SelectInput',
          'TimeRangePicker',
          'DeptPicker',
          'TableList',
          'Attachment',
          'SelectMaterial',
        ].includes(eleI.type)
      ) {
        valueC[eleI.key] = []
      } else if (['FieldsGroup'].includes(eleI.type)) {
        valueC[eleI.key] = processValueItems(eleI.props.items) // 递归处理嵌套的 items
      } else {
        valueC[eleI.key] = ''
      }
    })

    return valueC
  }
  // 主逻辑
  _sampleInfo.value.record_table.params.forEach((ele) => {
    let valueC = ''

    if (
      [
        'SelectInput',
        'TimeRangePicker',
        'DeptPicker',
        'TableList',
        'Attachment',
        'SelectMaterial',
      ].includes(ele.type)
    ) {
      valueC = []
    } else if (['FieldsGroup'].includes(ele.type)) {
      valueC = processValueItems(ele.props.items) // 调用递归函数处理嵌套的 items
    }
    rowD[ele.key] = valueC
  })
  if (init) {
    record_table_data.value = [rowD]
  } else {
    record_table_data.value.push(rowD)
  }
}

const getAssessmentOptionFunc = async () => {
  const resGroups = await getIndexTypeGroupsFetch({ limit: 9999 })
  const resAttribute = await getEval_attribute_libraryListFetch({ limit: 9999 })
  if (resGroups.data.code === 2000 && resAttribute.data.code === 2000) {
    assessmentAllOption.value = [
      {
        group: '检测组',
        children: resGroups.data.data.map((ele) => ({
          ...ele,
          isGroup: true,
          id: ele.id + '/G',
          title: ele.group_name,
        })),
      },
      {
        group: '指标',
        children: resAttribute.data.data,
      },
    ]
    assessmentGroupOption.value = resGroups.data.data
    assessmentOption.value = resAttribute.data.data
    // console.log('---assessmentOption--', assessmentOption.value)
  }
}

const getSampleInfoFunc = async () => {
  const res = await get_ingredient_dev_sample_infoFetch(props.sample)

  let resD = {}
  if (true) {
    resD = res.data
  } else {
    resD = res.data.value ? res.data.value : res.data
  }
  if (resD.code === 2000) {
    _value.value = resD.data
  }
}

onMounted(async () => {
  await getAssessmentOptionFunc()
  // 暂时停止使用接口获取样品试验记录数据
  // if (props.sample && false) {
  //   await getSampleInfoFunc()
  // }
})
</script>

<style lang="less" scoped></style>
