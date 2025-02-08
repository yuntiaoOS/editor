<template>
  <node-view-wrapper :id="node.attrs.id" class="umo-node-view">
    <div style="width: 100%">
      <!-- <h2>试验原辅料</h2> -->
      <t-table
        ref="tableRef" :loading="loading"
        row-key="id" :data="table_data" :columns="columns" resizable v-model:displayColumns="displayColumns"
        >
        <template #topContent>
          <div style="padding: 6px 0;display: block;">
            <t-space>
              <div>
                <span  v-if="false" :title=" isChanged?'未保存':'已保存' " style="width: 10px; height: 10px; border-radius: 50%;" :style="{background:isChanged? 'var(--td-error-color)' : 'var(--td-success-color)'}"></span>
                <t-input v-if="false" v-model="_title" label="名称：" size="large" autofocus autoWidth borderless placeholder="请输入物料名称" />
              </div>
              <t-space>
                <t-button variant="outline" @click="addFunc">对比</t-button>
                <div v-if="false" title="修改时间"><t-icon name="time" size="13px" style="color: #a0a0a0;margin-right:4px;"/><span class="Font12Color">{{updateTime}}</span> </div>
                <t-button title="设置" variant="outline" @click="columnEditFunc"><template #icon> <t-icon name="setting" size="18px"></t-icon></template></t-button>
              </t-space>
            </t-space>
          </div>
        </template>
        <template #type-slot-sort="{ col, row , rowIndex}">
          <t-space>
            <t-icon v-if="rowIndex!==0" name="order-ascending" size="18px"></t-icon>
            <div v-else></div>
            <t-icon v-if="rowIndex!==table_data.length-1" name="order-descending" size="18px"></t-icon>
          </t-space>

        </template>
      </t-table>
<!--      <node-view-content :node="node" ></node-view-content>-->
    </div>
    <t-dialog destroyOnClose
      v-model:visible="add_dialog_visible"
      header="选择对比样品"
      width="40%" attach="body"
      :confirm-on-enter="true"
      :on-confirm="on_select_parentFunc"
    >
      <t-select
        v-model="_selectSamples"
        :options="sampleOptions"
        filterable
        multiple
        :keys="{ label: 'name', value: 'id' }"
        placeholder="请选择样品"
      />
    </t-dialog>
    <t-dialog destroyOnClose
      v-model:visible="dialog_visible"
      header="表格列配置"
      width="40%" attach="body"
      :confirm-on-enter="true"
      :on-confirm="onConfirmFunc"
    >
      <t-space direction="vertical" style="width: 100%">
        <div>
          <p>请选择需要在表格中显示的数据列</p>
        </div>
        <t-card header-bordered :style="{ width: '400px' }">
          <template #header>
            <t-checkbox :checked="checkAll" :indeterminate="indeterminate" :on-change="handleSelectAll">全选</t-checkbox>
          </template>
          <template #content>
            <t-checkbox-group v-model="displayColumnsC" label="title" value="colKey" :options="columnsCheckboxs" />
          </template>

        </t-card>
      </t-space>
    </t-dialog>
  </node-view-wrapper>
</template>

<script setup lang="jsx">
import { nodeViewProps, NodeViewWrapper,NodeViewContent } from '@tiptap/vue-3'
import { post_experiment_material_fetch ,get_experiment_material_fetch} from '@/api/experiment'
import { v4 as uuid } from 'uuid'
import { timeFormat } from '@/utils/time-ago'
import cloneDeep from 'lodash/cloneDeep.js'

const { node, editor, updateAttributes } = defineProps(nodeViewProps)

const { options ,editedComponentType} = useStore()
const $key_data = JSON.parse( localStorage.getItem('key_data'))
const experiment_record = computed(() => $key_data?.experiment_record)
const experiment_theme = computed(() => $key_data?.experiment_theme)

const dialog_visible = ref(false);
const tableRef = ref();

const loading = ref(false)
const searchTitle = ref('')
const add_dialog_visible = ref(false);
const add_parent_visible = ref(false);
const raw_materialOptions = ref([])
const sampleOptions = ref([])
const dialog_select = ref([])

const _title = computed({
  get: () => node.attrs.title,
  set(value) {
    updateAttributes({ title: value })
  },
})

const _params = computed({
  get: () => node.attrs.params,
  set(value) {
    updateAttributes({ params: value })
  },
})

const _selectSamples = computed({
  get: () => node.attrs.selectSamples,
  set(value) {
    updateAttributes({ selectSamples: value })
  },
})

const table_data = ref([])

const  addFunc = () => {
  getSampleOptions()
  add_dialog_visible.value = true
}

