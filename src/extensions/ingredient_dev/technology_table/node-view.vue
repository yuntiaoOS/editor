<template>
  <node-view-wrapper :id="node.attrs.id" class="umo-node-view">
    <div style="width: 100%">
      <t-enhanced-table ref="tableRef" v-model:expandedTreeNodes="expandedTreeNodes" :tree-expand-and-fold-icon="treeExpandIcon" 
        row-key="key" drag-sort="row-handler" :data="data" :columns="columns" resizable :tree="treeConfig" :pagination="pagination"
        :before-drag-sort="beforeDragSort" @abnormal-drag-sort="onAbnormalDragSort" @drag-sort="onDragSort"
        @page-change="onPageChange" @expanded-tree-nodes-change="onExpandedTreeNodesChange" >
      </t-enhanced-table>
      <!-- <t-enhanced-table
        ref="tableRef"
        v-model:expandedTreeNodes="expandedTreeNodes"
        row-key="key"
        drag-sort="row-handler"
        :data="data"
        :columns="columns"
        :tree="treeConfig"
        :tree-expand-and-fold-icon="treeExpandIcon"
        :pagination="pagination"
        :before-drag-sort="beforeDragSort"
        lazy-load
        @page-change="onPageChange"
        @abnormal-drag-sort="onAbnormalDragSort"
        @drag-sort="onDragSort"
        @expanded-tree-nodes-change="onExpandedTreeNodesChange"
      >
        <template #topContent>
          <div style="padding: 6px 0;">
            <t-input v-model="editableRowKeys" placeholder="请输入节点名称" />
            <t-button variant="outline" @click="columnEditFunc"><template #icon> <t-icon name="setting" size="30px"></t-icon></template>列配置</t-button>
          </div>
        </template>
      </t-enhanced-table> -->
      <node-view-content :node="node" ></node-view-content> 
    </div>
    <t-dialog
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
 
import {
  ChevronRightIcon,
  ChevronDownIcon,
  MoveIcon,
  AddRectangleIcon,
  MinusRectangleIcon,
} from 'tdesign-icons-vue-next';
 
import { Loading } from 'tdesign-vue-next';
import { getIngredient_dev_materialListFetch } from '@/api/material'

const { node, updateAttributes } = defineProps(nodeViewProps)

const { options } = useStore()
const dialog_visible = ref(false);
const tableRef = ref();
const editableRowKeys = ref(['1']);
const currentSaveId = ref('');
// 保存变化过的行信息
const editMap  = {};

const TOTAL = 5;
function getObject(i, currentPage) {
  const columns = {
    id: i,
    key: `申请人 ${i}_${currentPage} 号`,
    platform: ['电子签署', '纸质签署', '纸质签署'][i % 3],
    type: ['String', 'Number', 'Array', 'Object'][i % 4],
    default: ['-', '0', '[]', '{}'][i % 4],
    detail: {
      position: `读取 ${i} 个数据的嵌套信息值`,
    },
    needed: i % 4 === 0 ? '是' : '否',
    description: '数据源',
  };
  return columns;
}

function getData(currentPage = 1) {
  const data = [];
  // const pageInfo = `第 ${currentPage} 页`;
  for (let i = 0; i < TOTAL; i++) {
    const obj = getObject(i, currentPage);
    // 第一行不设置子节点
    obj.list = new Array(2).fill(null).map((t, j) => {
      const secondIndex = 100 * j + (i + 1) * 10;
      const secondObj = {
        ...obj,
        id: secondIndex,
        key: `申请人 ${secondIndex}_${currentPage} 号`,
      };
      secondObj.list = new Array(3).fill(null).map((m, n) => {
        const thirdIndex = secondIndex * 1000 + 100 * m + (n + 1) * 10;
        return {
          ...obj,
          id: thirdIndex,
          key: `申请人 ${thirdIndex}_${currentPage} 号`,
          list: true,
        };
      });
      return secondObj;
    });
    // 第一行不设置子节点
    if (i === 0) {
      obj.list = [];
    }
    data.push(obj);
  }
  // 懒加载1
  data.push({
    ...getObject(66666, currentPage),
    /** 如果子节点为懒加载，则初始值设置为 true */
    list: true,
    key: '申请人懒加载节点 66666，点我体验',
  });
  // 懒加载2
  data.push({
    ...getObject(88888, currentPage),
    /** 如果子节点为懒加载，则初始值设置为 true */
    list: true,
    key: '申请人懒加载节点 88888，点我体验 ',
  });
  return data;
}

