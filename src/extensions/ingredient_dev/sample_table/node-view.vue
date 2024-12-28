<template>
  <node-view-wrapper :id="node.attrs.id" class="umo-node-view">
    <div style="width: 100%">
      <!-- <h2>样品</h2> -->
      <t-table :expandIcon="false"
        ref="tableRef"  :loading="loading" :expanded-row-keys="expandedRowKeys" expanded-row="expandedRow"
        row-key="id" :data="table_data" :columns="columns" resizable v-model:displayColumns="displayColumns"
         >
        <template #topContent>
          <div style="padding: 6px 0;display: block;">
            <t-space>
              <div>
                <span :title=" isChanged?'未保存':'已保存' " style="width: 10px; height: 10px; border-radius: 50%;" :style="{background:isChanged? 'var(--td-error-color)' : 'var(--td-success-color)'}"></span>
              </div>
              <t-space>
                <t-input v-if="false" v-model="searchTitle" auto-width placeholder="请输入样品名称" />
                <t-button  variant="outline" @click="onAddFunc">刷新</t-button>
                <div v-if="updateTime&&updateTime.length>10" title="修改时间"><t-icon name="time" size="13px" style="color: #a0a0a0;margin-right:4px;"/><span class="Font12Color">{{updateTime}}</span> </div>
                <t-button title="设置" variant="outline" @click="columnEditFunc"><template #icon> <t-icon name="setting" size="18px"></t-icon></template></t-button>
              </t-space>
            </t-space>
          </div>
        </template>
        <template #expandedRow="slotProps">
          <TestRecordExpanded v-if="expandedRowKeys.includes(slotProps.row.id)" v-model="slotProps.row.value" :sample="slotProps.row.id"></TestRecordExpanded>
        </template>
        <template #type-slot-operate="{ col, row }">
          <div style="display: flex; align-items: center;gap: 10px; ">
            <t-button
              style="width: 50px"
              title="工艺"
              theme="primary"
              shape="square"
              variant="text"
              @click.stop="onTechnology(row)"
            >
              工艺
            </t-button>
            <t-button
              style="width: 80px"
              title="试验数据"
              theme="primary"
              shape="square"
              variant="text"
              @click.stop="expandDataFunc(row)"
            >
              试验数据
            </t-button>

            <!-- <div v-else>
              <t-link theme="primary" hover="color" @click.stop="onSave(row)">
                保存
              </t-link>
              <t-link theme="primary" hover="color" @click.stop="onCancel(row)">
                取消
              </t-link>
            </div> -->
<!--            <t-popconfirm content="确认删除吗" @confirm="() => onDelete(row)" >-->
<!--              <t-button title="删除" theme="danger" shape="square" variant="text" >删除</t-button>-->
<!--            </t-popconfirm>-->
          </div>
        </template>
      </t-table>
      <node-view-content :node="node" ></node-view-content> 
    </div>
    <editSampleView v-if="editSampleDialogVisible" v-model:dialog-visible="editSampleDialogVisible" :design-params="_designParams" @onSubmit="onSubmit" />
    <t-dialog destroyOnClose
      v-model:visible="technologyInfoVisible"
      header="工艺详情" :footer="false"
      width="70%" attach="body"
    >
      <t-table v-if="selectRow"
        :rowspan-and-colspan="rowspanAndColspan"
        ref="tableRef"
        :loading="loading"
        table-layout="auto"
        :expandIcon="false"
        row-key="id"
        :data="selectRow.value.formItems"
        :columns="technologyColumns"
      >
        <template #expandedRow="slotProps">
          <TestRecordExpanded v-model="slotProps.row"></TestRecordExpanded>
        </template>
        <template #type-slot-operate-router="{ col, row, rowIndex }">
          <div class="operate-router-class">
            <div v-if="row.operateType === '样品'">
              <div>
                <span>{{ row.sample.name }} ：{{ row.sample.sn }}</span>
              </div>
            </div>
            <FormDesignRender
              v-else-if="row.operateType !== '过程描述'"
              v-model="row.formData"
              style="overflow: auto"
              :label="row.operate_router.title + '：'"
              :mode="'READ'"
              readonly
              :config="row.operate_router"
            >
            </FormDesignRender>
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
    
    <t-dialog destroyOnClose
      v-model:visible="dialog_visible"
      header="表格列配置"
      width="40%" attach="body"
      :confirm-on-enter="true"
      :on-confirm="onConfirmFunc"
    >
      <t-space direction="vertical" style="width: 100%">
        <div>
          <p>请选择需要在表格中显示的数据列</p>
        </div>
        <t-card header-bordered :style="{ width: '400px' }">
          <template #header>
            <t-checkbox :checked="checkAll" :indeterminate="indeterminate" :on-change="handleSelectAll">全选</t-checkbox>
          </template>
          <template #content>
            <t-checkbox-group v-model="displayColumnsC" label="title" value="colKey" :options="columnsCheckboxs" />
          </template>

        </t-card>
      </t-space>
    </t-dialog>
  </node-view-wrapper>
