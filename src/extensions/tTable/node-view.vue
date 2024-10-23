<template>
  <node-view-wrapper :id="node.attrs.id" class="umo-node-view">
    <div style="width: 100%">
      <t-radio-group v-model="placement" variant="default-filled">
        <t-radio-button value="top-left">左上角</t-radio-button>
        <t-radio-button value="top-right">右上角</t-radio-button>
        <t-radio-button value="bottom-left">左下角</t-radio-button>
        <t-radio-button value="bottom-right">右下角</t-radio-button>
      </t-radio-group>
      <t-table :data="data" :columns="columns" :column-controller="columnControllerConfig" row-key="property">

      </t-table>
      <node-view-content :node="node" ></node-view-content> 
    </div>
    
    
  </node-view-wrapper>
</template>

<script setup lang="ts">
import { nodeViewProps, NodeViewWrapper,NodeViewContent } from '@tiptap/vue-3'

const { node, updateAttributes } = defineProps(nodeViewProps)

const { options } = useStore()


const data = [] as any;

for (let i = 0; i < 5; i++) {
  data.push({
    index: i + 1,
    applicant: ['贾明', '张三', '王芳'][i % 3],
    status: i % 3,
    channel: ['电子签署', '纸质签署', '纸质签署'][i % 3],
    email: ['w.cezkdudy@lhll.au', 'r.nmgw@peurezgn.sl', 'p.cumx@rampblpa.ru'][i % 3],
    matters: ['宣传物料制作费用', 'algolia 服务报销', '相关周边制作费', '激励奖品快递费'][i % 4],
    time: [2, 3, 1, 4][i % 4],
    createTime: ['2022-01-01', '2022-02-01', '2022-03-01', '2022-04-01', '2022-05-01'][i % 4],
  });
}

const columns = [
  {
    colKey: 'applicant',
    title: '申请人',
    // type-slot-name 会被用于自定义单元格的插槽名称
    cell: 'type-slot-name',
    width: 120,
  },
  {
    title: '审批状态',
    // 没有 cell 的情况下， platform 会被用作自定义单元格的插槽名称
    colKey: 'status',
    width: 120,
  },
  {
    colKey: 'matters',
    title: '申请事项',
  },
  {
    title: '邮箱地址',
    colKey: 'email',
    // render 即可渲染表头，也可以渲染单元格。但 cell 只能渲染单元格，title 只能渲染表头
  },
  { colKey: 'createTime', title: '申请时间' },
];
const placement = ref('top-right');
const customText = ref(false);
const groupColumn = ref(false);
const columnControllerConfig = computed(() => ({
  // 列配置按钮位置
  placement: placement.value,
  // 用于设置允许用户对哪些列进行显示或隐藏的控制，默认为全部字段
  fields: ['applicant', 'status', 'matters', 'email', 'createTime'],

  // 弹框组件属性透传
  dialogProps: { preventScrollThrough: true },
  // 列配置按钮组件属性透传
  buttonProps: customText.value ? { content: '显示列控制', theme: 'primary', variant: 'base' } : undefined,

  // 数据字段分组显示
  groupColumns: groupColumn.value
    ? [
        {
          label: '指标维度',
          value: 'index',
          columns: ['applicant', 'status'],
        },
        {
          label: '次要维度',
          value: 'secondary',
          columns: [ 'matters'],
        },
        {
          label: '数据维度',
          value: 'data',
          columns: ['email', 'createTime'],
        },
      ]
    : undefined,
}));

</script>

<style lang="less" scoped>

</style>
