<template>
  <node-view-wrapper :id="node.attrs.id" class="umo-node-view">
    <div style="width: 100%">
      <!-- <h2>试验原辅料</h2> -->
      <t-table 
        ref="tableRef"  
        row-key="id" :data="_table_data" :columns="_columns" resizable v-model:displayColumns="displayColumns"
        >
        <template #topContent>
          <div style="padding: 6px 0;display: block;">
            <t-space>
              <div></div>
              <t-space>
                <t-input v-model="searchTitle" auto-width placeholder="请输入原材料名称" />
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
            <t-icon v-if="rowIndex!==_table_data.length-1" name="order-descending" size="18px"></t-icon>
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
    <t-dialog 
      v-model:visible="select_design_visible"
      destroy-on-close 
      :close-on-overlay-click="false"
      header="选择样品表" :cancel-btn="null"
      width="600" attach="body"
      :confirm-on-enter="true"
      :on-confirm="on_select_designFunc"
    >
      <t-form ref="select_design_form" :rules="FORM_RULES" :data="selectTableForm" :colon="true" >
        <t-form-item label="样品表" name="sample_table">
          <t-select v-model="selectTableForm.sample_table" borderless placeholder="请选择" style="width: 100%;" clearable filterable >
            <t-option v-for="item in sample_table_options" :key="item.id" :value="item.id" :label="item.title"></t-option>
          </t-select>
        </t-form-item>
      </t-form>
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
 
