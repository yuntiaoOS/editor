<template>
  <node-view-wrapper :id="node.attrs.id" class="umo-node-view">
    <div class="test-record-class" style="width: 100%">
      <!-- <h2>样品</h2> -->
      <t-table
        expanded-row="expandedRow"
        :rowspan-and-colspan="rowspanAndColspan"
        ref="tableRef"
        :loading="loading"
        table-layout="auto"
        :expanded-row-keys="expandedRowKeys"
        :expandIcon="false"
        row-key="id"
        :data="table_data"
        :columns="columns"
        v-model:displayColumns="displayColumns"
      >
        <template #topContent>
          <div style="padding: 6px 0; display: block">
            <t-space>
              <div>
                <span
                  :title="isChanged ? '未保存' : '已保存'"
                  style="width: 10px; height: 10px; border-radius: 50%"
                  :style="{
                    background: isChanged
                      ? 'var(--td-error-color)'
                      : 'var(--td-success-color)',
                  }"
                ></span>
                <t-input
                  v-model="_title"
                  label="名称："
                  size="large"
                  autofocus
                  autoWidth
                  borderless
                  placeholder="请输入名称"
                />
              </div>
              <t-space>
                <t-button v-if="false" variant="outline" @click="onShowFunc">{{
                  '试验方法设计'
                }}</t-button>
                <t-button variant="outline" @click="onAddFunc">{{
                  designResult.formItems ? '设计' : '新增'
                }}</t-button>
                <div
                  v-if="updateTime && updateTime.length > 10"
                  title="修改时间"
                >
                  <t-icon
                    name="time"
                    size="13px"
                    style="color: #a0a0a0; margin-right: 4px"
                  />
                  <span class="Font12Color">{{ updateTime }}</span>
                </div>
                <t-button
                  title="设置"
                  variant="outline"
                  @click="columnEditFunc"
                >
                  <template #icon>
                    <t-icon name="setting" size="18px"></t-icon>
                  </template>
                </t-button>
              </t-space>
            </t-space>
          </div>
        </template>
        <template #expandedRow="slotProps">
          <TestRecordExpanded
            v-if="expandedRowKeys.includes(slotProps.row.id)"
            v-model="slotProps.row"
            :sample="slotProps.row.sample.id"
            @change="sampleRecordChange"
          ></TestRecordExpanded>
        </template>
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
                  class="node-form-design-render-class"
                  v-model="row.formData[item.key]"
                  v-model:formData="row.formData"
                  style="overflow: auto"
                  :label="item.title + '：'"
                  :mode="'READ'"
                  :config="item"
                >
                </FormDesignRender>
              </template>
            </t-space>
            <div v-else-if="row.operateType === '过程描述'">
              <t-textarea
                v-model="row.description"
                placeholder="请输入过程描述"
                name="description"
                :autosize="true"
              />
            </div>
          </div>
        </template>
        <template #slot-description="{ row, rowIndex }">
          <div
            class="slot-description-class"
            style="
              display: flex;
              align-items: center;
              justify-content: space-between;
              width: 100%;
            "
          >
            <span
              v-if="!row.description || row.description.length === 0"
              style="color: var(--td-text-color-placeholder)"
              >{{ '点击输入实验记录' }}</span
            >
            <span v-else>{{ row.description }}</span>
            <div class="slot-description-S-class">
              <t-button
                v-if="['物料', '操作'].includes(row.operateType)"
                title="拍照"
                style="width: 50px"
                theme="primary"
                shape="square"
                variant="text"
                @click.stop="expandDataFunc(row)"
              >
                拍照
              </t-button>
              <t-button
                v-if="['物料', '操作'].includes(row.operateType)"
                title="出样"
                style="width: 50px"
                theme="primary"
                shape="square"
                variant="text"
                @click.stop="creatSample(row)"
              >
                出样
              </t-button>

              <t-button
                v-if="['样品'].includes(row.operateType)"
                style="width: 80px"
                title="试验数据"
                theme="primary"
                shape="square"
                variant="text"
                @click.stop="expandDataFunc(row)"
              >
                试验数据
              </t-button>
              <t-popconfirm
                v-if="['样品'].includes(row.operateType)"
                content="确认删除吗"
                @confirm="() => onSampleDelete(row, rowIndex)"
              >
                <t-button
                  title="删除"
                  style="width: 50px"
                  theme="danger"
                  shape="square"
                  variant="text"
                  @click.stop="null"
                >
                  删除
                </t-button>
              </t-popconfirm>
            </div>
          </div>
        </template>
        <template #type-slot-operate="{ col, row, rowIndex }">
          <div style="display: flex; align-items: center; gap: 10px">
            <t-link
              v-if="row.operateType === '样品'"
              theme="primary"
              hover="color"
              @click="expandDataFunc(row)"
            >
              记录
            </t-link>
            <t-switch
              v-if="['物料', '操作'].includes(row.operateType)"
              v-model="row.is_sample"
              :disabled="row.is_sample"
              :label="['已出样', '未出样']"
              @change="creatSample(row)"
            ></t-switch>

            <t-popconfirm
              v-if="false"
              content="确认删除吗"
              @confirm="() => onDelete(row)"
            >
              <t-button
                title="删除"
                theme="danger"
                shape="square"
                variant="text"
                >删除
              </t-button>
            </t-popconfirm>
          </div>
        </template>
      </t-table>
      <!--      <node-view-content :node="node"></node-view-content>-->
    </div>
    <!-- <t-dialog
      v-model:visible="select_design_visible"
      destroy-on-close
      :close-on-overlay-click="false"
      header="选择实验设计方案" :cancel-btn="null"
      width="600" attach="body"
      :confirm-on-enter="true"
      :on-confirm="on_select_design_formFunc"
    >
      <t-form ref="select_design_form" :rules="FORM_RULES" :data="selectTableForm" :colon="true" >
        <t-form-item label="实验设计方案" name="experimental_design">
          <t-select v-model="selectTableForm.experimental_design" multiple borderless placeholder="请选择" style="width: 100%;" clearable filterable >
            <t-option v-for="item in experimental_designOptions" :key="item.id" :value="item.id" :label="item.title"></t-option>
          </t-select>
        </t-form-item>
      </t-form>
    </t-dialog> -->
    <select-experimental-design
      v-if="select_design_visible"
      v-model:node-attrs="_nodeAttrs"
      :node="node"
      :editor="editor"
      @cancel="selectDesignCancel"
      @submit="submitExperimentalDesign"
    />
    <t-dialog
      v-model:visible="result_design_visible"
      destroy-on-close
      :close-on-overlay-click="false"
      header="试验方法设计"
      :cancel-btn="null"
      width="80%"
      attach="body"
      :confirmBtn="null"
      :confirm-on-enter="true"
      :on-cancel="onCancelFunc"
      :on-close="onCancelFunc"
    >
      <experimental-design
        v-if="result_design_visible"
        v-model:designParams="designResult"
        readonly
      />
    </t-dialog>
    <t-dialog
      v-model:visible="sampleOrthogonalDialog"
      destroy-on-close
      :close-on-overlay-click="false"
      header="变量选择"
      :cancel-btn="null"
      width="70%"
      attach="body"
      :confirm-on-enter="true"
      :on-confirm="onSampleOrthogonalFunc"
    >
      <variable-sample-creat
        v-if="sampleOrthogonalDialog && creatSampleOrthogonal"
        :data="creatSampleOrthogonal.isOrthogonal"
        @change="sampleOrthogonalChange"
      />
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
            <t-option
              v-for="item in assessmentOption"
              :key="item.id"
              :value="item.id"
              :label="item.title"
            ></t-option>
          </t-select>
        </t-form-item>
      </t-form>
    </t-dialog>
    <t-dialog
      destroyOnClose
      v-model:visible="dialog_visible"
      header="表格列配置"
      width="40%"
      attach="body"
      :confirm-on-enter="true"
      :on-confirm="onConfirmFunc"
    >
      <t-space direction="vertical" style="width: 100%">
        <div>
          <p>请选择需要在表格中显示的数据列</p>
        </div>
        <t-card header-bordered :style="{ width: '400px' }">
          <template #header>
            <t-checkbox
              :checked="checkAll"
              :indeterminate="indeterminate"
              :on-change="handleSelectAll"
              >全选
            </t-checkbox>
          </template>
          <template #content>
            <t-checkbox-group
              v-model="displayColumnsC"
              label="title"
              value="colKey"
              :options="columnsCheckboxs"
            />
          </template>
        </t-card>
      </t-space>
    </t-dialog>
  </node-view-wrapper>
