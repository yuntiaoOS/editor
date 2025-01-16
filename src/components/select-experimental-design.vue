<template>
  <t-dialog
    v-model:visible="select_design_visible"
    destroy-on-close
    :close-on-overlay-click="false"
    header="选择物料表及工艺表" :cancel-btn="null"
    width="600" attach="body"
    :confirm-on-enter="true"
    :on-cancel="onCancelFunc"
    :on-close="onCancelFunc"
    :on-confirm="select_design_formFunc"
  >
    <t-form ref="select_design_form" :rules="FORM_RULES" :data="selectTableForm" :colon="true" >
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
    :on-cancel="onCancelFunc"
    :on-close="onCancelFunc"
    :on-confirm="on_experimental_designFunc"
  >
    <experimental-design v-if="experimental_design_visible" v-model:designParams="_designParams" v-model:selectFormItems="selectFormItems" v-model:orthogonalDesign="orthogonalDesign"  @select-change="onSelectChange"/>
  </t-dialog>
</template>

<script setup lang="jsx">
import { v4 as uuid } from 'uuid'
import { shortId } from '@/utils/short-id'
import { timeFormat } from '@/utils/time-ago'
import { cloneDeep } from 'lodash-es';

const emits = defineEmits(['update:nodeAttrs','submit','cancel'])
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
  }
})

const _nodeAttrs = computed({
  get: () => props.nodeAttrs,
  set: (value) => {
    emits('update:nodeAttrs', value)
  }
})

const { options } = useStore()
const select_design_visible = ref(false);
const $key_data = JSON.parse( localStorage.getItem('key_data'))
const experiment_record = computed(() => $key_data?.experiment_record)
const experiment_theme = computed(() => $key_data?.experiment_theme)

const designTreeRef = ref();
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
const selectFormItems = ref([])

// 正交设计相关参数
const orthogonalDesign = ref({})

const _designParams = computed({
  get: () => {
    return _nodeAttrs.value.designParams
  },
  set(value) {
    _nodeAttrs.value.designParams = value
  },
})

const designResult = computed({
  get: () => {
    return _nodeAttrs.value.designResult
  },
  set(value) {
    _nodeAttrs.value.designResult = value
  }
})
// 递归函数，处理嵌套的 FieldsGroup 和 SelectMaterial
function processItems(items, optionsGroup) {
  return items.map(eleI => {
    if (eleI.type === 'SelectMaterial') {
      return {
        ...eleI,
        props: {
          ...eleI.props,
          options: optionsGroup,
        },
      };
    } else if (eleI.type === 'FieldsGroup') {
      return {
        ...eleI,
        props: {
          ...eleI.props,
          items: processItems(eleI.props.items, optionsGroup), // 递归处理嵌套的 items
        },
      };
    } else if (eleI.type === 'TableList' ) {
      return {
        ...eleI,
        props: {
          ...eleI.props,
          showBorder: false,
          columns: eleI.props.columns.map(eleC=>{
            if (eleC.type === 'SelectMaterial') {
              return {
                ...eleC,
                props: {
                  ...eleC.props,
                  options: optionsGroup,
                },
              };
            }else{
              return eleC
            }
          })
        },
      };
    } else {
      return eleI;
    }
  });
}

const getDesignParams = () => {
  let designParams = {}

  const technology_table_data = technologyOptions.value.find(ele=> ele.id === selectTableForm.value.technology).table_data.map(eleT => ({...eleT.form,id:eleT.id,key:eleT.id,rowKey:eleT.rowKey,title:eleT.name ,name:eleT.name}) )
  const optionsGroup = raw_materialOptions.value.map(ele=>{
    return {
      group: ele.title,
      children: ele.table_data.map(eleT=>{
        return { value: eleT.id, label: `${eleT.name }/${eleT.sn }` }
      })
    }
  })

  //[ ] TODO  待优化optionsGroup物料数据要插入更新
  if (technology_table_data) {
    const formItems = technology_table_data.map(ele=>{
      const eleC = cloneDeep(ele)
      delete eleC.formData
      eleC.formItems = eleC.formItems.map(eleT=>{
        eleT.attribute = eleT.attribute.map(eleA=>{
          return processItems([eleA], optionsGroup)[0]
        })
        return eleT
      })
      return eleC
    })

    designParams = {
      formItems,
      formData:{},
      stepData:{},
    }
    technology_table_data.forEach(eleT => {
      designParams.formData[eleT.id] = eleT.formData
      designParams.stepData[eleT.id] = eleT.formData
    })
  }

  return designParams
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
    keys.push(node.data.key)
  }else{
    keys.push(node.data.key)
  }

  const keyStr = keys.join('.')
  //
  return keyStr? keyStr : ''
}
const select_design_formFunc = ()=>{
  select_design_form.value?.validate({ showErrorMessage: true }).then((validateResult) => {
    if (validateResult && Object.keys(validateResult).length) {
      const firstError = Object.values(validateResult)[0]?.[0]?.message;
      useMessage('warning',firstError)
    }else{
      select_design_visible.value = false
      _designParams.value = getDesignParams()
      experimental_design_visible.value = true;
    }
  })
}
const on_select_designFunc = ()=>{
  _designParams.value = getDesignParams()
  experimental_design_visible.value = true;


}

const onCancelFunc = ()=>{

  emits('cancel')
}

const onSelectChange = ( formItems )=>{

}

const on_experimental_designFunc = async ()=>{

  if (!selectFormItems.value || selectFormItems.value.length === 0) {
    TMessagePlugin.warning('请选择需要添加的数据')
    return
  }
  designResult.value = {
    // ..._designParams.value,
    formData: cloneDeep(_designParams.value.formData),
    formItems: cloneDeep(selectFormItems.value),
    orthogonalDesign: orthogonalDesign.value,
    id: uuid(),
    title: `试验设计方案-${timeFormat(null,'yyyymmddhhMMss')}`,
  }
  emits('submit',designResult.value)
  experimental_design_visible.value = false

}

const initialize = () => {
  const docD = cloneDeep(props.editor.getJSON())
  if (docD) {
    // 物料表
    const raw_material_tables = docD.content.filter(ele=> ele.type === 'raw_material_table')
    if (raw_material_tables.length === 0) {
      TMessagePlugin.warning('请先创建物料表')
      return  // 物料表不存在，返回
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


  if (_nodeAttrs.value.designParams?.formItems && _nodeAttrs.value.designParams?.formItems.length > 0) {
    experimental_design_visible.value = true
  }else{
    if (!designResult.value || !designResult.value.formItems || designResult.value.formItems.length === 0) {
      setTimeout(() => {
        if (technologyOptions.value.length === 1 ) {
          selectTableForm.value.technology = technologyOptions.value[0].id
          on_select_designFunc()
        }else{
          select_design_visible.value = true
        }
      }, 500);
    }

  }

})

</script>

<style lang="scss" scoped>

</style>
