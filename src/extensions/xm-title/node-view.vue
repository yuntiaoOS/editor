<template>
  <node-view-wrapper :id="node.attrs.id" class="umo-node-view" :class=" { 't-is-disabled':readOnly,'umo-is-disabled':readOnly } ">
    <div
      ref="containerRef"
      class="umo-node-container "
      :class="node.attrs.theme"
      style="border-bottom:1px solid #ddd;margin-bottom: 10px;"
    >
<!--      <t-row :gutter="6">-->
<!--        <t-col :span="6">-->
          <h1 v-if="!isEdit && title && title.length>0" @click="HeditFunc">{{ title }}</h1>
          <t-input
            v-else ref="xmTitleRef" v-model="title"
            :readonly="readOnly" autofocus borderless placeholder="标题" size="large" :inputClass="['xmTitleClass']"
            @blur="tInputBlur" />
<!--        </t-col>-->
<!--        <t-col :span="6">-->
          <div v-if="!isSnEdit && sn && sn.length>0" style="margin-top: 8px;display: flex;align-items: center;justify-content: flex-start;">
            <hashtag-icon style="margin-right: 10px;color:var(--umo-primary-color)"/>
            <h2 @click="HeditSnFunc">{{ sn }}</h2>
          </div>
          <t-input
            v-else ref="xmTitleSnRef" v-model="sn"
            :readonly="readOnly" autofocus borderless placeholder="实验测试编号" size="large" :inputClass="['xmTitleClass-sn']"
            @blur="tInputBlur"
          >
            <template #prefix-icon>
              <hashtag-icon />
            </template>
          </t-input>
