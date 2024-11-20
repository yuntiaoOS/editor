<template>
  <node-view-wrapper :id="node.attrs.id" class="umo-node-view">
    <div style="width: 100%">
      <!-- <h2>试验原辅料</h2> -->
      <t-table 
        ref="tableRef"  
        v-model:display-columns="displayColumns" row-key="id" :data="_table_data" :columns="_columns" resizable
        >
        <template #topContent>
          <div style="padding: 6px 0;display: block;">
            <t-space>
              <div></div>
              <t-space>
                <t-input v-if="false" v-model="searchTitle" auto-width placeholder="请输入原材料名称" />
                <!-- <t-button variant="outline" @click="add_dialog_visible = true;">新增</t-button> -->
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
        <t-form-item label="执行标准" name="index_type">
          <t-select v-model="selectTableForm.index_type" borderless placeholder="请选择" style="width: 100%;" clearable filterable >
            <t-option v-for="item in eval_execute_standardList" :key="item.id" :value="item.id" :label="item.standard_name"></t-option>
          </t-select>
        </t-form-item>
        <t-form-item label="条件" name="condition">
          <t-select v-model="selectTableForm.condition" borderless placeholder="请选择" style="width: 100%;" clearable filterable >
            <t-option v-for="item in test_condition_options" :key="item.value" :value="item.value" :label="item.label"></t-option>
          </t-select>
        </t-form-item>
        <t-form-item label="开始日期" name="start_datetime">
          <t-date-picker v-model="selectTableForm.start_datetime" borderless format="YYYY-MM-DD" value-type="YYYY-MM-DD"/>
        </t-form-item>
        <t-form-item label="周期间隔" name="current_period">
          <t-input v-model="selectTableForm.current_period" placeholder="周期间隔" clearable>
            <template #suffix>
              <t-select v-model="selectTableForm.test_period" borderless placeholder="请选择" style="width: 100%;" clearable filterable >
                <t-option v-for="item in evaluating_test_period_options" :key="item.value" :value="item.value" :label="item.label"></t-option>
              </t-select>
            </template>
          </t-input>
        </t-form-item>
        <t-form-item label="周期数" name="period_num">
          <t-input-number v-model="selectTableForm.period_num" theme="column" :max="100" :min="1" style="width: 100%;border:none;" borderless  @blur="blurCycleNumberFunc"/>
        </t-form-item>
      </t-form>
    </t-dialog>
    <t-dialog
      v-model:visible="dialog_visible"
      destroy-on-close
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
import { NodeViewContent,nodeViewProps, NodeViewWrapper } from '@tiptap/vue-3'
import { v4 as uuid } from 'uuid'

import { getEval_execute_standardListFetch,getExecute_standard_itemInfoFetch } from '@/api/experiment'
import xmInput from '@/components/xm-input.vue';

const { editor, node, updateAttributes } = defineProps(nodeViewProps)
const $dict_data = JSON.parse( localStorage.getItem('dict_data') )
console.log('-----------113------------------',$dict_data);

const test_condition_options = $dict_data['test_conditions'];
const evaluating_test_period_options = $dict_data['evaluating_test_period'];

const { options } = useStore()
const dialog_visible = ref(false);
const tableRef = ref();
const editableRowKeys = ref([]);
 
