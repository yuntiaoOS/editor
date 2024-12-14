<template>
  <menus-button
    :ico="icon"
    :text="text"
    huge
    @menu-click="dialogVisible = true"
  >
    <modal
      :visible="dialogVisible"
      :ico="icon"
      :header="`插入${text}`"
      width="480px"
      :confirm-btn="t('insert.web.insert')"
      @confirm="confirmFunc"
      @close="dialogVisible = false"
    >
      <div class="umo-web-page-container">
        <t-select
          v-model="selectData"
          :options="selectOptions"
          filterable
          multiple
          :keys="{ label: 'name', value: 'id' }"  
          placeholder="请选择操作"
          :scroll="{type: 'virtual'}"  
          :popup-props="{ overlayInnerStyle: { height: '300px' } }"  
          :status=" selectData !== '' ? 'success': 'error' "
          :tips="selectData !== '' ? '校验通过': '操作不能为空'"
        />
      </div>
    </modal>
  </menus-button>
</template>

<script setup lang="ts">

const { editor } = useStore()
const props = defineProps({
  tableType: {
    type: String,
    default: Xm_Table_key['raw_material_table'],
  },
})

const icon = computed(() => {
  switch (props.tableType) {
    case Xm_Table_key['raw_material_table']:
      return 't-table'
    case Xm_Table_key['technology_table']:
      return 't-table'
    case Xm_Table_key['sample_table']:
      return 'sample'
    default:
      return 't-table'
  }
})

const text = computed(() => {
  switch (props.tableType) {
    case Xm_Table_key['raw_material_table']:
      return '原材料表格'
    case Xm_Table_key['technology_table']:
      return '工艺路线'
    case Xm_Table_key['sample_table']:
      return '样品表格'
    default:
      return '原材料表格'
  }
})

const func = computed(() => {
  switch (props.tableType) {
    case Xm_Table_key['raw_material_table']:
      return ()=> editor?.chain().focus().addRaw_material_tables().run()
    case Xm_Table_key['technology_table']:
      return ()=> editor?.chain().focus().addTechnology_tables().run()
    case Xm_Table_key['sample_table']:
      return ()=> editor?.chain().focus().addSample_tables().run()
    default:
      return ()=> editor?.chain().focus().addRaw_material_tables().run()
  }
})


let dialogVisible = $ref(false)
let selectData = $ref('')
let error = $ref(false)

const selectOptions = ref([])

const confirmFunc = () => {
  if (!editor.value) {
    return
  }
  if (
    selectData === '' ||
    (!selectData.startsWith('http://') && !selectData.startsWith('https://'))
  ) {
    error = true
    return
  }
  func.value()
  error = false
  dialogVisible = false
}
watch(
  () => dialogVisible,
  (val: boolean) => {
    if (!val) {
      selectData = ''
      error = false
    }
  },
)
</script>

<style lang="less" scoped>
.umo-web-page {
  &-container {
    padding: 2px;
  }
  &-tip {
    color: var(--umo-text-color-light);
    margin-bottom: 10px;
  }
}
</style>