<!--        </t-col>-->
<!--      </t-row>-->

      <div style="padding:7px;" > </div>
      <div v-if="showSubTitle && experiment_record && experiment_record.id" style=" display: flex; align-items: center; justify-content: space-between; ">
        <!-- <t-avatar-group size="small" :max="2">
          <t-avatar v-for="participant in experiment_record.participants" :image="participant.avatar" >{{participant.name}}</t-avatar>
        </t-avatar-group> -->
        <div style="display:flex;align-items: center;gap:20px;padding:5px;">
          <t-popup
            v-if=" false && experiment_record.experimenter"
            trigger="click"
            placement="bottom"
            destroyOnClose
            hideEmptyPopup
          >
            <t-icon name="usergroup" size="14px" style="color: #a0a0a0"/>
            <span class="Font12Color" style="margin-left:4px;cursor: pointer;">{{formatParticipants(experiment_record.experimenter)}} </span>
            <div style="" > </div>
            <template #content>
              <div style="padding:10px;">
                <div v-if="experiment_record.experimenter" style="padding-bottom: 4px;" >
                  <span class="Font12Color">编辑者（{{experiment_record.experimenter.length}}）</span>
                </div>
                <div v-for=" participant in experiment_record.experimenter " :key="participant.id" style="padding-bottom: 6px;">
                  <t-space size="10px">
                    <t-avatar size="20px" shape="round" :image="participant.avatar"> {{participant.name}} </t-avatar>
                    <span class="Font12Color" >{{participant.name}}</span>
                    <t-tag
                      v-if="participant.id === experiment_record.creator" style="margin-left:16px;"
                      theme="primary" size="small" shape="round" variant="outline">创建者</t-tag>
                  </t-space>
                </div>
              </div>

            </template>

          </t-popup>
          <div >
            <span style="cursor: pointer;" @click="()=> {historyDataInit();historyDataVisible = true ;}" ><t-icon name="time" size="13px" style="color: #a0a0a0;margin-right:4px;"/><span class="Font12Color">{{ current_update_datetime}}</span> </span>

            <t-popup
              v-if="false"
              trigger="click"
              placement="bottom"
              destroyOnClose
              hideEmptyPopup
              :on-visible-change=" (visible:boolean)=> visible && historyDataInit()"
            >
              <span style="cursor: pointer;" ><t-icon name="time" size="13px" style="color: #a0a0a0;margin-right:4px;"/><span class="Font12Color">{{ current_update_datetime}}</span> </span>
              <template #content>
                <div style="padding:10px;" >
                  <t-list v-if="historyData.length > 0" style="height: 300px" :scroll="{ type: 'virtual' }" >
                    <t-list-item v-for="(history, index) in historyData" :key="index">
                      <t-space size="10px" style="cursor: pointer;">
                        <t-avatar size="20px" shape="round" :image="history.history_user.avatar"> {{history.history_user.name}} </t-avatar>
                        <span class="Font12Color" >{{history.history_user.name}}</span>
                        <span class="Font12Color" >{{timeAgo(history.create_datetime)}}</span>
                      </t-space>
                      <template #action>
                        <span>
                          <t-link theme="primary" hover="color" style="margin-left: 16px" @click="transformDocContent(history)">还原</t-link>
                        </span>
                      </template>
                    </t-list-item>
                  </t-list>
                  <!-- <div v-for=" history in historyData " :key="history.id" style="padding-bottom: 6px;" @click="transformDocContent(history)">
                    <t-space size="10px" style="cursor: pointer;">
                      <t-avatar size="20px" shape="round" :image="history.history_user.avatar"> {{history.history_user.name}} </t-avatar>
                      <span class="Font12Color" >{{history.history_user.name}}</span>
                      <span class="Font12Color" >{{timeAgo(history.create_datetime)}}</span>
                    </t-space>
                  </div> -->
                </div>

              </template>

            </t-popup>

          </div>
        </div>
        <div style="display: flex;align-items: center;gap: 4px;">
          <t-popup
            v-if="visitorData"
            trigger="click"
            placement="bottom"
            destroyOnClose
            hideEmptyPopup
            :on-visible-change=" (visible:boolean)=> visible && visitorDataInit()"
          >
            <div style="cursor: pointer;">
              <t-icon name="book-open" size="14px" style="color: #a0a0a0"/>
              <span class="Font12Color" style="margin-left:4px;">{{visitorData.length}} </span>
            </div>
            <template #content>
              <div v-if="visitorData" style="padding:10px;">
                <div style="padding-bottom: 4px;">
                  <span class="Font12Color">阅读者（{{visitorData.length}}）</span>
                </div>
                <div v-for=" participant in visitorData" :key="participant.id" style="padding-bottom: 6px;">
                  <t-space size="10px">
                    <t-avatar size="20px" shape="round" :image="participant.user.avatar"> {{participant.user.name}} </t-avatar>
                    <span class="Font12Color" >{{participant.user.name}}</span>
                    <span class="Font12Color" >{{timeAgo(participant.update_datetime)}}</span>
                  </t-space>
                </div>
              </div>

            </template>

          </t-popup>
          <div class="Font12Color" style="margin-left:4px;">
            <t-icon name="hashtag" size="14px" style="color: #a0a0a0"></t-icon>
            <span title="创建时间">创建时间：{{experiment_record.create_datetime}} </span>
          </div>
        </div>


      </div>
    </div>

    <t-drawer
      v-model:visible="historyDataVisible"
      :closeBtn="true"
      destroyOnClose
      :closeOnOverlayClick="false"
      closeOnEscKeydown
      :footer="false"
      :show-overlay="false"
      header="修改记录"
    >
      <t-list style="height: calc( 100vh - 100px )" :scroll="{ type: 'virtual' }" >
        <t-list-item v-for="(history, index) in historyData" :key="index">
          <t-space size="10px" style="cursor: pointer;">
            <t-avatar size="20px" shape="round" :image="history.history_user.avatar"> {{history.history_user.name}} </t-avatar>
            <span class="Font12Color" >{{history.history_user.name}}</span>
            <span class="Font12Color" >{{timeAgo(history.create_datetime)}}</span>
          </t-space>
          <template #action>
            <span style="margin-right:10px;">
              <t-link theme="primary" hover="color" style="margin-left: 16px" @click="transformDocContent(history)">还原</t-link>
            </span>
          </template>
        </t-list-item>
      </t-list>
    </t-drawer>
  </node-view-wrapper>
</template>

<script setup lang="ts">