const columnsDefaultF = [
  {
    title: '样品名',
    colKey: 'sample_name',
    minWidth: 140,
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
    //       required: true,
    //       message: '不能为空',
    //     },
    //   ],
    //   showEditIcon: true,
    //   abortEditOnEvent: ['onEnter','onBlur'],
    //   onEdited: (context ) => {
    //     console.log(context);
    //     const newData = [..._table_data.value];
    //     newData.splice(context.rowIndex, 1, context.newRowData);
    //     _table_data.value = newData;
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
  {
    title: '编号',
    colKey: 'sample_sn',
    width: 140,
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
    //       required: true,
    //       message: '不能为空',
    //     },
    //   ],
    //   showEditIcon: true,
    //   abortEditOnEvent: ['onEnter','onBlur'],
    //   onEdited: (context ) => {
    //     console.log(context);
    //     const newData = [..._table_data.value];
    //     newData.splice(context.rowIndex, 1, context.newRowData);
    //     _table_data.value = newData;
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
  // {
  //   title: '类型',
  //   colKey: 'category',
  //   minWidth: 140,
  //   edit: {
  //     // 1. 支持任意组件。需保证组件包含 `value` 和 `onChange` 两个属性，且 onChange 的第一个参数值为 new value。
  //     // 2. 如果希望支持校验，组件还需包含 `status` 和 `tips` 属性。具体 API 含义参考 Input 组件
  //     component: TInput,
  //     // props, 透传全部属性到 Input 组件
  //     props: {
  //       clearable: true,
  //       autofocus: true,
  //       // autoWidth: true,
  //     },
  //     // 校验规则，此处同 Form 表单
  //     rules: [
  //       {
  //         required: true,
  //         message: '不能为空',
  //       },
  //     ],
  //     showEditIcon: true,
  //     abortEditOnEvent: ['onEnter','onBlur'],
  //     onEdited: (context ) => {
  //       console.log(context);
  //       const newData = [..._table_data.value];
  //       newData.splice(context.rowIndex, 1, context.newRowData);
  //       _table_data.value = newData;
  //       console.log('Edit firstName:', context);
  //       useMessage('success' ,'Success');
  //     },
  //     // 触发校验的时机（when to validate)
  //     validateTrigger: 'change',
  //     // 透传给 component: Input 的事件（也可以在 edit.props 中添加）
  //     on: (editContext ) => ({
  //       onBlur: (ctx ) => {
  //         console.log('失去焦点', editContext);
  //         ctx?.e?.preventDefault();
  //       },
  //       onEnter: (ctx ) => {
  //         ctx?.e?.preventDefault();
  //         console.log('onEnter', ctx);
  //       },
  //       // 默认是否为编辑状态
  //       defaultEditable: false,
  //     }),
  //   },
  // },
  {
    title: '周期',
    colKey: 'cycle_name',
    width: 40,
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
    //       required: true,
    //       message: '不能为空',
    //     },
    //   ],
    //   showEditIcon: true,
    //   abortEditOnEvent: ['onEnter','onBlur'],
    //   onEdited: (context ) => {
    //     console.log(context);
    //     const newData = [..._table_data.value];
    //     newData.splice(context.rowIndex, 1, context.newRowData);
    //     _table_data.value = newData;
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
  { 
    title: '条件',
    colKey:'condition',
    width: 100,
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
    width: 120,
    edit: {
      // 1. 支持任意组件。需保证组件包含 `value` 和 `onChange` 两个属性，且 onChange 的第一个参数值为 new value。
      // 2. 如果希望支持校验，组件还需包含 `status` 和 `tips` 属性。具体 API 含义参考 Input 组件
      component: TDatePicker,
      // props, 透传全部属性到 Input 组件
      props: {
        clearable: true,
        autofocus: true,
        Format: "YYYY-MM-DD", 
        valueType: "YYYY-MM-DD",
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
      abortEditOnEvent: ['onEnter','onPick','onChange'],
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
  index_type: '',
  condition: '',
  test_period: evaluating_test_period_options&&evaluating_test_period_options.length > 0 ? evaluating_test_period_options[0].value : '',
  start_datetime: '',
  current_period: '',
  period_num: 1,
})
const sample_table_options = ref([]);
const eval_execute_standardList = ref([]);

const FORM_RULES = { 
  sample_table: [{ required: true, message: '必填' ,trigger: ['blur'] }],
  index_type: [{ required: true, message: '必填' ,trigger: ['blur'] }],
  condition: [{ required: true, message: '必填' ,trigger: ['blur'] }],
  test_period: [{ required: true, message: '必填' ,trigger: ['blur'] }],
  start_datetime: [{ required: true, message: '必填' ,trigger: ['blur'] }],
  current_period: [{ required: true, message: '必填' ,trigger: ['blur'] }],
  period_num: [{ required: true, message: '必填' ,trigger: ['blur'] }],
};

const _table_data = computed({
  get: () => node.attrs.table_data,
  set(value) {
    updateAttributes({ table_data: value })
  },
})

const designParams = computed({
  get: () => node.attrs.designParam,
  set(value) {
    updateAttributes({ designParam: value })
  },
})

const _columns = ref([])

const columns = computed({
  get: () => {
    return node.attrs.columns
  },
  set(value) {
    updateAttributes({ columns: value })
  },
})

const columnsCheckboxs = ref([])

const displayColumns = ref([]);
const displayColumnsC = ref([]);

const checkAll = computed(() => displayColumns.value.length === displayColumnsC.value.length);
const indeterminate = computed(() => !!(displayColumns.value.length > displayColumnsC.value.length && displayColumnsC.value.length));

const blurCycleNumberFunc = (val) => {
  if (Number(val) > 100) selectTableForm.value.period_num = 100;
  if (Number(val) < 1) selectTableForm.value.period_num = 1;
}

const makeTableDataAndColumnFunc = (designParam,selectTableForm,index_typeInfo)=>{
  console.log('-----478-----makeTableDataAndColumnFunc------------',selectTableForm,index_typeInfo)
  // 将开始日期转换为 Date 对象
  const startDate = new Date(selectTableForm.start_datetime);

  // 初始化结果数组
  const result = [];

  // 根据周期间隔单位计算每次增加的天数
  const incrementDays = selectTableForm.test_period === '1' ? selectTableForm.current_period * 7 : selectTableForm.current_period;

  // 生成日期数组
  for (let i = 0; i < selectTableForm.period_num; i++) {
      // 将当前日期转换为 YYYY-MM-DD 格式
      const year = startDate.getFullYear();
      const month = String(startDate.getMonth() + 1).padStart(2, '0');
      const day = String(startDate.getDate()).padStart(2, '0');
      result.push(`${year}-${month}-${day}`);

      // 增加指定天数
      startDate.setDate(startDate.getDate() + incrementDays);
  }
  console.log('-----478-----makeTableDataAndColumnFunc----result--------',result)


  const table_data = []
  const columns = []
  // 做表格数据
  const designParamKeys = index_typeInfo.map(ele=> ele.attribute ).map(ele=> ele.key )
  result.forEach((date,index) => {
    designParam.table_data.forEach(ele => {
      const condition = test_condition_options.find( cond => cond.value === selectTableForm.condition ).label
      const obj = { id:uuid(),sample_name:ele.name,sample_sn:ele.sn, sample: ele,condition:selectTableForm.condition,condition_name:condition , 
         category: '',current_period:selectTableForm.current_period,test_period:selectTableForm.test_period,
         cycle_name: `${(index)*selectTableForm.current_period}${selectTableForm.test_period==1?'W':'D'}` ,description: '',reviewer: '',dateTime: date,}
      designParamKeys.forEach(key => {
        obj[key] = ''
      });
      table_data.push(obj)
    });
  })

  // 属性按category属性分组做两层表头
  const groupedData = index_typeInfo.reduce((acc, item) => {
    const categoryId = item.category.id;
    const categoryName = item.category.category_name;

    // 如果当前类别不存在，则创建一个新的类别对象
    if (!acc[categoryId]) {
      acc[categoryId] = {
        id: categoryId,
        category_name: categoryName,
        children: []
      };
    }

    // 将当前项添加到对应类别的 children 数组中
    acc[categoryId].children.push(item);

    return acc;
  }, {});

  // 将分组后的对象转换为数组
  const group_Colums_result = Object.values(groupedData);
  // 做表格列
  const makeColumns = (item,children) => {
    const componentName = xmInput
    const options = !['SelectPlusRadio','SelectPlus'].includes(item.type) ? [] : item.props.options.map(ele=> ({ label: ele.name, value: ele.id }) )
    children.push({
      title: item.name,
      colKey: item.key,
      width: 100,
      edit: {
        // 1. 支持任意组件。需保证组件包含 `value` 和 `onChange` 两个属性，且 onChange 的第一个参数值为 new value。
        // 2. 如果希望支持校验，组件还需包含 `status` 和 `tips` 属性。具体 API 含义参考 Input 组件
        component: componentName,
        // props, 透传全部属性到 Input 组件
        customProps: {
          componentName: 'xmInput',
          config: item,
          options
        },
        props:({col,row})=> {
          return {
            modelValue: row[item.key],
            config: item,
            clearable: true,
            autofocus: true,
            multiply: true,
            options
            // autoWidth: true,
          }
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
  group_Colums_result.forEach(ele => {
    const { category_name } = ele;
    const group_Colums = {
      title: category_name,
      colKey: `category${  ele.id}` ,
      children: [],
    }
    ele.children.map(ele=> ele.attribute ).forEach(item=>{
      if (item.group && item.group.length > 0){
        const sub_col = {
          title: item.name,
          colKey: item.key ,
        }
        sub_col.children = []
        item.group.forEach(sub_item => {
          makeColumns(sub_item,sub_col.children)
        })
        group_Colums.children.push(sub_col)
      }else{
        makeColumns(item,group_Colums.children)
      }
    })
    columns.push(group_Colums)
  })
  updateAttributes({ columns: [...columns] }) 
  console.log('-----700-----makeTableDataAndColumnFunc----columns--------',columns)
  return { table_data , columns: [...columnsDefaultF,...columns,...columnsDefaultA] }
}

const on_select_designFunc = ()=>{
  select_design_form.value?.validate({ showErrorMessage: true }).then(async (validateResult) => {
    if (validateResult && Object.keys(validateResult).length) {
      const firstError = Object.values(validateResult)[0]?.[0]?.message;
      useMessage('warning',firstError)
    }else{
      select_design_visible.value = false
      const index_typeInfoRes = await getExecute_standard_itemInfoFetch({
        execute_standard: selectTableForm.value.index_type
      })
      if (index_typeInfoRes && index_typeInfoRes.data.code === 2000) {
        const selectTable = sample_table_options.value.find(ele=> ele.id === selectTableForm.value.sample_table)
        updateAttributes({ designParam: selectTable })
        const { table_data, columns } = makeTableDataAndColumnFunc(selectTable,selectTableForm.value,index_typeInfoRes.data.data) 
        _columns.value = [...columns]
        _table_data.value = [...table_data]
        displayColumns.value = columns.map(ele=> ele.colKey)
        console.log('-------575-------table_data', _table_data.value,_columns.value)
        tableRef.value.refreshTable()
      }
      
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

    getEval_execute_standardListFetch().then((res) => {
      if (res.data.code === 2000) {
        eval_execute_standardList.value = res.data.data
      }else{
        TMessagePlugin.error(res.data.msg)
      }
    }).catch((err) => {
      TMessagePlugin.error('获取标准列表失败')
    })
    console.log('-----------initialize----317----------------',sample_table_options)
  }else {
    select_design_visible.value = false;
    TMessagePlugin.warning('当前文档中没有数据错误')
  }
}

onMounted(() => {
  initialize()
  console.log('-----------onMounted----680----------------',node.attrs)
  if (node.attrs.columns && Object.keys(node.attrs.columns).length > 0) {
    const columns = node.attrs.columns.map((col) => {
      if (col.children && col.children.length > 0) {
        return { ...col, children: col.children.map((ele) => {
          if (ele.children && ele.children.length > 0) {
            return { ...ele, children: ele.children.map((eleC) => {
              return { 
                ...eleC, 
                edit:{
                  ...eleC.edit, 
                  component: xmInput,
                  props:({row})=> {
                    return {
                      modelValue: row[eleC.colKey],
                      config: eleC.edit.customProps?.config,
                      clearable: true,
                      autofocus: true,
                      multiply: true,
                      options: eleC.edit.customProps?.options,
                      // autoWidth: true,
                    }
                  },
                  onEdited: (context ) => {
                    console.log(context);
                    const newData = [..._table_data.value];
                    newData.splice(context.rowIndex, 1, context.newRowData);
                    _table_data.value = newData;
                    useMessage('success' ,'Success');
                  },
                } 
              };
            })}
          }else{
            return { 
              ...ele, 
              edit:{
                ...ele.edit, 
                component: xmInput,
                props:({row})=> {
                  return {
                    modelValue: row[ele.colKey],
                    config: ele.edit.customProps?.config,
                    clearable: true,
                    autofocus: true,
                    multiply: true,
                    options: ele.edit.customProps?.options,
                    // autoWidth: true,
                  }
                },
                onEdited: (context ) => {
                  console.log(context);
                  const newData = [..._table_data.value];
                  newData.splice(context.rowIndex, 1, context.newRowData);
                  _table_data.value = newData;
                  useMessage('success' ,'Success');
                },
              } 
            };
          }
        })}
      }else{
        return {
          ...col,
          edit:{
            ...col.edit, 
            component:xmInput,
            props:({row})=> {
              return {
                modelValue: row[col.colKey],
                config: col.edit.customProps?.config,
                clearable: true,
                autofocus: true,
                multiply: true,
                options: col.edit.customProps?.options,
                // autoWidth: true,
              }
            },
            onEdited: (context ) => {
              console.log(context);
              const newData = [..._table_data.value];
              newData.splice(context.rowIndex, 1, context.newRowData);
              _table_data.value = newData;
              useMessage('success' ,'Success');
            },
          },
        };
      }
      
    });
    console.log('-----------onMounted---822----------------',columns)
    setTimeout(() => {
      _columns.value = [...columnsDefaultF,...columns,...columnsDefaultA ]
      displayColumns.value = _columns.value.map(ele=> ele.colKey)
      tableRef.value.refreshTable()
    }, 100);
    
  }else{
    setTimeout(() => {
      select_design_visible.value = true;
    }, 100);
  }
  
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
