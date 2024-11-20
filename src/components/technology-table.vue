<template>
  <div style="width: 100%">
    <!-- <h2>工艺</h2> -->
    <t-enhanced-table ref="tableRef" v-model:expandedTreeNodes="expandedTreeNodes" :tree-expand-and-fold-icon="treeExpandIcon" 
      row-key="id" :data="table_data" :columns="columns" resizable :tree="treeConfig" :editable-cell-state="editableCellStateFunc"
       @expanded-tree-nodes-change="onExpandedTreeNodesChange" >
      <template #topContent>
        <div style="padding: 6px 0;display: block;">
          <t-space>
            <t-input v-model="_title" label="名称：" size="large" autofocus autoWidth borderless />
            <t-space>
              <!-- <t-input  v-if="false" v-model="searchTitle" auto-width placeholder="请输入工艺步骤名称" /> -->
              <t-button variant="outline" @click="onAddWorkingProcedure">添加工艺步骤</t-button>
              <t-button variant="outline" @click="columnEditFunc"><template #icon> <t-icon name="setting" size="18px"></t-icon></template>列配置</t-button>
            </t-space>
          </t-space>
        </div>
      </template>
      <template #defaultValueSlot="slotProps">
        <div v-if="slotProps.row.step_type === 'processes'" style="bottom: 0px;position: absolute;line-height: 38px;width: 95%;z-index: 99;background-color: #fff;;" @click.stop="disableClick">-</div>
        <span v-else-if="slotProps.row.attribute_type ">
          <div v-if="slotProps.row.attribute_type === 'single'" >
            <xm-input v-model="slotProps.row.value" :config="slotProps.row" borderless style="border-bottom: 1px solid var(--td-border-level-2-color);"/>
          </div>
          <div v-else>
            <xm-form ref="xmformRef" v-model:form-data="slotProps.row.value" :config="getConfig('form',slotProps.row)" :showSubmitBtn="false"/>
          </div>
        </span>
      </template>
    </t-enhanced-table>
  </div>
  <t-dialog
    v-model:visible="operationVisible"
    header="操作配置"
    width="40%" attach="body"
    :confirm-on-enter="true"
    :on-confirm="onOperationConfirmFunc"
  >
    <t-select
      v-model="dialog_select"
      :options="operationOptionSelect"
      filterable
      multiple
      :keys="{ label: 'name', value: 'id' }"  
      placeholder="请选择操作"
      :scroll="{type: 'virtual'}"  
      :popup-props="{ overlayInnerStyle: { height: '300px' } }"  
      :status=" dialog_select.length > 0 ? 'success': 'error' "
      :tips="dialog_select.length > 0 ? '校验通过': '操作不能为空'"
    />
    
  </t-dialog>
  <t-dialog
    v-model:visible="procedureVisible"
    header="工艺步骤配置"
    width="40%" attach="body"
    :confirm-on-enter="true"
    :on-confirm="onProcedureConfirmFunc"
  >
    <t-input  v-model="dialog_input" placeholder="输入工艺步骤名称" 
      :status=" dialog_input.length > 0 ? 'success': 'error' " 
      :tips=" dialog_input.length > 0 ? '校验通过': '名称不能为空'"
      />
  </t-dialog>
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
</template>

<script setup lang="jsx">
import { getMaterial_batchListFetch } from '@/api/material'
import { getProcesses_attributeListFetch,get_experiment_processListFetch,post_experiment_process_fetch } from '@/api/experiment'

import {
  ChevronRightIcon,
  ChevronDownIcon,
  MoveIcon,
  AddRectangleIcon,
  MinusRectangleIcon,
} from 'tdesign-icons-vue-next';
 
import { Loading } from 'tdesign-vue-next';
import { getIngredient_dev_materialListFetch } from '@/api/material'
import { v4 as uuid } from 'uuid'

const emits = defineEmits(['update:modelValue', 'update:title'])

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => ([]),
  }, 
  title: {
    type: String,
    default: () => '',
  }
});

const table_data = computed({
  get() {
    return props.modelValue || []
  },
  set(val) {
    emits('update:modelValue',val )
  },
})

const _title = computed({
  get() {
    return props.title;
  },
  set(val) {
    emits('update:title', val);
  },
});

const { options ,editedComponentType} = useStore()
const $key_data = useState('key_data')

