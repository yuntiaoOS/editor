<template>
  <div style="width: 100%">
    <!-- <h2>工艺</h2> -->
    <t-enhanced-table ref="tableRef" v-model:expandedTreeNodes="expandedTreeNodes" :tree-expand-and-fold-icon="treeExpandIcon" 
      row-key="id" :loading="loading" :data="table_data" :columns="columns" resizable :tree="treeConfig" :editable-cell-state="editableCellStateFunc"
       @expanded-tree-nodes-change="onExpandedTreeNodesChange" >
      <template #topContent>
        <div style="padding: 6px 0;display: block;">
          <t-space>
            <div>
              <span :title=" isChanged?'未保存':'已保存' " style="width: 10px; height: 10px; border-radius: 50%;" :style="{background:isChanged? 'var(--td-error-color)' : 'var(--td-success-color)'}"></span>
              <t-input v-model="_title" label="名称：" size="large" autofocus autoWidth borderless />
            </div>
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
        <div v-if="slotProps.row.step_type === 'processes' || slotProps.row.key.includes( 'xm_raw_material') " style="bottom: 0px;position: absolute;line-height: 30px;width: 95%;z-index: 99;background-color: #fff;;" @click.stop="disableClick">-</div>
        <span v-else-if="slotProps.row.attribute_type ">
          <div v-if="slotProps.row.attribute_type === 'single'" >
            <!-- <xm-input v-model="slotProps.row.value" :config="slotProps.row" readonly borderless @change="rowEditFunc($event,slotProps.row)"/> -->
            <div>{{slotProps.row.value}} {{ slotProps.row.props.suffix }}</div>
          </div>
          <div v-else>
            <div v-if="slotProps.row.multiple">
              <div v-for="(item, index) in slotProps.row.value" :key="index" style="margin-bottom: 8px;">
                <xm-form ref="xmformRef" :form-data="item" :readonly="true" :config="getConfig('form',slotProps.row)" :showSubmitBtn="false" @change="rowEditFunc($event,slotProps.row)"/>
              </div>
            </div>
            <div v-else>
              <xm-form ref="xmformRef" :form-data="slotProps.row.value" :readonly="true" :config="getConfig('form',slotProps.row)" :showSubmitBtn="false" @change="rowEditFunc($event,slotProps.row)"/>
            </div>
          </div>
        </span>
      </template>
    </t-enhanced-table>
    <node-view-content :node="_node" ></node-view-content> 
  </div>
  <t-dialog
    v-model:visible="procedureVisible"
    header="工艺配置" destroyOnClose
    width="80%" attach="body"
    :confirm-on-enter="true"
    :on-confirm="onProcedureConfirmFunc"
  >
    <!-- <t-input  v-model="dialog_input" placeholder="输入工艺步骤名称" 
      :status=" dialog_input.length > 0 ? 'success': 'error' " 
      :tips=" dialog_input.length > 0 ? '校验通过': '名称不能为空'"
      /> -->
      <technology-table v-model="table_data_edit" :editor="editor" :viewType="viewType" :getAttributesFunction="getAttributesFunction" v-model:title="_title" @change=""/>
  </t-dialog>
  <t-dialog destroyOnClose 
      v-model:visible="add_parent_visible"
      header="选择原材料表"
      width="40%" attach="body"
      :confirm-on-enter="true"
      :on-confirm="on_select_parentFunc"
    >
      <t-select
        v-model="dialog_select"
        :options="dialog_selectOptions"
        filterable
        multiple
        :keys="{ label: 'title', value: 'id' }"  
        placeholder="请选择操作"
        :scroll="{type: 'virtual'}"  
        :popup-props="{ overlayInnerStyle: { height: '300px' } }"  
        :status=" dialog_select !== '' ? 'success': 'error' "
        :tips="dialog_select !== '' ? '校验通过': '操作不能为空'"
      />
    </t-dialog>
  <t-dialog
    v-model:visible="dialog_visible"
    header="表格列配置" destroyOnClose
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
import { getProcesses_attributeListFetch  } from '@/api/experiment'

import {
  ChevronRightIcon,
  ChevronDownIcon,
  MoveIcon,
  AddRectangleIcon,
  MinusRectangleIcon,
} from 'tdesign-icons-vue-next';
const emits = defineEmits(['update:node'])
const props = defineProps({
  node: {
    type: Object,
    default: () => {}
  },
  editor: {
    type: Object,
    default: () => {}
  },
  viewType: {
    type: String,
    default: 'nodeView',
  },
  getAttributesFunction: {
    type: Function,
    default: getProcesses_attributeListFetch,
  },
  getDataFunction: {
    type: Function,
    required: true,
  },
  postDataFunction: {
    type: Function,
    required: true,
  },
})
import { Loading } from 'tdesign-vue-next';

const _node = computed({
  get: () => props.node,
  set: (value) => {
    // Update the node in the editor
    emits('update:node', value)
  }
})

