<template>
  <node-view-wrapper :id="node.attrs.id" class="umo-node-view">
    <div style="width: 100%">
      <!-- <h2>样品</h2> -->
      <t-table expanded-row="expandedRow"
        ref="tableRef"  :loading="loading" :expanded-row-keys="expandedRowKeys" :expandIcon="false"
        row-key="id" :data="table_data" :columns="columns" resizable v-model:displayColumns="displayColumns"
         >
        <template #topContent>
          <div style="padding: 6px 0;display: block;">
            <t-space>
              <div>
                <span :title=" isChanged?'未保存':'已保存' " style="width: 10px; height: 10px; border-radius: 50%;" :style="{background:isChanged? 'var(--td-error-color)' : 'var(--td-success-color)'}"></span>
                <t-input v-model="_title" auto-width placeholder="请输入名称" />
              </div>
              <t-space>
                
                <t-button  variant="outline" @click="onAddFunc">新增</t-button>
                <div v-if="updateTime&&updateTime.length>10" title="修改时间"><t-icon name="time" size="13px" style="color: #a0a0a0;margin-right:4px;"/><span class="Font12Color">{{updateTime}}</span> </div>
                <t-button title="设置" variant="outline" @click="columnEditFunc"><template #icon> <t-icon name="setting" size="18px"></t-icon></template></t-button>
              </t-space>
            </t-space>
          </div>
        </template>
        <template #expandedRow="{ row }">
          <t-space direction="vertical" align="" style="width: 100%;">
            <div class="more-detail">
              <t-divider align="left" dashed>试验方法设计</t-divider>
              <div v-for="(treeItem,index) in row.experimental_design.formItems" :key="index">
                <t-descriptions :title="treeItem.title" size="small" colon  :column="1" :label-style="{ width: '150px', textAlign: 'left' }" style="margin-bottom: 20px">
                  <t-descriptions-item v-for="(item,indexF) in treeItem.formItems" :key="indexF" :label="item.title">
                    <FormDesignRender 
                      v-model="row.experimental_design.formData[treeItem.key][item.key]"
                      style="overflow: auto;"
                      :mode=" 'RESP'"
                      :config="item">
                    </FormDesignRender>
                  </t-descriptions-item>
                  <t-descriptions-item >
                    <template #label>
                      <t-tag theme="primary">备注</t-tag>
                    </template>
                    <t-textarea v-model="row.experimental_design.formData[treeItem.key].description" :autosize="{minRows: 2}" placeholder="请输入备注"></t-textarea>
                  </t-descriptions-item>
                </t-descriptions>
                <t-tree v-if="false"
                  :data="[treeItem]"  :keys="{ value: 'rowKey', label: 'title', children: 'formItems' }"
                  activable  expandParent activeMultiple expandAll 
                  allowFoldNodeOnFilter  line >  
                  <template #label="{ node }">
                    <t-row>
                      <t-col flex="150px">
                        <span :style="{color: node.data.type ?'blue' :'var(--umo-text-color-primary)' ,width: '150px'}">{{ node.label }}</span>
                      </t-col>
                      <t-col flex="auto">
                        <div v-if="node.isLeaf()">
                          <xmFormDesignRender
                            v-model="row.experimental_design.formData"
                            :label="node.data.title"
                            :valueKey="getNodeFullColKey(node)"
                            :mode=" 'RESP'"
                            :config="node.data">
                          </xmFormDesignRender>
                          
                        </div>
                      </t-col>
                    </t-row>
                  </template>
                </t-tree>
                
              </div>
              
            </div>
            <div>
              <t-divider align="left" dashed>试验记录</t-divider>
              <t-table  
                ref="tableRef"  :loading="loading"  
                row-key="id" :data="row.record_table.table_data" :columns="row.record_table.columns" resizable
              >
                <template #defaultValueSlot="slotProps">
                  <div >
                    <FormDesignRender style="overflow: auto;"
                      v-model="slotProps.row[slotProps.col.colKey]"
                      :mode=" 'NORMAL'"
                      :config="slotProps.col.attrs">
                    </FormDesignRender>
                  </div>
                </template>
                <template #topContent>
                  <div style="padding: 6px 0;display: block;">
                    <t-space>
                      <div>
                        <!-- <span :title=" isChanged?'未保存':'已保存' " style="width: 10px; height: 10px; border-radius: 50%;" :style="{background:isChanged? 'var(--td-error-color)' : 'var(--td-success-color)'}"></span>
                        <t-input v-model="_title" auto-width placeholder="请输入名称" /> -->
                      </div>
                      <t-space>
                        <t-button  variant="outline" @click="makerecordDataFunc()">新增</t-button>
                        <t-button  variant="outline" @click="onAddIndexFunc(row)">配置指标</t-button>
                      </t-space>
                    </t-space>
                  </div>
                </template>
                <template #type-slot-operate="slotProps">
                  <div style="display: flex; align-items: center;gap: 10px; ">
                    <t-link theme="primary" hover="color" @click="row.record_table.table_data.push(cloneDeep( slotProps.row ) )">
                      复制
                    </t-link>
                    <t-popconfirm content="确认删除吗" @confirm="() => { row.record_table.table_data.splice( row.record_table.table_data.indexOf(slotProps.row),1 ) }" >
                      <t-button title="删除" theme="danger" shape="square" variant="text" >删除</t-button>
                    </t-popconfirm>
                  </div>
                </template>
              </t-table>
            </div>
          </t-space>
        </template>
        <template #type-slot-sort="{ col, row , rowIndex}">
          <t-space>
            <t-icon v-if="rowIndex!==0" name="order-ascending" size="18px"></t-icon>
            <div v-else></div>
            <t-icon v-if="rowIndex!==table_data.length-1" name="order-descending" size="18px"></t-icon>
          </t-space>

        </template> 
        <template #type-slot-operate="{ col, row }">
          <div style="display: flex; align-items: center;gap: 10px; ">
            <t-link theme="primary" hover="color" @click="expandDataFunc(row)">
              试验记录
            </t-link>
            <t-switch v-model="row.is_sample" :label="['已出样', '未出样']"></t-switch>
            <!-- <div v-else>
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
      header="选择实验设计方案" :cancel-btn="null"
      width="600" attach="body"
      :confirm-on-enter="true"
      :on-confirm="on_select_designFunc"
    >
      <t-form ref="select_design_form" :rules="FORM_RULES" :data="selectTableForm" :colon="true" >
        <t-form-item label="实验设计方案" name="experimental_design">
          <t-select v-model="selectTableForm.experimental_design" multiple borderless placeholder="请选择" style="width: 100%;" clearable filterable >
            <t-option v-for="item in experimental_designOptions" :key="item.id" :value="item.id" :label="item.title"></t-option>
          </t-select>
        </t-form-item>
      </t-form>
    </t-dialog>
    <t-dialog 
      v-model:visible="select_index_visible"
      destroy-on-close 
      :close-on-overlay-click="false"
      header="选择指标属性" :cancel-btn="null"
      width="600" attach="body"
      :confirm-on-enter="true"
      :on-confirm="on_select_indexFunc"
    >
      <t-form ref="select_record_form" :rules="FORM_RULES" :data="selectTableForm" :colon="true" >
        <t-form-item label="类型" name="type">
          <t-radio-group v-model="selectTableForm.type" variant="primary-filled" @change="procedureTypeChange">
            <t-radio-button value="group">指标组</t-radio-button>
            <t-radio-button value="customer">自定义</t-radio-button>
          </t-radio-group>
        </t-form-item>
        <t-form-item label="指标属性" name="index_type">
          <t-select v-model="selectTableForm.index_type" borderless placeholder="请选择" style="width: 100%;" multiple clearable filterable >
            <t-option v-for="item in assessmentOption" :key="item.id" :value="item.id" :label="item.title"></t-option>
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
import { getEval_attribute_libraryListFetch,get_experiment_samplesListFetch  } from '@/api/experiment'
import { timeFormat } from '@/utils/time-ago'
import component from '@/extensions/form/item/component';
import { cloneDeep } from 'lodash-unified';
import { shortId } from '@/utils/short-id'