const loading = ref(false)
const dialog_visible = ref(false);
const dialog_input = ref('')
const dialog_select = ref('')
const tableRef = ref();

const procedureVisible = ref(false);
const operationVisible = ref(false);


const operationOption = ref([])
const operationOptionSelect = ref([])
const searchTitle = ref('')

const readOnly = computed(() => options.value.document?.readOnly)
const _editedComponentType = computed(() => editedComponentType.value)

const experiment_record = computed(() => $key_data.value?.experiment_record)
const experiment_theme = computed(() => $key_data.value?.experiment_theme)



const renderStepIcon = () => {
  return <t-icon name="map-connection" />;
};
const renderOperationIcon = () => {
  return <t-icon name="adjustment" />;
};
const renderArrowUp = () => {
  return <t-icon name="arrow-left-up" />;
};
const renderArrowDown = () => {
  return <t-icon name="arrow-left-down" />;
};
const renderDelete = () => {
  return <t-icon name="delete" />;
};

const pagination = ref({
  limit: 20,
  total: 0,
  page: 1,
});

const columnsCheckboxs = ref([])

const displayColumns = ref([]);
const displayColumnsC = ref([]);
displayColumns.value = ['serial-number', 'step_name', 'step_type', 'attributes', 'description', 'operate']

const selectOperationRow = ref(null)
const selectProcedureRow = ref(null)

const selectOperationType = ref('append')
const selectProcedureType = ref('append')

const checkAll = computed(() => displayColumns.value.length === displayColumnsC.value.length);
const indeterminate = computed(() => !!(displayColumns.value.length > displayColumnsC.value.length && displayColumnsC.value.length));

const editableCellStateFunc = ()=> {
  return !(_editedComponentType !== 'technology_table'  && readOnly.value);
}

const getConfig = (type,row) => {
  let config = {
    formItems: [],
    formConfig: {
      rules: {
        name: [
          { required: true, message: '必填', type: 'error', trigger: 'blur' },
        ],
        description: [
          { required: false, message: '必填', type: 'error', trigger: ['blur'] },
        ]
      },
      ruleJs: "//formData: 表单数据  formMap: 表单字段id -> 字段json配置\r\nfunction doChange(formData, formMap){\r\n\t\r\n}",
      labelPos: "left",
      ruleType: "SIMPLE",
      layout: "vertical",
      columns: 1,
      colon: true,
      labelWidth: "80px",
      showSubmitBtn: false,
    }
  }
  if (row.attribute_type === 'compound' && row.group) {
    config.formItems = row.group
  }

  return config
}

const onProcedureConfirmFunc = async () => {
  if (dialog_input.value.length > 0) {
    const obj  = {
      id: uuid(),
      step_name: dialog_input.value,
      step_type: 'processes',
      children: [],
      description: '',
      sequence: table_data.value.length
    }

    await nextTick()
    if (selectProcedureType.value === 'append') {
      tableRef.value.appendTo( selectProcedureRow.value ? selectProcedureRow.value.id : '', obj);
    }else if (selectProcedureType.value === 'insertBefore') {
      tableRef.value.insertBefore(selectProcedureRow.value ? selectProcedureRow.value.id: '', obj);
    }else if (selectProcedureType.value === 'insertAfter') {
      tableRef.value.insertAfter(selectProcedureRow.value ? selectProcedureRow.value.id: '', obj);
    }
    procedureVisible.value = false
    getTreeNode()
    dialog_input.value = ''

  }

}
const onOperationConfirmFunc = async () => {
  if (dialog_select.value !== '' && dialog_select.value.length > 0) {
    const listArr = table_data.value.map(ele => ele.children ? ele.children.map(eleL=>eleL.id) : [] )
    let keysArr = []
    if (listArr && listArr.length > 0) {
      keysArr = listArr.reduce((a, b) => a.concat(b))
    }
    const itemOs = operationOption.value.filter(item => dialog_select.value.includes(item.id) && !keysArr.includes(item.id))
    const parent = selectOperationRow.value.step_type === 'processes' ? selectOperationRow.value.id : selectOperationRow.value.parent
    
    console.log('--------197---------keys: ',parent, itemOs,keysArr)
    let objS = []
    itemOs.forEach(itemO =>{
      const obj  = {
        ...itemO,
        step_name: itemO.name,
        step_type: 'operation',
        parent: parent,
        value: itemO.attribute_type === "compound" ? {} : '',
        description: ''
      }
      objS.push( obj )
    })
    console.log('--------197---------keys: ', parent, objS)
    if (selectOperationType.value === 'append') {
      tableRef.value.appendTo( parent, objS);
    }else if (selectOperationType.value === 'insertBefore') {
      tableRef.value.insertBefore( parent, objS);
    }else if (selectOperationType.value === 'insertAfter') {
      tableRef.value.insertAfter( parent, objS);
    }
    operationVisible.value = false
    getTreeNode()
    dialog_select.value = []

  }
};

