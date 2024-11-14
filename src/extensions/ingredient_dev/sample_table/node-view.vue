<template>
  <node-view-wrapper :id="node.attrs.id" class="umo-node-view">
    <div style="width: 100%">
      <!-- <h2>样品</h2> -->
      <t-table 
        ref="tableRef"  
        row-key="id" :data="table_data" :columns="columns" resizable v-model:displayColumns="displayColumns"
         >
        <template #topContent>
          <div style="padding: 6px 0;display: block;">
            <t-space>
              <div></div>
              <t-space>
                <t-input v-model="searchTitle" auto-width placeholder="请输入样品名称" />
                <t-button theme="warning" variant="outline" @click="experimental_design_visible = true;">试验方法设计</t-button>
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
            <t-link theme="danger" hover="color" @click.stop="onDelete(row)">
              删除
            </t-link>
          </div>
        </template>
      </t-table>
      <node-view-content :node="node" ></node-view-content> 
    </div>
    <t-dialog destroyOnClose :closeOnOverlayClick="false"
      v-model:visible="experimental_design_visible"
      header="试验方法设计" :cancelBtn="null"
      width="80%" attach="body"
      :confirm-on-enter="true"
      :on-confirm="on_experimental_designFunc"
    >
      <experimental-design v-if="experimental_design_visible" v-model:designParams="_designParams" v-model:designResult="designResult" @select-change="onSelectChange"/>
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
const { editor, node, updateAttributes } = defineProps(nodeViewProps)

const { options } = useStore()
const dialog_visible = ref(false);
const tableRef = ref();
const editableRowKeys = ref([]);
const currentSaveId = ref('');
// 保存变化过的行信息
const editMap  = {};

const searchTitle = ref('')

const experimental_design_visible = ref(false);

const select_material = ref([])

const _designParams = computed({
  get: () => {
    const oldDesignParams = node.attrs.designParams
    console.log('------116--------oldDesignParams------',oldDesignParams)
    const docD = editor.getJSON()
    let designParams = []
    if (docD) {
      // 原材料表
      const raw_material_tables = docD.content.filter(ele=> ele.type === 'raw_material_table')
      // 工艺表
      const technology_tables = docD.content.filter(ele=> ele.type === 'technology_table')
      if (technology_tables.length > 0) {
        const [technology_table] = technology_tables
        const table_data  = technology_table.attrs.table_data.map(eleT => eleT.list)
        console.log('--------_designParams--------123--------',table_data)
        let material_options = []
        if (raw_material_tables.length > 0) {
          const [raw_material_table] = raw_material_tables
          console.log('-------130-------raw_material_table----------',raw_material_table)
          console.log('-------131-------raw_material_table----------',raw_material_table.attrs.table_data)
          material_options = Object.assign([],raw_material_table.attrs.table_data).map(ele=> { return { ...ele,name: ele.material.name + '/' + ele.material.sn } }) 
        }
        if (table_data.length > 0) {
          
          designParams = table_data.reduce((a, b) => a.concat(b)).map(eleT => { 
            if (eleT.key === XM_raw_material_key) {
              return { 
                ...eleT,step:'',check:true,
                raw_material: raw_material_tables[0].attrs.key,
                technology: technology_tables[0].attrs.key,
                type: 'SelectPlus',
                label: eleT.name,
                value: eleT.id,
                props: {
                  ...eleT.props,
                  labelKey: 'name',
                  valueKey: 'id',
                  options: material_options
                },
              }
            } else {
              return {...eleT,step:'',check:true}
            }
            
          })
          nextTick(()=>{
            if (oldDesignParams && oldDesignParams.length > 0) {
              // 遍历数组 b，查找并更新数组 a 中的对象
              oldDesignParams.forEach(itemB => {
                const itemA = designParams.find(itemA => itemA.id === itemB.id);
                if (itemA) {
                  itemA.step = itemB.step;
                }
              });
            }
          })
        }
      }
    }else {
      designParams = oldDesignParams
    }
    return designParams
  },
  set(value) {
    console.log('------172--------updateAttributes({ designParams: value })------',value)
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

const onSelectChange = ({value, params} )=>{
  // console.log('--------onSelectChange--------44--------',value, params)
  select_material.value = params.selectedRowData
}

const on_experimental_designFunc = ()=>{
  
  const selectData = designResult.value.filter(ele=> ele.check)
  if (selectData.length > 0) {
    
    selectData.forEach((ele ,index) => {
      const obj  = {
        ...ele,
        id: uuid(),
        raw_material: ele.id,
        sn: `S-00${index + 1}`,
        count: '0',
      }
      table_data.value.push(obj)
    });
    experimental_design_visible.value = false
  }else{
    TMessagePlugin.warning('请选择需要添加的数据')
  }
  nextTick(()=>{
    updateAttributes({ designParams:[ ..._designParams.value] })
  })
  
  console.log('--------on_experimental_designFunc--------119--------',_designParams.value,designResult.value)
}

const onEdit = (row) => {
  console.log('--------onEdit--------44--------',row)
  if (!editableRowKeys.value.includes(row.id)) {
    editableRowKeys.value.push(row.id);
  }
};

const onDelete = (row) => {
  console.log('--------onDelete--------44--------',row)
  const index = table_data.value.findIndex((t ) => t === row);
  table_data.value.splice(index, 1);
};

// 更新 editableRowKeys
const updateEditState = (id) => {
  console.log('--------updateEditState--------44--------',id)
  const index = editableRowKeys.value.findIndex((t) => t === id);
  editableRowKeys.value.splice(index, 1);
};
const onCancel = (row) => {
  console.log('--------onSave--------44--------',row)
  const { id } = row;
  updateEditState(id );
  tableRef.value?.clearValidateData();
};
const onSave = (row) => {
  console.log('--------onSave--------44--------',row)
  const { id } = row;
  currentSaveId.value = id;
  // 触发内部校验，而后也可在 onRowValidate 中接收异步校验结果
  tableRef.value.validateRowData(id).then((params ) => {
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
      onEdited: (context ) => {
        console.log(context);
        const newData = [...table_data.value];
        newData.splice(context.rowIndex, 1, context.newRowData);
        table_data.value = newData;
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
      onEdited: (context ) => {
        console.log(context);
        const newData = [...table_data.value];
        newData.splice(context.rowIndex, 1, context.newRowData);
        table_data.value = newData;
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
      onEdited: (context ) => {
        console.log(context);
        const newData = [...table_data.value];
        newData.splice(context.rowIndex, 1, context.newRowData);
        table_data.value = newData;
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
        defaultEditable: true,
      }),
    },
  },
  {
    title: '操作栏',
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
  console.log('-------onCellClick-----row,col',col.colKey, row, col)
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
  setTimeout(() => {
    // experimental_design_visible.value = true;
  }, 500);
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