import { timeFormat } from '@/utils/time-ago'
import { cloneDeep } from 'lodash-unified';
const { options ,editedComponentType} = useStore()
const $key_data = JSON.parse( localStorage.getItem('key_data'))

const loading = ref(false)
const dialog_visible = ref(false);
const tableRef = ref();
const add_parent_visible = ref(false);
const procedureVisible = ref(false);
const dialog_select = ref('')
const dialog_selectOptions = ref([])

const operationOption = ref([])
const searchTitle = ref('')

const readOnly = computed(() => options.value.document?.readOnly)
const _editedComponentType = computed(() => editedComponentType.value)

const experiment_record = computed(() => $key_data?.experiment_record)
const experiment_theme = computed(() => $key_data?.experiment_theme)

const updateTime = computed({
  get: () => _node.value&&_node.value.attrs? _node.value.attrs.updateTime : '',
  set(value) {
    _node.value.attrs.updateTime = value
    emits('update:node', _node.value)
  },
})

const isChanged = computed({
  get: () => _node.value&&_node.value.attrs? _node.value.attrs.isChanged : false,
  set(value) {
    _node.value.attrs.isChanged = value
    emits('update:node', _node.value)
  },
})

const change_log = computed({
  get: () => _node.value&&_node.value.attrs? _node.value.attrs.change_log : '',
  set(value) {
    console.log('-------150---change_log-----',value)
    _node.value.attrs.change_log = value
    emits('update:node', _node.value)
    console.log('-------150---change_log-----',_node.value)
  },
})

const is_integration = computed({
  get: () => _node.value&&_node.value.attrs? _node.value.attrs.is_integration : false,
  set(value) {
    _node.value.attrs.is_integration = value
    emits('update:node', _node.value)
  },
})

const table_data = computed({
  get: () => _node.value&&_node.value.attrs? _node.value.attrs.table_data : [],
  set(value) {
    console.log('-------166---table_data-----',value)
    _node.value.attrs.table_data = value
    emits('update:node', _node.value)
    console.log('-------166---table_data-----',_node.value)
  },
})

const table_data_edit = ref([])

const _title = computed({
  get: () => _node.value&&_node.value.attrs? _node.value.attrs.title : `工艺${timeFormat(null, 'yyyymmddhhMM')}`,
  set(value) {
    _node.value.attrs.title = value
    emits('update:node', _node.value)
  },
})


const renderStepIcon = () => {
  return <t-icon name="map-connection" />;
};
const renderOperationIcon = () => {
  return <t-icon name="adjustment" />;
};

const pagination = ref({
  limit: 20,
  total: 0,
  page: 1,
});

const columnsCheckboxs = ref([])

const displayColumns = ref([]);
const displayColumnsC = ref([]);
displayColumns.value = ['serial-number', 'name', 'step_type', 'attributes', 'description', 'operate']

const selectProcedureRow = ref(null)

const selectProcedureType = ref('append')

const checkAll = computed(() => displayColumns.value.length === displayColumnsC.value.length);
const indeterminate = computed(() => !!(displayColumns.value.length > displayColumnsC.value.length && displayColumnsC.value.length));

