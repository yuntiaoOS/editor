<template>
  <node-view-wrapper :id="node.attrs.id" class="umo-node-view">
    <div
      ref="containerRef"
      class="umo-node-container "
      :class="node.attrs.theme"
      style="border-bottom:1px solid #ddd;margin-bottom: 10px;"
    >
      <h1 v-if="!isEdit && title && title.length>0" @click="HeditFunc">{{ title }}</h1>
      <t-input 
        v-else ref="xmTitleRef" v-model="title" autofocus borderless placeholder="标题" size="large" :inputClass="['xmTitleClass']" 
        @blur="tInputBlur" />
      <div style="padding:7px;" > </div>
      <div v-if="showSubTitle && experiment_record && experiment_record.id" style=" display: flex; align-items: center; justify-content: space-between; ">
        <!-- <t-avatar-group size="small" :max="2">
          <t-avatar v-for="participant in experiment_record.participants" :image="participant.avatar" >{{participant.name}}</t-avatar>
        </t-avatar-group> -->
        <div style="display:flex;align-items: center;gap:20px;padding:5px;">
          <t-popup 
            v-if="experiment_record.participants"
            trigger="click"
            placement="bottom"
            destroyOnClose
            hideEmptyPopup
          >
            <t-icon name="usergroup" size="14px" style="color: #a0a0a0"/> 
            <span class="Font12Color" style="margin-left:4px;">{{formatParticipants(experiment_record.participants)}} </span>
            <div style="" > </div>
            <template #content>
              <div style="padding:10px;">
                <div v-if="experiment_record.participants" style="padding-bottom: 4px;" >
                  <span class="Font12Color">编辑者（{{experiment_record.participants.length}}）</span>
                </div>
                <div v-for=" participant in experiment_record.participants " :key="participant.id" style="padding-bottom: 6px;">
                  <t-space size="10px">
                    <t-avatar size="20px" shape="round" :image="participant.avatar"> {{participant.name}} </t-avatar>
                    <span class="Font12Color" >{{participant.name}}</span>
                    <t-tag 
                      v-if="participant.is_creator" style="margin-left:16px;"
                      theme="primary" size="small" shape="round" variant="outline">创建者</t-tag>
                  </t-space>
                </div>
              </div>
              
            </template> 

          </t-popup>
          <div ><t-icon name="time" size="13px" style="color: #a0a0a0;margin-right:4px;"/><span class="Font12Color">{{experiment_record.create_datetime}}</span> </div>
        </div>
        <t-popup 
          v-if="experiment_record.participants"
          trigger="click"
          placement="bottom"
          destroyOnClose
          hideEmptyPopup
        >
          <t-icon name="book-open" size="14px" style="color: #a0a0a0"/> 
          <span class="Font12Color" style="margin-left:4px;">{{experiment_record.participants.length}} </span>
          <div style="" > </div>
          <template #content>
            <div v-if="experiment_record.participants" style="padding:10px;">
              <div style="padding-bottom: 4px;">
                <span class="Font12Color">阅读者（{{experiment_record.participants.length}}）</span>
              </div>
              <div v-for=" participant in experiment_record.participants " :key="participant.id" style="padding-bottom: 6px;">
                <t-space size="10px">
                  <t-avatar size="20px" shape="round" :image="participant.avatar"> {{participant.name}} </t-avatar>
                  <span class="Font12Color" >{{participant.name}}</span>
                </t-space>
              </div>
            </div>
            
          </template> 

        </t-popup>
        
      </div>
    </div>
  </node-view-wrapper>
</template>

<script setup lang="ts">

import { nodeViewProps, NodeViewWrapper ,NodeViewContent} from '@tiptap/vue-3'

const { node, updateAttributes } = defineProps(nodeViewProps)

const { options } = useStore()

const isEdit = ref(false)

const xmTitleRef = ref()

const showSubTitle = ref(true)

const title = computed({
  get: () => node.attrs.title,
  set(value: string) {
    updateAttributes({ title: value })
  },
})

const experiment_record = computed({
  get: () => node.attrs.experiment_record,
  set(value: any) {
    updateAttributes({ experiment_record: value })
  },
})

const formatParticipants = (participants:any[]) => {
  const names = participants.map(participant => participant.name);
  const firstTwoNames = names.slice(0, 2).join('、');
  const totalCount = participants.length;

  return `${firstTwoNames} 等${totalCount}人编辑`;
};

const HeditFunc = () => {
  isEdit.value = true
  if (xmTitleRef.value) {
    xmTitleRef.value.$el.focus()
  } else {
    setTimeout(() => {
      xmTitleRef.value.$el.focus()
    } , 10)
  }
}
const tInputBlur = () => {
  isEdit.value = false
}
onMounted(() => {
  
})
onBeforeUnmount(() => {
   
})

</script>

<style lang="less" scoped>
h1 {
  font-size: 32px;
  font-weight:bold;
}
.Font12Color {
  font-size: 12px;
  color: #a0a0a0;
}
:deep( .xmTitleClass) {
  border: none !important;
  padding: 0;
  .umo-input__inner {
    font-size:32px;
    font-weight:bold;
  }
}

</style>
