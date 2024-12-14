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
                <span :title=" isChanged?'未保存':'已保存' " style="width: 10px; height: 10px; border-radius: 50%;" :style="{background:isChanged? 'var(--td-error-color)' : 'var(--td-success-color)'}"></span>
              </div>
              <t-space>
                <t-input v-if="false" v-model="searchTitle" auto-width placeholder="请输入原材料名称" />
                <t-button variant="outline" @click="addFunc">新增</t-button>
                <div v-if="updateTime&&updateTime.length>10" title="修改时间"><t-icon name="time" size="13px" style="color: #a0a0a0;margin-right:4px;"/><span class="Font12Color">{{updateTime}}</span> </div>
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
        <template #type-slot-operate="{ col, row }">
          <div class="table-operations">
            <!-- <t-link v-if="!editableRowKeys.includes(row.id)" theme="primary" hover="color" @click.stop="onEdit(row)">
              编辑
            </t-link>
            <div v-else>
              <t-link theme="primary" hover="color" @click.stop="onSave(row)">
                保存
              </t-link>
              <t-link theme="primary" hover="color" @click.stop="onCancel(row)">
                取消
              </t-link>
            </div> -->
            <t-popconfirm content="确认删除吗" @confirm="() => onDelete(row)" >
              <t-button title="删除" theme="danger" shape="square" variant="text" >删除</t-button>
            </t-popconfirm>
          </div>
        </template>
      </t-table>
      <node-view-content :node="node" ></node-view-content> 
    </div>
    <t-dialog destroyOnClose
      v-model:visible="add_dialog_visible"
      header="新增原材料"
      width="80%" attach="body"
      :confirm-on-enter="true"
      :on-confirm="on_select_materialFunc"
    >
      <materialSelect @select-change="onSelectChange"/>
    </t-dialog>
    <t-dialog destroyOnClose 
      v-model:visible="add_parent_visible"
      header="选择原材料表"
      width="40%" attach="body"
      :confirm-on-enter="true"
      :on-confirm="on_select_parentFunc"
    >
      <t-select
        v-model="dialog_select"
        :options="raw_materialOptions"
        filterable
        multiple
        :keys="{ label: 'title', value: 'id' }"  
        placeholder="请选择操作"
        :scroll="{type: 'virtual'}"  
        :popup-props="{ overlayInnerStyle: { height: '300px' } }"  
        :status=" dialog_select !== '' ? 'success': 'error' "
        :tips="dialog_select !== '' ? '校验通过': '操作不能为空'"
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
import { post_experiment_material_fetch,put_experiment_material_fetch,delete_material_multiple_deleteFetch ,get_experiment_material_fetch} from '@/api/experiment'
import { timeFormat } from '@/utils/time-ago'

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
const select_material = ref([])
const dialog_select = ref('')

const isChanged = computed({
  get: () => node.attrs.isChanged,
  set(value) {
    updateAttributes({ isChanged: value })
  },
})

const updateTime = computed({
  get: () => node.attrs.updateTime,
  set(value) {
    updateAttributes({ updateTime: value })
  },
})

const table_data = computed({
  get: () => node.attrs.table_data,
  set(value) {
    updateAttributes({ table_data: value })
  },
})

const change_log = computed({
  get: () => node.attrs.change_log,
  set(value) {
    updateAttributes({ change_log: value })
  },
})

const is_integration = computed({
  get: () => node.attrs.is_integration,
  set(value) {
    updateAttributes({ is_integration: value })
  },
})

const  addFunc = () => {

  add_dialog_visible.value = true
}

const onSelectChange = ({value, params} )=>{
  console.log('--------onSelectChange--------44--------',value, params,change_log.value)
  select_material.value = params.selectedRowData
}

const on_select_parentFunc = async ()=>{
  const params = {
    parent: dialog_select.value
  }
  isChanged.value = true
  const res = await post_experiment_material_fetch(params)
  if (res.data.code === 2000) {
    useMessage('success' ,res.data.msg);
    await initData()
  }
  add_parent_visible.value = false
}

const on_select_materialFunc = async ()=>{
  console.log('--------on_select_materialFunc--------161--------',change_log.value)
  const params = {
    experiment_theme: experiment_theme.value?.id,
    record: experiment_record.value?.id,
    parent: change_log.value?.change_log,
    identifier: undefined,  // 标识 非必填
    experiment_materials: select_material.value.map(ele=>{ return { experiment_material: ele.id } })
  }
  select_material.value.forEach((ele ) => {
    const obj  = {
      ...ele,
      // content: '0.0',
    }
    // table_data.value.push(obj)
  });
  isChanged.value = true
  const res = await post_experiment_material_fetch(params)
  add_dialog_visible.value = false
  if (res.data.code === 2000) {
    useMessage('success' ,res.data.msg);
    change_log.value = {
      change_log: res.data.data.change_log
    }
    updateTime.value = timeFormat(null,'yyyy-mm-dd hh:MM:ss')
    // table_data.value = res.data.data.data
    await initData()
  }
  console.log('--------onSelectChange--------119--------',table_data.value)
  // setReadOnly()
}

const onDelete = async (row) => {
  console.log('--------onDelete--------44--------',row)
  const params = {
    change_log: change_log.value?.change_log,
    // change_log: row.change_log,  // 标识 非必填
    ids: row.id
  }
  isChanged.value = true
  const res = await delete_material_multiple_deleteFetch(params)
  if (res.data.code === 2000) {
    useMessage('success' ,res.data.msg);
    change_log.value = {
      change_log: res.data.data.change_log
    }
    updateTime.value = timeFormat(null,'yyyy-mm-dd hh:MM:ss')
    await initData()
  }
  // const index = table_data.value.findIndex((t ) => t === row);
  // table_data.value.splice(index, 1);
  // setReadOnly(false)
};

