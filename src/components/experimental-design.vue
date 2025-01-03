<!-- 试验方法设计 -->
<template>
  <t-space direction="vertical">
    <t-space direction="vertical">
      <t-check-tag-group
        v-model="designType"
        style="margin-right: 32px"
        :options="designTypeOptions"
        @change="current = 0"
        >选中/未选态</t-check-tag-group
      >
      <div style="width: calc(80vw - 100px)">
        <t-checkbox disabled
          >为设定的默认显示上一次实验参数（也可以选择来源于某个样品）</t-checkbox
        >
        <t-enhanced-table
          ref="tableEnhancedRef"
          v-model:expandedTreeNodes="expandedTreeNodes"
          :tree-expand-and-fold-icon="treeExpandIcon"
          :showHeader="false"
          :row-key="rowKey"
          :data="_designParams.formItems"
          :columns="enhancedColumns"
          resizable
          :tree="treeConfig"
          :selected-row-keys="designTreeChecked"
          @select-change="onEdenhancedSelectChange"
          @expanded-tree-nodes-change="onExpandedTreeNodesChange"
        >
          <template #defaultValueSlot="slotProps">
            <div style="display: flex; gap: 10px; align-items: center">
              <t-tag
                v-if="!slotProps.row.formItems"
                size="small"
                :theme="
                  slotProps.row.operateType === '物料'
                    ? 'primary'
                    : slotProps.row.operateType === '样品'
                      ? 'warning'
                      : 'success'
                "
                >{{ slotProps.row.operateType }}</t-tag
              >
              <span
                :style="{
                  color: slotProps.row.type
                    ? 'blue'
                    : 'var(--umo-text-color-primary)',
                  fontWeight: slotProps.row.type ? 'normal' : 'bold',
                  width: '150px',
                }"
                >{{ slotProps.row.title }}</span
              >
              <div
                v-if="!slotProps.row.formItems"
                style="width: calc(100% - 150px);overflow-x: auto"
              >
                <t-space >
                  <template v-for="(item, index) in slotProps.row.attribute">
                    <xmFormDesignRender
                      style="overflow: auto"
                      v-model="_designParams.formData"
                      :label="item.title"
                      :valueKey=" getParentRowKeys(item, _designParams.formItems) "
                      :mode=" readonly ? 'READ' : 'RESP'"
                      :config="item"
                    >
                    </xmFormDesignRender>
                  </template>
                </t-space>

              </div>
            </div>
          </template>
        </t-enhanced-table>
      </div>
    </t-space>
  </t-space>
</template>

<script setup lang="jsx">
import { ref } from 'vue'
import { v4 as uuid } from 'uuid'
import { getFieldValue } from '@/utils/index'
import xmInput from './xm-input.vue'
import { timeFormat } from '@/utils/time-ago'
import {
  AddRectangleIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  MinusRectangleIcon,
} from 'tdesign-icons-vue-next'
import { Loading } from 'tdesign-vue-next'
import cloneDeep from 'lodash/cloneDeep'

const emits = defineEmits([
  'update:designParams',
  'update:designResult',
  'update:selectFormItems',
  'update:orthogonalDesign',
  'change',
])
const props = defineProps({
  designParams: {
    type: Array,
    default: () => [],
  },
  designResult: {
    type: Array,
    default: () => [],
  },
  selectFormItems: {
    type: Array,
    default: () => [],
  },
  orthogonalDesign: {
    type: Object,
    default: () => {},
  },
  readonly: {
    type: Boolean,
    default: false,
  },
})
const current = ref(0)

const columns = ref([])

const lazyLoadingData = ref(false)
const tableRef = ref()
const tableEnhancedRef = ref()
const table_data = ref([])
const selectedenhancedRowKeys = ref([])
const enhancedColumns = ref([
  {
    colKey: 'row-select',
    type: 'multiple',
    disabled: ()=> props.readonly ,
    width: 46,
    checkProps: ({ row }) => ({
      checked: designTreeChecked.value.includes(row[rowKey]),
    }),
  },
  {
    title: '工艺路线',
    colKey: 'name',
    minWidth: 200,
    cell: 'defaultValueSlot',
  },
])
const rowKey = 'rowKey'
// 非必须，如果不传，表格有内置树形节点展开逻辑
const expandedTreeNodes = ref([])
const treeConfig = reactive({
  childrenKey: 'formItems',
  treeNodeColumnIndex: 1,
  indent: 25,
  expandTreeNodeOnClick: true,
})

