<template>
  <node-view-wrapper :id="node.attrs.id" class="umo-node-view" :class=" { 't-is-disabled':readOnly,'umo-is-disabled':readOnly } ">
    <technology-table-node-view
      v-model:node="_node" :editor="editor" :get-attributes-function="getProcesses_attributeListFetch"
    :get-data-function="get_assign_record_process_dataFetch" :post-data-function="post_experiment_process_fetch"/>
  </node-view-wrapper>
</template>

<script setup lang="jsx">
import { nodeViewProps, NodeViewWrapper,NodeViewContent } from '@tiptap/vue-3'
import { get_assign_record_process_dataFetch,getProcesses_attributeListFetch,get_experiment_processListFetch,post_experiment_process_fetch } from '@/api/experiment'
const { node, editor, updateAttributes } = defineProps(nodeViewProps)

const _node = computed({
  get: () => node,
  set: (value) => {
    // Update the node in the editor
    updateAttributes(value)
  }
})

</script>

<style lang="scss" scoped>

</style>
