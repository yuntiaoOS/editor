<template>
  <node-view-wrapper :id="node.attrs.id" class="umo-node-view" :class=" { 't-is-disabled':readOnly,'umo-is-disabled':readOnly } ">
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
                <t-input v-if="false" v-model="searchTitle" auto-width placeholder="请输入工艺步骤名称" />
                <t-button variant="outline" @click="onAddWorkingProcedure">工艺配置</t-button>
                <div v-if="updateTime&&updateTime.length>10" title="修改时间"><t-icon name="time" size="13px" style="color: #a0a0a0;margin-right:4px;"/><span class="Font12Color">{{updateTime}}</span> </div>
                <t-button title="设置" variant="outline" @click="columnEditFunc"><template #icon> <t-icon name="setting" size="18px"></t-icon></template></t-button>
              </t-space>
            </t-space>
          </div>
        </template>
        <template #defaultValueSlot="slotProps">
          <div v-if="slotProps.row.step_type === 'processes'" style="bottom: 0px;position: absolute;line-height: 30px;width: 95%;z-index: 99;background-color: #fff;;" @click.stop="disableClick">-</div>
          <span v-else-if="slotProps.row.attribute_type ">
            <div v-if="slotProps.row.attribute_type === 'single'" >
              <xm-input v-model="slotProps.row.value" :config="slotProps.row" readonly borderless @change="rowEditFunc($event,slotProps.row)"/>
            </div>
            <div v-else>
              <xm-form ref="xmformRef" v-model:form-data="slotProps.row.value" :readonly="true" :config="getConfig('form',slotProps.row)" :showSubmitBtn="false" @change="rowEditFunc($event,slotProps.row)"/>
            </div>
          </span>
        </template>
      </t-enhanced-table>
      <node-view-content :node="node" ></node-view-content> 
    </div>
    <t-dialog
      v-model:visible="procedureVisible"
      header="工艺配置"
      width="80%" attach="body"
      :confirm-on-enter="true"
      :on-confirm="onProcedureConfirmFunc"
    >
      <!-- <t-input  v-model="dialog_input" placeholder="输入工艺步骤名称" 
        :status=" dialog_input.length > 0 ? 'success': 'error' " 
        :tips=" dialog_input.length > 0 ? '校验通过': '名称不能为空'"
        /> -->
        <technology-table v-model="table_data" v-model:title="_title" @change=""/>
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
  </node-view-wrapper>
</template>

<script setup lang="jsx">
import { nodeViewProps, NodeViewWrapper,NodeViewContent } from '@tiptap/vue-3'
import { getMaterial_batchListFetch } from '@/api/material'
import { get_assign_record_process_dataFetch,getProcesses_attributeListFetch,get_experiment_processListFetch,post_experiment_process_fetch } from '@/api/experiment'

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
const { node, editor, updateAttributes } = defineProps(nodeViewProps)
import { timeFormat } from '@/utils/time-ago'
const { options ,editedComponentType} = useStore()
const $key_data = JSON.parse( localStorage.getItem('key_data'))

const loading = ref(false)
const dialog_visible = ref(false);
const dialog_input = ref('')
const dialog_select = ref('')
const tableRef = ref();

const procedureVisible = ref(false);
const operationVisible = ref(false);


const operationOption = ref([])
const searchTitle = ref('')

const readOnly = computed(() => options.value.document?.readOnly)
const _editedComponentType = computed(() => editedComponentType.value)

const experiment_record = computed(() => $key_data?.experiment_record)
const experiment_theme = computed(() => $key_data?.experiment_theme)

const updateTime = computed({
  get: () => node.attrs.updateTime,
  set(value) {
    updateAttributes({ updateTime: value })
  },
})

const change_log = computed({
  get: () => node.attrs.change_log,
  set(value) {
    updateAttributes({ change_log: value })
  },
})

const is_integration = computed({
  get: () => node.attrs.is_integration,
  set(value) {
    updateAttributes({ is_integration: value })
  },
})

const table_data = computed({
  get: () => node.attrs.table_data,
  set(value) {
    updateAttributes({ table_data: value })
  },
})

const _title = computed({
  get: () => node.attrs.title,
  set(value) {
    updateAttributes({ title: value })
  },
})


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
  return !(_editedComponentType !== node.type.name  && readOnly.value);
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