const { editor, node, updateAttributes } = defineProps(nodeViewProps)

const { options } = useStore()
const dialog_visible = ref(false);
const tableRef = ref();
const editableRowKeys = ref([]);
const currentSaveId = ref('');
// 保存变化过的行信息
const editMap  = {};
const loading = ref(false);
const searchTitle = ref('')
const raw_materialOptions = ref([])
const technologyOptions = ref([])
const experimental_designOptions = ref([])
const selectRow = ref()

const select_record_form = ref()

const select_index_visible = ref(false);

const technologyInfoVisible = ref(false);

const $key_data = JSON.parse( localStorage.getItem('key_data'))
const experiment_record = computed(() => $key_data?.experiment_record)
const experiment_theme = computed(() => $key_data?.experiment_theme)
const select_design_visible = ref(false);
const experimental_design_visible = ref(false);

const assessmentOption = ref([
  {
    "id": 8,
    "title": "单行输入",
    "props": {
      "suffix": "%",
      "abstract": true,
      "required": false,
      "enableScan": true,
      "enablePrint": true
    },
    "key": "dan_hang_shu_ru",
    "type": "TextInput",
    "value": null,
    "unit": null,
    "attribute_type": "single"
  },
  {
    "id": 9,
    "title": "数字输入",
    "props": {
      "suffix": "%",
      "abstract": false,
      "required": false,
      "enablePrint": true
    },
    "key": "shu_zi_shu_ru",
    "type": "NumberInput",
    "value": null,
    "unit": null,
    "attribute_type": "single"
  },
  {
    "id": 10,
    "title": "组合属性",
    "props": {
      "size": 8,
      "items": [
        {
          "id": 8,
          "key": "dan_hang_shu_ru",
          "type": "TextInput",
          "unit": null,
          "group": [],
          "props": {
            "suffix": "%",
            "abstract": true,
            "required": false,
            "enableScan": true,
            "enablePrint": true
          },
          "title": "单行输入",
          "value": null,
          "attribute_type": "single"
        }
      ],
      "abstract": false,
      "required": false,
      "direction": "horizontal",
      "expanding": false,
      "enablePrint": true
    },
    "key": "zu_he_shu_xing",
    "type": "FieldsGroup",
    "value": null,
    "unit": null,
    "attribute_type": "single"
  },
  {
    "id": 11,
    "title": "原料",
    "props": {
      "options": [
        "选项1",
        "选项2"
      ],
      "abstract": false,
      "required": false,
      "expanding": false,
      "enablePrint": true
    },
    "key": "yuan_liao",
    "type": "SelectInput",
    "value": null,
    "unit": null,
    "attribute_type": "single"
  },
  {
    "id": 12,
    "title": "附件",
    "props": {
      "maxSize": 100,
      "abstract": false,
      "onlyRead": false,
      "required": false,
      "fileTypes": [],
      "maxNumber": 10,
      "enablePrint": true,
      "placeholder": "点击上传"
    },
    "key": "fu_jian",
    "type": "Attachment",
    "value": null,
    "unit": null,
    "attribute_type": "single"
  }
])
const expandedRowKeys = ref([]);