const editableCellStateFunc = ()=> {
  return !(_editedComponentType !== _node.value.type.name  && readOnly.value);
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

const on_select_parentFunc = async ()=>{
  const params = {
    parent: dialog_select.value
  }
  isChanged.value = true
  const res = await post_experiment_material_fetch(params)
  if (res.data.code === 2000) {
    useMessage('success' ,res.data.msg);
    await initData()
  }
  add_parent_visible.value = false
}

const onProcedureConfirmFunc = async () => {
  console.log('--------210---------onProcedureConfirmFunc: ', table_data.value,table_data_edit.value)
  if (table_data_edit.value && table_data_edit.value.length > 0) {
    const steps = table_data_edit.value.map(ele => {
      let obj = {...ele}
      delete obj.id
      obj.children = obj.children.map(eleC=>{
        let objC = {...eleC, id:eleC.attribute ? eleC.attribute : eleC.id }
        objC.value = objC.value ? objC.attribute_type === "compound" ? JSON.stringify(objC.value) : objC.value : ''
        return objC
      })
      return obj
    })
    console.log('--------240---------onProcedureConfirmFunc', steps)
    let params = {}
    if (props.viewType === 'nodeView') {
      params = {
        experiment_theme: experiment_theme.value.id,
        record: experiment_record.value.id,
        parent: change_log.value.change_log,
        process: {
          name: _title.value,
          step:steps
        }
      } 
    }else {
      params = {
        product: change_log.value.change_log,
        process: {
          name: _title.value,
          step: steps,
        },  
      } 
    }
    
    isChanged.value = true
    const res = await props.postDataFunction(params)
    let resD = {}
    if (props.viewType === 'nodeView') {
      resD = res.data
    }else {
      resD = res.data.value ? res.data.value : res.data
    }
    if (resD.code === 2000) {
      if (props.viewType === 'nodeView') {
        change_log.value = { change_log:resD.data.change_log }
      }else {
        change_log.value = { change_log:resD.data.product }
      }
      procedureVisible.value = false
      updateTime.value = timeFormat(null,'yyyy-mm-dd hh:MM:ss')
      initData()
    }else{
      TMessagePlugin.error(resD.msg)
    }
  }
};

const getOperationOptionFunc = async (page=1) => {
  const res = await props.getAttributesFunction({page,limit:9999})
  console.log(res, '-------------2243------------operationOption.value')
  let resD = {}
  if (props.viewType === 'nodeView') {
    resD = res.data
  }else {
    resD = res.data.value ? res.data.value : res.data
  }
  if (resD.code === 2000) {
    if (page === 1) {
      operationOption.value = resD.data
    } else {
      operationOption.value = [...operationOption.value, ...resD.data]
    }
    pagination.value.total = resD.total
    console.log(operationOption.value, '-------------250------------operationOption.value')
  }
  
}

getOperationOptionFunc()

const columns = ref([
  {
    title: '序号',
    colKey: 'serial-number',
    width: 62,
  },
  {
    width: 140,
    colKey: 'name',
    title: '名称',
    ellipsis: true,
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
  },
  {
    colKey: 'description',
    title: '描述',
    ellipsis: true,
    minWidth: 200,
  },
])

function disableClick(e) {
  e.preventDefault();
  e.stopPropagation();
}

function onAddWorkingProcedure(row=undefined) {
  table_data_edit.value = Object.assign([],cloneDeep(table_data.value) ) 
  procedureVisible.value = true;
  selectProcedureRow.value = row;
  selectProcedureType.value = 'append';
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
  // TMessagePlugin.success('树形结构获取成功，请打开控制台查看');
};

const onExpandedTreeNodesChange = (expandedTreeNodes, context) => {
  console.log('------485-------',expandedTreeNodes, context);
  // 全选不需要处理；仅处理懒加载
  if (!context.rowState) return;
  onTreeExpandChange(context);
};
const onTreeExpandChange = (context ) => {
  console.log('------491-------',context.rowState.expanded ? '展开' : '收起', context);
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
  let params = { }
  if (props.viewType === 'nodeView') {
    params = {
      change_log: change_log.value?.change_log,
    }
  }else{
    params = {
      product: change_log.value.change_log,
      page: 1,
      limit: 'all',
    }
  }
  console.log('----------initData-----297---------',params)
  const res = await props.getDataFunction(params)
  console.log('----------initData-----482---------',res)
  loading.value = false
  let resD = {}
  if (props.viewType === 'nodeView') {
    resD = res.data
  }else {
    resD = res.data.value ? res.data.value : res.data
  }
  if (resD.code === 2000 ) {
    if ( resD.data.process && resD.data.process.step ){
      if (isChanged.value) { isChanged.value = false } 
      const tableD = resD.data.process.step.map(ele => {
        let obj = { ...ele}
        obj.children = obj.children.map(eleC=>{
          let objC = {
            ...eleC,
            type: eleC.key.includes( 'xm_raw_material') ? 'VueContainer' :eleC.type,
          }
          objC.value = objC.value ? objC.attribute_type === "compound" ? JSON.parse(objC.value) : objC.value : ''
          if (objC.attribute_type === "compound") {
            objC.group = objC.group.map(eleG=>{
              return {...eleG,type: eleG.key.includes( 'xm_raw_material') ? 'VueContainer' :eleG.type }
            })
          }
          return objC
        })
        return obj
      })
      if ( tableD.length > 0 ) { 
        nextTick(()=>{
          table_data.value = tableD 
          _title.value = resD.data.process.name
        })
        
      }
      console.log('----------initData-----607---------',table_data.value)
      setTimeout(() => {
        tableRef.value.expandAll()
      }, 100);
    }
  }else {
    table_data.value = []
    TMessagePlugin.error(resD.msg)
  }
}

onMounted(async () => {
  console.log('----------change_log.value22222222222222---------',props);
  if (change_log.value?.change_log && (table_data.value && table_data.value.length === 0) ) {
    console.log('----------change_log.value222222222---------',change_log.value);
    await initData()
  }else if (props.viewType === 'productView' && props.node.attrs && props.node.attrs.change_log) {
    await initData()
  } else if(is_integration.value) {
    console.log('----------change_log.value22222222--------',is_integration.value);
    const docD = props.editor.getJSON()
    if (docD ) {
      dialog_selectOptions.value = []
      // 原材料表
      const dialog = useConfirm({
        theme: 'info',
        header: '提示',
        body: '检测到当前实验项目中存在工艺表，是否使用该工艺表进行初始化？',
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
  tableRef.value.expandAll()
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
