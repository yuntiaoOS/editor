<template>
  <node-view-wrapper :id="node.attrs.id" class="umo-node-view" :class=" { 't-is-disabled':readOnly,'umo-is-disabled':readOnly } ">
    <div
      ref="containerRef"
      class="umo-node-container umo-hover-shadow umo-select-outline "
      :class="node.attrs.theme"
    >
      <node-view-content class="content" ></node-view-content>
    </div>
  </node-view-wrapper>
</template>

<script setup lang="ts">

import { nodeViewProps, NodeViewWrapper ,NodeViewContent} from '@tiptap/vue-3'

const { node, updateAttributes } = defineProps(nodeViewProps)

const options = inject('options')
const readOnly = computed(() => options.value.document?.readOnly)
const title = computed(() => node.attrs.title)
const content = computed(() => node.attrs.content)

onMounted(() => {

})
onBeforeUnmount(() => {

})

</script>

<style lang="less" scoped>
@import '@/assets/styles/_mixins.less';
.umo-node-view {
  display: block;
  .content {
    width: 100%;
    background-color: #f5f6f7;
    border-radius: 5px;
  }
 }

</style>