const customTreeExpandAndFoldIcon = ref(false)
const treeExpandAndFoldIconRender = (h, { type, row }) => {
  if (row.formItems && row.formItems.length > 0) {
    if (
      lazyLoadingData.value &&
      lazyLoadingData.value[rowKey] === row[rowKey]
    ) {
      return <Loading size="14px" />
    }
    return type === 'expand' ? <ChevronRightIcon /> : <ChevronDownIcon />
  } else {
    return <span style="display:none;"></span>
  }
}

// 懒加载图标渲染
const lazyLoadingTreeIconRender = (h, params) => {
  const { type, row } = params
  if (row.formItems && row.formItems.length > 0) {
    if (lazyLoadingData.value && lazyLoadingData.value[rowKey] === row[rowKey]) {
      return <Loading size="14px" />;
    }
    return type === 'expand' ? <AddRectangleIcon /> : <MinusRectangleIcon />
  } else {
    return <span style="display:none;"></span>
  }
}
const treeExpandIcon = computed(() => {
  // 自定义展开图标
  if (!customTreeExpandAndFoldIcon.value) {
    return treeExpandAndFoldIconRender
  }
  return lazyLoadingTreeIconRender
})
const onExpandedTreeNodesChange = (expandedTreeNodes, context) => {
  console.log('------485-------', expandedTreeNodes, context)
  // 全选不需要处理；仅处理懒加载
  if (!context.rowState) return
  onTreeExpandChange(context)
}
const onTreeExpandChange = (context) => {
  console.log(
    '------491-------',
    context.rowState.expanded ? '展开' : '收起',
    context,
  )
}
const onEdenhancedSelectChange = (value, params) => {
  designTreeChecked.value = value
  if (params.currentRowData.formItems) {
    const rowKeys = params.currentRowData.formItems.map((item) => item[rowKey])
    if (params.type === 'check') {
      designTreeChecked.value = [
        ...new Set([...designTreeChecked.value, ...rowKeys]),
      ]
    } else {
      designTreeChecked.value = designTreeChecked.value.filter(
        (item) => !rowKeys.includes(item),
      )
    }
  }
  const filterFormItems = (items, selectedKeys) => {
    return items.map(item => {
      // 如果 rowKey 不在 selectedKeys 中，直接跳过该项
      if (!selectedKeys.includes(item.rowKey) && !item.formItems.some(formItem => selectedKeys.includes(formItem.rowKey))) {
        return null;
      }

      // 过滤 formItems，保留 rowKey 在 selectedKeys 中的子项
      const filteredFormItems = item.formItems.filter(formItem => selectedKeys.includes(formItem.rowKey));

      // 返回符合条件的数据结构
      return {
        ...item,
        formItems: filteredFormItems
      };
    }).filter(Boolean); // 移除 null 值
  };

  _selectFormItems.value = filterFormItems( cloneDeep(_designParams.value.formItems) , designTreeChecked.value);
  console.log('-----331----onSelec1tChange----------',designTreeChecked.value, _selectFormItems.value)

  _designResult.value = _designResult.value.map((item) => {
    return {
      ...item,
      check: designTreeChecked.value.includes(item[rowKey.value]),
    }
  })
  console.log('-----220----onSelect1Change----------', _designResult.value)
}

const selectedRowKeys = ref([])
const designTreeChecked = ref([])

const _designResult = computed({
  get() {
    return props.designResult || []
  },
  set(value) {
    emits('update:designResult', value)
  },
})

const _selectFormItems = computed({
  get() {
    return props.selectFormItems || []
  },
  set(value) {
    emits('update:selectFormItems', value)
  },
})

const _orthogonalDesign = computed({
  get() {
    return props.orthogonalDesign || {}
  },
  set(value) {
    emits('update:orthogonalDesign', value)
  },
})

// 生成数据组数
_orthogonalDesign.value = { cycleNumber: 1, stepItems: [] }

const _designParams = ref([])

watch(
  _designParams.value,
  (val) => {
    if (val) {
      console.log('-------_designParams--------161-----', val)
      if (val.formItems && val.formItems.length > 0) {
        console.log(
          '-------_designParams--designTreeChecked------156-----',
          designTreeChecked.value,
          val,
        )
        emits('update:designParams', val)
      }
    }
  },
  { immediate: true },
)