const columnsDefaultF = [
  {
    title: '样品名',
    colKey: 'name',
    minWidth: 140,
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
        const newData = [..._table_data.value];
        newData.splice(context.rowIndex, 1, context.newRowData);
        _table_data.value = newData;
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
    title: '编号',
    colKey: 'sn',
    minWidth: 140,
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
        const newData = [..._table_data.value];
        newData.splice(context.rowIndex, 1, context.newRowData);
        _table_data.value = newData;
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
    title: '类型',
    colKey: 'type',
    minWidth: 140,
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
        const newData = [..._table_data.value];
        newData.splice(context.rowIndex, 1, context.newRowData);
        _table_data.value = newData;
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
    title: '周期',
    colKey: 'cycle',
    minWidth: 140,
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
        const newData = [..._table_data.value];
        newData.splice(context.rowIndex, 1, context.newRowData);
        _table_data.value = newData;
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
    title: '评测人',
    colKey: 'reviewer',
    minWidth: 140,
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
        const newData = [..._table_data.value];
        newData.splice(context.rowIndex, 1, context.newRowData);
        _table_data.value = newData;
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
    title: '时间',
    colKey: 'dateTime',
    minWidth: 140,
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
        const newData = [..._table_data.value];
        newData.splice(context.rowIndex, 1, context.newRowData);
        _table_data.value = newData;
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
]
const columnsDefaultA = [
  {
    colKey: 'description',
    title: '评论',
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
        const newData = [..._table_data.value];
        newData.splice(context.rowIndex, 1, context.newRowData);
        _table_data.value = newData;
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
]
const searchTitle = ref('')
const add_dialog_visible = ref(false);

const select_design_form = ref()
const select_design_visible = ref(false)
const selectTableForm = ref({
  sample_table: '',
})
const sample_table_options = ref([]);

const FORM_RULES = { 
  sample_table: [{ required: true, message: '必填' ,trigger: ['change'] }]
};

const _table_data = computed({
  get: () => node.attrs.table_data,
  set(value) {
    updateAttributes({ table_data: value })
  },
})

const designParam = computed({
  get: () => node.attrs.designParam,
  set(value) {
    updateAttributes({ designParam: value })
  },
})


const _columns = computed({
  get: () => node.attrs.columns,
  set(value) {
    updateAttributes({ columns: value })
  },
})

const columnsCheckboxs = ref([])

const displayColumns = ref([]);
const displayColumnsC = ref([]);

displayColumns.value = [...columnsDefaultF,...columnsDefaultA].map(ele=> ele.colKey)

const checkAll = computed(() => displayColumns.value.length === displayColumnsC.value.length);
const indeterminate = computed(() => !!(displayColumns.value.length > displayColumnsC.value.length && displayColumnsC.value.length));

const makeTableDataAndColumnFunc = (designParam)=>{
  console.log('-----478-----makeTableDataAndColumnFunc------------',designParam)
  const table_data = []
  const columns = []
  // 做表格数据
  const designParamKeys = designParam.designParams.map(ele=> ele.key )
  designParam.table_data.forEach(ele => {
    let obj = { ...ele, id:uuid(), sample: ele.id,  type: '',cycle: '',description: '',reviewer: '',dateTime: '',}
    designParamKeys.forEach(key => {
      obj[key] = ''
    });
    table_data.push(obj)
  });
  // 做表格列
  designParam.designParams.forEach(item=>{
    const componentName = ['SelectPlusRadio','SelectPlus'].indexOf(item.type) === -1 ? TInput : TSelect
    const options = ['SelectPlusRadio','SelectPlus'].indexOf(item.type) === -1 ? [] : item.props.options.map(ele=> ({ label: ele.name, value: ele.id }) )
    if (item.key === XM_raw_material_key) {
      columns.unshift({
        title: item.name,
        colKey: item.key,
        width: 100,
        render(h, { row }) {
          const dataR =  row[item.key]
          return dataR ? item.props.options?.filter(eleO => dataR.includes(eleO.id))?.map(eleO => eleO.name)?.join(";") : '' 
        },
      });
    }else{
      columns.push({
        title: item.name,
        colKey: item.key,
        width: 100,
        edit: {
          // 1. 支持任意组件。需保证组件包含 `value` 和 `onChange` 两个属性，且 onChange 的第一个参数值为 new value。
          // 2. 如果希望支持校验，组件还需包含 `status` 和 `tips` 属性。具体 API 含义参考 Input 组件
          component: componentName,
          // props, 透传全部属性到 Input 组件
          props: {
            clearable: true,
            autofocus: true,
            multiply: true,
            options
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
            const newData = [..._table_data.value];
            newData.splice(context.rowIndex, 1, context.newRowData);
            _table_data.value = newData;
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
        }
      });
    }
  })

  return { table_data , columns: [...columnsDefaultF,...columns,...columnsDefaultA] }
}

const on_select_designFunc = ()=>{
  select_design_form.value?.validate({ showErrorMessage: true }).then((validateResult) => {
    if (validateResult && Object.keys(validateResult).length) {
      const firstError = Object.values(validateResult)[0]?.[0]?.message;
      useMessage('warning',firstError)
    }else{
      select_design_visible.value = false

      const selectTable = sample_table_options.value.find(ele=> ele.id === selectTableForm.value.sample_table)
      updateAttributes({ designParam: selectTable })
      const { table_data, columns } = makeTableDataAndColumnFunc(selectTable)

      setTimeout(() => {
        _columns.value = [...columns]
        _table_data.value = [...table_data]
        displayColumns.value = columns.map(ele=> ele.colKey)
        console.log('-------575-------table_data', _table_data.value,_columns.value)
        tableRef.value.refreshTable()

      }, 100);
    }
  })
  
}


const onDelete = (row) => {
  console.log('--------onDelete--------44--------',row)
  const index = _table_data.value.findIndex((t ) => t === row);
  _table_data.value.splice(index, 1);
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

const handleSelectAll = (checked) => {
  displayColumnsC.value = checked ? [ ...displayColumns.value ] : [];
}

const onConfirmFunc = ()=>{
  displayColumns.value = [ ...displayColumnsC.value ]
  dialog_visible.value = false
}

const columnEditFunc = ()=>{
  columnsCheckboxs.value = _columns.value.map((col )=>{ return { label:col.title, value:col.colKey } })
  displayColumnsC.value = [ ...displayColumns.value ]
  dialog_visible.value = true
}

const initialize = () => {
  const docD = editor.getJSON()
  if (docD) {
    // 原材料表
    const experimental_design_tables_contents = docD.content.filter(ele=> ele.type === 'experimental_design' && ele.content).map(ele=> ele.content )
    let experimental_design_tables = []
    if (experimental_design_tables_contents && experimental_design_tables_contents.length > 0) {
      console.log('-------299-------experimental_design_tables_contents', experimental_design_tables_contents)
      experimental_design_tables = experimental_design_tables_contents.reduce((a, b) => a.concat(b)).filter(ele=> ele.type === 'sample_table')
    }
    // 工艺表
    const sample_tables = docD.content.filter(ele=> ele.type === 'sample_table')
    if (experimental_design_tables.length === 0 && sample_tables.length === 0) {
      TMessagePlugin.warning('请先创建样品表')
      select_design_visible.value = false;
      return  // 工艺表不存在，返回
    }
    sample_table_options.value = experimental_design_tables.concat(sample_tables).map((ele) => ele.attrs)
    console.log('-----------initialize----317----------------',sample_table_options)
  }else {
    select_design_visible.value = false;
    TMessagePlugin.warning('当前文档中没有数据错误')
  }
}

onMounted(() => {
  initialize()
  setTimeout(() => {
    select_design_visible.value = true;
  }, 100);
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