const data = ref(getData());
const lazyLoadingData = ref(null);

// 非必须，如果不传，表格有内置树形节点展开逻辑
const expandedTreeNodes = ref([]);
const treeConfig = reactive({
  childrenKey: 'list',
  treeNodeColumnIndex: 2,
  indent: 25,
  expandTreeNodeOnClick: true,
});

// 重置数据和展开节点
const resetData= () => {
  const newData = getData();
  // 方式一
  data.value = newData;
  expandedTreeNodes.value = [];

  // 方式二
  // tableRef.value.resetData(newData);
};
const onEditClick = (row) => {
  const newData = {
    ...row,
    platform: 'New',
    type: 'Symbol',
    default: 'undefined',
  };
  tableRef.value.setData(row.key, newData);
  TMessagePlugin.success('数据已更新');
};
const onDeleteConfirm = (row) => {
  // 移除当前节点及其所有子节点
  tableRef.value.remove(row.key);

  // 仅移除所有子节点
  // tableRef.value.removeChildren(row.key);
  TMessagePlugin.success('删除成功');
};
const onLookUp = (row) => {
  const allRowData = tableRef.value.getData(row.key);
  const message = '当前行全部数据，包含节点路径、父节点、子节点、是否展开、是否禁用等';
  TMessagePlugin.success(`打开控制台查看${message}`);
  console.log(`${message}：`, allRowData);
};
const appendTo = (row) => {
  const randomKey1 = Math.round(Math.random() * Math.random() * 1000) + 10000;
  tableRef.value.appendTo(row.key, {
    id: randomKey1,
    key: `申请人 ${randomKey1} 号`,
    platform: '电子签署',
    type: 'Number',
  });
  TMessagePlugin.success(`已插入子节点申请人 ${randomKey1} 号，请展开查看`);

  // 一次性添加多个子节点。示例代码有效，勿删！!!
  // appendMultipleDataTo(row);
};
function appendMultipleDataTo(row) {
  const randomKey1 = Math.round(Math.random() * Math.random() * 1000) + 10000;
  const randomKey2 = Math.round(Math.random() * Math.random() * 1000) + 10000;
  const randomKey3 = Math.round(Math.random() * Math.random() * 1000) + 10000;
  const appendList = [
    {
      id: randomKey1,
      key: `申请人 ${randomKey1} 号`,
      platform: '电子签署',
      type: 'Number',
    },
    {
      id: randomKey2,
      key: `申请人 ${randomKey2} 号`,
      platform: '纸质签署',
      type: 'Number',
    },
    {
      id: randomKey3,
      key: `申请人 ${randomKey3} 号`,
      platform: '纸质签署',
      type: 'Number',
      list: true,
    },
  ];
  tableRef.value.appendTo(row?.key, appendList);
  TMessagePlugin.success(`已插入子节点申请人 ${randomKey1} 和 ${randomKey2} 号，请展开查看`);
}
// 当前节点之前，新增兄弟节前
const insertBefore = (row) => {
  const randomKey = Math.round(Math.random() * Math.random() * 1000) + 10000;
  tableRef.value.insertBefore(row.key, {
    id: randomKey,
    key: `申请人 ${randomKey} 号`,
    platform: '纸质签署',
    type: 'Number',
  });
  TMessagePlugin.success(`已插入子节点申请人 ${randomKey} 号，请展开查看`);
};

