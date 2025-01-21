<template>
  <node-view-wrapper :id="node.attrs.id" class="umo-node-view">
    <div style="width: 100%">
      <!-- <h2>试验原辅料</h2> -->
      <t-table
        ref="tableRef"
        row-key="id" :data="table_data" :columns="columns" resizable v-model:displayColumns="displayColumns"
        >
        <template #topContent>
          <div style="padding: 6px 0;display: block;">
            <t-space>
              <div></div>
              <t-space>
                <t-input v-if="false" v-model="searchTitle" auto-width placeholder="请输入物料名称" />
                <t-button variant="outline" @click="add_dialog_visible = true;">新增</t-button>
                <t-button variant="outline" @click="columnEditFunc"><template #icon> <t-icon name="setting" size="18px"></t-icon></template>列配置</t-button>
              </t-space>
            </t-space>
          </div>
        </template>
        <template #type-slot-sort="{ col, row , rowIndex}">
          <t-space>
            <t-icon v-if="rowIndex!==0" name="order-ascending" size="18px"></t-icon>
            <div v-else></div>
            <t-icon v-if="rowIndex!==table_data.length-1" name="order-descending" size="18px"></t-icon>
          </t-space>

        </template>
        <template #type-slot-operate="{ col, row }">
          <div class="table-operations">
            <!-- <t-link v-if="!editableRowKeys.includes(row.id)" theme="primary" hover="color" @click.stop="onEdit(row)">
              编辑
            </t-link>
            <div v-else>
              <t-link theme="primary" hover="color" @click.stop="onSave(row)">
                保存
              </t-link>
              <t-link theme="primary" hover="color" @click.stop="onCancel(row)">
                取消
              </t-link>
            </div> -->
            <t-popconfirm content="确认删除吗" @confirm="() => onDelete(row)" >
              <t-button title="删除" theme="danger" shape="square" variant="text" >删除</t-button>
            </t-popconfirm>
          </div>
        </template>
      </t-table>
<!--      <node-view-content :node="node" ></node-view-content>-->
    </div>
    <t-dialog destroyOnClose
      v-model:visible="add_dialog_visible"
      header="新增物料"
      width="80%" attach="body"
      :confirm-on-enter="true"
      :on-confirm="on_select_materialFunc"
    >
      <materialSelect v-if="add_dialog_visible" @select-change="onSelectChange"/>
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

const { node, updateAttributes } = defineProps(nodeViewProps)

const { options } = useStore()
const dialog_visible = ref(false);
const tableRef = ref();
const editableRowKeys = ref([]);
const currentSaveId = ref('');
// 保存变化过的行信息
const editMap  = {};

const searchTitle = ref('')
const add_dialog_visible = ref(false);

const select_material = ref([])

const table_data = computed({
  get: () => node.attrs.table_data,
  set(value) {
    updateAttributes({ table_data: value })
  },
})


const onAdd = ()=>{
  add_dialog_visible.value = true
}

const onSelectChange = ({value, params} )=>{
  //
  select_material.value = params.selectedRowData
}

const on_select_materialFunc = ()=>{
  select_material.value.forEach((ele ) => {
    const obj  = {
      ...ele,
      // content: '0.0',
    }
    table_data.value.push(obj)
  });

  add_dialog_visible.value = false
}

const onEdit = (row) => {

  if (!editableRowKeys.value.includes(row.id)) {
    editableRowKeys.value.push(row.id);
  }
};

const onDelete = (row) => {

  const index = table_data.value.findIndex((t ) => t === row);
  table_data.value.splice(index, 1);
};

const onDragSort = (params ) => {

  table_data.value = params.newData;
};
// 更新 editableRowKeys
const updateEditState = (id) => {

  const index = editableRowKeys.value.findIndex((t) => t === id);
  editableRowKeys.value.splice(index, 1);
};
const onCancel = (row) => {

  const { id } = row;
  updateEditState(id );
  tableRef.value?.clearValidateData();
};
const onSave = (row) => {

  const { id } = row;
  currentSaveId.value = id;
  // 触发内部校验，而后也可在 onRowValidate 中接收异步校验结果
  tableRef.value.validateRowData(id).then((params ) => {

    if (params.result.length) {
      const r = params.result[0];
      TMessagePlugin.error(`${r.col.title} ${r.errorList[0].message}`);
      return;
    }
    // 如果是 table 的父组件主动触发校验
    if (params.trigger === 'parent' && !params.result.length) {
      const current = editMap[currentSaveId.value];
      if (current) {
        table_data.value.splice(current.rowIndex, 1, current.editedRow);
        TMessagePlugin.success('保存成功');
      }
      updateEditState(currentSaveId.value);
    }
  });
};

const columns = ref([])

const columnsCheckboxs = ref([])

const displayColumns = ref([]);
const displayColumnsC = ref([]);
displayColumns.value = ['material','batch', 'supplier', 'price', 'description', 'operate']
columns.value = [
  // {
  //   title: '排序',
  //   colKey: 'sort',
  //   width: 80,
  //   cell: 'type-slot-sort',
  // },
  // {
  //   title: '序号',
  //   colKey: 'serial-number',
  //   width: 45,
  // },
  {
    colKey: 'material',
    title: '物料',
    cell: (h , { row: { material}, rowIndex } ) => {
      const status = rowIndex % 3;
      return (
        <div>
          <span>{material ? material.name : ''}</span>
          <t-tag size="small">{material ? material.sn : ''}</t-tag>
        </div>
      );
    },
    minWidth: 120,
  },
  {
    colKey: 'batch',
    title: '批次',
    width: 170,
  },
  // {
  //   colKey: 'content',
  //   title: '含量%',
  //   width: 120,
  // },
  {
    colKey: 'supplier',
    title: '供应商',
    width: 160,
  },
  {
    colKey: 'price',
    title: '价格',
    width: 90,
  },
  // {
  //   colKey: 'cas',
  //   title: 'CAS号',
  //   width: 120,
  // },
  {
    colKey: 'description',
    title: '描述',
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
      onEdited: (context ) => {

        const newData = [...table_data.value];
        newData.splice(context.rowIndex, 1, context.newRowData);
        table_data.value = newData;

        useMessage('success' ,'Success');
      },
      // 触发校验的时机（when to validate)
      validateTrigger: 'change',
      // 透传给 component: Input 的事件（也可以在 edit.props 中添加）
      on: (editContext ) => ({
        onBlur: (ctx ) => {

          ctx?.e?.preventDefault();
        },
        onEnter: (ctx ) => {
          ctx?.e?.preventDefault();

        },
        // 默认是否为编辑状态
        defaultEditable: true,
      }),
    },
  },
  {
    title: '操作',
    colKey: 'operate',
    width: 80,
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

const onCellClick = ({row,col} ) => {

  const editMapKey = ['content','description']
  if (!editableRowKeys.value.includes(row.id)) {
    editableRowKeys.value.push(row.id);
  }else{
    onCancel(row)
  }
}

const onRowEdit = (params ) => {
  const { row, col, value } = params;
  const oldRowData  = editMap[row.id]?.editedRow || row;
  const editedRow = {
    ...oldRowData,
    [col.colKey]: value,
  };
  editMap[row.id] = {
    ...params,
    editedRow,
  };

  // ⚠️ 重要：以下内容应用于全量数据校验（单独的行校验不需要）
  // const newData = [...table_data.value];
  // newData[rowIndex] = editedRow;
  // table_data.value = newData;
};

onMounted(() => {
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
