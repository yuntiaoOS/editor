<!-- 试验方法设计 -->
<template>
  <!-- <t-steps layout="vertical" :current="current" status="process" class="steps-demos-extra">
    <t-step-item title="设计方式" content="选择实验设计方式类型">
      <template #extra> -->
        <t-space direction="vertical">
          <t-space direction="vertical">
            <t-check-tag-group v-model="designType" style="margin-right: 32px" :options="designTypeOptions" @change="current = 0;">选中/未选态</t-check-tag-group>
            <div style="width: calc(80vw - 100px);" >
              <t-checkbox disabled>为设定的默认显示上一次实验参数（也可以选择来源于某个样品）</t-checkbox>
              <t-tree 
                ref="designTreeRef" v-model="designTreeChecked"
                :data="_designParams.formItems"  :keys="{ value: 'rowKey', label: 'title', children: 'formItems' }"
                activable  expandParent activeMultiple expandAll 
                allowFoldNodeOnFilter checkable  line @change="treeSelectChange">  
                <template #label="{ node }">
                  <div style="display:flex;gap:10px;">
                    <span :style="{color: node.data.type ?'blue' :'var(--umo-text-color-primary)' ,width: '150px'}">{{ node.label }}</span>
                    <div v-if="node.isLeaf()" >
                      <xmFormDesignRender style="overflow: auto;"
                        v-model="_designParams.formData"
                        :valueKey="getNodeFullColKey(node)"
                        :mode=" 'RESP'"
                        :config="node.data">
                      </xmFormDesignRender>
                    </div>
                  </div>
                </template>
              </t-tree>
            </div>
          </t-space>
          <t-button v-if="false" size="small" variant="base" @click="typeSelectNext"> 下一步 </t-button>
        </t-space>
      <!-- </template>
    </t-step-item>
    <t-step-item title="实验数据" content="选择正交表确定实验">
      <template #extra>
        <t-space v-if="current === 1" direction="vertical">
          <div>
            <t-table
              ref="tableRef" :selected-row-keys="selectedRowKeys"
              row-key="id" :data="_designResult" :columns="columns" resizable  
              @select-change="onSelectChange"
              >
              <template #topContent>
                <div style="padding: 6px 0;display: block;">
                  <t-space>
                    <div> &nbsp; </div>
                      <t-button variant="outline" @click="onAdd">添加数据</t-button>
      
                  </t-space>
                </div>
              </template>
              <template #defaultValueSlot="slotProps">
                <div >
                  <xmFormDesignRender style="overflow: auto;"
                    v-model="slotProps.row"
                    :label="slotProps.col.title"
                    :valueKey="slotProps.col.colKey"
                    :mode=" 'RESP'"
                    :config="slotProps.col.attrs">
                  </xmFormDesignRender>
                </div>
              </template>
            </t-table>
          </div>
          <t-space align="center">
            <t-button size="small" variant="text" @click=" designType.includes('自定义') ? current = 0 : current--"> 上一步 </t-button>
          
          </t-space>
        </t-space>
      </template>
    </t-step-item>
  </t-steps> -->
  <editSampleView v-if="add_dialog_visible" v-model:dialog-visible="add_dialog_visible" :design-params="_designParams" @onSubmit="onSubmit" />
    
</template>

<script setup lang="jsx">
import { ref } from 'vue';
import { v4 as uuid } from 'uuid'
import { getFieldValue } from '@/utils/index';
import xmInput from './xm-input.vue';
import { timeFormat } from '@/utils/time-ago'

const emits = defineEmits(['update:designParams', 'update:designResult','update:selectFormItems', 'change']);
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
});
const current = ref(0);

const columns = ref([]);
const add_dialog_visible = ref(false);

const columnsDefault = [
  {
    colKey: 'row-select',
    type: 'multiple',
    width: 46,
    checkProps: ({ row }) => ({ checked:  selectedRowKeys.value.includes(row.id) }),
  },
  {
    title: '序号',
    colKey: 'serial-number',
    width: 40,
  },
]

const designTreeRef = ref();
const selectedRowKeys = ref([]);
const designTreeChecked = ref([]);
const cycleNumber = ref(0);

const _designResult = computed({
  get() {
    return props.designResult || [];
  },
  set(value) {
    emits('update:designResult', value);
  },
});

const _selectFormItems = computed({
  get() {
    return props.selectFormItems || [];
  },
  set(value) {
    emits('update:selectFormItems', value);
  },
});

const _designParams = ref([])

function filterFormItems(nodes, targetIds) {
  const result = [];

  for (const node of nodes) {
    // 对每个节点进行递归处理
    const filteredChildren = node.formItems && node.formItems.length > 0 
      ? filterFormItems(node.formItems, targetIds) 
      : [];
    
    // 判断当前节点是否在目标列表中，或者其子节点中有目标节点
    if (targetIds.includes(node.rowKey) || filteredChildren.length > 0) {
      result.push({
        ...node,
        formItems: filteredChildren
      });
    }
  }

  return result;
}