// 当前节点之后，新增兄弟节前
const insertAfter = (row) => {
  const randomKey = Math.round(Math.random() * Math.random() * 1000) + 10000;
  tableRef.value.insertAfter(row.key, {
    id: randomKey,
    key: `申请人 ${randomKey} 号`,
    platform: '纸质签署',
    type: 'Number',
  });
  TMessagePlugin.success(`已插入子节点申请人 ${randomKey} 号，请展开查看`);
};

const columns = [
  {
    // 列拖拽排序必要参数
    colKey: 'drag',
    title: '排序',
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    cell: (h) => <MoveIcon />,
    width: 46,
  },
  {
    colKey: 'id',
    title: '编号',
    ellipsis: true,
    width: 80,
  },
  {
    width: 180,
    colKey: 'key',
    title: '申请人',
    ellipsis: true,
  },
  {
    colKey: 'platform',
    title: '签署方式',
    width: 100,
  },
  {
    colKey: 'operate',
    width: 280,
    title: '操作',
    // 增、删、改、查 等操作
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    cell: (h, { row }) => (
      <div class="tdesign-table-demo__table-operations">
        <t-link variant="text" hover="color" onClick={() => appendTo(row)}>
          插入
        </t-link>
        <t-link variant="text" hover="color" onClick={() => insertBefore(row)}>
          前插
        </t-link>
        <t-link variant="text" hover="color" onClick={() => insertAfter(row)}>
          后插
        </t-link>
        <t-link variant="text" hover="color" onClick={() => onEditClick(row)}>
          更新
        </t-link>
        <t-link variant="text" hover="color" onClick={() => onLookUp(row)}>
          查看
        </t-link>
        <t-popconfirm content="确认删除吗" onConfirm={() => onDeleteConfirm(row)}>
          <t-link variant="text" hover="color" theme="danger">
            删除
          </t-link>
        </t-popconfirm>
      </div>
    ),
  },
]

const columnsCheckboxs = ref([])

const displayColumns = ref([]);
const displayColumnsC = ref([]);
displayColumns.value = ['applicant', 'status', 'matters', 'email', 'createTime', 'operate']

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
  columnsCheckboxs.value = columns.map((col)=>{ return { label:col.title, value:col.colKey } })
  displayColumnsC.value = [ ...displayColumns.value ]
  dialog_visible.value = true
}

const expandAll = ref(false);
const pagination = reactive({
  current: 1,
  pageSize: TOTAL,
  total: TOTAL,
});

// const defaultPagination = {
//   defaultCurrent: 1,
//   defaultPageSize: TOTAL,
//   total: TOTAL,
// };

const onPageChange = (pageInfo) => {
  if (!pagination) {
    return
  }
  pagination.current = pageInfo.current;
  pagination.pageSize = pageInfo.pageSize;
  data.value = getData(pageInfo.current);
};
const onRowToggle= () => {
  const rowIds = ['申请人 1_1 号', '申请人 2_1 号', '申请人 3_1 号', '申请人 4_1 号'];
  rowIds.forEach((id) => {
    // getData 参数为行唯一标识，lodash.get(row, rowKey)
    const rowData = tableRef.value.getData(id);
    tableRef.value.toggleExpandData(rowData);
    // 或者
    // tableRef.value.toggleExpandData({ rowIndex: rowData.rowIndex, row: rowData.row });
  });
};
const customTreeExpandAndFoldIcon = ref(false);
const treeExpandAndFoldIconRender = (h, { type, row }) => {
  if (lazyLoadingData.value && lazyLoadingData.value.key === row?.key) {
    return <Loading size="14px" />;
  }
  return type === 'expand' ? <ChevronRightIcon /> : <ChevronDownIcon />;
};

// 懒加载图标渲染
const lazyLoadingTreeIconRender = (h, params) => {
  const { type, row } = params;
  if (lazyLoadingData.value && lazyLoadingData.value.key === row?.key) {
    return <Loading size="14px" />;
  }
  return type === 'expand' ? <AddRectangleIcon /> : <MinusRectangleIcon />;
};

