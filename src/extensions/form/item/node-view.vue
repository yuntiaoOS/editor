<template>
  <node-view-wrapper :id="node.attrs.id" class="umo-node-view">
    <t-form-item
      :name="_config.key"
      :label="_config.title"
      :rules="_config.rules" >
      <node-view-content :node="node" style="width: 100%;"></node-view-content>
    </t-form-item>
  </node-view-wrapper>
</template>

<script setup lang="ts">
import { nodeViewProps, NodeViewWrapper,NodeViewContent } from '@tiptap/vue-3'


const { node, updateAttributes } = defineProps(nodeViewProps)

const options = inject('options')

const _value = computed({
  get: () => node.attrs.value,
  set: (val:any) => {
    updateAttributes({ value: val })
  }
})
const _formData = computed({
  get: () => node.attrs.formData,
  set: (val:any) => {
    updateAttributes({ formData: val })
  }
})

const _config = computed({
  get: () => node.attrs.config,
  set: (val:any) => {
    updateAttributes({ config: val })
  }
})


</script>

<style lang="scss" scoped>


</style>