</template>

<script setup lang="jsx">
import { nodeViewProps, NodeViewWrapper,NodeViewContent } from '@tiptap/vue-3'
import { v4 as uuid } from 'uuid'
import { getIngredient_dev_experimentListFetch,post_ingredient_dev_sample_fetch,delete_ingredient_dev_sampleFetch,get_ingredient_dev_sampleListFetch ,put_ingredient_dev_sample_fetch } from '@/api/experiment'
import { timeFormat } from '@/utils/time-ago'
import Template from '@/components/menus/toolbar/insert/template.vue'
import { mergeRowsByFields } from '@/utils/index'

const { editor, node, updateAttributes } = defineProps(nodeViewProps)

const { options , refreshNode } = useStore()
const dialog_visible = ref(false);
const tableRef = ref();
const editableRowKeys = ref([]);
const currentSaveId = ref('');
// 保存变化过的行信息
const editMap  = {};
const loading = ref(false);
const searchTitle = ref('')

const editSampleDialogVisible = ref(false);
const selectRow = ref()

const technologyInfoVisible = ref(false);
const expandSampleData = ref([])

const $key_data = JSON.parse( localStorage.getItem('key_data'))
const experiment_record = computed(() => $key_data?.experiment_record)
const experiment_theme = computed(() => $key_data?.experiment_theme)

const experimental_design_visible = ref(false);
const expandedRowKeys = ref([])
const select_material = ref([])

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

watch(() => refreshNode?.value, async (value) => {
  console.log('--------refreshNode.value--------',value)
  if (value === 'sample_table') {
    await initData()
    refreshNode.value = ''
  }
})

const _designParams = computed({
  get: () => node.attrs.designParams,
  set(value) {
    updateAttributes({ designParams: value })
  },
})

const designResult = ref([])

const table_data = computed({
  get: () => node.attrs.table_data,
  set(value) {
    updateAttributes({ table_data: value })
  },
})

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
    ellipsis: true,
    minWidth: 220,
  }
]);

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
      selectRow.value.value.formItems,
    )({ row, col, rowIndex })
  }
}

const expandDataFunc = (row) => {
  if (expandedRowKeys.value.includes(row.id)) {
    expandedRowKeys.value = expandedRowKeys.value.filter(
      (item) => item !== row.id,
    )
  } else {
    expandedRowKeys.value.push(row.id)
  }

}

const onAddFunc = async () => {
  await initData()
  // editSampleDialogVisible.value = true
  console.log('------220--------onAddFunc----------')
}

const onTechnology = (row)=> {
  console.log('----220--onTechnology-------',row)
  selectRow.value = row
  technologyInfoVisible.value = true
}

const onSubmit = async (row)=> {
  const params = {
    experiment_theme: experiment_theme.value?.id,
    record: experiment_record.value?.id,
    keys: _designParams.value.filter(ele=> ele.check).map(ele=> `${ele.key }_id`),
    values: _designParams.value.filter(ele=> ele.check).map(ele=> ele.key),
    group: group.value,
    data: [{
      ...row,
      name: row.name&&row.name.length>0 ? row.name : `SF-${timeFormat(null,'yyyymmddhhMMss')}`,
      raw_material: row.id,
      count: '0',
    }]
  }
  const res = await post_ingredient_dev_sample_fetch(params)
  console.log('--------on_experimental_designFunc--------180--------',params,_designParams.value,designResult.value)
  if (res.data.code === 2000) {
    console.log('--------on_experimental_designFunc--------183--------',editor.state)
    group.value =  res.data.data.group
    updateTime.value = timeFormat(null,'yyyy-mm-dd hh:MM:ss')
    await initData()
  }else{
    TMessagePlugin.warning(res.data.msg)
  }


}

const onDelete = async(row) => {
  console.log('--------onDelete--------44--------',row)
  const params = {
    group: group.value,
  }
  isChanged.value = true
  const res = await delete_ingredient_dev_sampleFetch(row.id,params)
  if (res.data.code === 2000) {
    useMessage('success' ,res.data.msg);
    // group.value =  res.data.data.group
    updateTime.value = timeFormat(null,'yyyy-mm-dd hh:MM:ss')
    await initData()
  }

  // const index = table_data.value.findIndex((t ) => t === row);
  // table_data.value.splice(index, 1);
};

const columns = ref([])

const columnsCheckboxs = ref([])

