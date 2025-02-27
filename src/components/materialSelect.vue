<script setup lang="jsx">
import { getIngredient_dev_materialListFetch } from '@/api/material'
import { ChevronRightIcon ,ChevronDownIcon } from 'tdesign-icons-vue-next';

const props = defineProps({
  selected: {
    type: Array,
    default: () => [],
  },
})

const treeConfig = reactive({
  childrenKey: 'children',
  treeNodeColumnIndex: 1,
  indent: 25,
  expandTreeNodeOnClick: true,
});
const expandedTreeNodes = ref([]);

const columns = ref([
  {
    colKey: 'checkbox',
    title: '',
    width: 36,
  },
  {
    colKey: 'sn',
    title: '编号',
    width: 140,
  },
  {
    colKey: 'name',
    title: '名称',
  },
  {
    colKey: 'batch',
    title: '批次',
  },
  { colKey: 'brand', width: 170, title: '品牌' },
  { colKey: 'brand_mode', width: 170, title: '品牌型号' },
  { colKey: 'creator_name', width: 100, title: '创建人' },
  { colKey: 'create_datetime', width: 200, title: '创建时间' },
])
const MTTableRef = ref()

const rowspanAndColspan = (ctx) => {
  // 如果  ctx.row 有 group 属性，合并这一行
  if (ctx.row.group) {
    return {
      colspan: [2,5],
    };
  }
};
const fetchTableData = async (obj) => {
  const response = await getIngredient_dev_materialListFetch(obj);
  return response.data;
};

const lazyLoadingTreeIconRender = (h, params) => {
  const { type, row } = params;
  return type === 'expand' ? <ChevronRightIcon /> : <ChevronDownIcon />;
};
const selected_list = computed(() => {
  //props.selected 对象数组里面的id
  return props.selected.map((item) => {
    return item.id;
  });
})
const onSelect = (checked, row) => {
  console.log(checked, row,"--------------------------------------------")
  if (checked) {
    const selected = props.selected;
    selected.push(row);
    emits('update:selected', selected);
  } else {
    const selected = props.selected.filter((item) => {
      return item.id !== row.id;
    });
    emits('update:selected', selected);
  }
}
const onReloadData = (pageConfig) => {
  setTimeout(() => {
    MTTableRef.value?.tableRef?.expandAll()
  }, 100);
}

const emits = defineEmits(['update:selected',]);
</script>

<template>
  <MTTable
    ref="MTTableRef"
    :columns="columns"
    :fetchData="fetchTableData"
    :treeConfig="treeConfig"
    :rowspan-and-colspan="rowspanAndColspan"
    :autoLoad="true"
    row-key="id"
    :tree-expand-and-fold-icon="lazyLoadingTreeIconRender"
    :pagination="true"
    size="small"
    @update:pageConfig="onReloadData"
  >

    <template #tool-bar>

    </template>
    <template #checkbox="{row}">
      <t-checkbox :checked="selected_list.includes(row.id)" @change="onSelect($event,row)" v-if="!row['group']"  />
    </template>

    <template #sn="{row}">
      <span v-if="row['group']">{{row.sn}}</span>
    </template>
    <template #name="{row}">
      <span v-if="row['group']" style="font-weight: 600;font-size:13px;">{{row.name}}</span>
      <span v-else>{{row.name}}</span>
    </template>

  </MTTable>
</template>

<style scoped>
#alice{
  width: calc(100vw - 1px - var(--nav-menu-width) - var(--td-pop-padding-l) * 4);
}
</style>
