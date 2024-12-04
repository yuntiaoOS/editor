<!-- 试验方法设计 -->
<template>
  <t-steps layout="vertical" :current="current" status="process" class="steps-demos-extra">
    <t-step-item title="步骤1" content="选择实验设计方式类型">
      <template #extra>
        <t-space direction="vertical">
          <t-space align="center">
            <t-check-tag-group v-model="designType" style="margin-right: 32px" :options="designTypeOptions" @change="current = 0;">选中/未选态</t-check-tag-group>
          </t-space>
          <t-button v-if="current === 0" size="small" variant="base" @click="typeSelectNext"> 下一步 </t-button>
        </t-space>
      </template>
    </t-step-item>
    <t-step-item title="步骤2" content="根据选择方式设置参数">
      <template #extra>
        <t-space direction="vertical" >
          <t-checkbox disabled>为设定的默认显示上一次实验参数（也可以选择来源于某个样品）</t-checkbox>
          <t-list v-if="current === 1" :split="true">
            <t-list-item v-for=" (item,index) in _designParams " :key="index">
              <t-checkbox v-model="item.check" style="min-width: 200px;">因数{{index+1}}： {{item.name}}</t-checkbox>
              <template #action>
                <t-space >
                  <span v-if="['SelectPlusRadio','SelectPlus'].indexOf(item.type) === -1 " style="line-height: 32px;">步进： </span>
                  <div style="width: 300px">
                    <div v-if="item.attribute_type === 'single'" >
                      <xm-input v-model="item.step" :config="item" borderless style="border-bottom: 1px solid var(--td-border-level-2-color);"/>
                    </div>
                    <div v-else>
                      <xm-form ref="xmformRef" v-model:form-data="item.step" :config="getConfig('form',item)" :show-submit-btn="false" />
                    </div>
                    <!-- <xm-input v-model="item.step" :config="item" borderless style="border-bottom: 1px solid var(--td-border-level-2-color);"/> -->
                  </div>
                  
                  <!-- <t-input v-model="item.step" auto-width borderless style="border-bottom: 1px solid var(--td-border-level-2-color);"/> -->
                </t-space>  
              </template>
            </t-list-item>
          </t-list>
          <t-space v-if="current === 1" style="line-height: 32px;">正交：{{_designParams.filter(ele=>ele.check).length}} x    <t-input-number v-model="cycleNumber" theme="column" :max="100" :min="1" auto-width borderless  style="border-bottom: 1px solid var(--td-border-level-2-color);" @blur="blurCycleNumberFunc"/>     (前边{{_designParams.filter(ele=>ele.check).length}}是选择的因数数量，后边我是需要正交的次数需要手动填写) </t-space>
          <t-space v-if="current === 1" align="center">
            <t-button size="small" variant="text" @click="current--"> 上一步 </t-button>
            <t-button v-if="_designParams.filter(ele=>ele.check).length>0" size="small" variant="base" @click="makeTableFunc"> 下一步 </t-button>
          </t-space>
        </t-space>
      </template>
    </t-step-item>
    <t-step-item title="步骤3" content="选择正交表确定实验">
      <template #extra>
        <t-space v-if="current === 2" direction="vertical">
          <div>
            <t-table
              ref="tableRef" :selected-row-keys="selectedRowKeys"
              row-key="id" :data="_designResult" :columns="columns" resizable  
              @select-change="onSelectChange"
              >
              <template #topContent>
                <div style="padding: 6px 0;display: block;">
                  <t-space>
                    <div> &nbsp; </div>
                    <!-- <t-space> -->
                      <t-button variant="outline" @click="onAdd">添加数据</t-button>
                    <!-- </t-space> -->
                  </t-space>
                </div>
              </template>
              
            </t-table>
          </div>
          <t-space align="center">
            <t-button size="small" variant="text" @click="current--"> 上一步 </t-button>
            <!-- <t-button size="small" variant="base" @click="null"> 完成 </t-button> -->
          </t-space>
        </t-space>
      </template>
    </t-step-item>
  </t-steps>
  <t-dialog 
    v-model:visible="add_dialog_visible"
    header="新增" destroy-on-close
    width="50%" attach="body"
    :confirm-on-enter="true"
    :on-confirm="onSubmit"
  >
    <t-form
      ref="xmformRef" 
      :label-align="form_config.labelPos"
      :label-width="form_config.labelWidth"
      :data="formData"
      :rules="form_config.rules"
      :error-message="errorConfig === 'default' ? undefined : errorMessage"
      scroll-to-first-error="smooth"
      @submit="onSubmit"
    >
      <t-row :gutter="[16, 10]" justify="space-between">
        <t-col 
          v-for="formItem in form_config.formItems "  :key="formItem.key"
          :xs="12" :sm="columns" :md="columns" :lg="columns" :xl="columns/2" 
          >
          <t-form-item 
            :name="formItem.key" 
            :label="formItem.title?formItem.title:formItem.name"
            :rules="formItem.rules" >
              <div v-if="formItem.attribute_type === 'single'" >
                <xm-input v-model="formData[formItem.key]" :config="formItem" ></xm-input>
              </div>
              <div v-else>
                <xm-form ref="xmformSubRef" v-model:form-data="formData[formItem.key]" :config="getConfig('form',formItem)" :show-submit-btn="false" />
              </div>
          </t-form-item>
        </t-col>
      </t-row>
    </t-form>
    <!-- <xm-form ref="xmformRef"  v-model:form-data="formData" :show-submit-btn="false" :config="form_config" :on-submit="onSubmit"/> -->
  </t-dialog>