const getOperationOptionFunc = async (page=1) => {
  const res = await getProcesses_attributeListFetch({page,limit:9999})
  console.log(res, '-------------2243------------operationOption.value')
  if (res.data.code === 2000) {
    if (page === 1) {
      operationOption.value = res.data.data
      operationOptionSelect.value = res.data.data.map(item => ({id: item.id, name: item.name}))
    } else {
      operationOption.value = [...operationOption.value, ...res.data.data]
      operationOptionSelect.value = [...operationOption.value, ...res.data.data].map(item => ({id: item.id, name: item.name}))
    }
    pagination.value.total = res.data.total
    
    console.log(operationOption.value, '-------------250------------operationOption.value')
  }
}
getOperationOptionFunc()

function updateTableData(tableData, newRowData) {
  const data = tableData.map(item => {
    let row = {...item}
    console.log('---------tableData---303------',newRowData,row)
    if (newRowData.step_type === 'operation' && row.id === newRowData.parent) {
      console.log('---------tableData---305------',row)
      // 替换 children 属性中 id 相等的这一条数据
      row.children = row.children.map(listItem => {
        if (listItem.id === newRowData.id) {
          return newRowData;
        }
        return listItem;
      });
      console.log('---------tableData---311------',row)
    } else if (newRowData.step_type === 'processes') {
      // 直接替换 table_data 中 id 相等的这一条数据
      if (row.id === newRowData.id) {
        row = Object.assign(item, newRowData);
      }
    }
    
    return row;
  });
  console.log('---------tableData---234------',data)
  return data;
}
const columns = ref([
  {
    title: '序号',
    colKey: 'serial-number',
    width: 62,
    // render(h, { type, row ,rowIndex }) {
    //   return  rowIndex===0 ? '序号': getFormattedIndex(rowIndex, row);
    // },
  },
  {
    width: 140,
    colKey: 'step_name',
    title: '名称',
    ellipsis: true,
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
          required: false,
          message: '不能为空',
        },
      ],
      showEditIcon: true,
      abortEditOnEvent: ['onEnter','onBlur'],
      onEdited: (context ) => {
        console.log(context);
        table_data.value = updateTableData(table_data.value, context.newRowData)
        console.log('Edit firstName:', context,table_data.value);
        useMessage('success' ,'Success');
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
    }

  },
  {
    colKey: 'step_type',
    title: '类型',
    width: 80,
    cell: (h, { row:{ step_type }, rowIndex }) => {
      return (
        <t-tag shape="round" icon={step_type === 'processes' ? renderStepIcon: renderOperationIcon} theme={step_type === 'processes' ? 'primary' : 'success' } variant="light-outline">
          {step_type === 'processes' ? '步骤' : '操作'}
        </t-tag>
      );
    },
  },
  {
    colKey: 'attributes',
    title: '默认值',
    minWidth: 160,
    cell: 'defaultValueSlot',
    // edit: {
    //   // 1. 支持任意组件。需保证组件包含 `value` 和 `onChange` 两个属性，且 onChange 的第一个参数值为 new value。
    //   // 2. 如果希望支持校验，组件还需包含 `status` 和 `tips` 属性。具体 API 含义参考 Input 组件
    //   component: TInput,
    //   // props, 透传全部属性到 Input 组件
    //   props: {
    //     clearable: true,
    //     autofocus: true,
    //     // autoWidth: true,
    //   },
    //   // 校验规则，此处同 Form 表单
    //   rules: [
    //     {
    //       required: false,
    //       message: '不能为空',
    //     },
    //   ],
    //   showEditIcon: true,
    //   abortEditOnEvent: ['onEnter','onBlur'],
    //   onEdited: (context ) => {
    //     console.log('------396--------onEdited------',context,table_data.value);
    //     table_data.value = updateTableData(table_data.value, context.newRowData)
    //     console.log('Edit firstName:', context);
    //     useMessage('success' ,'Success');
    //   },
    //   // 触发校验的时机（when to validate)
    //   validateTrigger: 'change',
    //   // 透传给 component: Input 的事件（也可以在 edit.props 中添加）
    //   on: (editContext ) => ({
    //     onBlur: (ctx ) => {
    //       console.log('失去焦点', editContext);
    //       ctx?.e?.preventDefault();
    //     },
    //     onEnter: (ctx ) => {
    //       ctx?.e?.preventDefault();
    //       console.log('onEnter', ctx);
    //     },
    //     // 默认是否为编辑状态
    //     defaultEditable: false,
    //   }),
    // }
  },
  {
    colKey: 'description',
    title: '描述',
    ellipsis: true,
    minWidth: 200,
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
        console.log(context);
        table_data.value = updateTableData(table_data.value, context.newRowData)
        console.log('Edit firstName:', context);
        useMessage('success' ,'Success');
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
    colKey: 'operate',
    width: 120,
    title: '操作',
    // 增、删、改、查 等操作
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    cell: (h, { row }) => (
      <div class="tdesign-table-demo__table-operations">
        {row.step_type === "processes" && (
          <t-button title="插入操作" shape="square" variant="text" icon={renderOperationIcon}  onClick={(event) =>{event.stopPropagation();  appendTo(row)} }></t-button>
        )}
        <t-button title="前插步骤" shape="square" variant="text" icon={renderArrowUp}  onClick={(event) =>{event.stopPropagation();  insertBefore(row)} }></t-button>
        <t-button title="后插步骤" shape="square" variant="text" icon={renderArrowDown}  onClick={(event) =>{event.stopPropagation();  insertAfter(row)} }></t-button>
        <t-popconfirm content="确认删除吗" onConfirm={() => onDeleteConfirm(row) }>
          <t-button title="删除" theme="danger" shape="square" variant="text" icon={renderDelete} ></t-button>
        </t-popconfirm>
      </div>
    ),
  },
])

