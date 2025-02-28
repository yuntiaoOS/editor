<template>
  <node-view-wrapper :id="node.attrs.id" class="umo-node-view">
    <div
      ref="containerRef"
      class="umo-node-container umo-hover-shadow umo-select-outline umo-node-code-block"
      :class="node.attrs.theme"
    >
      <node-view-content class="content" > </node-view-content>
    </div>
  </node-view-wrapper>
</template>

<script setup lang="ts">

import { nodeViewProps, NodeViewWrapper ,NodeViewContent} from '@tiptap/vue-3'

const { node, updateAttributes } = defineProps(nodeViewProps)

const options = inject('options')

onMounted(() => {

})
onBeforeUnmount(() => {

})

</script>

<style lang="less">
@import '@/assets/styles/_mixins.less';

</style>