// 默认展开全部。示例代码有效，勿删
// onMounted(() => {
//   tableRef.value.expandAll();
// });

const getTreeNode= () => {
  // 查看树形结构平铺数据
  // tableRef.value.dataSource
  const treeData = tableRef.value.getTreeNode();
  console.log(treeData);
  TMessagePlugin.success('树形结构获取成功，请打开控制台查看');
};
const onExpandAllToggle= () => {
  expandAll.value = !expandAll.value;
  expandAll.value ? tableRef.value.expandAll() : tableRef.value.foldAll();
};
const appendToRoot= () => {
  const key = Math.round(Math.random() * 10010);
  const newData = {
    id: key,
    key: `申请人 ${key}_${1} 号`,
    platform: key % 2 === 0 ? '共有' : '私有',
    type: ['String', 'Number', 'Array', 'Object'][key % 4],
    default: ['-', '0', '[]', '{}'][key % 4],
    detail: {
      position: `读取 ${key} 个数据的嵌套信息值`,
    },
    needed: key % 4 === 0 ? '是' : '否',
    description: '数据源',
  };
  // data.value.push(newData);
  tableRef.value.appendTo('', newData);

  // 同时添加多个元素，示例代码有效勿删
  // appendMultipleDataTo();
};
const onAbnormalDragSort = (params) => {
  console.log(params);
  // TMessagePlugin.warning(params.reason);
  if (params.code === 1001) {
    TMessagePlugin.warning('不同层级的元素，不允许调整顺序');
  }
};
const onExpandedTreeNodesChange = (expandedTreeNodes, context) => {
  console.log(expandedTreeNodes, context);
  // 全选不需要处理；仅处理懒加载
  if (!context.rowState) return;
  onTreeExpandChange(context);
};
const onTreeExpandChange = (context ) => {
  console.log(context.rowState.expanded ? '展开' : '收起', context);
  /**
   * 如果是懒加载，请确认自己完成了以下几个步骤
   * 1. 提前设置 children 值为 true；
   * 2. 在 onTreeExpandChange 事件中处理异步数据；
   * 3. 自定义展开图标渲染 lazyLoadingTreeIconRender
   */
  if (context.row.list === true) {
    lazyLoadingData.value = context.row;
    const timer = setTimeout(() => {
      appendMultipleDataTo(context.row);
      lazyLoadingData.value = null;
      clearTimeout(timer);
    }, 200);
  }
};
const onDragSort = (params) => {
  console.log('onDragSort:', params);
};

// 应用于需要阻止拖拽排序的场景。如：当子节点存在时，则不允许调整顺序。
// 返回值为 true，允许拖拽排序；返回值 为 false，则阻止拖拽排序
const beforeDragSort = (params) => {
  console.log('beforeDragSort:', params);
  return true;
};
const treeExpandIcon = computed(() => {
  // 自定义展开图标
  if (customTreeExpandAndFoldIcon.value) {
    return treeExpandAndFoldIconRender;
  }
  return lazyLoadingTreeIconRender;
});



onMounted(() => {
  // getIngredient_dev_materialListFetch().then((res:IngredientDevMaterialListResult) => {
  //   console.log('-------onMounted-----res-------', res)
  // });
  // console.log('-------onMounted-----node-------', node.attrs.option)
  // const optionAtt = node.attrs.option;
  // if (optionAtt && optionAtt.fields) {
  //   columns.value = optionAtt.fields.map((field) => ({
  //     colKey: field.key,
  //     title: field.title
  //   }));
  //   displayColumns.value = optionAtt.fields.map((field) => field.key);
  // }
  // if (optionAtt && optionAtt.data) {
  //   data.value = optionAtt.data
  // }
  // console.log('-------onMounted-----node--22-----',columns.value,data.value )
})

</script>

<style lang="scss" scoped>
:deep(.tdesign-table-demo__table-operations .umo-link) {
  padding: 0 8px;
}
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
