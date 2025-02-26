<template>
  <div style="width: 100%">
    <!-- <h2>工艺</h2> -->
    <t-table :data="table_data" :columns="columns" row-key="id" :loading="loading">
      <template #topContent>
        <div style="padding: 6px 0;display: block;">
          <t-space>
            <div>
              <span :title=" isChanged?'未保存':'已保存' " style="width: 10px; height: 10px; border-radius: 50%;" :style="{background:isChanged? 'var(--td-error-color)' : 'var(--td-success-color)'}"></span>
              <t-input v-model="_title" label="名称：" size="large" autofocus autoWidth borderless />
            </div>
            <t-space>
              <t-input v-if="false" v-model="searchTitle" auto-width placeholder="请输入工艺步骤名称" />
              <t-button variant="outline" @click="onAddWorkingProcedure">添加工序</t-button>
              <div v-if="updateTime&&updateTime.length>10" title="修改时间"><t-icon name="time" size="13px" style="color: #a0a0a0;margin-right:4px;"/><span class="Font12Color">{{updateTime}}</span> </div>
              <t-button title="设置" variant="outline" @click="columnEditFunc"><template #icon> <t-icon name="setting" size="18px"></t-icon></template></t-button>
            </t-space>
          </t-space>
        </div>
      </template>
      <template #defaultValueSlot="slotProps">
        <div >
          <t-list v-if="slotProps.row.form.formItems && slotProps.row.form.formItems.length > 0 ">
            <t-list-item v-for="(item, index) in slotProps.row.form.formItems" >
              <div style="display: flex;align-items: center;gap:10px;">
                <t-dropdown :options="operateTypeOption" trigger="click" @click="(operateI)=>{ item.operateType = operateI.value; }">
                  <t-tag size="small" :theme=" item.operateType === '物料' ? 'primary' :  item.operateType === '样品' ? 'warning' : 'success' ">{{item.operateType}}</t-tag>
                </t-dropdown>
                <span>{{item.title}}</span>
              </div>
              <template #action>
                <div style="margin-right:10px;">
                  <t-button :disabled="index === 0 " variant="text" shape="square" hover="color" @click="onOperateAdd('up',index,slotProps.rowIndex,slotProps.row)" > <t-icon name="arrow-up" ></t-icon> </t-button>
                  <t-button :disabled="index === slotProps.row.form.formItems.length - 1 " variant="text" shape="square" hover="color" @click="onOperateAdd('down',index,slotProps.rowIndex,slotProps.row)" > <t-icon name="arrow-down" ></t-icon> </t-button>
                  <t-button variant="text" shape="square" hover="color" @click="onOperateAdd('insert',index,slotProps.rowIndex,slotProps.row)" > <t-icon name="download-1"></t-icon> </t-button>
                  <t-popconfirm content="确认删除吗" @confirm="onOperateAdd('delete',index,slotProps.rowIndex,slotProps.row)">
                    <t-button variant="text" shape="square" theme="danger" hover="color"> <t-icon name="delete"></t-icon> </t-button>
                  </t-popconfirm>

                  <t-dropdown v-if="false" :options="[{content:'上移', value: 'up'},{content:'下移', value: 'down'},{content:'插入', value: 'insert'},{content:'删除', value: 'delete'}]" trigger="hover" @click="(operateI)=>{
                    if(operateI.value === 'delete'){
                      slotProps.row.form.formItems.splice(index, 1);
                    }else if(operateI.value === 'up'){
                      onOperateAdd('up',index,slotProps.rowIndex,slotProps.row)
                    }else if(operateI.value === 'down'){
                      onOperateAdd('down',index,slotProps.rowIndex,slotProps.row)
                    }else if(operateI.value === 'insert'){
                      onOperateAdd('insert',index,slotProps.rowIndex,slotProps.row)
                    }
                   }">
                    <t-icon name="ellipsis" size="18px" style="cursor: pointer;"></t-icon>
                  </t-dropdown>
                </div>
              </template>
            </t-list-item>
          </t-list>
          <div v-else>
            <t-link theme="primary" hover="color" @click="onOperateAdd('insert',index,slotProps.rowIndex,slotProps.row)"> + 添加工艺模块 </t-link>
          </div>
        </div>
      </template>
      <template #type-slot-operate="{ col, row, rowIndex }">
        <div class="table-operations">
          <t-button  v-if="false" :disabled="rowIndex === 0 " variant="text" shape="square" hover="color" @click="onProcedureAdd('up',rowIndex,row)" > <t-icon name="arrow-up" ></t-icon> </t-button>
          <t-button  v-if="false" :disabled="rowIndex === table_data.length - 1 " variant="text" shape="square" hover="color" @click="onProcedureAdd('down',rowIndex,row)" > <t-icon name="arrow-down" ></t-icon> </t-button>
          <t-button  v-if="false" variant="text" shape="square" hover="color" @click="onProcedureAdd('insert',rowIndex,row)" > <t-icon name="download-1"></t-icon> </t-button>
          <t-popconfirm  v-if="false" content="确认删除吗" @confirm="onProcedureAdd('delete',rowIndex,row)">
            <t-button variant="text" shape="square" theme="danger" hover="color"> <t-icon name="delete"></t-icon> </t-button>
          </t-popconfirm>
          <t-dropdown :options="[{content:'上移', value: 'up'},{content:'下移', value: 'down'},{content:'插入', value: 'insert'},{content:'删除', value: 'delete'}]" trigger="hover" @click="(operateI)=>{
                    if(operateI.value === 'delete'){
                      onProcedureAdd('delete',rowIndex,row)
                    }else if(operateI.value === 'up'){
                      onProcedureAdd('up',rowIndex,row)
                    }else if(operateI.value === 'down'){
                      onProcedureAdd('down',rowIndex,row)
                    }else if(operateI.value === 'insert'){
                      onProcedureAdd('insert',rowIndex,row)
                    }
                   }">
            <t-button theme="primary" variant="text" shape="square" hover="color"> <t-icon name="ellipsis"></t-icon> </t-button>
          </t-dropdown>
        </div>
      </template>
      <!-- <template #footerSummary >
        <div v-if="table_data.length > 0" style="display: flex;align-items: center;justify-content: space-between;">
          <div></div>
          <t-button theme="primary" variant="text" @click="onExperimentalDesign" >试验设计</t-button>
        </div>
      </template> -->
    </t-table>
