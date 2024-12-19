<template>
  <t-space direction="vertical" align="" style="width: 100%;">
    <div v-if="viewType === 'nodeView'" class="more-detail">
      <t-divider align="left" dashed>样品参数</t-divider>
      <div v-for="(treeItem,index) in _value.experimental_design.formItems" :key="index">
        <div><span :style="{color: 'var(--umo-text-color-primary)',fontWeight: 'bold' ,lineHeight:'32px'}">{{ treeItem.title }}</span></div>
        <t-row v-for="(item,indexF) in treeItem.formItems" :key="indexF" style="margin-left:30px;line-height: 32px ;">
          <t-col flex="150px">
            <div>
              <span class="umo-tree__line umo-tree__line--leaf umo-tree__line--first" style="--level: 1;left: -26px;line-height: 36px;bottom:10px;"></span>
              <span :style="{color: 'blue1' ,width: '150px'}">{{ item.title }}</span>
            </div>
          </t-col>
          <t-col flex="auto">
            <FormDesignRender 
              v-model="_value.experimental_design.formData[treeItem.key][item.key]"
              style="overflow: auto;"
              :mode=" 'RESP'"
              :config="item">
            </FormDesignRender>
          </t-col>
        </t-row>
        <t-row style="margin-bottom:16px;margin-top:10px;">
          <t-col flex="100px">
            <span :style="{color: 'blue' ,width: '150px'}">备注</span>
          </t-col>
          <t-col flex="auto">
            <t-textarea v-model="_value.experimental_design.formData[treeItem.key].description" :autosize="{minRows: 2}" placeholder="请输入备注"></t-textarea>
          </t-col>
        </t-row>

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
                    v-model="_value.experimental_design.formData"
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
      <t-divider align="left" dashed>评测记录</t-divider>
      <t-table  
        ref="tableRef"  :loading="loading"  
        row-key="id" :data="_value.record_table.table_data" :columns="_value.record_table.columns" resizable
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
                <t-button  variant="outline" @click="onAddIndexFunc()">配置指标</t-button>
              </t-space>
            </t-space>
          </div>
        </template>
        <template #type-slot-operate="slotProps">
          <div style="display: flex; align-items: center;gap: 10px; ">
            <t-link theme="primary" hover="color" @click="_value.record_table.table_data.push(cloneDeep( slotProps.row ) )">
              复制
            </t-link>
            <t-popconfirm content="确认删除吗" @confirm="() => { _value.record_table.table_data.splice( _value.record_table.table_data.indexOf(slotProps.row),1 ) }" >
              <t-button title="删除" theme="danger" shape="square" variant="text" >删除</t-button>
            </t-popconfirm>
          </div>
        </template>
      </t-table>
    </div>
  </t-space>
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
</template>

<script setup lang="jsx">
import { getFieldValue } from '@/utils/index';
import { cloneDeep } from 'lodash-unified';
import { shortId } from '@/utils/short-id'
import { v4 as uuid } from 'uuid'
import { getEval_attribute_libraryListFetch,get_experiment_samplesListFetch,post_samples_create_manyFetch  } from '@/api/experiment'
import { timeFormat } from '@/utils/time-ago'

const emits = defineEmits(['update:modelValue', 'change','blur','enter'])
const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({}),
    required: true,
  },
  viewType: {
    type: String,
    default: 'nodeView',
  },
})
 
const _value = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emits('update:modelValue', val)
  }
})

const select_index_visible = ref(false);
const assessmentOption = ref([])
const select_record_form = ref()

const suffixColumns = [
  {
    title: '操作栏',
    colKey: 'operate',
    width: 180,
    cell: 'type-slot-operate',
  },
]

const pagination = ref({
  limit: 20,
  total: 0,
  page: 1,
});

const selectTableForm = ref({
  type: 'group',
  index_type: [] ,  
  experimental_design:[]
})
const FORM_RULES = {
  experimental_design: [{ required: true, message: '必填' ,trigger: ['change'] }] ,
  index_type: [{ required: true, message: '必填' ,trigger: ['change'] }]
};

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
    keys.push(node.data.key)
  }else{
    keys.push(node.data.key)
  }
  
  const keyStr = keys.join('.')
  // console.log('keys:-----204---', keyStr);
  return keyStr? keyStr : ''
}

const onAddIndexFunc = ()=>{
  select_index_visible.value = true
}

const on_select_indexFunc = ()=>{
  console.log('--------on_select_indexFunc--------590--------',_value.value,selectTableForm.value )
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

      _value.value.record_table.columns = [...paramsColumns, ...suffixColumns]
      _value.value.record_table.params = cloneDeep(indexTypes)
      

      makerecordDataFunc(true)
      emits('change', _value.value)
      // let indexC = -1
      // table_data.value.forEach((row, index) => {
      //   if (row.id === _value.value.id) {
      //     indexC = index;
      //   }
      // });
      // table_data.value.splice(indexC, 1, _value.value)
      // console.log('--------on_select_indexFunc--------656--------',table_data.value )
      select_index_visible.value = false
    }
  })
  
}

const makerecordDataFunc = (init=false)=>{
  console.log('--------makerecordDataFunc--------590--------',_value.value,selectTableForm.value )
  const rowD = {name: _value.value.name}
  // 递归函数，处理嵌套的 FieldsGroup 和 SelectMaterial
  function processValueItems(items) {
    const valueC = {};

    items.forEach(eleI => {
      if (['SelectInput', 'TimeRangePicker', 'DeptPicker', 'TableList', 'Attachment', 'SelectMaterial'].includes(eleI.type)) {
        valueC[eleI.key] = [];
      } else if (['FieldsGroup'].includes(eleI.type)) {
        valueC[eleI.key] = processValueItems(eleI.props.items); // 递归处理嵌套的 items
      } else {
        valueC[eleI.key] = '';
      }
    });

    return valueC;
  }
  // 主逻辑
  _value.value.record_table.params.forEach(ele => {
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
      _value.value.record_table.table_data = [rowD]
    }else{
      _value.value.record_table.table_data.push(rowD)
    }
    
  });
}

const getAssessmentOptionFunc = async (page=1) => {
  const res = await getEval_attribute_libraryListFetch({page,limit:9999})
  console.log(res, '-------------488------------assessmentOption.value')
  let resD = {}
  if (true) {
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



onMounted( async () => {
  await getAssessmentOptionFunc()

})

</script>

<style lang="less" scoped>

</style>