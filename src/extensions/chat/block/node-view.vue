<template>
  <node-view-wrapper :id="node.attrs.id" class="umo-node-view">
    <node-view-content class="umo-node-text-box-content" />
  </node-view-wrapper>
</template>

<script setup lang="ts">
import { NodeViewContent, nodeViewProps, NodeViewWrapper } from '@tiptap/vue-3'

const { node } = defineProps(nodeViewProps)
</script>

<style lang="less" scoped>
.umo-node-view {
  .umo-node-text-box-content {
    padding: 20px;
    position: relative;
    outline: solid 1px var(--umo-content-node-border);
    border-radius: var(--umo-content-node-radius);
    width: 100%;
  }
}

</style>
