<script setup lang="jsx">
import { mergeRowsByFields } from '@/utils/index'
import cloneDeep from 'lodash/cloneDeep'

const emits = defineEmits(['update:modelValue', 'change'])
const props = defineProps({
  data: {
    type: Array,
    default: () => [],
  },
})
const table_data = ref([])
//   computed(() => {
//   let data = cloneDeep(props.data)
//   if (data.length > 0) {
//     data = data.map((ele) => {
//       ele.formItems = {
//         ...ele.formItems,
//         attribute: groupByRootKey(ele.formItems.attribute),
//       }
//       return ele
//     })
//   }
//   console.log('--------table_data-----44-------', data)
//   return data
// })

const checked = ref([])
const loading = ref(false)

const columns = [
  {
    title: '工序',
    colKey: 'procedure',
    width: 100,
    cell: (h, { row }) => {
      return row.procedure.title
    },
  },
  {
    colKey: 'operate_router',
    title: '工艺线路',
    width: 120,
    cell: (h, { row }) => {
      const theme =
        row.operateType === '物料'
          ? 'primary'
          : row.operateType === '样品'
            ? 'warning'
            : 'success'
      return (
        <div>
          {row.operateType !== '过程描述' && [
            <t-tag size="small" style="margin-right:6px;" theme={theme}>
              {row.operateType}
            </t-tag>,
          ]}
          <span>{row.operate_router.title}</span>
        </div>
      )
    },
  },
  {
    colKey: 'formItems',
    title: '工艺要求',
    width: 280,
    cell: 'type-slot-operate-router',
  },
]

const rowspanAndColspan = ({ row, col, rowIndex, colIndex }) => {
  if (colIndex > 1 && row.operateType === '过程描述') {
    if (colIndex === 2) {
      return { rowspan: 1, colspan: 2 }
    } else if (colIndex === 3) {
      return { rowspan: 0, colspan: 0 }
    } else {
      return { rowspan: 1, colspan: 1 }
    }
  } else {
    return mergeRowsByFields(
      ['procedure'],
      'procedure_rowKey',
      table_data.value,
    )({ row, col, rowIndex })
  }
}

function groupByRootKey(data) {
  return Object.values(
    data.reduce((groups, item) => {
      const rootKey = item.key.split('/')[0]; // 提取根 key
      if (!groups[rootKey]) {
        groups[rootKey] = { items: [], value: '' }; // 初始化分组对象
      }
      groups[rootKey].items.push(item); // 将当前项添加到对应的分组
      groups[rootKey].value = item.key;
      return groups;
    }, {})
  );
}
const onChange = (value) => {
  console.log('--------value-----', value)
  emits('change', table_data.value)
}
onMounted(()=>{
  let data = cloneDeep(props.data)
  if (data.length > 0) {
    table_data.value = data.map((ele) => {
      ele.formItems = {
        ...ele.formItems,
        attribute: groupByRootKey(ele.formItems.attribute),
      }
      return ele
    })
    emits('change', table_data.value)
  }
})
</script>

<template>
  <t-table
    :rowspan-and-colspan="rowspanAndColspan"
    ref="tableRef"
    :loading="loading"
    table-layout="auto"
    row-key="id"
    :data="table_data"
    :columns="columns"
  >
    <template #type-slot-operate-router="{ col, row, rowIndex }">
      <div class="operate-router-class">
        <t-space direction="vertical">
          <template v-for="(attribute, indexs) in row.formItems.attribute">
            <t-radio-group
              v-model="attribute.value"
              @change="onChange"
            >
              <template v-for="(item, index) in attribute.items">
                <t-radio :value="item.key">
                  <FormDesignRender
                    class="node-form-design-render-class"
                    v-model="row.formData[item.key]"
                    v-model:formData="row.formData"
                    style="overflow: auto"
                    :label="item.title + '：'"
                    :mode="'READ'"
                    :config="item"
                  >
                  </FormDesignRender>
                </t-radio>
              </template>
            </t-radio-group>
          </template>
        </t-space>
      </div>
    </template>
  </t-table>
</template>

<style scoped lang="scss"></style>