import { nodeViewProps, NodeViewWrapper ,NodeViewContent} from '@tiptap/vue-3'
import { get_record_history_versionsFetch,get_record_history_infoFetch ,get_experiment_record_visitorListFetch} from '@/api/experiment'
import { HashtagIcon } from 'tdesign-icons-vue-next'
import { timeAgo } from '@/utils/time-ago'
import { transform } from 'typescript';

const { node, updateAttributes } = defineProps(nodeViewProps)

const editor = inject('editor')
const options = inject('options')
const $key_data = JSON.parse( localStorage.getItem('key_data') ?? '{}')
const isEdit = ref(false)
const isSnEdit = ref(false)

const xmTitleRef = ref()
const xmTitleSnRef = ref()
const historyDataVisible = ref(false)
const showSubTitle = ref(true)

const readOnly = computed(() => options.value.document?.readOnly)

const title = computed({
  get: () => node.attrs.title,
  set(value: string) {
    updateAttributes({ title: value })
  },
})

const sn = computed({
  get: () => node.attrs.sn,
  set(value: string) {
    updateAttributes({ sn: value })
  },
})

const experiment_record = computed(() => $key_data?.experiment_record)

const current_update_datetime = ref('')
if (experiment_record.value.update_datetime) {
  current_update_datetime .value = experiment_record.value.update_datetime
}

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
      if (xmTitleRef.value) xmTitleRef.value.$el.focus()
    } , 10)
  }
}
const HeditSnFunc = () => {
  isSnEdit.value = true
  if (xmTitleSnRef.value) {
    xmTitleSnRef.value.$el.focus()
  } else {
    setTimeout(() => {
      if (xmTitleSnRef.value) xmTitleSnRef.value.$el.focus()
    } , 10)
  }
}
const tInputBlur = () => {
  isEdit.value = false
  isSnEdit.value = false
}


/*
历史记录数据
*/
const historyData = ref([])
const historyDataInit = async () => {
  if (experiment_record.value) {
    const res = await get_record_history_versionsFetch({ record: experiment_record.value.id})
    if (res.data.code === 2000) {
      historyData.value = res.data.data
    }

  } else {
    historyData.value = []
  }
}

//获取历史记录详情
const transformDocContent = async (history:any) => {
  if (history?.id) {
    const res = await get_record_history_infoFetch(history.id)
    if (res.data.code === 2000) {
      nextTick(async () => {
        // 确保 editor 已初始化
        if (editor.value) {
          try {
            // editor.value?.chain().setContent(res.data.data.json_data, true).focus().run()
            // 解析 JSON 数据
            const parsedContent = editor.value.schema.nodeFromJSON(res.data.data.json_data);

            // 创建一个新的事务（transaction）
            const transaction = editor.value.state.tr.replaceWith(
              0, // 替换的起始位置
              editor.value.state.doc.content.size, // 替换的结束位置
              parsedContent // 替换的内容
            );

            // 分发事务
            editor.value.view.dispatch(transaction);
            current_update_datetime.value = res.data.data.update_datetime
            useMessage('success',res.data.msg)
          } catch (error) {
            console.error('Error setting content:', error);
            // console.error('Invalid JSON data:', jsonData);
          }
        } else {
          console.error('Editor is not initialized');
        }
      })
    }else {
      useMessage('error',res.data.msg)
    }
  } else {

  }
}


/*
访客数据
*/
const visitorData = ref([])
const visitorDataInit = async () => {
  if (experiment_record.value) {
    const res = await get_experiment_record_visitorListFetch(experiment_record.value.id)
    if (res.data.code === 2000) {
      visitorData.value = res.data.data
    }
  } else {
    visitorData.value = []
  }
}


onMounted( async () => {
  await historyDataInit()
  await visitorDataInit()
})

onBeforeUnmount(() => {

})

</script>

<style lang="less" scoped>
h1 {
  font-size: 32px;
  font-weight:bold;
}
h2 {
  font-size: 14px;
  font-weight:bold;
  color: #a7abac;
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
:deep( .xmTitleClass-sn) {
  border: none !important;
  padding: 0;
  .umo-input__inner {
    font-size:14px;
    font-weight:bold;
    color: #a7abac;
  }
}
</style>