console.log('-------78-----props----', props)

const designTypeOptions = [
  { label: '自定义', value: '自定义', disabled: true },
  { label: '正交设计', value: '正交设计', disabled: true },
  { label: '响应面法', value: '响应面法', disabled: true },
  { label: '中心复合', value: '中心复合', disabled: true },
]

const designType = ref(['自定义'])

const getParentRowKeys = (row, data) => {
  // console.log('------getParentRowKeys----', row, data)
  const parentKeys = []
  const findParentKeys = (node, targetRow) => {
    const node_formItems = node.formItems ? node.formItems : node.attribute
    if (node_formItems) {
      for (const child of node_formItems) {
        if (child.rowKey === targetRow.rowKey) {
          parentKeys.push(node.attribute ? node.rowKey : node.key)
          return true
        }
        if (findParentKeys(child, targetRow)) {
          parentKeys.push(node.attribute ? node.rowKey : node.key)
          return true
        }
      }
    }
    return false
  }

  for (const item of data) {
    if (findParentKeys(item, row)) {
      break
    }
  }
  // console.log('------getParentRowKeys----', parentKeys)

  return [...parentKeys.reverse(), row.key].join('.')
}

const onSelectChange = (value, params) => {
  selectedRowKeys.value = value
  console.log('-----318----onSelectChange----------', value, params)
  // _designParams.formItems里面数据过滤selectedRowKeys.value.includes(item.rowKey),_designParams.formItems子项里面的数据也要过滤selectedRowKeys.value.includes(item.rowKey),相当于一直递归formItems值

  const filterFormItems = (items, selectedKeys) => {
    return items
      .filter(item => selectedKeys.includes(item.rowKey))
      .map(item => ({
        ...item,
        formItems: item.formItems ? filterFormItems(item.formItems, selectedKeys) : []
      }));
  };

  _selectFormItems.value = filterFormItems(cloneDeep(_designParams.value.formItems) , selectedRowKeys.value);
  console.log('-----331----onSelectChange----------', _selectFormItems.value)
  _designResult.value = _designResult.value.map((item) => {
    return { ...item, check: selectedRowKeys.value.includes(item.id) }
  })
}

const onSubmit = (row) => {
  console.log('-------formData----------', _designParams.value, row)
  _designResult.value.push(row)
  selectedRowKeys.value = [...selectedRowKeys.value, row.id]
}

function isNumber(value) {
  // 使用 Number 构造函数将值转换为数字
  const num = Number(value)

  // 判断转换后的值是否为数字，并且不是 NaN
  return !isNaN(num)
}

const getTreeData = (formItems, designTreeChecked) => {
  const treeData = []
  if (!formItems) return []
  formItems.map((ele) => {
    if (ele.formItems && ele.formItems.length > 0) {
      const obj = {
        ...ele,
        title: ele.title ? ele.title : ele.name,
        formItems: [],
      }
      obj.formItems = getTreeData(ele.formItems, designTreeChecked)
      if (obj.rowKey) {
        designTreeChecked.push(obj.rowKey)
        expandedTreeNodes.value.push(obj.rowKey)
      }
      treeData.push(obj)
    } else {
      if (ele.rowKey) {
        designTreeChecked.push(ele.rowKey)
      }
      treeData.push({ ...ele, title: ele.title ? ele.title : ele.name })
    }
  })
  console.log('------425-----_designParams----------', treeData)
  return treeData
}

onMounted(() => {
  designTreeChecked.value = []
  expandedTreeNodes.value = []
  if (
    props.designParams?.formItems &&
    props.designParams.formItems.length > 0
  ) {
    _designParams.value = {
      ...props.designParams,
      formItems: getTreeData(
        props.designParams.formItems,
        designTreeChecked.value,
      ),
    }
    _selectFormItems.value = [...props.designParams.formItems]
  }
  console.log(
    '------439-----_designParams----------',
    designTreeChecked.value,
    _designParams.value,
  )
})
</script>
<style lang="less" scoped>
:deep(.umo-table__content) {
  border-top: 1px #333 solid;
}
.steps-demos-extra {
  .t-button + .t-button {
    margin-left: 4px;
  }
}
:deep(.umo-list-item-main) {
  justify-content: flex-start;
  gap: 20px;
}
:deep(.umo-list-item) {
  padding: 6px 0;
}
</style>