// ====================== 核心转换函数 ======================
function transformData(data) {
  // 1. 生成 columns
  const columns = [
    { colKey: 'index', title: '指标', width: 100 }, // 固定第一列
    ...data.map(item => ({
      colKey: item.id,
      title: item.name,
      width: 100
    }))
  ];

  // 2. 收集所有出现过的 index_type（根据 id 去重，或根据 title 去重都可以）
  //   这里以 index_type.id 做唯一标识
  const indexTypesMap = new Map();

  // 记录保持插入顺序，以便后续 table_data 的行顺序与出现顺序一致
  // （当然你也可以对 index_type.title 排序）
  data.forEach(sample => {
    const tableData = sample.record_table?.table_data || [];
    tableData.forEach(item => {
      if (!indexTypesMap.has(item.index_type.id)) {
        indexTypesMap.set(item.index_type.id, item.index_type);
      }
    });
  });

  // 3. 构造 table_data
  //   - 每一个 indexType 作为一行
  //   - 行的 key 为 { index: indexType.title, [sampleId]: data + unit, ... }
  const table_data = [];

  // 把 indexTypesMap 转换为数组并保持插入顺序
  const allIndexTypes = Array.from(indexTypesMap.values());

  // 对每个 index_type 创建一行
  for (const indexType of allIndexTypes) {
    const row = { index: indexType.title };
    const keyForUnit = indexType.key + '_unit'; // 如 'lab_l_unit', 'lab_a_unit' 等

    // 再对每个样品，填充这一行的数据
    data.forEach(sample => {
      let cellValue = '';

      // 在每个样品的 table_data 中找与当前 indexType.id 对应的记录
      const found = sample.record_table?.table_data?.find(
        item => item.index_type.id === indexType.id
      );

      if (found) {
        // 取 data 字段
        const baseValue = found.data || '';
        // 动态取 unit 值，比如 "lab_l_unit"
        const unitValue = found[keyForUnit] || '';
        cellValue = unitValue&&unitValue.length>0? `${baseValue}（${unitValue}）` : baseValue;
      }

      // 把结果放进 row
      row[sample.id] = cellValue;
    });

    table_data.push(row);
  }

  return { columns, table_data };
}

const makeTableData = ()=>{
  let record_table_data = []
  const selectSamples = sampleOptions.value.filter((ele) => _selectSamples.value.includes(ele.id))
  // const samples_record = selectSamples?.map((ele) => ele.record_table)
  // record_table_data = samples_record.map((ele) => ele.table_data).reduce((pre, cur) => pre.concat(cur), [])
  //
  // const uniqueIndexTypes = {};
  // record_table_data.forEach(item => {
  //   const indexType = item.index_type;
  //   uniqueIndexTypes[indexType.id] = indexType;
  // });
  // const result = Object.values(uniqueIndexTypes);

  const result = transformData(selectSamples);
  console.log('columns = ', result.columns);
  console.log('table_data = ', result.table_data);
  console.log('--------------table_data-----------',selectSamples,result)
  columns.value = result?.columns
  table_data.value = cloneDeep(result?.table_data)
  displayColumns.value = columns.value.map((ele) => ele.colKey)

}

const on_select_parentFunc = ()=>{
  // const selectSamples = sampleOptions.value.filter((ele) => dialog_select.value.includes(ele.id))
  // const samples_record = selectSamples?.map((ele) => ele.record_table)
  // const table_data = samples_record.map((ele) => ele.table_data).reduce((pre, cur) => pre.concat(cur), [])
  // console.log('--------------table_data-----------', table_data)
  makeTableData()
  add_dialog_visible.value = false
}


const columns = ref([])

const columnsCheckboxs = ref([])

const displayColumns = ref([]);
const displayColumnsC = ref([]);
displayColumns.value = ['index', 'description']
columns.value = [
  {
    colKey: 'index',
    title: '指标',
    width: 100,
  },
];

const checkAll = computed(() => displayColumns.value.length === displayColumnsC.value.length);
const indeterminate = computed(() => !!(displayColumns.value.length > displayColumnsC.value.length && displayColumnsC.value.length));

const handleSelectAll = (checked) => {
  displayColumnsC.value = checked ? [ ...displayColumns.value ] : [];
}

const onConfirmFunc = ()=>{
  displayColumns.value = [ ...displayColumnsC.value ]
  dialog_visible.value = false
}

const columnEditFunc = ()=>{
  columnsCheckboxs.value = columns.value.map((col )=>{ return { label:col.title, value:col.colKey } })
  displayColumnsC.value = [ ...displayColumns.value ]
  dialog_visible.value = true
}

const getSampleOptions = ()=>{
  const docD = cloneDeep(editor.getJSON())
  if (docD) {
    const test_record_table = docD.content.filter(
      (ele) => ele.type === 'test_record_table',
    )
    if (test_record_table.length === 0) {
      TMessagePlugin.warning('请先在试验记录表中出样')
      table_data.value = []
      loading.value = false
      return false// 物料表不存在，返回
    }
    const sample_table = test_record_table
      .map((ele) => ele.attrs.table_data)
      .reduce((pre, cur) => pre.concat(cur), [])
      .filter((ele) => ele.is_sample)
      .map((ele) => ele.sample)

    sampleOptions.value = cloneDeep(sample_table)
    if (sample_table.length === 0) {
      TMessagePlugin.warning('请先在试验记录表中出样')
      table_data.value = []
      loading.value = false
      return false
    }
    console.log('--------------sample_table-----------', sampleOptions.value)
    return true
  } else {
    TMessagePlugin.warning('当前文档中没有数据错误')
    return false
  }
}

const initData = () => {
  loading.value = true

  const docD = getSampleOptions()
  if (docD) {
    console.log('--------------sample_table-----------', sampleOptions.value)
    if (_selectSamples.value && _selectSamples.value?.length > 0) {

    }

  }
  loading.value = false
}

onMounted( () => {
  initData()
})


onBeforeUnmount(() => {
  table_data.value = []


})

</script>

<style lang="scss" scoped>
:deep(.umo-table__top-content) {
  div{
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 4px;
    justify-content: space-between;
    .umo-table__column-controller-trigger {
      padding: 10px 0;
    }
  }
}
:deep(.umo-table--column-resizable:not(.umo-table--bordered) th) {
  border-top: 1px solid #333;
}

</style>