function disableClick(e) {
  e.preventDefault();
  e.stopPropagation();
}

function onAddWorkingProcedure(row=undefined) {
  procedureVisible.value = true;
  selectProcedureRow.value = row;
  selectProcedureType.value = 'append';
  // processesConfirm((obj)=>{
  //   tableRef.value.appendTo( row ? row.id : '', obj);
  //   getTreeNode()
  // })
}


const lazyLoadingData = ref(null);

// 非必须，如果不传，表格有内置树形节点展开逻辑
const expandedTreeNodes = ref([]);
const treeConfig = reactive({
  childrenKey: 'children',
  treeNodeColumnIndex: 1,
  indent: 25,
  expandTreeNodeOnClick: true,
});

const onDeleteConfirm = (row) => {
  // 移除当前节点及其所有子节点
  tableRef.value.remove(row.id);

  // 仅移除所有子节点
  // tableRef.value.removeChildren(row.id);
  TMessagePlugin.success('删除成功');
};

const appendTo = (row=undefined) => {
  operationVisible.value = true;
  selectOperationRow.value = row;
  selectOperationType.value = 'append';
  // operationConfirm((obj)=>{
  //   tableRef.value.appendTo(row ? row.id: '', obj);
  //   nextTick(()=>{
  //     if (row && row.id) {
  //       const rowData = tableRef.value.getData(row.id);
  //       tableRef.value.toggleExpandData(rowData);
  //     }
  //   });
  //   getTreeNode()
  // },row)
};
function appendMultipleDataTo(row) {
  const randomKey1 = Math.round(Math.random() * Math.random() * 1000) + 10000;
  const randomKey2 = Math.round(Math.random() * Math.random() * 1000) + 10000;
  const randomKey3 = Math.round(Math.random() * Math.random() * 1000) + 10000;
  const appendList = [
    {
      id: randomKey1,
      step_name: `申请人 ${randomKey1} 号`,
      platform: '电子签署',
      step_type: 'Number',
    },
    {
      id: randomKey2,
      step_name: `申请人 ${randomKey2} 号`,
      platform: '纸质签署',
      step_type: 'Number',
    },
    {
      id: randomKey3,
      step_name: `申请人 ${randomKey3} 号`,
      platform: '纸质签署',
      step_type: 'Number',
      list: true,
    },
  ];
  tableRef.value.appendTo(row?.id, appendList);
  TMessagePlugin.success(`已插入子节点申请人 ${randomKey1} 和 ${randomKey2} 号，请展开查看`);
  getTreeNode()
}
// 当前节点之前，新增兄弟节前
const insertBefore = (row) => {
  if (row.step_type !== 'processes') {
    operationVisible.value = true;
    selectOperationRow.value = row;
    selectOperationType.value = 'insertBefore';
    // operationConfirm((obj)=>{
    //   tableRef.value.insertBefore(row ? row.id: '', obj);
    //   getTreeNode()
    // },row)
  }else{
    procedureVisible.value = true;
    selectProcedureRow.value = row;
    selectProcedureType.value = 'insertBefore';
    // processesConfirm((obj)=>{
    //   tableRef.value.insertBefore(row ? row.id: '', obj);
    //   getTreeNode()
    // })
  }
};