const selectRecordTable = ref()

const selectTableForm = ref({
  type: 'group',
  index_type: [] ,  
  experimental_design:[]
})
const FORM_RULES = {
  experimental_design: [{ required: true, message: '必填' ,trigger: ['change'] }] ,
  index_type: [{ required: true, message: '必填' ,trigger: ['change'] }]
};
const select_material = ref([])

const _title = computed({
  get: () => node.attrs.title,
  set(value) {
    updateAttributes({ title: value })
  },
})

const updateTime = computed({
  get: () => node.attrs.updateTime,
  set(value) {
    updateAttributes({ updateTime: value })
  },
})

const isChanged = computed({
  get: () => node.attrs.isChanged,
  set(value) {
    updateAttributes({ isChanged: value })
  },
})
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

const _designParams = computed({
  get: () => node.attrs.designParams,
  set(value) {
    updateAttributes({ designParams: value })
  },
})

const designResult = ref([])

const pagination = ref({
  limit: 20,
  total: 0,
  page: 1,
});


const table_data = computed({
  get: () => node.attrs.table_data,
  set(value) {
    updateAttributes({ table_data: value })
  },
})

const onAddFunc = () => {
  initialize()
  if (experimental_designOptions.value.length === 1 ) {
    selectTableForm.value.experimental_design = experimental_designOptions.value[0].id
    on_select_designFunc(true)
  }else{
    select_design_visible.value = true
  }
  console.log('------220--------onAddFunc----------')
}

const expandDataFunc = (row)=>{
  expandedRowKeys.value.push(row.id)
}

