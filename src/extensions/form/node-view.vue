<template>
  <node-view-wrapper :id="node.attrs.id" class="umo-node-view">
    <div style="padding: 10px 0">
      <xm-form v-model:form-data="_formData" :show-submit-btn="showSubmitBtn" :config="_config" :on-submit="_onSubmit"/>
    </div>
  </node-view-wrapper>
</template>

<script setup lang="ts">
import { nodeViewProps, NodeViewWrapper,NodeViewContent } from '@tiptap/vue-3'

const { node, updateAttributes } = defineProps(nodeViewProps)

const { options } = useStore()


const showSubmitBtn = computed(() => {
  return _config.value?.formConfig?.showSubmitBtn
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

const _onSubmit = computed({
  get: () => node.attrs.onSubmit,

 })

</script>

<style lang="scss" scoped>
:deep( .umo-form__item ){
  background-color: #e8f2fe;
  padding:8px 5px;
  border-radius: 8px;
  .umo-input {
    background-color: #e8f2fe;
  }
}

</style>
