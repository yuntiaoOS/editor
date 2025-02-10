<template>
  <t-dialog
    v-model:visible="select_design_visible"
    destroy-on-close
    :close-on-overlay-click="false"
    header="选择物料表及工艺表"
    :cancel-btn="null"
    width="600"
    attach="body"
    :confirm-on-enter="true"
    :on-cancel="onCancelFunc"
    :on-close="onCancelFunc"
    :on-confirm="select_design_formFunc"
  >
    <t-form
      ref="select_design_form"
      :rules="FORM_RULES"
      :data="selectTableForm"
      :colon="true"
    >
      <t-form-item label="工艺表" name="technology">
        <t-select
          v-model="selectTableForm.technology"
          borderless
          placeholder="请选择"
          style="width: 100%"
          clearable
          filterable
        >
          <t-option
            v-for="item in technologyOptions"
            :key="item.id"
            :value="item.id"
            :label="item.title"
          ></t-option>
        </t-select>
      </t-form-item>
    </t-form>
  </t-dialog>
  <t-dialog
    v-model:visible="experimental_design_visible"
    destroy-on-close
    :close-on-overlay-click="false"
    header="试验方法设计"
    :cancel-btn="null"
    width="80%"
    attach="body"
    :confirm-on-enter="true"
    :on-cancel="onCancelFunc"
    :on-close="onCancelFunc"
    :on-confirm="on_experimental_designFunc"
  >
    <experimental-design
      v-if="experimental_design_visible"
      v-model:design-params="_designParams"
      v-model:select-form-items="selectFormItems"
      v-model:orthogonal-design="orthogonalDesign"
      @select-change="onSelectChange"
    />
  </t-dialog>
</template>

<script setup lang="jsx">
import { cloneDeep } from 'lodash-es'
import { v4 as uuid } from 'uuid'

import { timeFormat } from '@/utils/time-ago'

const emits = defineEmits(['update:nodeAttrs', 'submit', 'cancel'])
const props = defineProps({
  node: {
    type: Object,
    default: () => {},
  },
  nodeAttrs: {
    type: Object,
    default: () => {},
  },
  editor: {
    type: Object,
    default: () => {},
  },
  viewType: {
    type: String,
    default: 'nodeView',
  },
})

const _nodeAttrs = computed({
  get: () => props.nodeAttrs,
  set: (value) => {
    emits('update:nodeAttrs', value)
  },
})

const { options } = useStore()
const select_design_visible = ref(false)
const $key_data = JSON.parse(localStorage.getItem('key_data'))
const experiment_record = computed(() => $key_data?.experiment_record)
const experiment_theme = computed(() => $key_data?.experiment_theme)

const designTreeRef = ref()
const experimental_design_visible = ref(false)
const select_design_form = ref()
const raw_materialOptions = ref([])
const sampleOptions = ref([])
const technologyOptions = ref([])
const selectTableForm = ref({
  raw_material: '',
  technology: '',
})
const FORM_RULES = {
  raw_material: [{ required: true, message: '必填', trigger: ['change'] }],
  technology: [{ required: true, message: '必填', trigger: ['change'] }],
}
const selectFormItems = ref([])

// 正交设计相关参数
const orthogonalDesign = ref({})

const _designParams = ref({})