</template>

<script setup lang="jsx">
import { ref } from 'vue';
import { v4 as uuid } from 'uuid'
import { config } from 'process';

import xmInput from './xm-input.vue';
import { multiply } from 'lodash-unified';

const emits = defineEmits(['update:designParams', 'update:designResult']);
const props = defineProps({
  designParams: {
    type: Array,
    default: () => [],
  },
  designResult: {
    type: Array,
    default: () => [],
  },
});
const current = ref(1);
const tableRef = ref();
const xmformRef = ref();
const xmformSubRef = ref();
const columns = ref([]);
const add_dialog_visible = ref(false);
const formData = ref({});
const form_config = ref({
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
});
const columnsDefault = [
  {
    colKey: 'row-select',
    type: 'multiple',
    width: 46,
    checkProps: ({ row }) => ({ checked:  selectedRowKeys.value.includes(row.id) }),
  },
  {
    title: '序号',
    colKey: 'serial-number',
    width: 40,
  },
]

const selectedRowKeys = ref([]);

const cycleNumber = ref(1);

const _designResult = computed({
  get() {
    return props.designResult || [];
  },
  set(value) {
    emits('update:designResult', value);
  },
});



const _designParams = ref([])

watch(_designParams.value, (val) => {
  if (val && val.length > 0) {
    console.log('-------_designParams-------------',val);
    emits('update:designParams', val);
  }
}, { immediate: true });

console.log('-------78-----props----',props);

const designTypeOptions = [
  { label: '自定义', value: '自定义' , disabled: false },
  { label: '正交设计', value: '正交设计' , disabled: false},
  { label: '响应面法', value: '响应面法' , disabled: true},
  { label: '中心复合', value: '中心复合' , disabled: true},
]

const designType = ref('正交设计');