const displayColumns = ref([]);
const displayColumnsC = ref([]);
displayColumns.value = ['name','sn', 'count','description', 'operate']
columns.value = [
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
      abortEditOnEvent: ['onEnter','onBlur'],
      onEdited: async (context ) => {
        console.log(context);
        const params = {
          name:context.newRowData.name,
          group: group.value
        }
        isChanged.value = true
        const res = await put_ingredient_dev_sample_fetch(context.row.id,params)
        if (res.data.code === 2000) {
          useMessage('success' ,res.data.msg);
          group.value =  res.data.data.group
          updateTime.value = timeFormat(null,'yyyy-mm-dd hh:MM:ss')
          // const newData = [...table_data.value];
          // newData.splice(context.rowIndex, 1, context.newRowData);
          // table_data.value = newData;
          await initData()
          console.log('Edit firstName:', context);
        }
        
      },
      // 触发校验的时机（when to validate)
      validateTrigger: 'change',
      // 透传给 component: Input 的事件（也可以在 edit.props 中添加）
      on: (editContext ) => ({
        onBlur: (ctx ) => {
          console.log('失去焦点', editContext);
          ctx?.e?.preventDefault();
        },
        onEnter: (ctx ) => {
          ctx?.e?.preventDefault();
          console.log('onEnter', ctx);
        },
        // 默认是否为编辑状态
        defaultEditable: false,
      }),
    },
    minWidth: 120,
  },
  {
    colKey: 'sn',
    title: '编号',
    width: 170,
  },
  {
    colKey: 'count',
    title: '数量',
    width: 160,
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
      abortEditOnEvent: ['onEnter','onBlur'],
      onEdited: async (context ) => {
        console.log(context);
        const params = {
          count:context.newRowData.count,
          group: group.value
        }
        isChanged.value = true
        const res = await put_ingredient_dev_sample_fetch(context.row.id,params)
        if (res.data.code === 2000) {
          useMessage('success' ,res.data.msg);
          group.value =  res.data.data.group
          updateTime.value = timeFormat(null,'yyyy-mm-dd hh:MM:ss')
          await initData()
          console.log('Edit firstName:', context);
        }
      },
      // 触发校验的时机（when to validate)
      validateTrigger: 'change',
      // 透传给 component: Input 的事件（也可以在 edit.props 中添加）
      on: (editContext ) => ({
        onBlur: (ctx ) => {
          console.log('失去焦点', editContext);
          ctx?.e?.preventDefault();
        },
        onEnter: (ctx ) => {
          ctx?.e?.preventDefault();
          console.log('onEnter', ctx);
        },
        // 默认是否为编辑状态
        defaultEditable: false,
      }),
    },
  },
  {
    colKey: 'description',
    title: '描述',
    ellipsis: true,
    minWidth: 100,
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
      abortEditOnEvent: ['onEnter','onBlur'],
      onEdited:async (context ) => {
        console.log(context);
        const params = {
          description:context.newRowData.description,
          group: group.value
        }
        isChanged.value = true
        const res = await put_ingredient_dev_sample_fetch(context.row.id,params)
        if (res.data.code === 2000) {
          useMessage('success' ,res.data.msg);
          group.value =  res.data.data.group
          updateTime.value = timeFormat(null,'yyyy-mm-dd hh:MM:ss')
          await initData()
          console.log('Edit firstName:', context);
        }
      },
      // 触发校验的时机（when to validate)
      validateTrigger: 'change',
      // 透传给 component: Input 的事件（也可以在 edit.props 中添加）
      on: (editContext ) => ({
        onBlur: (ctx ) => {
          console.log('失去焦点', editContext);
          ctx?.e?.preventDefault();
        },
        onEnter: (ctx ) => {
          ctx?.e?.preventDefault();
          console.log('onEnter', ctx);
        },
        // 默认是否为编辑状态
        defaultEditable: true,
      }),
    },
  },
  {
    title: '操作',
    colKey: 'operate',
    width: 150,
    cell: 'type-slot-operate',
  },
];

const checkAll = computed(() => displayColumns.value.length === displayColumnsC.value.length);
const indeterminate = computed(() => !!(displayColumns.value.length > displayColumnsC.value.length && displayColumnsC.value.length));

const handleSelectAll = (checked) => {
  displayColumnsC.value = checked ? [ ...displayColumns.value ] : [];
}

const onConfirmFunc = ()=>{
  displayColumns.value = [ ...displayColumnsC.value ]
  dialog_visible.value = false
}

const columnEditFunc = ()=>{
  columnsCheckboxs.value = columns.value.map((col )=>{ return { label:col.title, value:col.colKey } })
  displayColumnsC.value = [ ...displayColumns.value ]
  dialog_visible.value = true
}

const initData = async () => {
  loading.value = true
  const params = {
    experiment_theme: experiment_theme.value?.id,
    record: experiment_record.value?.id,
  }
  console.log('----------initData-----297---------',params)
  const res = await get_ingredient_dev_sampleListFetch(params)
  loading.value = false
  if (res.data.code === 2000 && res.data.data.length > 0) {
    table_data.value = res.data.data
    updateTime.value = timeFormat(null,'yyyy-mm-dd hh:MM:ss')
    if (isChanged.value) { isChanged.value = false }
  }
}

onMounted(async () => {
  console.log('----------4447----onMounted-----',node);
  await initData()
})

</script>

<style lang="scss" scoped>
:deep(.umo-table__top-content) {
  div{
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
