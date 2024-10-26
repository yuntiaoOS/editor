<template>
  <node-view-wrapper :id="node.attrs.id" class="umo-node-view">
    <div style="width: 100%">
      <t-table ref="tableRef" :editable-row-keys="editableRowKeys"
        row-key="key" :data="data" :columns="columns" resizable v-model:displayColumns="displayColumns"
        :column-controller="columnControllerConfig" attach="等等"
        @row-edit="onRowEdit">
        <template #topContent>
          <div style="width: calc(100% - 100px);">
            <t-input v-model="editableRowKeys" placeholder="请输入节点名称" size="small" />
          </div>
        </template>
        <template #type-slot-operate="{ col, row }">
          <div class="table-operations">
            <t-link v-if="!editableRowKeys.includes(row.key)" theme="primary" hover="color" @click="onEdit">
              编辑
            </t-link>
            <div v-else>
              <t-link theme="primary" hover="color" @click="onSave">
                保存
              </t-link>
              <t-link theme="primary" hover="color" @click="onCancel">
                取消
              </t-link>
            </div>
          </div>
        </template>
      </t-table>
      <node-view-content :node="node" ></node-view-content> 
    </div>
    
  </node-view-wrapper>
</template>

<script setup lang="ts">
import { nodeViewProps, NodeViewWrapper,NodeViewContent } from '@tiptap/vue-3'
// import { Button as TButton, EnhancedTable as TTable  } from 'tdesign-vue-next';
import type { TableColumnController, TableProps } from 'tdesign-vue-next';


const { node, updateAttributes } = defineProps(nodeViewProps)

const { options } = useStore()

const tableRef = ref();
const editableRowKeys = ref(['1']);
const currentSaveId = ref('');
// 保存变化过的行信息
const editMap = {};

const data = ref([]) ;

// for (let i = 0; i < 5; i++) {
//   data.value.push({
//     index: i + 1,
//     applicant: ['贾明', '张三', '王芳'][i % 3],
//     status: i % 3,
//     channel: ['电子签署', '纸质签署', '纸质签署'][i % 3],
//     email: ['w.cezkdudy@lhll.au', 'r.nmgw@peurezgn.sl', 'p.cumx@rampblpa.ru'][i % 3],
//     matters: ['宣传物料制作费用', 'algolia 服务报销', '相关周边制作费', '激励奖品快递费'][i % 4],
//     time: [2, 3, 1, 4][i % 4],
//     createTime: ['2022-01-01', '2022-02-01', '2022-03-01', '2022-04-01', '2022-05-01'][i % 4],
//   });
// }

const onEdit = (e: MouseEvent) => {
  console.log('--------onEdit--------44--------',e)
  const { id } = (e.currentTarget as HTMLElement).dataset;
  if (!editableRowKeys.value.includes(id)) {
    editableRowKeys.value.push(id);
  }
};

// 更新 editableRowKeys
const updateEditState = (id: string) => {
  console.log('--------updateEditState--------44--------',id)
  const index = editableRowKeys.value.findIndex((t) => t === id);
  editableRowKeys.value.splice(index, 1);
};
const onCancel = (e: MouseEvent) => {
  console.log('--------onCancel--------44--------',e)
  const { id } = (e.currentTarget as HTMLElement).dataset;
  updateEditState(id);
  tableRef.value?.clearValidateData();
};
const onSave = (e: MouseEvent) => {
  console.log('--------onSave--------44--------',e)
  const { id } = (e.currentTarget as HTMLElement).dataset;
  currentSaveId.value = id;
  // 触发内部校验，而后也可在 onRowValidate 中接收异步校验结果
  tableRef.value.validateRowData(id).then((params) => {
    console.log('Event Table Promise Validate:', params);
    if (params.result.length) {
      const r = params.result[0];
      TMessagePlugin.error(`${r.col.title} ${r.errorList[0].message}`);
      return;
    }
    // 如果是 table 的父组件主动触发校验
    if (params.trigger === 'parent' && !params.result.length) {
      const current = editMap[currentSaveId.value];
      if (current) {
        data.value.splice(current.rowIndex, 1, current.editedRow);
        TMessagePlugin.success('保存成功');
      }
      updateEditState(currentSaveId.value);
    }
  });
};

