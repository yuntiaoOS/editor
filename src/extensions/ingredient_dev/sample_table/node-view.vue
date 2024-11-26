<template>
  <node-view-wrapper :id="node.attrs.id" class="umo-node-view">
    <div style="width: 100%">
      <!-- <h2>样品</h2> -->
      <t-table 
        ref="tableRef"  :loading="loading"
        row-key="id" :data="table_data" :columns="columns" resizable v-model:displayColumns="displayColumns"
         >
        <template #topContent>
          <div style="padding: 6px 0;display: block;">
            <t-space>
              <div></div>
              <t-space>
                <t-input v-if="false" v-model="searchTitle" auto-width placeholder="请输入样品名称" />
                <t-button v-if="false" theme="warning" variant="outline" @click="experimental_design_visible = true;">试验方法设计</t-button>
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
    <t-dialog destroyOnClose :closeOnOverlayClick="false"
      v-model:visible="experimental_design_visible"
      header="试验方法设计" :cancelBtn="null"
      width="80%" attach="body"
      :confirm-on-enter="true"
      :on-confirm="on_experimental_designFunc"
    >
      <experimental-design v-if="experimental_design_visible" v-model:design-params="_designParams" v-model:design-result="designResult" @select-change="onSelectChange"/>
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
import { v4 as uuid } from 'uuid'
import { getIngredient_dev_experimentListFetch,delete_experiment_samplesFetch,get_experiment_samplesListFetch ,put_experiment_samples_fetch } from '@/api/experiment'
import { timeFormat } from '@/utils/time-ago'

const { editor, node, updateAttributes } = defineProps(nodeViewProps)

const { options } = useStore()
const dialog_visible = ref(false);
const tableRef = ref();
const editableRowKeys = ref([]);
const currentSaveId = ref('');
// 保存变化过的行信息
const editMap  = {};
const loading = ref(false);
const searchTitle = ref('')

const $key_data = JSON.parse( localStorage.getItem('key_data'))
const experiment_record = computed(() => $key_data?.experiment_record)
const experiment_theme = computed(() => $key_data?.experiment_theme)

const experimental_design_visible = ref(false);

const select_material = ref([])

const updateTime = computed({
  get: () => node.attrs.updateTime,
  set(value) {
    updateAttributes({ updateTime: value })
  },
})
const is_integration = computed({
  get: () => node.attrs.is_integration,
  set(value) {
    updateAttributes({ is_integration: value })
  },
})
const group = computed({
  get: () => node.attrs.group,
  set(value) {
    updateAttributes({ group: value })
  },
})

const _designParams = computed({
  get: () => {
    const oldDesignParams = node.attrs.designParams
    console.log('------116--------oldDesignParams------',oldDesignParams)
    const docD = editor.getJSON()
    let designParams = []
    if (docD) {
      // 原材料表
      const raw_material_tables = docD.content.filter(ele=> ele.type === 'raw_material_table')
      // 工艺表
      const technology_tables = docD.content.filter(ele=> ele.type === 'technology_table')
      if (technology_tables.length > 0) {
        const [technology_table] = technology_tables
        const table_data  = technology_table.attrs.table_data.map(eleT => eleT.children)
        console.log('--------_designParams--------145--------',table_data)
        let material_options = []
        if (raw_material_tables.length > 0) {
          const [raw_material_table] = raw_material_tables
          console.log('-------130-------raw_material_table----------',raw_material_table)
          console.log('-------131-------raw_material_table----------',raw_material_table.attrs.table_data)
          material_options = Object.assign([],raw_material_table.attrs.table_data).map(ele=> { return { ...ele,name: ele.experiment_material_name + '/' + ele.experiment_material_sn } }) 
        }
        if (table_data.length > 0) {
          console.log('--------_designParams--------138--------',table_data,table_data.reduce((a, b) => a.concat(b)))
          designParams = table_data.reduce((a, b) => a.concat(b)).map(eleT => { 
            if (eleT.key === XM_raw_material_key) {
              return { 
                ...eleT,step:'',check:true,
                raw_material: raw_material_tables[0].attrs.key,
                technology: technology_tables[0].attrs.key,
                type: 'SelectPlus',
                label: eleT.name,
                value: eleT.id,
                props: {
                  ...eleT.props,
                  labelKey: 'name',
                  valueKey: 'id',
                  options: material_options
                },
              }
            } else {
              return {...eleT,step:'',check:true}
            }
            
          })
          nextTick(()=>{
            if (oldDesignParams && oldDesignParams.length > 0) {
              // 遍历数组 b，查找并更新数组 a 中的对象
              oldDesignParams.forEach(itemB => {
                const itemA = designParams.find(itemA => itemA.id === itemB.id);
                if (itemA) {
                  itemA.step = itemB.step;
                }
              });
            }
          })
        }
      }
    }else {
      designParams = oldDesignParams
    }
    console.log('-------192-------designParams----------',designParams)
    return designParams
  },
  set(value) {
    console.log('------172--------updateAttributes({ designParams: value })------',value)
    updateAttributes({ designParams: value })
  },
})

const designResult = ref([])

const table_data = computed({
  get: () => node.attrs.table_data,
  set(value) {
    updateAttributes({ table_data: value })
  },
})

const onSelectChange = ({value, params} )=>{
  // console.log('--------onSelectChange--------44--------',value, params)
  select_material.value = params.selectedRowData
}