</template>

<script setup lang="jsx">
import { nodeViewProps, NodeViewWrapper, NodeViewContent } from '@tiptap/vue-3'
import { v4 as uuid } from 'uuid'
import {
  getEval_attribute_libraryListFetch,
  get_ingredient_dev_sampleListFetch,
  post_ingredient_dev_sample_fetch,
} from '@/api/experiment'
import { timeFormat } from '@/utils/time-ago'
import { cloneDeep } from 'lodash-es'
import { shortId } from '@/utils/short-id'
import { mergeRowsByFields } from '@/utils/index'
import Template from '@/components/menus/toolbar/insert/template.vue'

const { editor, node, updateAttributes } = defineProps(nodeViewProps)

const { options, refreshNode } = useStore()
const dialog_visible = ref(false)
const tableRef = ref()
const editableRowKeys = ref([])
const currentSaveId = ref('')
// 保存变化过的行信息
const editMap = {}
const loading = ref(false)
const searchTitle = ref('')
const raw_materialOptions = ref([])
const technologyOptions = ref([])
const experimental_designOptions = ref([])
const selectRow = ref()

const select_record_form = ref()

const select_index_visible = ref(false)

const technologyInfoVisible = ref(false)

const $key_data = JSON.parse(localStorage.getItem('key_data'))
const experiment_record = computed(() => $key_data?.experiment_record)
const experiment_theme = computed(() => $key_data?.experiment_theme)
const select_design_visible = ref(false)

