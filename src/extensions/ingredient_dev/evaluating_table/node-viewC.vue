<template>
  <node-view-wrapper :id="node.attrs.id" class="umo-node-view">
    <div style="width: 100%">
      <!-- <h2>试验原辅料</h2> -->
      <t-table 
        ref="tableRef" :loading="loading"
        v-model:display-columns="displayColumns" row-key="id" :data="_table_data" :columns="_columns" resizable
        >
        <template #topContent>
          <div style="padding: 6px 0;display: block;">
            <t-space>
              <div>
                <span :title=" isChanged?'未保存':'已保存' " style="width: 10px; height: 10px; border-radius: 50%;" :style="{background:isChanged? 'var(--td-error-color)' : 'var(--td-success-color)'}"></span>
              </div>
              <t-space>
                <t-input v-if="false" v-model="searchTitle" auto-width placeholder="请输入物料名称" />
                <!-- <t-button variant="outline" @click="add_dialog_visible = true;">新增</t-button> -->
                <div v-if="updateTime&&updateTime.length>10" title="修改时间"><t-icon name="time" size="13px" style="color: #a0a0a0;margin-right:4px;"/><span class="Font12Color">{{updateTime}}</span> </div>
                <t-button title="设置" variant="outline" @click="columnEditFunc"><template #icon> <t-icon name="setting" size="18px"></t-icon></template></t-button>
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
            <t-popconfirm content="确认删除吗" @confirm="() => onDelete(row)" >
              <t-button title="删除" theme="danger" shape="square" variant="text" >删除</t-button>
            </t-popconfirm>
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
        <t-form-item label="样品表" name="sample_group">
          <t-select v-model="selectTableForm.sample_group" borderless placeholder="请选择" style="width: 100%;" clearable filterable >
            <t-option v-for="item in sample_group_options" :key="item.group" :value="item.group" :label="item.name"></t-option>
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
              <t-select v-model="selectTableForm.test_period" borderless placeholder="请选择" style="width: 100px;" filterable >
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
import { getEval_execute_standardListFetch,get_experiment_samples_groupsFetch,put_experiment_evaluation_fetch,delete_experiment_evaluationFetch, get_experiment_evaluationListFetch,post_experiment_evaluation_fetch } from '@/api/experiment'
import xmInput from '@/components/xm-input.vue';
import { timeFormat } from '@/utils/time-ago'
import { getOrg_memberFetch } from '@/api/index'
import { fixedImageUrls, fixedImageUrl } from '@/utils/index'

const { editor, node, updateAttributes } = defineProps(nodeViewProps)
const $dict_data = JSON.parse( localStorage.getItem('dict_data') )
console.log('-----------113------------------',$dict_data);

const $key_data = JSON.parse( localStorage.getItem('key_data'))
const experiment_record = computed(() => $key_data?.experiment_record)
const experiment_theme = computed(() => $key_data?.experiment_theme)

const test_condition_options = $dict_data['test_conditions'];
const evaluating_test_period_options = $dict_data['evaluating_test_period'];

const { options } = useStore()
const dialog_visible = ref(false);
const tableRef = ref();
const editableRowKeys = ref([]);
 
const loading = ref(false);
// 取字符串用. 分割的最后一位 value.lab.lab_l 得到lab_l
const resultKey = (str) => {
  const parts = str.split('.');
  return parts[parts.length - 1];
}

