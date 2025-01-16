<template>
  <node-view-wrapper :id="node.attrs.id" class="umo-node-view">
    <div style="display: flex ;flex-direction: column;gap: 10px;" >

      <div style="width: 100%;display: flex ;flex-direction: column;gap: 10px;" >
        <t-card
          v-for=" (design,index) in [designResult]" :key="index"
          :title="_title" header-bordered :style="{ width: '100%' }">
          <!-- <t-row v-for=" (formItemP,indexP) in design.formItems" :key="indexP">
            <t-col flex="100px">
              <div>{{formItemP.name}}</div>
            </t-col>
            <t-col flex="auto">
              <div >
                <template v-for="(formItemO, indexO) in formItemP.formItems" :key="indexO">
                  <xmFormDesignRender
                    v-model="design.formData"
                    style="overflow: auto;"
                    :label="formItemO.title"
                    :valueKey="`${formItemP.id}.${formItemO.key}`"
                    :mode=" 'RESP'"
                    :config="formItemO">
                  </xmFormDesignRender>
                </template>
              </div>
            </t-col>
          </t-row> -->
          <t-tree
            v-if="design"
            ref="designTreeRef"
            :data="design.formItems"  :keys="{ value: 'rowKey', label: 'title', children: 'formItems' }"
            activable  expandParent activeMultiple expandAll
            allowFoldNodeOnFilter  line @change="treeSelectChange">
            <template #label="{ node }">
              <div style="display:flex;gap:10px;">
                <span :style="{color: node.data.type ?'blue' :'var(--umo-text-color-primary)' ,width: '150px'}">{{ node.label }}</span>
                <div v-if="node.isLeaf()" style="width: calc(100% - 150px) ;">
                  <xmFormDesignRender style="overflow: auto;"
                    v-model="design.formData"
                    :label="node.data.title"
                    :valueKey="getNodeFullColKey(node)"
                    :mode=" 'RESP'"
                    :config="node.data">
                  </xmFormDesignRender>
                </div>
              </div>
            </template>
          </t-tree>
          <template #title>
            <t-input v-model="_title" auto-width placeholder="请输入名称" />
          </template>
          <template #actions>
            <t-button style="width: 100px;" variant="outline" @click="onSelectDesignFunc">
              <template #icon><icon class="umo-button-icon" name="experimental_design" /></template>
              <span style="margin-left:4px;"> 试验设计</span>
            </t-button>
            <!-- <a href="javascript:void(0)" @click="clickHandler">操作</a> -->
          </template>
        </t-card>

        <node-view-content :node="node" ></node-view-content>
      </div>
    </div>
    <t-dialog
      v-model:visible="select_design_visible"
      destroy-on-close
      :close-on-overlay-click="false"
      header="选择物料表及工艺表" :cancel-btn="null"
      width="600" attach="body"
      :confirm-on-enter="true"
      :on-confirm="select_design_formFunc"
    >
      <t-form ref="select_design_form" :rules="FORM_RULES" :data="selectTableForm" :colon="true" >
        <!-- <t-form-item label="物料表" name="raw_material">
          <t-select v-model="selectTableForm.raw_material" borderless placeholder="请选择" style="width: 100%;" clearable filterable >
            <t-option v-for="item in raw_materialOptions" :key="item.id" :value="item.id" :label="item.title"></t-option>
          </t-select>
        </t-form-item> -->
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
      <experimental-design v-if="experimental_design_visible" v-model:designParams="_designParams" v-model:selectFormItems="selectFormItems"  @select-change="onSelectChange"/>
    </t-dialog>
  </node-view-wrapper>
</template>

<script setup lang="jsx">
import { nodeViewProps, NodeViewWrapper,NodeViewContent } from '@tiptap/vue-3'
import { v4 as uuid } from 'uuid'
import { getIngredient_dev_experimentListFetch,post_ingredient_dev_sample_fetch } from '@/api/experiment'
import { timeFormat } from '@/utils/time-ago'
import { cloneDeep } from 'lodash-es';

const { editor, node, updateAttributes } = defineProps(nodeViewProps)

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

const _title = computed({
  get: () => {
    return node.attrs.title
  },
  set(value) {
    updateAttributes({ title: value })
  },
})

const _designParams = computed({
  get: () => {
    return node.attrs.designParams
  },
  set(value) {

    updateAttributes({ designParams: value })
  },
})

const customerParams  = computed({
  get: () => {
    return node.attrs.customerParams
  },
  set(value) {

    updateAttributes({ customerParams: value })
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
        } else {
          return eleI;
        }
      });
    }
    const formItems = technology_table_data.map(ele=>{
      return {...ele, formItems: processItems(ele.formItems, optionsGroup)}
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

const onSelectChange = ( formItems )=>{
  //
  // nextTick(() => {
  //   selectFormItems.value = [...formItems]
  // })
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
    id: uuid(),
    title: `试验设计方案-${timeFormat(null,'yyyymmddhhMMss')}`,
  }
  experimental_design_visible.value = false

  return
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
    const res = await post_ingredient_dev_sample_fetch(params)

    if (res.data.code === 2000) {

      // editor.commands.setTextSelection(editor.state.doc.content.size)
      // const { from0, to0 } = editor.state.selection ?? {}
      // editor.commands.setTextSelection({ from:from0 , to :to0  })
      //
      editor.chain().focus().insertContent('<p></p><p></p>').run();

      const { from, to } = editor.state.selection ?? {}

      editor.commands.setTextSelection({ from , to: to + 1  })
      editor.commands.addSample_tables({ group:res.data.data.group, table_data:[],designParams:designParamsC})
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


}

const initialize = () => {
  const docD = cloneDeep(editor.getJSON())
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

const onSelectDesignFunc = () => {
  initialize()
  if (node.attrs.customerParams?.is_select ) {
    selectTableForm.value.technology = node.attrs.customerParams?.technology
    on_select_designFunc()
  }else{
    if (technologyOptions.value.length === 1 ) {
      selectTableForm.value.technology = technologyOptions.value[0].id
      on_select_designFunc()
    } else {
      select_design_visible.value = true;
    }
  }
}


onMounted(() => {
  initialize()


  if (node.attrs.customerParams?.is_select ) {
    selectTableForm.value.technology = node.attrs.customerParams?.technology
    on_select_designFunc()
  }else{
    if (!designResult.value || !designResult.value.formItems || designResult.value.formItems.length === 0) {
      setTimeout(() => {
        if (technologyOptions.value.length === 1 ) {
          selectTableForm.value.technology = technologyOptions.value[0].id
          on_select_designFunc()
        }
      }, 500);
    }

  }

})

</script>

<style lang="scss" scoped>

</style>