const getNodeFullColKey = (node) => {
  const parents = node.getParents()
  
  // console.info('树结构数据:--------',node, parents);
  if (!parents) {
    return ''
  } 
  const keys = []
  parents.forEach(item => {
    keys.unshift(item.data.key)
  })
  if (parents[0].data.type && parents[0].data.type === "FieldsGroup") {
    keys.push(node.data.id)
  }else{
    keys.push(node.data.key)
  }
  
  const keyStr = keys.join('.')
  // console.log('keys:-----204---', keyStr);
  return keyStr? keyStr : ''
}

const onAddIndexFunc = (row)=>{
  selectRecordTable.value = row
  select_index_visible.value = true
}

const onDelete = async(row) => {
  table_data.value.splice(table_data.value.indexOf(row), 1)
};

const columns = ref([])

const columnsCheckboxs = ref([])

const displayColumns = ref([]);
const displayColumnsC = ref([]);
displayColumns.value = ['name','sn','experimental_design', 'count','description','is_sample', 'operate']
const frontColumns = [
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
        const newData = [...table_data.value];
        newData.splice(context.rowIndex, 1, context.newRowData);
        table_data.value = newData;
        console.log('------552------Edit firstName:', context,table_data.value);
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
    width: 140,
  },
]
const suffixColumns = [
{
  title: '操作栏',
  colKey: 'operate',
  width: 90,
  cell: 'type-slot-operate',
},
]
columns.value = [
  ...frontColumns,
  {
    colKey: 'sn',
    title: '编号',
    width: 120,
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
        const newData = [...table_data.value];
        newData.splice(context.rowIndex, 1, context.newRowData);
        table_data.value = newData;
        console.log('------552------Edit firstName:', context,table_data.value);
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
  // {
  //   colKey: 'experimental_design',
  //   title: '试验设计方案',
  //   minWidth: 400,
  //   cell: 'slot-experimental_design'
  // },
  {
    colKey: 'count',
    title: '数量/g',
    width: 80,
    edit: {
      // 1. 支持任意组件。需保证组件包含 `value` 和 `onChange` 两个属性，且 onChange 的第一个参数值为 new value。
      // 2. 如果希望支持校验，组件还需包含 `status` 和 `tips` 属性。具体 API 含义参考 Input 组件
      component: TInputNumber,
      // props, 透传全部属性到 Input 组件
      props: {
        clearable: true,
        autofocus: true,
        autoWidth: true,
        theme:"normal",
        suffix:"g"
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
        const newData = [...table_data.value];
        newData.splice(context.rowIndex, 1, context.newRowData);
        table_data.value = newData;
        console.log('------552------Edit firstName:', context,table_data.value);
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
  // {
  //   colKey: 'is_sample',
  //   title: '是否出样',
  //   width: 100,
  //   cell: (h, { row, rowIndex }) => {
  //     return h(TSwitch, {
  //       modelValue: row.is_sample,  // 使用 modelValue 绑定数据
  //       label:['已出样', '未出样'],
  //       'onUpdate:modelValue': (e) => {  // 监听 update:modelValue 事件
  //         console.log('switch-----', e);
  //         const newData = [...table_data.value];
  //         newData[rowIndex].is_sample = e;
  //         table_data.value = newData;
  //         useMessage('success', 'Success');
  //       },
  //       style: {
  //         'margin-left': '10px',
  //       },
  //     });
  //   },
  //   // edit: {
  //   //   component: TSwitch,
  //   //   props: {
  //   //     clearable: true,
  //   //     autofocus: true,
  //   //     // autoWidth: true,
  //   //   },
  //   //   // 校验规则，此处同 Form 表单
  //   //   rules: [
  //   //     {
  //   //       required: false,
  //   //       message: '不能为空',
  //   //     },
  //   //   ],
  //   //   showEditIcon: true,
  //   //   abortEditOnEvent: ['onEnter','onBlur'],
  //   //   onEdited: (context ) => {
  //   //     const newData = [...table_data.value];
  //   //     newData.splice(context.rowIndex, 1, context.newRowData);
  //   //     table_data.value = newData;
  //   //     console.log('------552------Edit firstName:', context,table_data.value);
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
  //   //     defaultEditable: true,
  //   //   }),

  //   // }
  // },
  {
    colKey: 'description',
    title: '描述',
    ellipsis: true,
    width: 140,
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
        console.log('------552------Edit firstName:', context,table_data.value);
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
  ...suffixColumns
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

const on_select_indexFunc = ()=>{
  console.log('--------on_select_indexFunc--------590--------',selectRecordTable.value,selectTableForm.value )
  select_record_form.value?.validate({ showErrorMessage: true }).then((validateResult) => {
    if (validateResult && Object.keys(validateResult).length) {
      const firstError = Object.values(validateResult)[0]?.[0]?.message;
      useMessage('warning',firstError)
    }else{
      const indexTypes = assessmentOption.value.filter(ele=> selectTableForm.value.index_type.includes(ele.id))
      const paramsColumns = []
      const descriptionCol = {"key":"description","icon":"","type":"TextareaInput","props":{"abstract":true,"required":false,"enableScan":false,"enablePrint":true},"title":"描述","valueType":""}
      indexTypes.push(descriptionCol)
      indexTypes.forEach(ele=>{
        const paramsColumn = {
          title: ele.title,
          colKey: ele.key,
          attrs: ele,
          minWidth: 100,
          cell: 'defaultValueSlot',
        }
        paramsColumns.push(paramsColumn)
      })
      console.log('--------on_select_indexFunc--------593--------',paramsColumns )

      selectRecordTable.value.record_table.columns = [...paramsColumns, ...suffixColumns]
      selectRecordTable.value.record_table.params = cloneDeep(indexTypes)
      

      makerecordDataFunc(true)

      let indexC = -1
      table_data.value.forEach((row, index) => {
        if (row.id === selectRecordTable.value.id) {
          indexC = index;
        }
      });
      table_data.value.splice(indexC, 1, selectRecordTable.value)
      console.log('--------on_select_indexFunc--------656--------',table_data.value )
      select_index_visible.value = false
    }
  })
  
}

const makerecordDataFunc = (init=false)=>{
  console.log('--------makerecordDataFunc--------590--------',selectRecordTable.value,selectTableForm.value )
  const rowD = {name: selectRecordTable.value.name}
  // 递归函数，处理嵌套的 FieldsGroup 和 SelectMaterial
  function processValueItems(items) {
    const valueC = {};

    items.forEach(eleI => {
      if (['SelectInput', 'TimeRangePicker', 'DeptPicker', 'TableList', 'Attachment', 'SelectMaterial'].includes(eleI.type)) {
        valueC[eleI.id] = [];
      } else if (['FieldsGroup'].includes(eleI.type)) {
        valueC[eleI.id] = processValueItems(eleI.props.items); // 递归处理嵌套的 items
      } else {
        valueC[eleI.id] = '';
      }
    });

    return valueC;
  }
  // 主逻辑
  selectRecordTable.value.record_table.params.forEach(ele => {
    let valueC = '';

    if (['SelectInput', 'TimeRangePicker', 'DeptPicker', 'TableList', 'Attachment', 'SelectMaterial'].includes(ele.type)) {
      valueC = [];
    } else if (['FieldsGroup'].includes(ele.type)) {
      valueC = processValueItems(ele.props.items); // 调用递归函数处理嵌套的 items
    }
    rowD[ele.key] = valueC;
  });
  nextTick(() => {
    if (init) {
      selectRecordTable.value.record_table.table_data = [rowD]
    }else{
      selectRecordTable.value.record_table.table_data.push(rowD)
    }
    
  });
}

const on_select_designFunc = (validate)=>{
  console.log('--------on_select_designFunc--------555555555555555555--------',experimental_designOptions.value )
  const makeData = ()=>{
    const experimental_designs = experimental_designOptions.value.filter(ele=> selectTableForm.value.experimental_design.includes(ele.id)).map(eleT => (eleT.designResult) )
    experimental_designs.forEach(ele=>{
      const newData = {
        id: uuid(),
        name: `样品-${timeFormat(null,'yyyymmddhhMM')}${shortId()}`,
        sn: `SF-${timeFormat(null,'yyyymmddhhMM')}${shortId()}`,
        count: 1,
        is_sample: false,
        experimental_design: cloneDeep( ele ),
        record_table: {
          id: uuid(),
          title: `测试${shortId()}`,
          table_data: [],
          columns: [ ...suffixColumns],
          params: {},
        },
        description: '',
      }
      table_data.value.push(newData)
    })
  }
  if (validate) {
    makeData()
    select_design_visible.value = false
  } else {
    select_design_form.value?.validate({ showErrorMessage: true }).then((validateResult) => {
      if (validateResult && Object.keys(validateResult).length) {
        const firstError = Object.values(validateResult)[0]?.[0]?.message;
        useMessage('warning',firstError)
      }else{
        makeData()
      }
    })
    select_design_visible.value = false
  }
  console.log('--------on_select_designFunc--------138--------',table_data.value, _designParams.value)
  
}

const getAssessmentOptionFunc = async (page=1) => {
  const res = await getEval_attribute_libraryListFetch({page,limit:9999})
  console.log(res, '-------------488------------assessmentOption.value')
  let resD = {}
  if ( true) {
    resD = res.data
  }else {
    resD = res.data.value ? res.data.value : res.data
  }
  if (resD.code === 2000) {
    if (page === 1) {
      assessmentOption.value = [...resD.data]
    } else {
      assessmentOption.value = [...assessmentOption.value, ...resD.data]
    }
    pagination.value.total = resD.total
    console.log(assessmentOption.value, '-------------502------------assessmentOption.value')
  }
  
}

getAssessmentOptionFunc()

const initData = async () => {
  loading.value = true
  const params = {
    experiment_theme: experiment_theme.value?.id,
    record: experiment_record.value?.id,
    group: group.value,
  }
  console.log('----------initData-----297---------',params)
  const res = await get_experiment_samplesListFetch(params)
  loading.value = false
  if (res.data.code === 2000 && res.data.data.length > 0) {
    table_data.value = res.data.data
    if (isChanged.value) { isChanged.value = false }
  }
}

const initialize = () => {
  const docD = editor.getJSON()
  if (docD) {
    // 原材料表
    const raw_material_tables = docD.content.filter(ele=> ele.type === 'raw_material_table')
    if (raw_material_tables.length === 0) {
      TMessagePlugin.warning('请先创建原材料表')
      return  // 原材料表不存在，返回
    }
    raw_materialOptions.value = raw_material_tables.map(ele=> ele.attrs)
    // 工艺表
    const technology_tables = docD.content.filter(ele=> ele.type === 'technology_table')
    if (technology_tables.length === 0) {
      TMessagePlugin.warning('请先创建工艺表')
      return  // 工艺表不存在，返回
    }
    technologyOptions.value = technology_tables.map(ele=> ele.attrs)
    // 试验设计方案
    const experimental_design_tables = docD.content.filter(ele=> ele.type === 'experimental_design')
    if (experimental_design_tables.length === 0) {
      TMessagePlugin.warning('请先创建试验设计方案')
      return  // 试验设计方案，返回
    }
    experimental_designOptions.value = experimental_design_tables.map(ele=> ele.attrs)
  }else {
    TMessagePlugin.warning('当前文档中没有数据错误')
  }
}

onMounted(() => {
  console.log('----------4447----onMounted-----',node);
  initialize()
  if (node.attrs.customerParams?.is_select ) {
    selectTableForm.value.experimental_design = node.attrs.customerParams?.experimental_design
    on_select_designFunc(node.attrs.customerParams?.is_select)
  }else{
    if (!table_data.value || table_data.value?.length === 0) {
      setTimeout(() => {
        if (experimental_designOptions.value.length === 1 ) {
          selectTableForm.value.experimental_design = experimental_designOptions.value[0].id
          on_select_designFunc(true)
        }else{
          select_design_visible.value = true
        }
      }, 500);
    }

  }
  if (group.value && group.value.length > 0 && table_data.value?.length === 0) {
    console.log('----------change_log.value499---------',group.value);
    // await initData()
  }else if(is_integration.value) {
    
    const docD = editor.getJSON()
    if (docD ) {
      // 原材料表
      // const raw_material_tables = docD.content.filter(ele=> ele.type === 'raw_material_table')
      // if (raw_material_tables.length === 0) {
      //   TMessagePlugin.warning('请先创建原材料表')
      //   return  // 原材料表不存在，返回
      // }
      // raw_materialOptions.value = raw_material_tables.map(ele=> ele.attrs)
      // const dialog = useConfirm({
      //   theme: 'info',
      //   header: '提示',
      //   body: '检测到当前文档中存在原材料表，是否使用该原材料表进行初始化？',
      //   confirmBtn: '确定',
      //   onConfirm() {
      //     dialog.destroy()
      //     setTimeout(() => {
      //       add_parent_visible.value = true
      //     }, 300)
      //   },
      //   onClosed() {
          
      //   },
      // })
      
    }else {
      TMessagePlugin.warning('当前文档中没有数据')
    }
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