const treeSelectChange = (keys) => {
  const formItems = filterFormItems(_designParams.value.formItems, designTreeChecked.value);
  console.log('-------treeSelectChange------',formItems,keys);
  _selectFormItems.value = formItems;
  // emits('change', formItems);
}

watch(_designParams.value, (val) => {
  if (val) {
    console.log('-------_designParams--------161-----',val);
    if (val.formItems && val.formItems.length > 0) {
      console.log('-------_designParams--designTreeChecked------156-----',designTreeChecked.value,val);
      emits('update:designParams', val);
    }
    
  }
}, { immediate: true });

console.log('-------78-----props----',props);

const designTypeOptions = [
  { label: '自定义', value: '自定义' , disabled: true },
  { label: '正交设计', value: '正交设计' , disabled: true},
  { label: '响应面法', value: '响应面法' , disabled: true},
  { label: '中心复合', value: '中心复合' , disabled: true},
]

const designType = ref(['自定义']);

const typeSelectNext = ()=>{
  console.log("typeSelectNext----------------------",current.value,_designParams)
  // designType.value === '自定义' 时 current.value跳到下下步
  if (designType.value.includes('自定义')  && current.value === 0) {
    makeTableFunc()
  } else if (designType.value.includes('正交设计') && current.value === 0) {
    
  } else if (designType.value.includes('响应面法') && current.value === 0) {
    
  } else if (designType.value.includes('中心复合') && current.value === 0) {
    
  } else {
     
  }
  current.value = 1
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
  // console.log('keys:-----204---', keyStr);
  return keyStr? keyStr : ''
}

const onSelectChange = (value, params) => {
  selectedRowKeys.value = value;
  console.log('-----195----onSelectChange----------',value, params);
  _designResult.value = _designResult.value.map((item) => { 
    return { ...item, check: selectedRowKeys.value.includes(item.id)}
  });
};

const blurCycleNumberFunc = (val) => {
  if (Number(val) > 100) cycleNumber.value = 100;
  if (Number(val) < 1) cycleNumber.value = 0;
}

const onAdd = () => {
  add_dialog_visible.value = true;
}

const onSubmit = (row) => {
  console.log('-------formData----------',_designParams.value, row);
  _designResult.value.push(row);
  selectedRowKeys.value = [...selectedRowKeys.value, row.id]
}

function addDecimals(str1, str2,index,attribute_type) {
  const addresult = (str1, str2) => { 
    console.log('---------304----addresult------',str1, str2,)
    if (( !str1 || str1.length === 0 || str1 === 'NaN') && ( !str2 || str2.length === 0 || str2 === 'NaN') ) return '0';
    if ( !str1 || str1.length === 0 || str1 === 'NaN') return str2;
    if ( !str2 || str2.length === 0 || str2 === 'NaN') return str1;
    try {
      let result = ''
      // 将小数转换为整数
      const factor = 10 ** Math.max(str1.split('.')[1]?.length || 0, str2.split('.')[1]?.length || 0);
      const num1 = BigInt(str1.replace('.', '')) * BigInt(factor);
      const num2 = BigInt(str2.replace('.', '')) * BigInt(factor);

      // 相加
      const sum = num1 + num2;

      // 将结果转换回小数
      result = `${(sum / BigInt(factor)).toString()  }.${  (sum % BigInt(factor)).toString().padStart(Math.log10(factor), '0')}`;

      return result;
    } catch (error) {
      return str1
    }
    
  }
  console.log('-------140-----addDecimals----------',str1, str2,attribute_type);
  if (attribute_type === 'compound'){ 
    const resD = {};
    for (const key in str1) {
      if (key.includes( XM_raw_material_key) ) {
        resD[key] = str1[key]
      }else{
        resD[key] = addresult(str1[key], String(index * str1[key]) )
      }
      
    }
    console.log('-------339-----addDecimals----------',str1, str2,attribute_type);
    return resD
  }else{
    return addresult(str1, String(index * str2))
  }
  
}