const on_experimental_designFunc = async()=>{
  console.log('--------on_experimental_designFunc--------156--------',designResult.value,_designParams.value)
  const designParamsC =  Object.assign([],_designParams.value)
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
    const res = await post_experiment_samples_fetch(params)
    console.log('--------on_experimental_designFunc--------180--------',params,selectData,_designParams.value,designResult.value)
    if (res.data.code === 2000) {
      console.log('--------on_experimental_designFunc--------183--------',editor.state)
    
      table_data.value = [...table_data]
      experimental_design_visible.value = false
    }else{
      TMessagePlugin.warning(res.data.msg)
    }
  }else{
    TMessagePlugin.warning('请选择需要添加的数据')
  }
  nextTick(()=>{
    updateAttributes({ designParams:[ ..._designParams.value] })
  })
}

const onDelete = async(row) => {
  console.log('--------onDelete--------44--------',row)
  const params = {
    group: group.value,
  }
  const res = await delete_experiment_samplesFetch(row.id,params)
  if (res.data.code === 2000) {
    useMessage('success' ,res.data.msg);
    // group.value =  res.data.data.group
    updateTime.value = timeFormat(null,'yyyy-mm-dd hh:MM:ss')
    await initData()
  }

  // const index = table_data.value.findIndex((t ) => t === row);
  // table_data.value.splice(index, 1);
};

const columns = ref([])

const columnsCheckboxs = ref([])

const displayColumns = ref([]);
const displayColumnsC = ref([]);
displayColumns.value = ['name','sn', 'count','description', 'operate']
columns.value = [
  {
    colKey: 'name',
    title: '名称',
    edit: {
      // 1. 支持任意组件。需保证组件包含 `value` 和 `onChange` 两个属性，且 onChange 的第一个参数值为 new value。
      // 2. 如果希望支持校验，组件还需包含 `status` 和 `tips` 属性。具体 API 含义参考 Input 组件
      component: TInput,
      // props, 透传全部属性到 Input 组件
      props: {
        clearable: true,
        autofocus: true,
        // autoWidth: true,
      },
      // 校验规则，此处同 Form 表单
      rules: [
        {
          required: true,
          message: '不能为空',
        },
      ],
      showEditIcon: true,
      abortEditOnEvent: ['onEnter','onBlur'],
      onEdited: async (context ) => {
        console.log(context);
        const params = {
          name:context.newRowData.name,
          group: group.value
        }
        const res = await put_experiment_samples_fetch(context.row.id,params)
        if (res.data.code === 2000) {
          useMessage('success' ,res.data.msg);
          group.value =  res.data.data.group
          updateTime.value = timeFormat(null,'yyyy-mm-dd hh:MM:ss')
          // const newData = [...table_data.value];
          // newData.splice(context.rowIndex, 1, context.newRowData);
          // table_data.value = newData;
          await initData()
          console.log('Edit firstName:', context);
        }
        
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
        defaultEditable: false,
      }),
    },
    minWidth: 120,
  },
  {
    colKey: 'sn',
    title: '编号',
    width: 170,
  },
  {
    colKey: 'count',
    title: '数量',
    width: 160,
    edit: {
      // 1. 支持任意组件。需保证组件包含 `value` 和 `onChange` 两个属性，且 onChange 的第一个参数值为 new value。
      // 2. 如果希望支持校验，组件还需包含 `status` 和 `tips` 属性。具体 API 含义参考 Input 组件
      component: TInput,
      // props, 透传全部属性到 Input 组件
      props: {
        clearable: true,
        autofocus: true,
        // autoWidth: true,
      },
      // 校验规则，此处同 Form 表单
      rules: [
        {
          required: true,
          message: '不能为空',
        },
      ],
      showEditIcon: true,
      abortEditOnEvent: ['onEnter','onBlur'],
      onEdited: async (context ) => {
        console.log(context);
        const params = {
          count:context.newRowData.count,
          group: group.value
        }
        const res = await put_experiment_samples_fetch(context.row.id,params)
        if (res.data.code === 2000) {
          useMessage('success' ,res.data.msg);
          group.value =  res.data.data.group
          updateTime.value = timeFormat(null,'yyyy-mm-dd hh:MM:ss')
          await initData()
          console.log('Edit firstName:', context);
        }
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
        defaultEditable: false,
      }),
    },
  },
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
      onEdited:async (context ) => {
        console.log(context);
        const params = {
          description:context.newRowData.description,
          group: group.value
        }
        const res = await put_experiment_samples_fetch(context.row.id,params)
        if (res.data.code === 2000) {
          useMessage('success' ,res.data.msg);
          group.value =  res.data.data.group
          updateTime.value = timeFormat(null,'yyyy-mm-dd hh:MM:ss')
          await initData()
          console.log('Edit firstName:', context);
        }
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

const initData = async () => {
  loading.value = true
  const params = {
    experiment_theme: experiment_theme.value?.id,
    record: experiment_record.value?.id,
    group: group.value,
  }
  console.log('----------initData-----297---------',params)
  const res = await get_experiment_samplesListFetch(params)
  loading.value = false
  if (res.data.code === 2000 && res.data.data.length > 0) {
    table_data.value = res.data.data
  }
}

onMounted(async () => {
  if (group.value && group.value.length > 0 && table_data.value?.length === 0) {
    console.log('----------change_log.value499---------',group.value);
    await initData()
  }else if(is_integration.value) {
    
    const docD = editor.getJSON()
    if (docD ) {
      // 原材料表
      const raw_material_tables = docD.content.filter(ele=> ele.type === 'raw_material_table')
      if (raw_material_tables.length === 0) {
        TMessagePlugin.warning('请先创建原材料表')
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