const cellMake = (h, { row, rowIndex,col }) => {
  console.log('------147----cellMake---------',row, rowIndex,col)
  const res = col.colKey.split('.').reduce((obj, k) => obj && obj[k], row);
  console.log('------153----cellMake---res------',col.colKey,res)
  if (col.edit && col.edit.customProps && col.edit.customProps.config ) {
    if (col.edit.customProps.config.type === 'ImageUpload' && res && res.length > 0) {
      return ( 
        <div class="tdesign-demo-image-viewer__base">
          <t-image-viewer images={fixedImageUrls(res)}>
            {{
              trigger: ({ open }) => (
                <div class="tdesign-demo-image-viewer__ui-image">
                  <img alt="test" src={fixedImageUrl(res[0].url)} class="tdesign-demo-image-viewer__ui-image--img" />
                  <div 
                    class="tdesign-demo-image-viewer__ui-image--hover" 
                    onClick={(e) => { e.stopPropagation(); open() }}
                  >
                    <span>
                      <BrowseIcon size="1.4em" /> 预览
                    </span>
                  </div>
                  <div class="tdesign-demo-image-viewer__ui-image--footer">
                    <span class="tdesign-demo-image-viewer__ui-image--title">
                      1/{res.length}
                    </span>
                  </div>
                </div>
              )
            }}
          </t-image-viewer>
        </div>
       )
    }else{
      return ( <span>{res}</span> );
    }
  }else{
    return ( <span>{res}</span> );
  }
  
}
const columnsDefaultF = [
  {
    title: '样品名',
    colKey: 'samples',
    minWidth: 140,
    cell: (h , { row, rowIndex } ) => {
      const status = rowIndex % 3;
      return (
        <div>
          <span>{row.samples ? row.samples.name : '-'}</span>
          <t-tag size="small">{row.samples ? row.samples.sn : ''}</t-tag>
        </div>
      );
    },
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
  //   title: '编号',
  //   colKey: 'sample_sn',
  //   width: 140,
  //   // edit: {
  //   //   // 1. 支持任意组件。需保证组件包含 `value` 和 `onChange` 两个属性，且 onChange 的第一个参数值为 new value。
  //   //   // 2. 如果希望支持校验，组件还需包含 `status` 和 `tips` 属性。具体 API 含义参考 Input 组件
  //   //   component: TInput,
  //   //   // props, 透传全部属性到 Input 组件
  //   //   props: {
  //   //     clearable: true,
  //   //     autofocus: true,
  //   //     // autoWidth: true,
  //   //   },
  //   //   // 校验规则，此处同 Form 表单
  //   //   rules: [
  //   //     {
  //   //       required: true,
  //   //       message: '不能为空',
  //   //     },
  //   //   ],
  //   //   showEditIcon: true,
  //   //   abortEditOnEvent: ['onEnter','onBlur'],
  //   //   onEdited: (context ) => {
  //   //     console.log(context);
  //   //     const newData = [..._table_data.value];
  //   //     newData.splice(context.rowIndex, 1, context.newRowData);
  //   //     _table_data.value = newData;
  //   //     console.log('Edit firstName:', context);
  //   //     useMessage('success' ,'Success');
  //   //   },
  //   //   // 触发校验的时机（when to validate)
  //   //   validateTrigger: 'change',
  //   //   // 透传给 component: Input 的事件（也可以在 edit.props 中添加）
  //   //   on: (editContext ) => ({
  //   //     onBlur: (ctx ) => {
  //   //       console.log('失去焦点', editContext);
  //   //       ctx?.e?.preventDefault();
  //   //     },
  //   //     onEnter: (ctx ) => {
  //   //       ctx?.e?.preventDefault();
  //   //       console.log('onEnter', ctx);
  //   //     },
  //   //     // 默认是否为编辑状态
  //   //     defaultEditable: false,
  //   //   }),
  //   // },
  // },
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
    colKey: 'current_period',
    width: 40,
    cell:(h, { row ,rowIndex})=> {
      return `${(rowIndex)*row.current_period}${row.test_period==1?'W':'D'}`
    }
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
    cell:(h, { row })=> {
      return row.condition && test_condition_options ? test_condition_options.find(ele=> ele.value === row.condition) ? test_condition_options.find(ele=> ele.value === row.condition).label: '-' : '-'
    }
  },
  {
    title: '评测人',
    colKey: 'eval_user',
    minWidth: 100,
    cell:(h, { row })=> {
      const dataR =  row.eval_user
      return dataR ? row.eval_user.name : '-' 
    },
    edit: {
      // 1. 支持任意组件。需保证组件包含 `value` 和 `onChange` 两个属性，且 onChange 的第一个参数值为 new value。
      // 2. 如果希望支持校验，组件还需包含 `status` 和 `tips` 属性。具体 API 含义参考 Input 组件
      component: xmInput,
      // props, 透传全部属性到 Input 组件
      props: {
        clearable: true,
        autofocus: true,
        config: {
                  "id": "experimenter",
                  "key": "experimenter",
                  "icon": "iconamoon:edit",
                  "name": "UserPicker",
                  "type": "UserPicker",
                  "alias": "评测人",
                  "props": {
                      "hidden": false,
                      "abstract": false,
                      "readOnly": false,
                      "required": false,
                      "enableScan": false,
                      "validation": null,
                      "enablePrint": true,
                      "textForSuffix": "",
                      "enableSuffixText": false,
                      "multiply":false,
                      "remote": true,
                      "valueKey": "id",
                      "labelKey": "name",
                      "remoteMethod": () => {
                        return getOrg_memberFetch({limit:9999})
                      }
                  },
                  "title": "评测人",
                  "valueType": "String"
              }
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
        console.log('-----eval_user--414-----',context);
        const params = {
          eval_user:context.newRowData.eval_user.id,
          group: group.value
        }
        isChanged.value = true
        const res = await put_experiment_evaluation_fetch(context.row.id,params)
        if (res.data.code === 2000) {
          useMessage('success' ,res.data.msg);
          group.value =  res.data.data.group
          updateTime.value = timeFormat(null,'yyyy-mm-dd hh:MM:ss')
          // const newData = [..._table_data.value];
          // newData.splice(context.rowIndex, 1, context.newRowData);
          // _table_data.value = newData;
          await initData()
          console.log('Edit firstName:', context);
        }
        // const newData = [..._table_data.value];
        // newData.splice(context.rowIndex, 1, context.newRowData);
        // _table_data.value = newData;
        // console.log('Edit firstName:', newData);
        // useMessage('success' ,'Success');
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
    colKey: 'start_time',
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
      onEdited: async (context ) => {
        console.log(context);
        const params = {
          start_time:context.newRowData.start_time,
          group: group.value
        }
        isChanged.value = true
        const res = await put_experiment_evaluation_fetch(context.row.id,params)
        if (res.data.code === 2000) {
          useMessage('success' ,res.data.msg);
          group.value =  res.data.data.group
          updateTime.value = timeFormat(null,'yyyy-mm-dd hh:MM:ss')
          await initData()
          console.log('Edit firstName:', context);
        }
        // const newData = [..._table_data.value];
        // newData.splice(context.rowIndex, 1, context.newRowData);
        // _table_data.value = newData;
        // console.log('Edit firstName:', context);
        // useMessage('success' ,'Success');
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
      onEdited: async (context ) => {
        console.log(context);
        const params = {
          description:context.newRowData.description,
          group: group.value
        }
        isChanged.value = true
        const res = await put_experiment_evaluation_fetch(context.row.id,params)
        if (res.data.code === 2000) {
          useMessage('success' ,res.data.msg);
          group.value =  res.data.data.group
          updateTime.value = timeFormat(null,'yyyy-mm-dd hh:MM:ss')
          await initData()
          console.log('Edit firstName:', context);
        }
        // const newData = [..._table_data.value];
        // newData.splice(context.rowIndex, 1, context.newRowData);
        // _table_data.value = newData;
        // console.log('Edit firstName:', context);
        // useMessage('success' ,'Success');
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
  sample_group: '',
  index_type: '',
  condition: '',
  test_period: evaluating_test_period_options&&evaluating_test_period_options.length > 0 ? evaluating_test_period_options[0].value : '',
  start_datetime: '',
  current_period: '',
  period_num: 1,
})
const sample_group_options = ref([]);
const eval_execute_standardList = ref([]);

const FORM_RULES = { 
  sample_group: [{ required: true, message: '必填' ,trigger: ['blur'] }],
  index_type: [{ required: true, message: '必填' ,trigger: ['blur'] }],
  condition: [{ required: true, message: '必填' ,trigger: ['blur'] }],
  test_period: [{ required: true, message: '必填' ,trigger: ['blur'] }],
  start_datetime: [{ required: true, message: '必填' ,trigger: ['blur'] }],
  current_period: [{ required: true, message: '必填' ,trigger: ['blur'] }],
  period_num: [{ required: true, message: '必填' ,trigger: ['blur'] }],
};

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

const isChanged = computed({
  get: () => node.attrs.isChanged,
  set(value) {
    updateAttributes({ isChanged: value })
  },
})

const updateTime = computed({
  get: () => node.attrs.updateTime,
  set(value) {
    updateAttributes({ updateTime: value })
  },
})

const _table_data = computed({
  get: () => node.attrs.table_data,
  set(value) {
    updateAttributes({ table_data: value })
  },
})

const designParams = computed({
  get: () => node.attrs.designParams,
  set(value) {
    updateAttributes({ designParams: value })
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

const makeTableDataAndColumnFunc = (tableData,selectTableForm,index_typeInfo)=>{
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
  tableData.forEach(ele => {
    const obj = { ...ele,value: {}}
    index_typeInfo.forEach(ele => {
      if (ele.attribute.group && ele.attribute.group.length > 0) {
        obj.value[ele.attribute.key] =  {}
      }else {
        obj.value[ele.attribute.key] =  ''
      }
    })
    table_data.push(obj)
  });

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
  console.log('--------692---------group_Colums_result-----',group_Colums_result)
  // 做表格列
  const makeColumns = (item,sub_col,type) => {
    const componentName = xmInput
    const options = !['SelectPlusRadio','SelectPlus'].includes(item.type) ? [] : item.props.options.map(ele=> ({ label: ele.name, value: ele.id }) )
    sub_col.children.push({
      title: item.name,
      colKey: type ==='group'? `${sub_col.colKey}.${item.key}`: `value.${item.key}`,
      minWidth: 100,
      cell: cellMake,
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
          if (!row.value) {
            row.value = {}
          }
          if(type ==='group'){
            if (!row.value[resultKey(sub_col.colKey)]) {
              row.value[resultKey(sub_col.colKey)] = {}
              row.value[resultKey(sub_col.colKey)][resultKey(col.colKey)] = ''
            }else if (!row.value[resultKey(sub_col.colKey)][resultKey(col.colKey)]) {
              row.value[resultKey(sub_col.colKey)][resultKey(col.colKey)] = ''
            }
          }else{
            if (!row.value[resultKey(col.colKey)]) {
              row.value[resultKey(col.colKey)] = ''
            }
          }
          return {
            modelValue: type ==='group'? row.value[resultKey(sub_col.colKey)][resultKey(col.colKey)] : row.value[resultKey(col.colKey)],
            config: item,
            clearable: true,
            autofocus: false,
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
        onEdited: async (context ) => {
          console.log(context);
          const params = {
            value:context.newRowData.value,
            group: group.value
          }
          isChanged.value = true
          const res = await put_experiment_evaluation_fetch(context.row.id,params)
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
          colKey: `value.${item.key}`  ,
        }
        sub_col.children = []
        item.group.forEach(sub_item => {
          makeColumns(sub_item,sub_col,'group')
        })
        group_Colums.children.push(sub_col)
      }else{
        makeColumns(item,group_Colums,'single')
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
      const params = {
        ...selectTableForm.value,
        experiment_theme: experiment_theme.value?.id,
        record: experiment_record.value?.id,
      }
      isChanged.value = true
      const res = await post_experiment_evaluation_fetch(params)
      if (res && res.data.code === 2000) {
        group.value = res.data.data.group
        useMessage('success',res.data.msg)
        updateTime.value = timeFormat(null,'yyyy-mm-dd hh:MM:ss')
        select_design_visible.value = false
        designParams.value = {form: selectTableForm.value,index_typeInfo:res.data.data.item  }
        const { table_data, columns } = makeTableDataAndColumnFunc(res.data.data.data,selectTableForm.value,res.data.data.item) 
        _columns.value = [...columns]
        // _table_data.value = [...table_data]
        displayColumns.value = columns.map(ele=> ele.colKey)
        await initData()
        console.log('-------575-------table_data', _table_data.value,_columns.value)
        // tableRef.value.refreshTable()
      }else{
        useMessage('error','提交失败')
      }
      
      
      
    }
  })
  
}


const onDelete = async (row) => {
  console.log('--------onDelete--------44--------',row)
  const params = {
    group: group.value,
  }
  isChanged.value = true
  const res = await delete_experiment_evaluationFetch(row.id,params)
  if (res.data.code === 2000) {
    useMessage('success' ,res.data.msg);
    // group.value =  res.data.data.group
    updateTime.value = timeFormat(null,'yyyy-mm-dd hh:MM:ss')
    await initData()
  }
  // const index = _table_data.value.findIndex((t ) => t === row);
  // _table_data.value.splice(index, 1);
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

const initData = async () => {
  loading.value = true
  const params = {
    experiment_theme: experiment_theme.value?.id,
    record: experiment_record.value?.id,
    group: group.value,
  }
  console.log('----------initData-----297---------',params)
  const res = await get_experiment_evaluationListFetch(params)
  loading.value = false
  if (res.data.code === 2000 && res.data.data.length > 0) {
    _table_data.value = res.data.data
    if (isChanged.value) { isChanged.value = false }
  }
  
}

onMounted(async () => {
  if (node.attrs.columns && Object.keys(node.attrs.columns).length > 0) {
    const columns = node.attrs.columns.map((col) => {
      if (col.children && col.children.length > 0) {
        return { ...col, children: col.children.map((ele) => {
          if (ele.children && ele.children.length > 0) {
            return { ...ele, children: ele.children.map((eleC) => {
              return { 
                ...eleC, 
                cell: cellMake,
                edit:{
                  ...eleC.edit, 
                  component: xmInput,
                  props:({row})=> {
                    console.log('---------888----children---children---',eleC)
                    if (!row.value) {
                      row.value = {}
                      row.value[resultKey(ele.colKey)] = {}
                      row.value[resultKey(ele.colKey)][resultKey(eleC.colKey)] = ''
                    }else if (!row.value[resultKey(ele.colKey)]) {
                      row.value[resultKey(ele.colKey)] = {}
                      row.value[resultKey(ele.colKey)][resultKey(eleC.colKey)] = ''
                    }else if (!row.value[resultKey(ele.colKey)][resultKey(eleC.colKey)]) {
                      row.value[resultKey(ele.colKey)][resultKey(eleC.colKey)] = ''
                    }
                    return {
                      modelValue: row.value? row.value[resultKey(ele.colKey)][resultKey(eleC.colKey)] : '',
                      config: eleC.edit.customProps?.config,
                      clearable: true,
                      autofocus: true,
                      multiply: true,
                      options: eleC.edit.customProps?.options,
                      // autoWidth: true,
                    }
                  },
                  onEdited: async (context ) => {
                    console.log('---------925-------------',context);
                    const params = {
                      value:context.newRowData.value,
                      group: group.value
                    }
                    isChanged.value = true
                    const res = await put_experiment_evaluation_fetch(context.row.id,params)
                    if (res.data.code === 2000) {
                      useMessage('success' ,res.data.msg);
                      group.value =  res.data.data.group
                      updateTime.value = timeFormat(null,'yyyy-mm-dd hh:MM:ss')
                      await initData()
                      console.log('Edit firstName:', context);
                    }
                  },
                  // on: (editContext ) => ({
                  //   onBlur: (ctx ) => {
                  //     console.log('失去焦点', editContext);
                  //     ctx?.e?.preventDefault();
                  //   },
                  //   onEnter: (ctx ) => {
                  //     ctx?.e?.preventDefault();
                  //     console.log('onEnter', ctx);
                  //   },
                  //   // 默认是否为编辑状态
                  //   defaultEditable: false,
                  // }),
                } 
              };
            })}
          }else{
            return { 
              ...ele, 
              cell: cellMake,
              edit:{
                ...ele.edit, 
                component: xmInput,
                props:({row})=> {
                  if (!row.value) {
                    row.value = {}
                    row.value[resultKey(ele.colKey)] = ''
                  }else if (!row.value[resultKey(ele.colKey)]) {
                    row.value[resultKey(ele.colKey)] = ''
                  }
                  return {
                    modelValue: row.value? row.value[resultKey(ele.colKey)] : '',
                    config: ele.edit.customProps?.config,
                    clearable: true,
                    autofocus: true,
                    multiply: true,
                    options: ele.edit.customProps?.options,
                    // autoWidth: true,
                  }
                },
                onEdited: async (context ) => {
                  console.log('---------952-------------',context);
                  const params = {
                    value:context.newRowData.value,
                    group: group.value
                  }
                  isChanged.value = true
                  const res = await put_experiment_evaluation_fetch(context.row.id,params)
                  if (res.data.code === 2000) {
                    useMessage('success' ,res.data.msg);
                    group.value =  res.data.data.group
                    updateTime.value = timeFormat(null,'yyyy-mm-dd hh:MM:ss')
                    await initData()
                    console.log('Edit firstName:', context);
                  }
                },
                // on: (editContext ) => ({
                //   onBlur: (ctx ) => {
                //     console.log('失去焦点', editContext);
                //     ctx?.e?.preventDefault();
                //   },
                //   onEnter: (ctx ) => {
                //     ctx?.e?.preventDefault();
                //     console.log('onEnter', ctx);
                //   },
                //   // 默认是否为编辑状态
                //   defaultEditable: false,
                // }),
              } 
            };
          }
        })}
      }else{
        return {
          ...col,
          cell: cellMake,
          edit:{
            ...col.edit, 
            component:xmInput,
            props:({row})=> {
              if (!row.value) {
                row.value = {}
                row.value[resultKey(col.colKey)] = ''
              }else if (!row.value[resultKey(col.colKey)]) {
                row.value[resultKey(col.colKey)] = ''
              }
              return {
                modelValue: row.value? row.value[resultKey(col.colKey)] : '',
                config: col.edit.customProps?.config,
                clearable: true,
                autofocus: true,
                multiply: true,
                options: col.edit.customProps?.options,
                // autoWidth: true,
              }
            },
            onEdited: async (context ) => {
              console.log('---------980-------------',context);
              const params = {
                value:context.newRowData.value,
                group: group.value
              }
              isChanged.value = true
              const res = await put_experiment_evaluation_fetch(context.row.id,params)
              if (res.data.code === 2000) {
                useMessage('success' ,res.data.msg);
                group.value =  res.data.data.group
                updateTime.value = timeFormat(null,'yyyy-mm-dd hh:MM:ss')
                await initData()
                console.log('Edit firstName:', context);
              }
            },
            // on: (editContext ) => ({
            //   onBlur: (ctx ) => {
            //     console.log('失去焦点', editContext);
            //     ctx?.e?.preventDefault();
            //   },
            //   onEnter: (ctx ) => {
            //     ctx?.e?.preventDefault();
            //     console.log('onEnter', ctx);
            //   },
            //   // 默认是否为编辑状态
            //   defaultEditable: false,
            // }),
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
    if (group.value && group.value.length > 0 && _table_data.value?.length === 0) {
      console.log('----------change_log.value1095---------',group.value);
      await initData()
      
    }else if(is_integration.value) {
      
      const docD = editor.getJSON()
      if (docD ) {
        // 物料表
        const raw_material_tables = docD.content.filter(ele=> ele.type === 'raw_material_table')
        if (raw_material_tables.length === 0) {
          TMessagePlugin.warning('请先创建物料表')
          return  // 物料表不存在，返回
        }
        raw_materialOptions.value = raw_material_tables.map(ele=> ele.attrs)
        const dialog = useConfirm({
          theme: 'info',
          header: '提示',
          body: '检测到当前文档中存在物料表，是否使用该物料表进行初始化？',
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
  }else{
    setTimeout(() => {
      select_design_visible.value = true;
    }, 100);
  }
  console.log('-----------onMounted----680----------------',node.attrs)
  get_experiment_samples_groupsFetch({experiment_theme: experiment_theme.value?.id, record: experiment_record.value?.id}).then((res)=>{
    if (res.data.code === 2000) {
      sample_group_options.value = res.data.data
    }else{
      TMessagePlugin.error(res.data.msg)
    }
  }).catch((err) => {
    TMessagePlugin.error('获取样品列表失败')
  })

  getEval_execute_standardListFetch().then((res) => {
    if (res.data.code === 2000) {
      eval_execute_standardList.value = res.data.data
    }else{
      TMessagePlugin.error(res.data.msg)
    }
  }).catch((err) => {
    TMessagePlugin.error('获取标准列表失败')
  })
  console.log('-----------initData----317----------------',sample_group_options)

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


:deep(.tdesign-demo-image-viewer__ui-image) {
  width: 80px;
  height: 80px;
  display: inline-flex;
  position: relative;
  justify-content: center;
  align-items: center;
  border-radius: var(--td-radius-small);
  overflow: hidden;
  //margin: 2px;
  //border: 4px solid var(--td-bg-color-secondarycontainer);
}

:deep(.tdesign-demo-image-viewer__ui-image--hover) {
  width: 80px;
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  gap: 4px;
  left: 0;
  top: 0;
  opacity: 0;
  background-color: rgba(0, 0, 0, 0.6);
  color: var(--td-text-color-anti);
  line-height: 22px;
  transition: 0.2s;
}

:deep(.tdesign-demo-image-viewer__ui-image:hover .tdesign-demo-image-viewer__ui-image--hover) {
  opacity: 1;
  cursor: pointer;
}

:deep(.tdesign-demo-image-viewer__ui-image--img) {
  width: 80px;
  height: 80px;
  cursor: pointer;
  position: absolute;
}

:deep(.tdesign-demo-image-viewer__ui-image--footer) {
  padding: 0 16px;
  height: 36px;
  width: 100%;
  text-align: center;
  line-height: 36px;
  font-size: 16px;
  position: absolute;
  bottom: 0;
  color: var(--td-text-color-anti);
  background-image: linear-gradient(0deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0) 100%);
  display: flex;
  box-sizing: border-box;
}

:deep(.tdesign-demo-image-viewer__ui-image--title) {
  flex: 1;
}

:deep(.tdesign-demo-popup__reference) {
  margin-left: 16px;
}

:deep(.tdesign-demo-image-viewer__ui-image--icons .tdesign-demo-icon) {
  cursor: pointer;
}

:deep(.tdesign-demo-image-viewer__base) {
  width: 100%;
  min-width: 80px;
  height: auto;
}

</style>