function isNumber(value) {
      // 使用 Number 构造函数将值转换为数字
  const num = Number(value)
  
  // 判断转换后的值是否为数字，并且不是 NaN
  return !isNaN(num)
}
const FormDesignRenderComponent = resolveComponent('FormDesignRender');
const makeTableFunc = () => {
  console.log('-------260-----makeTableFunc----------', _designParams.value );

  const selectedRK = [];
  // 递归函数，生成多级表头的 columns
  function generateColumns(formItems, parentKey = '',parent) {
    return formItems.map(item => {
      // 如果存在父级 key，则拼接父级 key 和当前 key
      const itemKey = parent?.type && parent.type === 'FieldsGroup' ?  item.id : item.key;
      const currentKey = parentKey ? `${parentKey}.${itemKey}` : itemKey;

      const column = {
        title: item.title,
        colKey: currentKey,
        attrs: item,
        minWidth: 100,
        cell: 'defaultValueSlot',
        // cell: (h , { row, rowIndex , col} ) => {
        //   if (!item.formItems ) {
        //     return (
        //       <FormDesignRender
        //           value={getFieldValue(col.key,row )}
        //           label={col.title}
        //           mode="RESP"
        //           config={col.attrs}
        //           onChange={(value) => {
        //             // row.form.formData[item.key] = value;
        //           }}
        //         />
        //     )
        //   }
        // }
      };

      // 如果当前项有子 formItems，递归生成 children
      if (item.formItems && item.formItems.length > 0) {
        column.children = generateColumns(item.formItems, currentKey,item);
      }

      return column;
    });
  }

  // 主逻辑：生成 columns
  const paramsColumns = generateColumns(_designParams.value.formItems,'',_designParams.value);
  // console.log('--------366---_designParams.value----------', paramsColumns);


  columns.value = [...columnsDefault, ...paramsColumns];
  // console.log('--------151----_designParams.value----------', _designResult.value, columns.value);

  const designResult = [];
  // for (let i = 0; i < cycleNumber.value; i++) {
  //   const obj = { check: true, name: '' };
  //   obj.id = uuid();
  //   obj.name = `样品-${timeFormat(null,'yyyymmddhhMMss')}`
  //   _designParams.value.forEach(item => {
  //     if (item.step) {
  //       if (!item.key.includes(XM_raw_material_key)) {
  //         obj[item.key] = addDecimals(item.value, item.step, i, item.attribute_type);
  //         obj[`${item.key}_id`] = item.id;
  //       } else {
  //         obj[item.key] = item.step;
  //         obj[`${item.key}_id`] = item.id;
  //         obj.name = item.props.options
  //           ? item.props.options
  //               .filter(eleO => item.step.includes(eleO.id))
  //               .map(eleO => eleO.name)
  //               .join('/')
  //           : '';
  //       }
  //     } else {
  //       if (!item.key.includes(XM_raw_material_key)) {
  //         obj[item.key] = item.value;
  //         obj[`${item.key}_id`] = item.id;
  //       } else {
  //         obj[item.key] = item.step;
  //         obj[`${item.key}_id`] = item.id;
  //       }
  //     }
  //     obj.raw_material = item.raw_material;
  //     obj.technology = item.technology;
  //   });
  //   designResult.push(obj);
  //   selectedRK.push(obj.id);
  // }

  // _designResult.value = [...designResult];
  selectedRowKeys.value = [...selectedRK];
  // console.log('------155------_designParams.value----------', selectedRK, selectedRowKeys.value, designResult, _designResult.value);
};

const getTreeData = (formItems,designTreeChecked) => {
  const treeData = [];
  if (!formItems) return [];
  formItems.map(ele => {
    if (ele.type === 'FieldsGroup') {
      const obj = { ...ele, title: ele.title ? ele.title : ele.name, formItems: [] };
      obj.formItems = getTreeData(ele.props.items,designTreeChecked);
      if (obj.rowKey) designTreeChecked.push(obj.rowKey);
      treeData.push(obj);
    } else {
      if (ele.formItems && ele.formItems.length > 0) {
        const obj = { ...ele, title: ele.title ? ele.title : ele.name, formItems: [] };
        obj.formItems = getTreeData(ele.formItems,designTreeChecked);
        if (obj.rowKey) designTreeChecked.push(obj.rowKey);
        treeData.push(obj);
      } else {
        if (ele.rowKey) designTreeChecked.push(ele.rowKey);
        treeData.push({ ...ele , title: ele.title ? ele.title : ele.name });
      }
    }
  })
  // console.log('------425-----_designParams----------',treeData);
  return treeData;
};

onMounted(() => {
  designTreeChecked.value = [];
  if (props.designParams?.formItems && props.designParams.formItems.length > 0) {
    _designParams.value = {
      ...props.designParams,
      formItems: getTreeData(props.designParams.formItems,designTreeChecked.value)
    };
    _selectFormItems.value = [...props.designParams.formItems];
    
  }
  console.log('------439-----_designParams----------',designTreeChecked.value, _designParams.value);
})

</script>
<style lang="less" scoped>
:deep(.umo-table__content){
  border-top: 1px #333 solid;
}
.steps-demos-extra {
  .t-button + .t-button {
    margin-left: 4px;
  }
}
:deep(.umo-list-item-main){
  justify-content: flex-start;
  gap: 20px;
}
:deep(.umo-list-item) {
  padding: 6px 0;
}
</style>