const columns = ref([])

const columnsCheckboxs = ref([])

const displayColumns = ref([]);
const displayColumnsC = ref([]);
displayColumns.value = ['experiment_material_name','experiment_material_batch', 'experiment_material_supplier', 'experiment_material_price', 'description', 'operate']
columns.value = [
  {
    colKey: 'experiment_material_name',
    title: '原材料',
    cell: (h , { row, rowIndex } ) => {
      const status = rowIndex % 3;
      return (
        <div>
          <span>{row.experiment_material_name ? row.experiment_material_name : ''}</span>
          <t-tag size="small">{row.experiment_material_sn ? row.experiment_material_sn : ''}</t-tag>
        </div>
      );
    },
    minWidth: 120,
  },
  {
    colKey: 'experiment_material_batch',
    title: '批次',
    width: 170,
  },
  {
    colKey: 'experiment_material_supplier',
    title: '供应商',
    width: 160,
  },
  {
    colKey: 'experiment_material_price',
    title: '价格',
    width: 90,
  },
  // {
  //   colKey: 'cas',
  //   title: 'CAS号',
  //   width: 120,
  // },
  {
    colKey: 'description',
    title: '描述',
    ellipsis: true,
    minWidth: 100,
    edit: {
      // 1. 支持任意组件。需保证组件包含 `value` 和 `onChange` 两个属性，且 onChange 的第一个参数值为 new value。
      // 2. 如果希望支持校验，组件还需包含 `status` 和 `tips` 属性。具体 API 含义参考 Input 组件
      component: TTextarea,
      // props, 透传全部属性到 Input 组件
      props: {
        clearable: true,
        autofocus: true,
        // autoWidth: true,
        autosize: true,
      },
      // 校验规则，此处同 Form 表单
      rules: [
        {
          required: false,
          message: '不能为空',
        },
      ],
      showEditIcon: true,
      abortEditOnEvent: ['onEnter','onBlur'],
      onEdited: async (context ) => {
        console.log(context);
        // const newData = [...table_data.value];
        // newData.splice(context.rowIndex, 1, context.newRowData);
        // table_data.value = newData;
        // console.log('Edit firstName:', context);
        const params = {
          change_log: change_log.value?.change_log,
          id: context.row.id,
          description: context.newRowData.description,
          experiment_material: context.row.experiment_material,
          experiment_material_batch: context.row.experiment_material_batch,
        }
        isChanged.value = true
        const res = await put_experiment_material_fetch(context.row.id,params)
        if (res.data.code === 2000) {
          useMessage('success' ,res.data.msg);
          change_log.value = {
            change_log: res.data.data.change_log
          }
          updateTime.value = timeFormat(null,'yyyy-mm-dd hh:MM:ss')
          await initData()
        }
        // setReadOnly()
      },
      // 触发校验的时机（when to validate)
      validateTrigger: 'change',
      // 透传给 component: Input 的事件（也可以在 edit.props 中添加）
      on: (editContext ) => ({
        onBlur: (ctx ) => {
          console.log('失去焦点', editContext);
          ctx?.e?.preventDefault();
        },
        onEnter: (ctx ) => {
          ctx?.e?.preventDefault();
          console.log('onEnter', ctx);
        },
        // 默认是否为编辑状态
        defaultEditable: true,
      }),
    },
  },
  {
    title: '操作栏',
    colKey: 'operate',
    width: 80,
    cell: 'type-slot-operate',
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

const setReadOnly = (readOnly = true) => {
  if (options.value.document) {
    options.value.document.readOnly = readOnly
    editedComponentType.value = node.type.name
  }
}

const initData = async () => {
  loading.value = true
  const params = {
    change_log: change_log.value?.change_log,
  }
  console.log('----------initData-----297---------',params)
  const res = await get_experiment_material_fetch(params)
  loading.value = false
  if (res.data.code === 2000 && res.data.data.length > 0) {
    table_data.value = res.data.data
    if (isChanged.value) { isChanged.value = false } 
  }
}

onMounted(async () => {
  if (change_log.value?.change_log && table_data.value?.length === 0) {
    console.log('----------change_log.value395---------',table_data.value,change_log.value);
    await initData()
  }else if(is_integration.value) {
    
    const docD = editor.getJSON()
    if (docD ) {
      // 原材料表
      const raw_material_tables = docD.content.filter(ele=> ele.type === 'raw_material_table')
      if (raw_material_tables.length === 0) {
        // TMessagePlugin.warning('请先创建原材料表')
        return  // 原材料表不存在，返回
      }
      raw_materialOptions.value = raw_material_tables.map(ele=> ele.attrs)
      const dialog = useConfirm({
        theme: 'info',
        header: '提示',
        body: '检测到当前文档中存在原材料表，是否使用该原材料表进行初始化？',
        confirmBtn: '确定',
        onConfirm() {
          dialog.destroy()
          setTimeout(() => {
            add_parent_visible.value = true
          }, 300)
        },
        onClosed() {
          
        },
      })
      
    }else {
      TMessagePlugin.warning('当前文档中没有数据')
    }
  }
  if ( is_integration.value) {
    is_integration.value = false
  }
  
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
