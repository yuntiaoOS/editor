<template>
  <node-view-wrapper :id="node.attrs.id" class="umo-node-view">
    <div v-if="_config && _config.type">
      <xm-input v-model="_value" :config="_config"/>
    </div>
    <node-view-content :node="node" ></node-view-content> 
  </node-view-wrapper>
</template>

<script setup lang="ts">
import { nodeViewProps, NodeViewWrapper,NodeViewContent } from '@tiptap/vue-3'


const { node, updateAttributes } = defineProps(nodeViewProps)

const { options } = useStore()

const _value = computed({
  get: () => {
    const value = node.attrs.formData[node.attrs.config.key]
    if (value) {
      return value
    }else{
      if (node.attrs.config.type === 'SelectPlusRadio') {
        return {}
      }else if (node.attrs.config.type === 'SelectPlus') {
        return []
      }else if (node.attrs.config.type === 'Score') {
        return 0
      }else{
        return ''
      }
    }
  },
  set: (val:any) => {
    const formData :any = {..._formData.value, [node.attrs.config.key]: val}
    updateAttributes({ formData })
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

<style lang="less" scoped>
.tdesign-demo__select-input-ul-borderless {
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.tdesign-demo__select-input-ul-borderless > li {
  display: block;
  border-radius: 3px;
  line-height: 22px;
  cursor: pointer;
  padding: 3px 8px;
  color: var(--td-text-color-primary);
  transition: background-color 0.2s linear;
  white-space: nowrap;
  word-wrap: normal;
  overflow: hidden;
  text-overflow: ellipsis;
}

.tdesign-demo__select-input-ul-borderless > li:hover {
  background-color: var(--td-bg-color-container-hover);
}
</style>