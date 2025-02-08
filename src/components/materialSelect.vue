<template>
  <EnhancedTable
    ref="MTTableRef"
    :columns="columns"
    :data="data"
    :selected-row-keys="selectedRowKeys"
    :tree="treeConfig"
    :pagination="pagination"
    :tree-expand-and-fold-icon="treeExpandIcon"
    :row-key="rowKey"
    size="small"
    lazy-load
    @select-change="onSelectChange"
    @pageChange="onPageChange"
  >
    <template #topContent>
      <div
        style="margin-bottom: 10px; display: flex; flex-direction: row-reverse"
      >
        <t-input
          v-model="searchText"
          placeholder="请输入物料名称"
          style="width: 200px"
          @change="onSearch"
        >
          <template #suffixIcon>
            <search-icon :style="{ cursor: 'pointer' }" />
          </template>
        </t-input>
      </div>
    </template>
<!--    <template #name="{ row }">-->
<!--      <span>{{ row.name }}</span>-->
<!--      <t-tag size="small">{{ row.sn }}</t-tag>-->
<!--    </template>-->
  </EnhancedTable>
</template>
<script setup lang="jsx">
import { ref, onMounted } from 'vue'
import { getIngredient_dev_materialListFetch } from '@/api/material'
import { EnhancedTable } from 'tdesign-vue-next'
import {
  SearchIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  AddRectangleIcon,
  MinusRectangleIcon,
} from 'tdesign-icons-vue-next'

const emits = defineEmits(['selectChange'])
const treeConfig = reactive({
  childrenKey: 'children',
  treeNodeColumnIndex: 2,
  indent: 25,
  expandTreeNodeOnClick: true,
  defaultExpandAll: true,
})
const expandedTreeNodes = ref([])
const MTTableRef = ref()
const columns = [
  {
    colKey: 'row-select',
    type: 'multiple',
    disabled: ({ row }) => {
      return row.children && row.children.length > 0
    },
    width: 46,
  },
  {
    title: '编号',
    colKey: 'sn',
    width: 120,
    ellipsis: true,
  },
  {
    colKey: 'name',
    title: '物料',
    ellipsis: true,
    // cell: (h, { row, rowIndex }) => {
    //   const status = rowIndex % 3;
    //   return (
    //     <div>
    //       <span>{row.name}</span>
    //       <t-tag size="small">{row.sn}</t-tag>
    //     </div>
    //   );
    // },
    minWidth: 120,
  },
  {
    colKey: 'batch',
    title: '批次',
    width: 170,
  },
  {
    colKey: 'supplier',
    title: '供应商',
    width: 160,
  },
  // {
  //   colKey: 'price',
  //   title: '价格',
  //   width: 90,
  // },
  {
    colKey: 'brand',
    title: '品牌',
    width: 120,
  },
  {
    colKey: 'brand_mode',
    title: '品牌型号',
    width: 120,
  },
  {
    colKey: 'cas',
    title: 'CAS号',
    width: 120,
  },
  {
    colKey: 'description',
    title: '描述',
    minWidth: 100,
  },
]

const searchText = ref('')
const data = ref([])
const isLoading = ref(false)
const selectedRowKeys = ref([])
// 懒加载图标渲染
const lazyLoadingTreeIconRender = (h, params) => {
  const { type, row } = params
  return type === 'expand' ? <ChevronRightIcon /> : <ChevronDownIcon />
}
const treeExpandIcon = computed(() => {
  return lazyLoadingTreeIconRender
})
const pagination = ref({
  defaultPageSize: 10,
  total: 0,
  defaultCurrent: 1,
})

const fetchData = async (paginationInfo, search = '') => {
  try {
    isLoading.value = true
    const { current, pageSize } = paginationInfo
    // 请求可能存在跨域问题
    let params = { page: current, limit: pageSize }
    if (search && search !== '') {
      params.keyword = search
    }
    const res = await getIngredient_dev_materialListFetch(params)

    if (res.data.code === 2000) {
      data.value = res.data.data
      // 数据加载完成，设置数据总条数
      pagination.value.total = res.data.total
      MTTableRef.value?.expandAll()
    } else {
      data.value = []
    }
  } catch (err) {
    data.value = []
  }
  isLoading.value = false
}
const fetchTableData = async ({ page, limit, keyword }) => {
  const response = await getIngredient_dev_materialListFetch({
    page,
    limit,
    keyword,
  })
  return response.data
}
const onSearch = async () => {
  await fetchData(
    {
      current: 1,
      pageSize: pagination.value.pageSize || pagination.value.defaultPageSize,
    },
    searchText.value,
  )
}

// BaseTable 中只有 page-change 事件，没有 change 事件
const rehandleChange = (changeParams, triggerAndData) => {}

// BaseTable 中只有 page-change 事件，没有 change 事件
const onPageChange = async (pageInfo) => {
  // 下面为受控方式，如果使用此方式，将pagination内的defaultCurrent改为current
  // pagination.value.current = pageInfo.current;
  // pagination.value.pageSize = pageInfo.pageSize;
  await fetchData(pageInfo)
}

onMounted(async () => {
  await fetchData({
    current: pagination.value.current || pagination.value.defaultCurrent,
    pageSize: pagination.value.pageSize || pagination.value.defaultPageSize,
  })
})

const onSelectChange = (value, params) => {
  console.log('onSelectChange-----------222---------', value, params)
  selectedRowKeys.value = value

  emits('selectChange', { value, params })
}

const rowKey = 'id'
</script>
<style lang="scss" scoped></style>