const result_design_visible = ref(false)
const experimental_design_visible = ref(false)

const select_design_form = ref()

const assessmentOption = ref([])
const expandedRowKeys = ref([])

const selectRecordTable = ref()

const creatSampleOrthogonal = ref({isOrthogonal:[] })
const sampleOrthogonalDialog = ref(false)
const selectSampleOrthogonal = ref()

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
const select_material = ref([])

const _nodeAttrs = computed({
  get: () => node.attrs,
  set: (value) => {
    // Update the node in the editor
    updateAttributes(value)
  },
})

const _title = computed({
  get: () => node.attrs.title,
  set(value) {
    updateAttributes({ title: value })
  },
})

const updateTime = computed({
  get: () => node.attrs.updateTime,
  set(value) {
    updateAttributes({ updateTime: value })
  },
})

const isChanged = computed({
  get: () => node.attrs.isChanged,
  set(value) {
    updateAttributes({ isChanged: value })
  },
})
const is_integration = computed({
  get: () => node.attrs.is_integration,
  set(value) {
    updateAttributes({ is_integration: value })
  },
})
const group = computed({
  get: () => node.attrs.group,
  set(value) {
    updateAttributes({ group: value })
  },
})

const pagination = ref({
  limit: 20,
  total: 0,
  page: 1,
})

const table_data = computed({
  get: () => node.attrs.table_data,
  set(value) {
    updateAttributes({ table_data: value })
  },
})

const designResult = computed({
  get: () => node.attrs.designResult,
  set(value) {
    updateAttributes({ designResult: value })
  },
})

const sampleOrthogonalChange = (value) => {
  selectSampleOrthogonal.value = value
}