const columns = ref([])

const displayColumns = ref<TableProps['displayColumns']>([]);

// columns.value = [
//   {
//     colKey: 'applicant',
//     title: '申请人',
//     // type-slot-name 会被用于自定义单元格的插槽名称
//     cell: 'type-slot-name',
//     width: 120,
//     edit: {
//       // 1. 支持任意组件。需保证组件包含 `value` 和 `onChange` 两个属性，且 onChange 的第一个参数值为 new value。
//       // 2. 如果希望支持校验，组件还需包含 `status` 和 `tips` 属性。具体 API 含义参考 Input 组件
//       component: TInput,
//       // props, 透传全部属性到 Input 组件
//       props: {
//         clearable: true,
//         autofocus: true,
//         autoWidth: true,
//       },
//       // 校验规则，此处同 Form 表单
//       rules: [
//         {
//           required: true,
//           message: '不能为空',
//         },
//         {
//           max: 10,
//           message: '字符数量不能超过 10',
//           type: 'warning',
//         },
//       ],
//       showEditIcon: false,
//     },
//   },
//   {
//     title: '审批状态',
//     // 没有 cell 的情况下， platform 会被用作自定义单元格的插槽名称
//     colKey: 'status',
//     cell: 'type-slot-status',
//     width: 120,
//   },
//   {
//     colKey: 'matters',
//     title: '申请事项',
//   },
//   {
//     title: '邮箱地址',
//     colKey: 'email',
//     // render 即可渲染表头，也可以渲染单元格。但 cell 只能渲染单元格，title 只能渲染表头
//   },
//   { colKey: 'createTime', title: '申请时间' },
//   {
//     title: '操作栏',
//     colKey: 'operate',
//     width: 150,
//     cell: 'type-slot-operate',
//   },
// ];

const placement = ref('top-right');
const customText = ref(false);
const groupColumn = ref(false);
const columnControllerConfig = computed(() => {
  const config = {
    // 列配置按钮位置
    placement: placement.value,
    // 用于设置允许用户对哪些列进行显示或隐藏的控制，默认为全部字段
    fields: columns.value.map((item) => item.colKey),
    // 弹框组件属性透传
    dialogProps: { preventScrollThrough: true },
    // 列配置按钮组件属性透传
    buttonProps: customText.value ? { content: '显示列控制', theme: 'primary', variant: 'base' } : undefined,

  }
  console.log('-------onMounted-----config-----', config)
  return config

});

const onRowEdit = (params) => {
  const { row, col, value } = params;
  const oldRowData = editMap[row.key]?.editedRow || row;
  const editedRow = {
    ...oldRowData,
    [col.colKey]: value,
  };
  editMap[row.key] = {
    ...params,
    editedRow,
  };

  // ⚠️ 重要：以下内容应用于全量数据校验（单独的行校验不需要）
  // const newData = [...data.value];
  // newData[rowIndex] = editedRow;
  // data.value = newData;
};

onMounted(() => {
  console.log('-------onMounted-----node-------', node.attrs.option)
  const optionAtt = node.attrs.option;
  if (optionAtt && optionAtt.fields) {
    columns.value = optionAtt.fields.map((field) => ({
      colKey: field.key,
      title: field.title
    }));
    displayColumns.value = optionAtt.fields.map((field) => field.key);
  }
  if (optionAtt && optionAtt.data) {
    data.value = optionAtt.data
  }
  console.log('-------onMounted-----node--22-----',columns.value,data.value )
})

</script>

<style lang="scss" scoped>
:deep(.umo-table__top-content) {
  div{
    display: flex;
    flex-direction: row;
    align-items: center;
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