<!--    <node-view-content :node="_node" ></node-view-content>-->
  </div>
  <!-- <t-dialog
    v-model:visible="procedureVisible"
    header="工艺配置" destroyOnClose
    width="80%" attach="body"
    :confirm-on-enter="true"
    :on-confirm="onProcedureConfirmFunc"
  >
      <technology-table v-model="table_data_edit" :editor="editor" :viewType="viewType" :getAttributesFunction="getAttributesFunction" v-model:title="_title" @change=""/>
  </t-dialog> -->
  <t-dialog destroyOnClose
    v-model:visible="add_parent_visible"
    header="添加工序项"
    width="50%" attach="body"
    :confirm-on-enter="true"
    :on-confirm="on_select_parentFunc"
  >
    <t-form ref="design_form" :rules="FORM_RULES" :data="procedureFormData" :colon="true" >
      <t-form-item v-if="false" label="类型" name="type">
        <t-radio-group v-model="procedureFormData.type" variant="primary-filled" @change="procedureTypeChange">
          <t-radio-button value="procedure">工序项</t-radio-button>
          <t-radio-button value="template">工艺模块</t-radio-button>
          <t-radio-button value="operate">自定义操作</t-radio-button>
        </t-radio-group>
      </t-form-item>
      <t-form-item v-if="false" label="名称" name="name">
        <t-input v-model="procedureFormData.name" placeholder="请输入物料名称" />
      </t-form-item>
      <t-form-item :label="procedureFormData.type ==='procedure' ?'工序项':'操作'" :name="procedureFormData.type ==='procedure' ?'processProcedure':'process_template'">
        <t-select v-if="procedureFormData.type ==='operate' " ref="selectOperationRef"  v-model="procedureFormData.operates" v-model:popupVisible="popupVisible" multiple clearable filterable placeholder="请选择"  >
          <t-option v-for="(item,index) in operationOption" :key="index" :value="item.id" :label="item.title"></t-option>
          <template #panelBottomContent>
            <div class="select-panel-footer">
              <t-button v-if="true || editOrCreate === 'create'" theme="primary" variant="text" block @click="onOperatesAdd"
                >新增选项</t-button
              >
              <div v-else style="padding: 10px;">
                <!-- <t-input v-model="newOption" autofocus></t-input> -->
                <t-space>
                  <t-button size="small" style="margin-top: 8px" @click="onAddConfirm"> 确认 </t-button>
                  <t-button theme="default" size="small" style="margin-top: 8px; margin-left: 8px" @click="onAddCancel">
                    取消
                  </t-button>
                </t-space>
              </div>
            </div>
          </template>
        </t-select>
        <t-select  v-else-if="procedureFormData.type ==='template' "  ref="selectOperationRef" v-model="procedureFormData.process_template" clearable filterable placeholder="请选择"
                   @focus="get_processes_procedureListFunc(1)">
          <t-option v-for="(item,index) in [...processesTemplateOption ,{id:'0',name:'自定义',process_template_info:[],description:''}]" :key="index" :value="item.id" :label="item.name"></t-option>

          <template #panelBottomContent>
            <div class="select-panel-footer">
              <t-button v-if="true || editOrCreate === 'create'" theme="primary" variant="text" block @click="onProcessesTemplateAdd"
              >新增工序项</t-button
              >
              <div v-else style="padding: 10px;">
                <t-space>
                  <t-button size="small" style="margin-top: 8px" @click="onAddConfirm"> 确认 </t-button>
                  <t-button theme="default" size="small" style="margin-top: 8px; margin-left: 8px" @click="onAddCancel">
                    取消
                  </t-button>
                </t-space>
              </div>
            </div>
          </template>
        </t-select>
        <t-select  v-else  ref="selectOperationRef" v-model="procedureFormData.processProcedure" clearable filterable placeholder="请选择"
          @focus="get_processes_procedureListFunc(1)">
          <t-option v-for="(item,index) in [...processesProcedureOption,{id:'0',name:'自定义',attribute:[]}]" :key="index" :value="item.id" :label="item.name"></t-option>

          <template #panelBottomContent>
            <div class="select-panel-footer">
              <t-button v-if="true || editOrCreate === 'create'" theme="primary" variant="text" block @click="onProcessesProcedureAdd"
                >新增工序项</t-button
              >
              <div v-else style="padding: 10px;">
                <t-space>
                  <t-button size="small" style="margin-top: 8px" @click="onAddConfirm"> 确认 </t-button>
                  <t-button theme="default" size="small" style="margin-top: 8px; margin-left: 8px" @click="onAddCancel">
                    取消
                  </t-button>
                </t-space>
              </div>
            </div>
          </template>
        </t-select>
      </t-form-item>
    </t-form>
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
  <t-dialog destroyOnClose
            v-model:visible="addTemplateVisible"
            header="添加工艺模块"
            width="50%" attach="body"
            :confirm-on-enter="true"
            :on-confirm="onAddOperateTemplateFunc"
  >
    <t-form ref="design_form" :rules="FORM_RULES" :data="procedureFormData" :colon="true" >
      <t-form-item :label="'工艺模块'" :name="'process_template'">
        <t-select ref="selectOperationRef"  v-model="procedureFormData.process_template" v-model:popupVisible="popupVisible"
                  multiple clearable filterable placeholder="请选择" @focus="getprocessesTemplateOptionFunc(1)" >
          <t-option v-for="(item,index) in processesTemplateOption" :key="index" :value="item.id" :label="item.name"></t-option>
          <template #panelBottomContent>
            <div class="select-panel-footer">
              <t-button v-if="true || editOrCreate === 'create'" theme="primary" variant="text" block @click="onProcessesTemplateAdd"
              >新增工艺模块</t-button
              >
              <div v-else style="padding: 10px;">
                <t-space>
                  <t-button size="small" style="margin-top: 8px" @click="onAddConfirm"> 确认 </t-button>
                  <t-button theme="default" size="small" style="margin-top: 8px; margin-left: 8px" @click="onAddCancel">
                    取消
                  </t-button>
                </t-space>
              </div>
            </div>
          </template>
        </t-select>
      </t-form-item>
    </t-form>
  </t-dialog>
  <t-dialog destroyOnClose
    v-model:visible="addOperateVisible"
    header="添加操作"
    width="50%" attach="body"
    :confirm-on-enter="true"
    :on-confirm="onAddOperateFunc"
  >
    <t-form ref="design_form" :rules="FORM_RULES" :data="procedureFormData" :colon="true" >
      <t-form-item :label="'操作'" :name="'operates'">
        <t-select ref="selectOperationRef"  v-model="procedureFormData.operates" v-model:popupVisible="popupVisible"
                  multiple clearable filterable placeholder="请选择" @focus="getOperationOptionFunc(1)" >
          <t-option v-for="(item,index) in operationOption" :key="index" :value="item.id" :label="item.title"></t-option>
          <template #panelBottomContent>
            <div class="select-panel-footer">
              <t-button v-if="true || editOrCreate === 'create'" theme="primary" variant="text" block @click="onOperatesAdd"
                >新增选项</t-button
              >
              <div v-else style="padding: 10px;">
                <!-- <t-input v-model="newOption" autofocus></t-input> -->
                <t-space>
                  <t-button size="small" style="margin-top: 8px" @click="onAddConfirm"> 确认 </t-button>
                  <t-button theme="default" size="small" style="margin-top: 8px; margin-left: 8px" @click="onAddCancel">
                    取消
                  </t-button>
                </t-space>
              </div>
            </div>
          </template>
        </t-select>
      </t-form-item>
    </t-form>
  </t-dialog>
  <FormFieldPanel
    v-if="showFormFieldPanelView"
    :mode="filedarr"
    :groupFields="groupFields"
    :editMode=" false "
    v-model:modelValue="formFieldData"
    v-model:visible="showFormFieldPanelView"
    @onSuccess="submitGroupFields"
  ></FormFieldPanel>
