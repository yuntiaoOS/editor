<template>
  <node-view-wrapper :id="node.attrs.id" class="umo-node-view">
    <div style="width: 100%">
      <node-view-content :node="node" ></node-view-content> 
    </div>
    <t-dialog 
      v-model:visible="select_design_visible"
      destroy-on-close 
      :close-on-overlay-click="false"
      header="选择原材料表及工艺表" :cancel-btn="null"
      width="600" attach="body"
      :confirm-on-enter="true"
      :on-confirm="on_select_designFunc"
    >
      <t-form ref="select_design_form" :rules="FORM_RULES" :data="selectTableForm" :colon="true" >
        <t-form-item label="原材料表" name="raw_material">
          <t-select v-model="selectTableForm.raw_material" borderless placeholder="请选择" style="width: 100%;" clearable filterable >
            <t-option v-for="item in raw_materialOptions" :key="item.id" :value="item.id" :label="item.title"></t-option>
          </t-select>
        </t-form-item>
        <t-form-item label="工艺表" name="technology">
          <t-select v-model="selectTableForm.technology" borderless placeholder="请选择" style="width: 100%;" clearable filterable >
            <t-option v-for="item in technologyOptions" :key="item.id" :value="item.id" :label="item.title"></t-option>
          </t-select>
        </t-form-item>
      </t-form>
    </t-dialog>
    <t-dialog 
      v-model:visible="experimental_design_visible"
      destroy-on-close 
      :close-on-overlay-click="false"
      header="试验方法设计" :cancel-btn="null"
      width="80%" attach="body"
      :confirm-on-enter="true"
      :on-confirm="on_experimental_designFunc"
    >
      <experimental-design v-if="experimental_design_visible" v-model:designParams="_designParams" v-model:designResult="designResult" @select-change="onSelectChange"/>
    </t-dialog>
  </node-view-wrapper>
</template>

<script setup lang="jsx">
import { nodeViewProps, NodeViewWrapper,NodeViewContent } from '@tiptap/vue-3'
import { v4 as uuid } from 'uuid'
import { getIngredient_dev_experimentListFetch,post_experiment_samples_fetch } from '@/api/experiment'
import { timeFormat } from '@/utils/time-ago'

const { editor, node, updateAttributes } = defineProps(nodeViewProps)

const { options } = useStore()
const select_design_visible = ref(false);
const $key_data = useState('key_data')
const experiment_record = computed(() => $key_data.value?.experiment_record)
const experiment_theme = computed(() => $key_data.value?.experiment_theme)

const experimental_design_visible = ref(false);
const select_design_form = ref();
const raw_materialOptions = ref([])
const technologyOptions = ref([])
const selectTableForm = ref({
  raw_material: '',
  technology: '',
});
const FORM_RULES = { raw_material: [{ required: true, message: '必填' ,trigger: ['change'] }],
  technology: [{ required: true, message: '必填' ,trigger: ['change'] }] 
};
const select_material = ref([])

const _designParams = computed({
  get: () => {
    return node.attrs.designParams
  },
  set(value) {
    console.log('------172--------updateAttributes({ designParams: value })------',value)
    updateAttributes({ designParams: value })
  },
})

const designResult = computed({
  get: () => {
    return node.attrs.designResult
  },
  set(value) {
    updateAttributes({ designResult: value })
  }
})

const getDesignParams = () => {
  const oldDesignParams = [..._designParams.value]
  console.log('------116--------oldDesignParams------',oldDesignParams)
  let designParams = []
  console.log('--------_designParams--------93--------',technologyOptions.value,raw_materialOptions.value)
  const technology_table_data = technologyOptions.value.find(ele=> ele.id === selectTableForm.value.technology).table_data.map(eleT => eleT.children).reduce((a, b) => a.concat(b)).filter(item => item.type || item.group )
  const material_table_data = raw_materialOptions.value.find(ele=> ele.id === selectTableForm.value.raw_material).table_data.map(ele=> { return { ...ele,name:`${ele.experiment_material_name }/${ele.experiment_material_sn}` } }) 
  console.log('--------_designParams--------123--------',technology_table_data,material_table_data)
  if (technology_table_data && material_table_data) {
    designParams = technology_table_data.map(eleT => { 
      if (eleT.key === XM_raw_material_key) {
        return { 
          ...eleT,step:'',check:true,
          raw_material: selectTableForm.value.raw_material,
          technology: selectTableForm.value.technology,
          type: 'SelectPlus',
          label: eleT.name,
          value: eleT.id,
          props: {
            ...eleT.props,
            labelKey: 'name',
            valueKey: 'id',
            options: material_table_data
          },
        }
      } else {
        if ( eleT.attribute_type === "compound"){
          return {...eleT,step:{},check:true}
        }else{
          return {...eleT,step:'',check:true}
        }
        
      }
      
    })
    if (oldDesignParams && oldDesignParams.length > 0) {
      // 遍历数组 b，查找并更新数组 a 中的对象
      oldDesignParams.forEach(itemB => {
        const itemA = designParams.find(itemA => itemA.id === itemB.id);
        if (itemA) {
          itemA.step = itemB.step;
        }
      });
    }
  }
  console.log('--------_designParams--------129--------',designParams)
  return designParams
}