const getConfig = (type,row) => {
  const config = {
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

const typeSelectNext = ()=>{
  console.log("typeSelectNext----------------------",current.value,designType.value)
  // designType.value === '自定义' 时 current.value跳到下下步
  if (designType.value.includes('自定义')  && current.value === 0) {
    current.value++
    makeTableFunc()
  } else if (designType.value.includes('正交设计') && current.value === 0) {
    
  } else if (designType.value.includes('响应面法') && current.value === 0) {
    
  } else if (designType.value.includes('中心复合') && current.value === 0) {
    
  } else {
     
  }
  current.value++
}

const onSelectChange = (value, params) => {
  selectedRowKeys.value = value;
  console.log('-----195----onSelectChange----------',value, params);
  _designResult.value = _designResult.value.map((item) => { 
    return { ...item, check: selectedRowKeys.value.includes(item.id)}
  });
};

const blurCycleNumberFunc = (val) => {
  if (Number(val) > 100) cycleNumber.value = 100;
  if (Number(val) < 1) cycleNumber.value = 1;
}

const onAdd = () => {
  formData.value = {}
  form_config.value.formItems = _designParams.value.map((item) => { return {...item, title: item.name } });
  console.log('-------onAdd-----275-----', form_config.value.formItems,_designParams.value);
  for (const key in _designParams.value) {
    if (Object.prototype.hasOwnProperty.call(_designParams.value, key)) {
      const designItem = _designParams.value[key];
      form_config.value.formConfig.rules[designItem.key] = [
        { required: true, message: '必填', type: 'error', trigger: ['blur','change'] },
      ]
      if (designItem.attribute_type === 'compound' && designItem.group) {
        formData.value[designItem.key] = {}
      }else{
        formData.value[designItem.key] = ''
      }
    }
  }
  add_dialog_visible.value = true;
}

const onSubmit = () => {
  console.log('-------formData----------', xmformRef.value,formData.value);
  xmformRef.value.validate({ showErrorMessage: true }).then((validateResult) => {
    if (validateResult && Object.keys(validateResult).length) {
      const firstError = Object.values(validateResult)[0]?.[0]?.message;
      useMessage('warning',firstError)
    }else{
      add_dialog_visible.value = false;
      const newData = { ...formData.value,id: uuid(), check: true };
      _designResult.value.push(newData);
      selectedRowKeys.value = [...selectedRowKeys.value, newData.id]
    }
  })

}

function addDecimals(str1, str2,index,attribute_type) {
  const addresult = (str1, str2) => { 
    console.log('---------304----addresult------',str1, str2,)
    if (( !str1 || str1.length === 0 || str1 === 'NaN') && ( !str2 || str2.length === 0 || str2 === 'NaN') ) return '0';
    if ( !str1 || str1.length === 0 || str1 === 'NaN') return str2;
    if ( !str2 || str2.length === 0 || str2 === 'NaN') return str1;
    // 将小数转换为整数
    const factor = 10 ** Math.max(str1.split('.')[1]?.length || 0, str2.split('.')[1]?.length || 0);
    const num1 = BigInt(str1.replace('.', '')) * BigInt(factor);
    const num2 = BigInt(str2.replace('.', '')) * BigInt(factor);

    // 相加
    const sum = num1 + num2;

    // 将结果转换回小数
    const result = `${(sum / BigInt(factor)).toString()  }.${  (sum % BigInt(factor)).toString().padStart(Math.log10(factor), '0')}`;

    return result;
  }
  console.log('-------140-----addDecimals----------',str1, str2,attribute_type);
  if (attribute_type === 'compound'){ 
    const resD = {};
    for (const key in str2) {
      if (key === XM_raw_material_key ) {
        resD[key] = str2[key]
      }else{
        resD[key] = addresult(str1[key], String(index * str2[key]) )
      }
      
    }
    console.log('-------339-----addDecimals----------',str1, str2,attribute_type);
    return resD
  }else{
    return addresult(str1, String(index * str2))
  }
  
}

function isNumber(value) {
      // 使用 Number 构造函数将值转换为数字
  const num = Number(value)
  
  // 判断转换后的值是否为数字，并且不是 NaN
  return !isNaN(num)
}

const makeTableFunc = ()=> {
  console.log('-------260-----makeTableFunc----------',_designParams.value);
  const selectedRK = [];
  const paramsColumns = [];
  _designParams.value.filter(ele=>ele.check).forEach((item) => {
    const componentName = xmInput
    const options = !['SelectPlusRadio','SelectPlus'].includes(item.type) ? [] : item.props.options.map(ele=> ({ label: ele.name, value: ele.id }) )
    if (item.key === XM_raw_material_key) {
      paramsColumns.unshift({
        title: item.name,
        colKey: item.key,
        width: 100,
        render(h, { row }) {
          const dataR =  row[item.key]
          return dataR ? item.props.options?.filter(eleO => dataR.includes(eleO.id))?.map(eleO => eleO.name)?.join(";") : '' 
        },
      });
    }else{
      if (item.attribute_type === 'compound') {
        const colG = {
          title: item.name,
          colKey: item.key,
          children: []
        }
        item.group.forEach((eleC) => {
          if (eleC.key === XM_raw_material_key) {
            colG.children.push({
              title: eleC.name,
              colKey: `${item.key}.${eleC.key}`,
              width: 100,
              render(h, { row ,col}) {
                console.log('---------------------0',row,item,col,eleC)
                const dataR = row[item.key]? row[item.key][eleC.key] : []
                return dataR ? eleC.props.options?.filter(eleO => dataR.includes(eleO.id))?.map(eleO => eleO.name)?.join(";") : '' 
              },
            })
          }else {
            colG.children.push({
              title: eleC.name,
              colKey: `${item.key}.${eleC.key}`,
              width: 100,
              edit: {
                // 1. 支持任意组件。需保证组件包含 `value` 和 `onChange` 两个属性，且 onChange 的第一个参数值为 new value。
                // 2. 如果希望支持校验，组件还需包含 `status` 和 `tips` 属性。具体 API 含义参考 Input 组件
                component: componentName,
                // props, 透传全部属性到 Input 组件
                props: ({col,row})=> {
                  return  {
                    modelValue: row[item.key][eleC.key],
                    config: eleC,
                    clearable: true,
                    autofocus: true,
                    multiply: true,
                    options
                    // autoWidth: true,
                  };

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
                  const newData = [..._designResult.value];
                  newData.splice(context.rowIndex, 1, context.newRowData);
                  _designResult.value = newData;
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
            })
          }
          
        })
        paramsColumns.push( colG );
      }else{
        paramsColumns.push({
          title: item.name,
          colKey: item.key,
          width: 100,
          edit: {
            // 1. 支持任意组件。需保证组件包含 `value` 和 `onChange` 两个属性，且 onChange 的第一个参数值为 new value。
            // 2. 如果希望支持校验，组件还需包含 `status` 和 `tips` 属性。具体 API 含义参考 Input 组件
            component: componentName,
            // props, 透传全部属性到 Input 组件
            props: ({col,row})=> {
              return  {
                modelValue: row[item.key],
                config: item,
                clearable: true,
                autofocus: true,
                multiply: true,
                options
                // autoWidth: true,
              };

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
              const newData = [..._designResult.value];
              newData.splice(context.rowIndex, 1, context.newRowData);
              _designResult.value = newData;
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
      
    }
    
  })
  columns.value = [...columnsDefault, ...paramsColumns];
  
  console.log('--------151----_desinParams.value----------',_designResult.value,paramsColumns)
  current.value++
  
  
  const designResult = [];
  for(let i = 0;i<cycleNumber.value;i++) {
    const obj = {check:true,name:''};
    obj.id = uuid();
    _designParams.value.forEach((item) => {
      console.log('-------310----item----------',item,item.step)
      if (item.step ) {
        if ( item.key !== XM_raw_material_key  ){
          obj[item.key] = addDecimals(item.value, item.step,i,item.attribute_type)  ;
          obj[`${item.key }_id`] = item.id
          console.log('-------524----obj----------',item.key,obj)
        }else{
          obj[item.key] = item.step ;
          obj[`${item.key }_id`] = item.id
          obj['name'] = item.props.options?.filter(eleO => item.step.includes(eleO.id))?.map(eleO => eleO.name)?.join("/") 
        }
      }
      
      obj['raw_material'] = item.raw_material 
      obj['technology'] = item.technology 
      console.log('-------533----obj----------',obj)
    })
    console.log('------315----item------obj----------',obj)
    designResult.push(obj);
    selectedRK.push(obj.id)
  }
  _designResult.value = Object.assign([],[...designResult]) ;
  selectedRowKeys.value = [...selectedRK]
  console.log('------155------_desinParams.value----------',selectedRK,selectedRowKeys.value,designResult,_designResult.value)
}

onMounted(() => {
  _designParams.value = props.designParams;
})

</script>
<style lang="less" scoped>
.steps-demos-extra {
  .t-button + .t-button {
    margin-left: 4px;
  }
}
:deep(.umo-list-item) {
  padding: 6px 0;
}
</style>