</template>

<script setup lang="jsx">
import { getProcesses_attributeListFetch ,
  get_processes_procedureListFetch,
  get_processes_templateListFetch,
  getEval_attribute_libraryListFetch ,
  postProcessesAttributeFetch
} from '@/api/experiment'
import { v4 as uuid } from 'uuid'

import { timeFormat } from '@/utils/time-ago'
import { cloneDeep } from 'lodash-es';
import { shortId } from '@/utils/short-id'
import {
  ChevronRightIcon,
  ChevronDownIcon,
  MoveIcon,
  AddRectangleIcon,
  MinusRectangleIcon,
} from 'tdesign-icons-vue-next';
const emits = defineEmits(['update:nodeAttrs'])
const props = defineProps({
  node: {
    type: Object,
    default: () => {}
  },
  nodeAttrs: {
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

const TextInputItem = {
  key: "",
  icon: "creditcard",
  type: "TextInput",
  props: {
    abstract: true,
    required: false,
    enableScan: true,
    enablePrint: true,
    suffix: undefined,
  },
  title: "单行文本",
  valueType: "String"
}

const _nodeAttrs = computed({
  get: () => props.nodeAttrs,
  set: (value) => {
    // Update the node in the editor
    emits('update:nodeAttrs', value)
  }
})

const { options ,editedComponentType} = useStore()
const $key_data = JSON.parse( localStorage.getItem('key_data'))

const loading = ref(false)
const dialog_visible = ref(false);
const tableRef = ref();
const add_parent_visible = ref(false);
const procedureVisible = ref(false);
const dialog_select = ref('')
const dialog_selectOptions = ref([])

const selectOperationRef = ref()
const popupVisible = ref(false)

const operationOption = ref([])
const searchTitle = ref('')

const processesTemplateOption = ref([])
const processesProcedureOption = ref([])

const raw_materialOptions = ref([])

const readOnly = computed(() => options.value.document?.readOnly)
const _editedComponentType = computed(() => editedComponentType.value)

const experiment_record = computed(() => _nodeAttrs.value?.experiment_record ? _nodeAttrs.value?.experiment_record : $key_data.experiment_record)
const experiment_theme = computed(() => _nodeAttrs.value?.experiment_theme ? _nodeAttrs.value?.experiment_theme : $key_data.experiment_theme)

const operateTypeOption = [{content:'操作', value: '操作'},{content:'物料', value: '物料'}, {content:'样品', value: '样品'}]


const filedarr = [
  'TextInput',
  'NumberInput',
  'Attachment',
  'SelectPlusRadio',
  'SelectPlus',
  // 'TextareaInput',
  'FieldsGroup',
  'AmountInput',
]
const formFieldData = ref({ name: '' })

const groupFields = ref([])

const showFormFieldPanelView = ref(false);


const updateTime = computed({
  get: () => _nodeAttrs.value? _nodeAttrs.value.updateTime : '',
  set(value) {
    _nodeAttrs.value.updateTime = value
  },
})

const isChanged = computed({
  get: () => _nodeAttrs.value? _nodeAttrs.value.isChanged : false,
  set(value) {
    _nodeAttrs.value.isChanged = value
  },
})

const change_log = computed({
  get: () => _nodeAttrs.value? _nodeAttrs.value.change_log : '',
  set(value) {

    _nodeAttrs.value.change_log = value
  },
})

const is_integration = computed({
  get: () => _nodeAttrs.value? _nodeAttrs.value.is_integration : false,
  set(value) {
    _nodeAttrs.value.is_integration = value
  },
})

const table_data = computed({
  get: () => _nodeAttrs.value? _nodeAttrs.value.table_data : [],
  set(value) {

    _nodeAttrs.value.table_data = value
  },
})

const table_data_edit = ref([])

const _title = computed({
  get: () => _nodeAttrs.value? _nodeAttrs.value.title : `工艺${timeFormat(null, 'yyyymmddhhMM')}`,
  set(value) {
    _nodeAttrs.value.title = value
  },
})


const renderDelete = () => {
  return <t-icon name="delete" />;
};
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



const design_form = ref()
const FORM_RULES = {
  name: [{ required: true, message: '必填' ,trigger: ['blur'] }],
  operates: [{ required: true, message: '必填' ,trigger: ['blur','change'] }],
  process_template: [{ required: true, message: '必填' ,trigger: ['blur','change'] }],
  processProcedure: [{ required: true, message: '必填' ,trigger: ['blur','change'] }],
};

const procedureFormData = ref({
  name:'',
  type: 'procedure',  // procedure: 已配好的工序  ；operate： 操作
  description:'',
  operates:[],
  processProcedure:'',
  process_template:[],
})

const editOrCreate = ref('create')

const onOperatesAdd = () => {
  editOrCreate.value = 'edit';
  formFieldData.value = { name: '' }

  popupVisible.value = false
  showFormFieldPanelView.value = true;
}

const onProcessesTemplateAdd = () => {
  window.open('/admin/process/processmodule/', '_blank')
}

const onProcessesProcedureAdd = () => {
  window.open('/admin/process/operationitem/', '_blank')
}

const onAddConfirm = () => {

  editOrCreate.value = 'create';
};
const onAddCancel = () => {
  editOrCreate.value = 'create';
};

const procedureTypeChange = async (val) => {
  if (val === 'procedure') {
    await getprocessesTemplateOptionFunc()
  } else {
    await getOperationOptionFunc()
  }
}

const columnsCheckboxs = ref([])

const displayColumns = ref([]);
const displayColumnsC = ref([]);
displayColumns.value = ['serial-number', 'name','operates', 'description', 'operate']

const selectProcedureRow = ref(null)

const selectProcedureType = ref('append')

const checkAll = computed(() => displayColumns.value.length === displayColumnsC.value.length);
const indeterminate = computed(() => !!(displayColumns.value.length > displayColumnsC.value.length && displayColumnsC.value.length));

const operateSelect = ref()
const addTemplateVisible = ref(false)
const addOperateVisible = ref(false)
const onOperateAdd = (type,index,rowIndex,row)=>{

  if (type === 'insert') {
    operateSelect.value = cloneDeep( {type,index,rowIndex,row} )
    procedureFormData.value.process_template = []
    addTemplateVisible.value = true
  }else if (type === 'insertOperate') {
    operateSelect.value = cloneDeep( {type,index,rowIndex,row} )
    procedureFormData.value.operates = []
    addOperateVisible.value = true
  }else if (type === 'up'){
    const temp = row.form.formItems[index];
    row.form.formItems[index] = row.form.formItems[index - 1];
    row.form.formItems[index - 1] = temp;
  }else if (type === 'down'){
    const temp = row.form.formItems[index];
    row.form.formItems[index] = row.form.formItems[index + 1];
    row.form.formItems[index + 1] = temp;
  }else if (type === 'delete'){
    row.form.formItems.splice(index, 1);
  }

}

const procedureSelect = ref()
const onProcedureAdd  = (type,index,row)=>{
  if (type === 'insert') {
    procedureSelect.value = cloneDeep( {type,index,row} )
    procedureFormData.value.operates = []
    add_parent_visible.value = true
  }else if (type === 'up'){
    const temp = table_data.value[index];
    table_data.value[index] = table_data.value[index - 1];
    table_data.value[index - 1] = temp;
  }else if (type === 'down'){
    const temp = table_data.value[index];
    table_data.value[index] = table_data.value[index + 1];
    table_data.value[index + 1] = temp;
  }else if (type === 'delete'){
    table_data.value.splice(index, 1);
  }

}
// 递归函数，处理嵌套的 FieldsGroup 和 SelectMaterial
function processValueItems(items) {
  const valueC = {};

  items.forEach(eleI => {
    if (['SelectInput', 'TimeRangePicker', 'DeptPicker', 'TableList', 'MaterialList','Attachment', 'SelectMaterial'].includes(eleI.type)) {
      valueC[eleI.key] = [];
    } else if (['FieldsGroup'].includes(eleI.type)) {
      valueC[eleI.key] = processValueItems(eleI.props.items); // 递归处理嵌套的 items
    } else if (['NumberInput', 'AmountInput','TextInput'].includes(eleI.type)) {
      valueC[eleI.key + '_unit'] = ''
    } else {
      valueC[eleI.key] = '';
    }
  });
  return valueC;
}
// 递归函数，处理嵌套的 FieldsGroup 和 SelectMaterial
function processItems(items, optionsGroup) {
  return items.map(eleI => {
    if (eleI.type === 'SelectMaterial') {
      return {
        ...eleI,
        rowKey: eleI.id + '/' + shortId(),
        description: '',
        props: {
          ...eleI.props,
          options: optionsGroup,
        },
      };
    } else if (eleI.type === 'FieldsGroup') {
      return {
        ...eleI,
        rowKey: eleI.id + '/' + shortId(),
        description: '',
        props: {
          ...eleI.props,
          items: processItems(eleI.props.items, optionsGroup), // 递归处理嵌套的 items
        },
      };
    } else {
      return {...eleI, description: '', rowKey: eleI.id + '/' + shortId()};
    }
  });
}
const onAddOperateTemplateFunc = () => {

  design_form.value.validate({ showErrorMessage: true }).then((validateResult) => {
    if (validateResult && Object.keys(validateResult).length) {
      const firstError = Object.values(validateResult)[0]?.[0]?.message;
      useMessage('warning',firstError)
    }else{
      let operates = []
      getRaw_materialOptionsFunc()
      const optionsGroup = raw_materialOptions.value.map(ele=>{
        return {
          group: ele.title,
          children: ele.table_data.map(eleT=>{
            return { value: eleT.id, label: `${eleT.name }/${eleT.sn }` }
          })
        }
      })
      operates = processesTemplateOption.value.filter(ele=> procedureFormData.value.process_template.includes(ele.id))
        .map(eleT=>{
          const attributeC =  eleT.attribute_info ?  cloneDeep(eleT.attribute_info) :  cloneDeep(eleT.attribute)
          eleT.attribute = attributeC.map(eleA=>{
            return processItems([eleA], [])[0]
          })
          // .map(eleA=>{
          //   return processItems([eleA], optionsGroup)[0]
          // })
          const keyId = eleT.id + '/' + shortId()
          eleT.rowKey = keyId
          eleT.key = keyId
          eleT.title = eleT.name
          eleT.operateType = eleT.type
          return eleT
        })



      let rowD = cloneDeep( operateSelect.value.row )

      if (operateSelect.value.type === 'up') {
        if (operateSelect.value.index === 0) {
          rowD.form.formItems.splice(0,0,...operates)
        }else{
          rowD.form.formItems.splice(operateSelect.value.index-1,0,...operates)
        }
      }else if (operateSelect.value.type === 'down') {
        rowD.form.formItems.splice(operateSelect.value.index,0,...operates)
      }else if (operateSelect.value.type === 'insert') {
        rowD.form.formItems.splice(operateSelect.value.index + 1,0,...operates)
      }else if (operateSelect.value.type === 'append') {
        rowD.form.formItems.splice(0,0,...operates)
      }


      // 主逻辑
      rowD.form.formItems.forEach(eleP => {
        let valueD = {};
        eleP.attribute.forEach(ele => {
          let valueC = '';

          if (['SelectInput', 'TimeRangePicker', 'DeptPicker', 'TableList', 'MaterialList', 'Attachment', 'SelectMaterial'].includes(ele.type)) {
            valueC = [];
          } else if (['FieldsGroup'].includes(ele.type)) {
            valueC = processValueItems(ele.props.items); // 调用递归函数处理嵌套的 items
          } else if (['NumberInput', 'AmountInput','TextInput'].includes(eleP.type)) {
            valueD[ele.key][eleP.key + '_unit'] = ''
          }

          valueD[ele.key] = valueC;
        });
        rowD.form.formData[eleP.rowKey] = valueD;
      });
      nextTick(()=>{
        table_data.value.splice(operateSelect.value.rowIndex,1,rowD)
      })
      addTemplateVisible.value = false

    }

  })
}


const onAddOperateFunc = () => {

  design_form.value.validate({ showErrorMessage: true }).then((validateResult) => {
    if (validateResult && Object.keys(validateResult).length) {
      const firstError = Object.values(validateResult)[0]?.[0]?.message;
      useMessage('warning',firstError)
    }else{
      let operates = []
      getRaw_materialOptionsFunc()
      const optionsGroup = raw_materialOptions.value.map(ele=>{
        return {
          group: ele.title,
          children: ele.table_data.map(eleT=>{
            return { value: eleT.id, label: `${eleT.name }/${eleT.sn }` }
          })
        }
      })

      operates = operationOption.value.filter(ele=> procedureFormData.value.operates.includes(ele.id))
          // .map(ele => processItems([ele], optionsGroup)[0])
        .map(ele => processItems([ele], [])[0])
        .map(ele => ({...ele,operateType: '操作'}));


      let rowD = cloneDeep( operateSelect.value.row )

      if (operateSelect.value.type === 'up') {
        if (operateSelect.value.index === 0) {
          rowD.form.formItems.splice(0,0,...operates)
        }else{
          rowD.form.formItems.splice(operateSelect.value.index-1,0,...operates)
        }
      }else if (operateSelect.value.type === 'down') {
        rowD.form.formItems.splice(operateSelect.value.index,0,...operates)
      }else if (operateSelect.value.type === 'insert') {
        rowD.form.formItems.splice(operateSelect.value.index,0,...operates)
      }else if (operateSelect.value.type === 'append') {
        rowD.form.formItems.splice(0,0,...operates)
      }

      // 主逻辑
      rowD.form.formItems.forEach(ele => {
        let valueC = '';

        if (['SelectInput', 'TimeRangePicker', 'DeptPicker', 'TableList', 'MaterialList', 'Attachment', 'SelectMaterial'].includes(ele.type)) {
          valueC = [];
        } else if (['FieldsGroup'].includes(ele.type)) {
          valueC = processValueItems(ele.props.items); // 调用递归函数处理嵌套的 items
        }else if (['NumberInput', 'AmountInput','TextInput'].includes(ele.type)) {
          rowD.form.formData[ele.rowKey + '_unit'] = ''
        }

        rowD.form.formData[ele.rowKey] = valueC;
      });
      nextTick(()=>{
        table_data.value.splice(operateSelect.value.rowIndex,1,rowD)
      })
      addOperateVisible.value = false

    }

  })
}



const getgroupFields = () => {
  getEval_attribute_libraryListFetch({
    page: 1,
    limit: 9999,
  })
    .then((res) => {
      if (res.data.value && res.data.value.code === 2000) {
        res.data.value.data = res.data.value.data.filter(
          (item) => item.type != 'FieldsGroup',
        )
        groupFields.value = [...res.data.value.data]
      }
    })
    .finally(() => {
      loading.value = false
    })
    .catch(() => {
      loading.value = false
    })
  loading.value = false
}

const submitGroupFields = (from) => {

  var fromData = cloneDeep(from)
  //根据EditType 判断 当前是否是编辑模式
  postProcessesAttributeFetch(fromData).then( async (res) => {

    if (res.data && res.data.code === 2000) {
      useMessage('success' ,res.data.msg);
      showFormFieldPanelView.value = false
      procedureFormData.value.operates.push(res.data.data.id)
      await procedureTypeChange(procedureFormData.value.type)

    }
  }).catch((err) => {
    TMessagePlugin.error(`${err}`)
  })
}

const onDelete = (row) => {
  // 移除当前节点及其所有子节点
  table_data.value.splice(table_data.value.indexOf(row), 1)
};

const onExperimentalDesign = () => {

  // props.editor?.chain().focus().insertContent('<p></p><p></p>').run();

  const { from, to } = props.editor?.state.selection ?? {}

  props.editor?.commands.setTextSelection({ from , to: to + 1  })
  props.editor?.chain().focus().insertContent('<p></p><p></p>').run();
  props.editor?.commands.addExperimental_designs({ customerParams: { is_select: true, technology: _nodeAttrs.value.id } })
  // props.editor?.chain().focus().addExperimental_designs({ customerParams: { is_select: true, technology: _nodeAttrs.value.id } }).run()
}

const getRaw_materialOptionsFunc = () => {
  if (!props.editor) {
    return
  }
  const docD = cloneDeep(props.editor.getJSON())
  if (docD) {
    // 物料表
    const raw_material_tables = docD.content.filter(ele=> ele.type === 'raw_material_table')
    if (raw_material_tables.length === 0) {
      TMessagePlugin.warning('请先创建物料表')
      return  // 物料表不存在，返回
    }
    raw_materialOptions.value = raw_material_tables.map(ele=> ele.attrs)

  }else {
    TMessagePlugin.warning('当前文档中没有数据')
  }
}

const on_select_parentFunc = async ()=>{
  design_form.value.validate({ showErrorMessage: true }).then((validateResult) => {
    if (validateResult && Object.keys(validateResult).length) {
      const firstError = Object.values(validateResult)[0]?.[0]?.message;
      useMessage('warning',firstError)
    }else{
      let operates = []
      getRaw_materialOptionsFunc()
      const optionsGroup = raw_materialOptions.value.map(ele=>{
        return {
          group: ele.title,
          children: ele.table_data.map(eleT=>{
            return { value: eleT.id, label: `${eleT.name }/${eleT.sn }` }
          })
        }
      })
      if (procedureFormData.value.type === 'operate' ) {
        operates = operationOption.value.filter(ele=> procedureFormData.value.operates.includes(ele.id))
          // .map(ele => processItems([ele], optionsGroup)[0])
          .map(ele => processItems([ele], [])[0])
          .map(ele => ({...ele,operateType: '操作'}));
      }else if (procedureFormData.value.type === 'template' ) {
        const processesTemplate = processesTemplateOption.value.find(ele=> procedureFormData.value.process_template === ele.id )
        const operateIds = processesTemplate? processesTemplate.attribute : []
        operates = operationOption.value.filter(ele=> operateIds.includes(ele.id))
          // .map(ele => processItems([ele], optionsGroup)[0])
          .map(ele => processItems([ele], [])[0])
          .map(ele => ({...ele,operateType: processesTemplate.type}));
      } else {
        const processesProcedure = processesProcedureOption.value.find(ele=> procedureFormData.value.processProcedure === ele.id )
        if (processesProcedure) {
          processesProcedure.process_template_info = processesProcedure.process_template_json?.map(eleT=>{
            const attributeC =  eleT.attribute_info ?  cloneDeep(eleT.attribute_info) :  cloneDeep(eleT.attribute)
            eleT.attribute = attributeC.map(eleA=>{
              return processItems([eleA], [])[0]
            })
            // .map(eleA=>{
            //   return processItems([eleA], optionsGroup)[0]
            // })
            const keyId = eleT.id + '/' + shortId()
            eleT.rowKey = keyId
            eleT.key = keyId
            eleT.title = eleT.name
            eleT.operateType = eleT.type
            return eleT
          })
          operates = {...processesProcedure }
        } else {
          operates = {id:'0',name:'自定义',process_template_info:[],description:''}
        }

      }

      const uuidStr = uuid()
      const rowD = {
        id: uuidStr,
        rowKey: uuidStr + '/' + shortId(),
        name: operates.name,
        type: procedureFormData.value.type,
        description: procedureFormData.value.description,
        form: {
          formItems: operates.process_template_info,
          formConfig: undefined,
          formData: {description:''}
        }
      }
      // 主逻辑
      operates.process_template_info.forEach(eleP => {
        let valueD = {};
        eleP.attribute.forEach(ele => {
          let valueC = '';

          if (['SelectInput', 'TimeRangePicker', 'DeptPicker', 'TableList', 'MaterialList', 'Attachment', 'SelectMaterial'].includes(ele.type)) {
            valueC = [];
          } else if (['FieldsGroup'].includes(ele.type)) {
            valueC = processValueItems(ele.props.items); // 调用递归函数处理嵌套的 items
          }if (['NumberInput', 'AmountInput','TextInput'].includes(ele.type)) {
            valueD[ele.key + '_unit'] = ''
          }

          valueD[ele.key] = valueC;
        });
        rowD.form.formData[eleP.rowKey] = valueD;
      });

      nextTick(() => {
        if (procedureSelect.value) {
          table_data.value.splice(procedureSelect.value.index+1,0,rowD )
          procedureSelect.value = undefined
        }else {
          table_data.value.push(rowD)
        }

      });
      add_parent_visible.value = false

    }

  })
}

const onProcedureConfirmFunc = async () => {

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

  let resD = {}
  if (props.viewType === 'nodeView') {
    resD = res.data
  }else {
    resD = res.data.value ? res.data.value : res.data
  }
  if (resD.code === 2000) {
    if (page === 1) {
      operationOption.value = [...resD.data]
    } else {
      operationOption.value = [...operationOption.value, ...resD.data]
    }
    pagination.value.total = resD.total
    //
  }

}

getOperationOptionFunc()

const getprocessesTemplateOptionFunc = async (page=1) => {
  const res = await get_processes_templateListFetch({page,limit:9999})

  let resD = {}
  if (props.viewType === 'nodeView') {
    resD = res.data
  }else {
    resD = res.data.value ? res.data.value : res.data
  }
  if (resD.code === 2000) {
    if (page === 1) {
      processesTemplateOption.value = [...resD.data]
    } else {
      processesTemplateOption.value = [...processesTemplateOption.value, ...resD.data]
    }
    pagination.value.total = resD.total

  }

}

getprocessesTemplateOptionFunc()

const get_processes_procedureListFunc = async (page=1) => {
  const res = await get_processes_procedureListFetch({page,limit:9999})

  let resD = {}
  if (props.viewType === 'nodeView') {
    resD = res.data
  }else {
    resD = res.data.value ? res.data.value : res.data
  }
  if (resD.code === 2000) {
    if (page === 1) {
      processesProcedureOption.value = [...resD.data]
    } else {
      processesProcedureOption.value = [...processesProcedureOption.value, ...resD.data]
    }
    pagination.value.total = resD.total

  }

}

get_processes_procedureListFunc()

const FormRenderComponent = resolveComponent('FormRender');
const columns = ref([
  {
    title: '序号',
    colKey: 'serial-number',
    width: '50px',
  },
  {
    width: 140,
    colKey: 'name',
    title: '工序',
    cell: (h , { row, rowIndex } ) => {
      return (
        <div title={row.type === "operate" ? "操作" : "评估"} style="width:100%;white-space: break-spaces;">
          {row.type === "operate" && [<t-icon name="adjustment" />] }
          {row.type === "assessment" && [<t-icon name="analytics" />] }
          <span style="margin-left:6px;">{row.name ? row.name : '-'}</span>
        </div>
      );
    },
    edit: {
      component: TInput,
      props: {
        clearable: true,
        autofocus: true,
        // autoWidth: true,
        autosize: true,
      },
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

        useMessage('success' ,'Success');
      },
      // 触发校验的时机（when to validate)
      validateTrigger: 'change',
      // 透传给 component: Input 的事件（也可以在 edit.props 中添加）
      on: (editContext ) => ({
        onBlur: (ctx ) => {

          ctx?.e?.preventDefault();
        },
        onEnter: (ctx ) => {
          ctx?.e?.preventDefault();

        },
        // 默认是否为编辑状态
        defaultEditable: true,
      }),
    }
  },
  {
    colKey: 'form',
    title: '默认值',
    minWidth: 240,
    cell: 'defaultValueSlot',
  },
  {
    colKey: 'description',
    title: '描述',
    width: 160,
    edit: {
      component: TTextarea,
      props: {
        clearable: true,
        autofocus: true,
        // autoWidth: true,
        autosize: true,
      },
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

        useMessage('success' ,'Success');
      },
      // 触发校验的时机（when to validate)
      validateTrigger: 'change',
      // 透传给 component: Input 的事件（也可以在 edit.props 中添加）
      on: (editContext ) => ({
        onBlur: (ctx ) => {

          ctx?.e?.preventDefault();
        },
        onEnter: (ctx ) => {
          ctx?.e?.preventDefault();

        },
        // 默认是否为编辑状态
        defaultEditable: true,
      }),
    }
  },
  {
    title: '操作',
    colKey: 'operate',
    width: 50,
    cell: 'type-slot-operate',
  },
])


function onAddWorkingProcedure(row=undefined) {
  procedureFormData.value = {
    name:'',
    type: 'procedure',
    description:'',
    operates:[]
  }
  add_parent_visible.value = true;
  onProcedureAdd('insert',table_data.value.length-1,row)
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
      limit: 9999,
    }
  }

  const res = await props.getDataFunction(params)

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

    }
  }else {
    table_data.value = []
    TMessagePlugin.error(resD.msg)
  }
}

onMounted(async () => {

  if (change_log.value?.change_log && (table_data.value && table_data.value.length === 0) ) {

    await initData()
  }else if (props.viewType === 'productView' && props.node.attrs && props.node.attrs.change_log) {
    await initData()
  } else if(is_integration.value) {

    const docD = cloneDeep(props.editor.getJSON())
    if (docD ) {
      // dialog_selectOptions.value = []
      // // 物料表
      // const dialog = useConfirm({
      //   theme: 'info',
      //   header: '提示',
      //   body: '检测到当前实验项目中存在工艺表，是否使用该工艺表进行初始化？',
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

  if (is_integration.value) {
    is_integration.value = false
  }
})

</script>

<style lang="scss" scoped>
:deep(.t-input--auto-width) {
  min-width: 160px;
}
:deep( .umo-table__row-full-element ){
  padding: 0;
}
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
