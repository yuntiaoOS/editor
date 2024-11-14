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
      width="80%" attach="body"
      :confirm-on-enter="true"
      :on-confirm="on_select_designFunc"
    >
      <t-form ref="select_design_form" :rules="FORM_RULES" :data="selectTableForm" :colon="true" >
        <t-form-item label="原材料表" name="raw_material">
          <t-select v-model="select_design_form.raw_material" borderless placeholder="请选择" style="width: 100%;" clearable filterable >
            <t-option v-for="item in raw_materialOptions" :key="item.value" :value="item.value" :label="item.label"></t-option>
          </t-select>
        </t-form-item>
        <t-form-item label="工艺表" name="technology">
          <t-select v-model="select_design_form.technology" borderless placeholder="请选择" style="width: 100%;" clearable filterable >
            <t-option v-for="item in technologyOptions" :key="item.value" :value="item.value" :label="item.label"></t-option>
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

const { editor, node, updateAttributes } = defineProps(nodeViewProps)

const { options } = useStore()
const select_design_visible = ref(false);

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

const designResult = computed({
  get: () => {
    return node.attrs.designResult
  },
  set(value) {
    updateAttributes({ designResult: value })
  }
})

const table_data = computed({
  get: () => node.attrs.table_data,
  set(value) {
    updateAttributes({ table_data: value })
  },
})

const on_select_designFunc = ()=>{
  formRef.value?.validate({ showErrorMessage: true }).then((validateResult) => {
    if (validateResult && Object.keys(validateResult).length) {
      const firstError = Object.values(validateResult)[0]?.[0]?.message;
      useMessage('warning',firstError)
    }else{
      add_dialog_visible.value = false;
      const newData = { ...formData.value };
      _designResult.value.push(newData);
    }
  })
  select_design_visible.value = false
}

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

const initialize = () => {
  const docD = editor.getJSON()
  let designParams = []
  if (docD) {
    // 原材料表
    const raw_material_tables = docD.content.filter(ele=> ele.type === 'raw_material_table')
    // 工艺表
    const technology_tables = docD.content.filter(ele=> ele.type === 'technology_table')
    if (technology_tables.length > 0) {
      const technology_table = technology_tables[0]
      const table_data  = technology_table.attrs.table_data.map(eleT => eleT.list)
      console.log('--------_designParams--------123--------',table_data)
      let material_options = []
      if (raw_material_tables.length > 0) {
        const raw_material_table = raw_material_tables[0]
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
}

onMounted(() => {
  initialize()
  setTimeout(() => {
    select_design_visible.value = true;
  }, 500);
})

</script>

<style lang="scss" scoped>

</style>