const designParamsId = computed({
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
  },
})
// 递归函数，处理嵌套的 FieldsGroup 和 SelectMaterial
function processItems(items, optionsGroup) {
  return items.map((eleI) => {
    if (eleI.type === 'SelectMaterial' || eleI.type === 'MaterialList') {
      return {
        ...eleI,
        props: {
          ...eleI.props,
          options: optionsGroup,
        },
      }
    } else if (eleI.type === 'FieldsGroup') {
      return {
        ...eleI,
        props: {
          ...eleI.props,
          items: processItems(eleI.props.items, optionsGroup), // 递归处理嵌套的 items
        },
      }
    } else if (eleI.type === 'TableList') {
      return {
        ...eleI,
        props: {
          ...eleI.props,
          showBorder: false,
          columns: eleI.props.columns.map((eleC) => {
            if (eleC.type === 'SelectMaterial') {
              return {
                ...eleC,
                props: {
                  ...eleC.props,
                  options: optionsGroup,
                },
              }
            } else {
              return eleC
            }
          }),
        },
      }
    } else {
      return eleI
    }
  })
}
function sortData(data) {
  // 为每个元素添加原始索引
  const indexedData = data.map((item, index) => ({
    ...item,
    originalIndex: index,
  }));

  // 自定义排序规则
  indexedData.sort((a, b) => {
    if (a.id !== b.id) {
      return a.id - b.id; // 按 id 升序排列
    } else {
      return a.originalIndex - b.originalIndex; // 相同 id 按原始索引排序
    }
  });

  // 移除临时添加的原始索引属性
  const sortedData = indexedData.map(({ originalIndex, ...rest }) => rest);

  return sortedData;
}
const getDesignParams = () => {
  let designParams = {}

  const technology_table_data = technologyOptions.value
    .find((ele) => ele.id === selectTableForm.value.technology)
    .table_data.map((eleT) => ({
      ...eleT.form,
      id: eleT.id,
      key: eleT.id,
      rowKey: eleT.rowKey,
      title: eleT.name,
      name: eleT.name,
    }))
  const optionsGroup = raw_materialOptions.value.map((ele) => {
    return {
      group: ele.title,
      children: ele.table_data.map((eleT) => {
        return { value: eleT.id, label: `${eleT.name}/${eleT.sn}` }
      }),
    }
  })
  // 插入样品组数据
  optionsGroup.push({
    group: '样品',
    children: sampleOptions.value.map((ele) => {
      return { value: ele.id, label: `${ele.name}/${ele.sn}` }
    }),
  })

  //[x] TODO  待优化optionsGroup物料数据要插入更新
  if (technology_table_data) {
    const formItems = technology_table_data.map((ele) => {
      const eleC = cloneDeep(ele)
      delete eleC.formData
      //
      eleC.formItems = eleC.formItems.map((eleT) => {
        eleT.attribute = eleT.attribute.map((eleA) => {
          return processItems([eleA], optionsGroup)[0]
        })
        // 判断当前工序里面是否有正交变量 eleA.props.orthogonal 有的话需要处理
        const old_data = designResult.value.formItems?.find(
          (eleF) => eleF.id === ele.id
        )
        if (old_data) {
          const old_item = old_data.formItems.find(
            (eleF) => eleF.id === eleT.id,
          )
          if (old_item) {
            const old_attribute = old_item.attribute.filter(eleO => eleO.props?.orthogonal)
            console.log('------230-----------',old_attribute)
            // 过滤重复key项
            eleT.attribute = eleT.attribute.filter(eleO => !old_attribute.map(eleS=>eleS.key).includes(eleO.key) )
            eleT.attribute = eleT.attribute.concat(old_attribute)
            eleT.attribute = sortData(eleT.attribute)
            eleT.attribute = eleT.attribute.map((eleA) => {
              return processItems([eleA], optionsGroup)[0]
            })
          }
        }
        return eleT
      })
      return eleC
    })

    designParams = {
      formItems,
      formData: {},
      stepData: {},
    }
    technology_table_data.forEach((eleT) => {
      designParams.formData[eleT.id] =
        designResult.value?.formData?.[eleT.id]
          ? designResult.value?.formData[eleT.id]
          : eleT.formData
      designParams.stepData[eleT.id] =
        designResult.value?.formData?.[eleT.id]
          ? designResult.value?.formData[eleT.id]
          : eleT.formData
    })
  }
  console.log('------226-----------',designParams,designResult.value,technology_table_data)
  return designParams
}
const getNodeFullColKey = (node) => {
  const parents = node.getParents()

  // console.info('树结构数据:--------',node, parents);
  if (!parents) {
    return ''
  }
  const keys = []
  parents.forEach((item) => {
    keys.unshift(item.data.key)
  })
  if (parents[0].data.type && parents[0].data.type === 'FieldsGroup') {
    keys.push(node.data.key)
  } else {
    keys.push(node.data.key)
  }

  const keyStr = keys.join('.')
  //
  return keyStr ? keyStr : ''
}
const select_design_formFunc = () => {
  select_design_form.value
    ?.validate({ showErrorMessage: true })
    .then((validateResult) => {
      if (validateResult && Object.keys(validateResult).length) {
        const firstError = Object.values(validateResult)[0]?.[0]?.message
        useMessage('warning', firstError)
      } else {
        select_design_visible.value = false
        _designParams.value = getDesignParams()
        experimental_design_visible.value = true
      }
    })
}
const on_select_designFunc = () => {
  _designParams.value = getDesignParams()
  experimental_design_visible.value = true
}

const onCancelFunc = () => {
  emits('cancel')
}

const onSelectChange = (formItems) => {}

const on_experimental_designFunc = async () => {
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
    title: `试验设计方案-${timeFormat(null, 'yyyymmddhhMMss')}`,
  }
  emits('submit', designResult.value)
  experimental_design_visible.value = false
}

const initialize = () => {
  const docD = cloneDeep(props.editor.getJSON())
  if (docD) {
    // 物料表
    const raw_material_tables = docD.content.filter(
      (ele) => ele.type === 'raw_material_table',
    )
    if (raw_material_tables.length === 0) {
      TMessagePlugin.warning('请先创建物料表')
      return // 物料表不存在，返回
    }
    // 工艺表
    const technology_tables = docD.content.filter(
      (ele) => ele.type === 'technology_table',
    )
    if (technology_tables.length === 0) {
      TMessagePlugin.warning('请先创建工艺表')
      return // 工艺表不存在，返回
    }
    raw_materialOptions.value = raw_material_tables.map((ele) => ele.attrs)
    technologyOptions.value = technology_tables.map((ele) => ele.attrs)
    // 样品表
    const test_record_table = docD.content.filter(
      (ele) => ele.type === 'test_record_table',
    )
    const sample_tables = test_record_table
      .map((ele) => ele.attrs.table_data)
      .reduce((pre, cur) => pre.concat(cur), [])
      .filter((ele) => ele.is_sample && (ele.sample?.really_sample || ele.sample?.params?.is_residue )  )
    if (sample_tables.length > 0) {
      sampleOptions.value = sample_tables.map((ele) => { return { ...ele.sample  } })
    }
  } else {
    TMessagePlugin.warning('当前文档中没有数据错误')
  }
}

onMounted(() => {
  initialize()
  console.log('-------------_designParams.value---------------', _nodeAttrs.value, _designParams.value, )

  if (
    _nodeAttrs.value.designParams &&
    _nodeAttrs.value.designParams.length > 0
  ) {
    selectTableForm.value.technology = designParamsId.value
    on_select_designFunc()
  } else {
    if (
      !designResult.value?.formItems ||
      designResult.value.formItems.length === 0
    ) {
      setTimeout(() => {
        if (technologyOptions.value.length === 1) {
          selectTableForm.value.technology = technologyOptions.value[0].id
          designParamsId.value = technologyOptions.value[0].id
          on_select_designFunc()
        } else {
          select_design_visible.value = true
        }
      }, 500)
    }
  }
})
</script>

<style lang="scss" scoped></style>