const submitExperimentalDesign = () => {
  console.log(
    '---------------submitExperimentalDesign----448--------',
    designResult.value,
  )
  select_design_visible.value = false
  let table_dataV = table_data.value ? table_data.value : []
  let rowIndex = 0
  designResult.value.formItems.forEach((procedure, indexP) => {
    procedure.formItems.forEach((operate, indexO) => {
      const row = {
        id: uuid(),
        procedure_rowKey: procedure.rowKey,
        operate_rowKey: operate.rowKey,
        operateType: operate.operateType,
        formData: designResult.value.formData[procedure.key][operate.key],
        formItems: operate,
        description: operate.description,
        params: operate.params,
        procedure: {
          id: procedure.id,
          title: procedure.title,
          key: procedure.key,
          rowKey: procedure.rowKey,
        },
        is_sample: false,
        sample: {},
        operate_router: {
          id: operate.id,
          title: operate.title,
          key: operate.key,
          rowKey: operate.rowKey,
        },
      }
      const index = table_dataV.findIndex(
        (ele) =>
          ele.procedure_rowKey === row.procedure_rowKey &&
          ele.operate_rowKey === row.operate_rowKey,
      )
      let oldRow = []
      if (index > -1) {
        oldRow = table_dataV.splice(index, 1)
      }
      table_dataV.splice(rowIndex, 0, {
        ...row,
        formData: {
          ...row.formData,
          attachment: oldRow.length > 0 ? oldRow[0].formData.attachment : [],
        },
        description: oldRow.length > 0 ? oldRow[0].description : '',
      })

      rowIndex++
    })
    const row = {
      id: uuid(),
      procedure_rowKey: procedure.rowKey,
      operate_rowKey: `过程描述${shortId()}`,
      operateType: '过程描述',
      formData: { description: procedure.description },
      formItems: { title: '过程描述' },
      description: procedure.description,
      params: {},
      procedure: {
        id: procedure.id,
        title: procedure.title,
        key: procedure.key,
        rowKey: procedure.rowKey,
      },
      is_sample: false,
      sample: {},
      operate_router: { title: '过程描述' },
    }
    const index = table_dataV.findIndex(
      (ele) =>
        ele.procedure_rowKey === row.procedure_rowKey &&
        ele.operateType === '过程描述',
    )
    if (index === -1) {
      table_dataV.splice(rowIndex, 0, row)
    } else {
      const oldRow = table_dataV.splice(index, 1)
      table_dataV.splice(rowIndex, 0, oldRow[0])
    }
    rowIndex++
  })
  const sampleData = table_dataV.filter((ele) => ele.operateType === '样品')
  table_dataV = table_dataV.filter((ele) => ele.operateType !== '样品')
  sampleData.forEach((row) => {
    const index = table_dataV.findIndex(
      (ele) =>
        ele.operateType !== '样品' &&
        ele.procedure_rowKey === row.procedure_rowKey &&
        ele.operate_rowKey === row.operate_rowKey,
    )
    if (index > -1) {
      table_dataV.splice(index + 1, 0, row)
    }
  })

  table_data.value = []
  nextTick(() => {
    table_data.value = cloneDeep(table_dataV)
    tableRef.value?.refreshTable()
    updateTime.value = timeFormat(null, 'yyyy-mm-dd hh:MM:ss')
  })

  console.log(
    '---------------submitExperimentalDesign-----493-------',
    table_data.value,
    table_dataV,
  )
}

const selectDesignCancel = () => {
  select_design_visible.value = false
}

const onShowFunc = () => {
  result_design_visible.value = true
}

const onAddFunc = () => {
  if (designResult.value.formItems && designResult.value.formItems.length > 0) {
    select_design_visible.value = true
  } else {
    initialize()
    select_design_visible.value = true
  }
}