const rowEditFunc = (val,row)=>{
  console.log('--------212---------rowEditFunc: ', val, row)

}

const onProcedureConfirmFunc = async () => {
  console.log('--------210---------onProcedureConfirmFunc: ', table_data.value)
  if (table_data.value && table_data.value.length > 0) {
    const steps = table_data.value.map(ele => {
      let obj = {...ele}
      delete obj.id
      obj.children = obj.children.map(eleC=>{
        let objC = {...eleC}
        objC.value = objC.value ? objC.attribute_type === "compound" ? JSON.stringify(objC.value) : objC.value : ''
        return objC
      })
      return obj
    })

    const params = {
      experiment_theme: experiment_theme.value.id,
      record: experiment_record.value.id,
      parent: change_log.value.change_log,
      process: {
        name: _title.value,
        step:steps
      }
    }   
    const res = await post_experiment_process_fetch(params)
    if (res.data.code === 2000) {
      change_log.value = { change_log: res.data.data.change_log }
      procedureVisible.value = false
      updateTime.value = timeFormat(null,'yyyy-mm-dd hh:MM:ss')
      initData()
    }
  }
};

const getOperationOptionFunc = async (page=1) => {
  const res = await getProcesses_attributeListFetch({page,limit:9999})
  console.log(res, '-------------2243------------operationOption.value')
  if (res.data.code === 2000) {
    if (page === 1) {
      operationOption.value = res.data.data
    } else {
      operationOption.value = [...operationOption.value, ...res.data.data]
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
    //     console.log(context);
    //     table_data.value = updateTableData(table_data.value, context.newRowData)
    //     console.log('Edit firstName:', context,table_data.value);
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
    // edit: {
    //   // 1. 支持任意组件。需保证组件包含 `value` 和 `onChange` 两个属性，且 onChange 的第一个参数值为 new value。
    //   // 2. 如果希望支持校验，组件还需包含 `status` 和 `tips` 属性。具体 API 含义参考 Input 组件
    //   component: TTextarea,
    //   // props, 透传全部属性到 Input 组件
    //   props: {
    //     clearable: true,
    //     autofocus: true,
    //     // autoWidth: true,
    //     autosize: true,
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
    //     console.log(context);
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
    // },
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


const initData = async () => {
  loading.value = true
  const params = {
    change_log: change_log.value?.change_log,
  }
  console.log('----------initData-----297---------',params)
  const res = await get_assign_record_process_dataFetch(params)
  loading.value = false
  if (res.data.code === 2000) {
    const tableD = res.data.data.process.step.map(ele => {
      let obj = {...ele}
      obj.children = obj.children.map(eleC=>{
        let objC = {...eleC}
        objC.value = objC.value ? objC.attribute_type === "compound" ? JSON.parse(objC.value) : objC.value : ''
        return objC
      })
      return obj
    })
    if ( tableD.length > 0 ) { table_data.value = tableD }
    console.log('----------initData-----607---------',table_data.value)
  }else {
    table_data.value = []
    TMessagePlugin.error(res.data.msg)
  }
}

onMounted(async () => {
  if (change_log.value?.change_log && (table_data.value && table_data.value.length === 0) ) {
    console.log('----------change_log.value22222222222222222222222222---------',change_log.value);
    await initData()
  }else if(is_integration.value) {
    
    const docD = editor.getJSON()
    if (docD ) {
      // 原材料表
      const raw_material_tables = docD.content.filter(ele=> ele.type === 'raw_material_table')
      if (raw_material_tables.length === 0) {
        TMessagePlugin.warning('请先创建原材料表')
        return  // 原材料表不存在，返回
      }
      raw_materialOptions.value = raw_material_tables.map(ele=> ele.attrs)
      const dialog = useConfirm({
        theme: 'info',
        header: '提示',
        body: '检测到当前文档中存在原材料表，是否使用该原材料表进行初始化？',
        confirmBtn: '确定',
        onConfirm() {
          dialog.destroy()
          setTimeout(() => {
            add_parent_visible.value = true
          }, 300)
        },
        onClosed() {
          
        },
      })
      
    }else {
      TMessagePlugin.warning('当前文档中没有数据')
    }
  }
  
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