// 当前节点之后，新增兄弟节前
const insertAfter = (row) => {
  if (row.step_type !== 'processes') {
    operationVisible.value = true;
    selectOperationRow.value = row;
    selectOperationType.value = 'insertAfter';
    // operationConfirm((obj)=>{
    //   tableRef.value.insertAfter(row ? row.id: '', obj);
    //   getTreeNode()
    // },row)
  }else{
    procedureVisible.value = true;
    selectProcedureRow.value = row;
    selectProcedureType.value = 'insertAfter';
    // processesConfirm((obj)=>{
    //   tableRef.value.insertAfter(row ? row.id: '', obj);
    //   getTreeNode()
    // })
  }
};

const handleSelectAll = (checked) => {
  displayColumnsC.value = checked ? [ ...displayColumns.value ] : [];
}

const onConfirmFunc = ()=>{
  displayColumns.value = [ ...displayColumnsC.value ]
  dialog_visible.value = false
}

const columnEditFunc = ()=>{
  columnsCheckboxs.value = columns.value.map((col)=>{ return { label:col.title, value:col.colKey } })
  displayColumnsC.value = [ ...displayColumns.value ]
  dialog_visible.value = true
}

const customTreeExpandAndFoldIcon = ref(false);
const treeExpandAndFoldIconRender = (h, { type, row }) => {
  if (lazyLoadingData.value && lazyLoadingData.value.id === row?.id) {
    return <Loading size="14px" />;
  }
  return type === 'expand' ? <ChevronRightIcon /> : <ChevronDownIcon />;
};

// 懒加载图标渲染
const lazyLoadingTreeIconRender = (h, params) => {
  const { type, row } = params;
  if (lazyLoadingData.value && lazyLoadingData.value.id === row?.id) {
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
  table_data.value = treeData
  console.log('------457-------',treeData);
  TMessagePlugin.success('树形结构获取成功，请打开控制台查看');
};

const onExpandedTreeNodesChange = (expandedTreeNodes, context) => {
  console.log('------485-------',expandedTreeNodes, context);
  // 全选不需要处理；仅处理懒加载
  if (!context.rowState) return;
  onTreeExpandChange(context);
};
const onTreeExpandChange = (context ) => {
  console.log('------491-------',context.rowState.expanded ? '展开' : '收起', context);
  /**
   * 如果是懒加载，请确认自己完成了以下几个步骤
   * 1. 提前设置 children 值为 true；
   * 2. 在 onTreeExpandChange 事件中处理异步数据；
   * 3. 自定义展开图标渲染 lazyLoadingTreeIconRender
   */
  if (context.row.children === true) {
    lazyLoadingData.value = context.row;
    const timer = setTimeout(() => {
      appendMultipleDataTo(context.row);
      lazyLoadingData.value = null;
      clearTimeout(timer);
    }, 200);
  }
}; 
const treeExpandIcon = computed(() => {
  // 自定义展开图标
  if (customTreeExpandAndFoldIcon.value) {
    return treeExpandAndFoldIconRender;
  }
  return lazyLoadingTreeIconRender;
});
 
onMounted(async () => {
   
})

</script>

<style lang="scss" scoped>
.t-is-disabled {
  cursor: not-allowed;
  color: var(--td-text-color-disabled);
  background-color: var(--td-bg-color-component-disabled);
  border-color: var(--td-border-level-2-color);
}
:deep(.tdesign-table-demo__table-operations) {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 1px;
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