const expandDataFunc = (row) => {
  if (expandedRowKeys.value.includes(row.id)) {
    expandedRowKeys.value = expandedRowKeys.value.filter(
      (item) => item !== row.id,
    )
  } else {
    expandedRowKeys.value.push(row.id)
    if (
      row.sample?.record_table?.table_data?.length > 0 ||
      row.formData.attachment
    ) {
      nextTick(() => {
        refreshNode.type = 'sample_table'
        refreshNode.selectId = row.id
        refreshNode.data = {
          ...refreshNode.data,
          [row.id]: row,
        }
      })
    }
  }
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

const onAddIndexFunc = (row) => {
  selectRecordTable.value = row
  select_index_visible.value = true
}

const onDelete = async (row) => {
  updateTime.value = timeFormat(null, 'yyyy-mm-dd hh:MM:ss')
  table_data.value.splice(table_data.value.indexOf(row), 1)
}

const rowspanAndColspan = ({ row, col, rowIndex, colIndex }) => {
  if (colIndex > 1 && row.operateType === '过程描述') {
    if (colIndex === 2) {
      return { rowspan: 1, colspan: 2 }
    } else if (colIndex === 3) {
      return { rowspan: 0, colspan: 0 }
    } else {
      return { rowspan: 1, colspan: 1 }
    }
  } else {
    return mergeRowsByFields(
      ['procedure'],
      'procedure_rowKey',
      table_data.value,
    )({ row, col, rowIndex })
  }
}

const columns = ref([])

const columnsCheckboxs = ref([])

const displayColumns = ref([])
const displayColumnsC = ref([])
displayColumns.value = [
  'name',
  'procedure',
  'operate_router',
  'formItems',
  'sn',
  'experimental_design',
  'weight',
  'description',
  'is_sample',
  'operate',
]
const frontColumns = [
  {
    colKey: 'name',
    title: '名称',
    edit: {
      // 1. 支持任意组件。需保证组件包含 `value` 和 `onChange` 两个属性，且 onChange 的第一个参数值为 new value。
      // 2. 如果希望支持校验，组件还需包含 `status` 和 `tips` 属性。具体 API 含义参考 Input 组件
      component: TInput,
      // props, 透传全部属性到 Input 组件
      props: {
        clearable: true,
        autofocus: true,
        // autoWidth: true,
      },
      // 校验规则，此处同 Form 表单
      rules: [
        {
          required: true,
          message: '不能为空',
        },
      ],
      showEditIcon: true,
      abortEditOnEvent: ['onEnter', 'onBlur'],
      onEdited: (context) => {
        const newData = [...table_data.value]
        newData.splice(context.rowIndex, 1, context.newRowData)
        table_data.value = newData

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
        defaultEditable: false,
      }),
    },
    width: 240,
  },
]
const suffixColumns = [
  {
    title: '操作',
    colKey: 'operate',
    width: 150,
    cell: 'type-slot-operate',
  },
]
columns.value = [
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
    width: 120,
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
    width: 280,
    cell: 'type-slot-operate-router',
  },
  {
    colKey: 'description',
    title: '实验记录',
    width: 220,
    cell: 'slot-description',
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
      showEditIcon: false,
      abortEditOnEvent: ['onEnter', 'onBlur'],
      onEdited: (context) => {
        const newData = [...table_data.value]
        updateTime.value = timeFormat(null, 'yyyy-mm-dd hh:MM:ss')
        newData.splice(context.rowIndex, 1, context.newRowData)
        table_data.value = newData
        if (context.newRowData.operateType === '样品') {
          nextTick(() => {
            refreshNode.type = 'sample_table'
            refreshNode.selectId = context.newRowData.id
            refreshNode.data = {
              ...refreshNode.data,
              [context.newRowData.id]: context.newRowData,
            }
          })
        }

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
  // {
  //   title: '操作',
  //   colKey: 'operate',
  //   width: 120,
  //   cell: 'type-slot-operate',
  // },
]

const checkAll = computed(
  () => displayColumns.value.length === displayColumnsC.value.length,
)
const indeterminate = computed(
  () =>
    !!(
      displayColumns.value.length > displayColumnsC.value.length &&
      displayColumnsC.value.length
    ),
)

watch(
  () => refreshNode,
  (value) => {
    if (value.type === 'record_sample_table') {
      nextTick(() => {
        let index = -1
        index = table_data.value.findIndex((row) => row.id === value.selectId)
        if (index > -1) {
          table_data.value.splice(index, 1, value.data[value.selectId])
          refreshNode.type = ''
        }
      })
    }
  },
  { deep: true, immediate: true },
)

const handleSelectAll = (checked) => {
  displayColumnsC.value = checked ? [...displayColumns.value] : []
}

const onConfirmFunc = () => {
  displayColumns.value = [...displayColumnsC.value]
  dialog_visible.value = false
}

const columnEditFunc = () => {
  columnsCheckboxs.value = columns.value.map((col) => {
    return { label: col.title, value: col.colKey }
  })
  displayColumnsC.value = [...displayColumns.value]
  dialog_visible.value = true
}

const sampleRecordChange = (row) => {
  if (
    row.sample?.record_table?.table_data?.length > 0 ||
    row.formData.attachment
  ) {
    // refreshNode.type = 'sample_table'
    // refreshNode.selectId = row.id
    // refreshNode.data = {
    //   ...refreshNode.data,
    //   [row.id]: row
    // }
  }
  console.log('-------sampleRecordChange------811-----------', refreshNode, row)
}

const onSampleDelete = (row, rowIndex) => {
  const table_dataV = cloneDeep(table_data.value)
  updateTime.value = timeFormat(null, 'yyyy-mm-dd hh:MM:ss')
  table_dataV.splice(rowIndex, 1)
  table_data.value = cloneDeep(table_dataV)
  tableRef.value?.refreshTable()
  nextTick(() => {
    refreshNode.type = 'sample_table'
    refreshNode.selectId = row.id
    refreshNode.data = {
      ...refreshNode.data,
      [row.id]: row,
    }
  })
}

const onSampleOrthogonalFunc = () => {
  console.log('-----onSampleOrthogonalFunc---952------', creatSampleOrthogonal.value, selectSampleOrthogonal.value)
  const params = []
  selectSampleOrthogonal.value.forEach((ele) => {
    params.push( {id: ele.id,formItems: { attribute:ele.formItems.attribute } }  )
  })
  creatSampleToTable(creatSampleOrthogonal.value.row, creatSampleOrthogonal.value.rowIndex, params)
  sampleOrthogonalDialog.value = false
}

const creatSampleToTable = (row, rowIndex,params={}  ) => {
  const $key_data = JSON.parse(localStorage.getItem('key_data'))
  const experiment_record = $key_data?.experiment_record
  const experiment_theme = $key_data?.experiment_theme

  if (experiment_record?.id) {
    const rowC = {
      id: uuid(),
      procedure_rowKey: row.procedure_rowKey,
      operate_rowKey: row.operate_rowKey,
      operateType: '样品',
      formData: {},
      formItems: [],
      description: '',
      procedure: row.procedure,
      test_record_table: node.attrs.id,
      is_sample: false,
      operate_router: { title: '样品检测' },
      params: params,
      sample: {
        id: uuid(),
        name: `样品-${timeFormat(null, 'yymmddhhMM')}${shortId(2)}`,
        sn: `SF-${timeFormat(null, 'yymmddhhMM')}${shortId(2)}`,
        weight: 1,
        record_table: {
          id: uuid(),
          title: `测试${shortId()}`,
          table_data: [],
          columns: [...suffixColumns],
          params: {},
        },
        description: '',
      },
    }

    const rowData = {
      ...rowC,
      is_sample: true,
      sample: {
        ...rowC.sample,
        really_sample: false,
      },
    }

    const table_dataV = cloneDeep(table_data.value)
    updateTime.value = timeFormat(null, 'yyyy-mm-dd hh:MM:ss')
    table_dataV.splice(rowIndex + 1, 0, rowData)
    table_data.value = cloneDeep(table_dataV)
    tableRef.value?.refreshTable()

    refreshNode.type = 'sample_table'
    refreshNode.selectId = rowData.id
    refreshNode.data = {
      ...refreshNode.data,
      [rowData.id]: rowData,
    }
  } else {
    row.is_sample = false
    useMessage('warning', '实验记录数据错误')
  }
}

const creatSample = async (row) => {
  const rowIndex = table_data.value.findIndex((rowT) => rowT.id === row.id)
  const sampleData = table_data.value.slice(0, rowIndex + 1)

  // 出样前判断是否有正交变量操作属性存在
  const filterOrthogonal = sampleData.filter(
    (ele) => ele.operateType === '物料' || ele.operateType === '操作',
  )
  if (filterOrthogonal.length === 0) {
    useMessage('warning', '请先添加物料或操作')
    return
  }
  const isOrthogonal = filterOrthogonal.filter((ele) =>
    ele.formItems.attribute.some((eleS) => eleS.props?.orthogonal),
  )
  console.log('------creatSample-----', isOrthogonal, filterOrthogonal)
  if (isOrthogonal.length > 0) {
    creatSampleOrthogonal.value = { isOrthogonal, row , rowIndex}
    sampleOrthogonalDialog.value = true
    return
  }

  creatSampleToTable(row, rowIndex)
}

const on_select_indexFunc = () => {
  select_record_form.value
    ?.validate({ showErrorMessage: true })
    .then((validateResult) => {
      if (validateResult && Object.keys(validateResult).length) {
        const firstError = Object.values(validateResult)[0]?.[0]?.message
        useMessage('warning', firstError)
      } else {
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

        selectRecordTable.value.record_table.columns = [
          ...paramsColumns,
          ...suffixColumns,
        ]
        selectRecordTable.value.record_table.params = cloneDeep(indexTypes)

        makerecordDataFunc(true)

        let indexC = -1
        table_data.value.forEach((row, index) => {
          if (row.id === selectRecordTable.value.id) {
            indexC = index
          }
        })
        table_data.value.splice(indexC, 1, selectRecordTable.value)
        updateTime.value = timeFormat(null, 'yyyy-mm-dd hh:MM:ss')

        select_index_visible.value = false
      }
    })
}

const makerecordDataFunc = (init = false) => {
  const rowD = { name: selectRecordTable.value.name }

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
  selectRecordTable.value.record_table.params.forEach((ele) => {
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
  nextTick(() => {
    if (init) {
      selectRecordTable.value.record_table.table_data = [rowD]
    } else {
      selectRecordTable.value.record_table.table_data.push(rowD)
    }
  })
}
const on_select_design_formFunc = () => {
  select_design_form.value
    ?.validate({ showErrorMessage: true })
    .then((validateResult) => {
      if (validateResult && Object.keys(validateResult).length) {
        const firstError = Object.values(validateResult)[0]?.[0]?.message
        useMessage('warning', firstError)
      } else {
        on_select_designFunc()
      }
    })
}
const on_select_designFunc = () => {
  // const makeData = ()=>{
  //   const experimental_designs = experimental_designOptions.value.filter(ele=> selectTableForm.value.experimental_design.includes(ele.id)).map(eleT => (eleT.designResult) )
  //   experimental_designs.forEach(ele=>{
  //     const newData = {
  //       id: uuid(),
  //       name: `样品-${timeFormat(null,'yymmddhhMM')}${shortId(2)}`,
  //       sn: `SF-${timeFormat(null,'yymmddhhMM')}${shortId(2)}`,
  //       weight: 1,
  //       is_sample: false,
  // customData:{
  //   photos:[]
  // },
  //       experimental_design: cloneDeep( ele ),
  //       record_table: {
  //         id: uuid(),
  //         title: `测试${shortId()}`,
  //         table_data: [],
  //         columns: [ ...suffixColumns],
  //         params: {},
  //       },
  //       description: '',
  //     }
  //     table_data.value.push(newData)
  //   })
  // }
  // makeData()
  // select_design_visible.value = false
  //
}

const getAssessmentOptionFunc = async (page = 1) => {
  const res = await getEval_attribute_libraryListFetch({ page, limit: 9999 })

  let resD = {}
  if (true) {
    resD = res.data
  } else {
    resD = res.data.value ? res.data.value : res.data
  }
  if (resD.code === 2000) {
    if (page === 1) {
      assessmentOption.value = [...resD.data]
    } else {
      assessmentOption.value = [...assessmentOption.value, ...resD.data]
    }
    pagination.value.total = resD.total
  }
}

getAssessmentOptionFunc()

const initData = async () => {
  loading.value = true
  const params = {
    experiment_theme: experiment_theme.value?.id,
    record: experiment_record.value?.id,
    group: group.value,
  }

  const res = await get_ingredient_dev_sampleListFetch(params)
  loading.value = false
  if (res.data.code === 2000 && res.data.data.length > 0) {
    table_data.value = res.data.data
    if (isChanged.value) {
      isChanged.value = false
    }
  }
}

const initialize = () => {
  const docD = cloneDeep(editor.getJSON())
  if (docD) {
    // 物料表
    const raw_material_tables = docD.content.filter(
      (ele) => ele.type === 'raw_material_table',
    )
    if (raw_material_tables.length === 0) {
      TMessagePlugin.warning('请先创建物料表')
      return // 物料表不存在，返回
    }
    raw_materialOptions.value = raw_material_tables.map((ele) => ele.attrs)
    // 工艺表
    const technology_tables = docD.content.filter(
      (ele) => ele.type === 'technology_table',
    )
    if (technology_tables.length === 0) {
      TMessagePlugin.warning('请先创建工艺表')
      return // 工艺表不存在，返回
    }
    technologyOptions.value = technology_tables.map((ele) => ele.attrs)
    // 试验设计方案
    // const experimental_design_tables = docD.content.filter(ele=> ele.type === 'experimental_design')
    // if (experimental_design_tables.length === 0) {
    //   TMessagePlugin.warning('请先创建试验设计方案')
    //   return  // 试验设计方案，返回
    // }
    // experimental_designOptions.value = experimental_design_tables.map(ele=> ele.attrs)
  } else {
    TMessagePlugin.warning('当前文档中没有数据错误')
  }
}

onMounted(() => {
  initialize()
  if (node.attrs.customerParams?.is_select) {
    selectTableForm.value.experimental_design =
      node.attrs.customerParams?.experimental_design
    on_select_designFunc()
  } else {
    if (!table_data.value || table_data.value?.length === 0) {
      setTimeout(() => {
        if (
          designResult.value.formItems &&
          designResult.value.formItems.length > 0
        ) {
          on_select_designFunc()
        } else {
          select_design_visible.value = true
        }
      }, 500)
    }
  }
  if (group.value && group.value.length > 0 && table_data.value?.length === 0) {
    // await initData()
  } else if (is_integration.value) {
    const docD = cloneDeep(editor.getJSON())
    if (docD) {
      // 物料表
      // const raw_material_tables = docD.content.filter(ele=> ele.type === 'raw_material_table')
      // if (raw_material_tables.length === 0) {
      //   TMessagePlugin.warning('请先创建物料表')
      //   return  // 物料表不存在，返回
      // }
      // raw_materialOptions.value = raw_material_tables.map(ele=> ele.attrs)
      // const dialog = useConfirm({
      //   theme: 'info',
      //   header: '提示',
      //   body: '检测到当前文档中存在物料表，是否使用该物料表进行初始化？',
      //   confirmBtn: '确定',
      //   onConfirm() {
      //     dialog.destroy()
      //     setTimeout(() => {
      //       add_parent_visible.value = true
      //     }, 300)
      //   },
      //   onClosed() {
      //   },
      // })
    } else {
      TMessagePlugin.warning('当前文档中没有数据')
    }
  }
})
</script>

<style lang="scss" scoped>
:deep(
  .node-form-design-render-class table td,
  .node-form-design-render-class table th
) {
  border: none;
}
.slot-description-S-class {
  opacity: 1;
}
.slot-description-class:hover {
  .slot-description-S-class {
    opacity: 1;
  }
}
:deep(.test-record-class) {
  table {
    table-layout: auto;
  }
}

.operate-sample-class {
  cursor: pointer;
}

.operate-router-class:hover {
  cursor: pointer;
}

:deep(.umo-table__top-content) {
  div {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 4px;
    justify-content: space-between;

    .umo-table__column-controller-trigger {
      padding: 10px 0;
    }
  }
}

:deep(.umo-table--column-resizable:not(.umo-table--bordered) th) {
  border-top: 1px solid #333;
}
</style>