const on_select_designFunc = ()=>{
  select_design_form.value?.validate({ showErrorMessage: true }).then((validateResult) => {
    if (validateResult && Object.keys(validateResult).length) {
      const firstError = Object.values(validateResult)[0]?.[0]?.message;
      useMessage('warning',firstError)
    }else{
      _designParams.value = getDesignParams()
      experimental_design_visible.value = true;
    }
  })
  select_design_visible.value = false
}

const onSelectChange = ({value, params} )=>{
  // console.log('--------onSelectChange--------44--------',value, params)
  select_material.value = params.selectedRowData
}

const on_experimental_designFunc = async ()=>{
  console.log('--------on_experimental_designFunc--------156--------',designResult.value,_designParams.value)
  const designParamsC =  Object.assign([],_designParams.value)
  const selectData = designResult.value.filter(ele=> ele.check)
  if (selectData.length > 0) {
    const table_data = []
    selectData.forEach((ele ,index) => {
      const obj  = {
        ...ele,
        name: ele.name&&ele.name.length>0 ? ele.name : `SF-${timeFormat(null,'yyyymmddhhMMss')}`,
        id: uuid(),
        raw_material: ele.id,
        count: '0',
      }
      table_data.push(obj)
    });
    const params = {
      experiment_theme: experiment_theme.value?.id,
      record: experiment_record.value?.id,
      keys: _designParams.value.filter(ele=> ele.check).map(ele=> `${ele.key }_id`),
      values: _designParams.value.filter(ele=> ele.check).map(ele=> ele.key),
      data: table_data
    }
    const res = await post_experiment_samples_fetch(params)
    console.log('--------on_experimental_designFunc--------180--------',params,selectData,_designParams.value,designResult.value)
    if (res.data.code === 2000) {
      console.log('--------on_experimental_designFunc--------183--------',editor.state)
      // editor.commands.setTextSelection(editor.state.doc.content.size)
      // const { from0, to0 } = editor.state.selection ?? {}
      // editor.commands.setTextSelection({ from:from0 , to :to0  })
      // console.log('--------on_experimental_designFunc--------184--------',from0, to0)
      editor.chain().focus().insertContent('<p></p>').run();

      const { from, to } = editor.state.selection ?? {}
      console.log('--------on_experimental_designFunc--------189--------',from, to)
      editor.commands.setTextSelection({ from , to: to + 1  })
      editor.commands.addSample_tables({ table_data:res.data.data,designParams:designParamsC})
      // editor.view.updateState(editor.state)
      table_data.value = [...table_data]
      experimental_design_visible.value = false
    }else{
      TMessagePlugin.warning(res.data.msg)
    }
  }else{
    TMessagePlugin.warning('请选择需要添加的数据')
  }
  // nextTick(()=>{
  //   updateAttributes({ designParams:[ ..._designParams.value] })
  // })
  
  console.log('--------on_experimental_designFunc--------186--------',_designParams.value,designResult.value)
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
    // 工艺表
    const technology_tables = docD.content.filter(ele=> ele.type === 'technology_table')
    if (technology_tables.length === 0) {
      TMessagePlugin.warning('请先创建工艺表')
      return  // 工艺表不存在，返回
    }
    raw_materialOptions.value = raw_material_tables.map(ele=> ele.attrs)
    technologyOptions.value = technology_tables.map(ele=> ele.attrs)
  }else {
    TMessagePlugin.warning('当前文档中没有数据错误')
  }
}

onMounted(() => {
  initialize()
  console.log('--------onMounted--------213--------',node.attrs)
  if (node.attrs.designParams && Object.keys(node.attrs.designParams).length > 0) {

  }else{
    setTimeout(() => {
      select_design_visible.value = true;
    }, 500);
  }
  
})

</script>

<style lang="scss" scoped>

</style>
