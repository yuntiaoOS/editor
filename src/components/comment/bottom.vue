<template>
  <div class="comment-body">
    <div style="display:flex;justify-content: center;">
      <div>
        <div style="display:flex;justify-content: center;">
          <t-button 
            v-if="$key_data.experiment_record"
            theme="default" variant="base" shape="round" size="large" :style="{'background-color':!$key_data.experiment_record.liked? '' : '#e7effb' }" 
            @click="submitLike">
            <div style="display:flex;justify-content: center; align-items: center; gap:10px;">
              <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="#4068dd" d="M23 10a2 2 0 0 0-2-2h-6.32l.96-4.57c.02-.1.03-.21.03-.32c0-.41-.17-.79-.44-1.06L14.17 1L7.59 7.58C7.22 7.95 7 8.45 7 9v10a2 2 0 0 0 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73zM1 21h4V9H1z"/></svg>
              <span v-if="record_likeList.length > 0">{{record_likeList.length}}</span>
            </div>
          </t-button>
        </div>
        <div :style="{ width: '200px' }">
          <div v-if="record_likeList.length > 0">
            <t-divider >共 {{record_likeList.length > 0 ? record_likeList.length: '' }} 条记录</t-divider>
            <div 
              v-for=" (item,index) in record_likeList " :key="index"
              style="color:#171a1d66;font-size:12px;display: flex;align-items: center;justify-content: space-between;">
              <div style="display: flex; align-items: center; gap: 10px;">
                <t-image 
                  :error="item.name[0]"
                  fit="contain" shape="circle" src="item.avatar"
                  :style="{ width: '20px', height: '20px' }"
                />
                <span>{{item.name}}</span>
              </div>
              <div>赞过</div>
            </div>
          </div>
          <t-divider v-else>点赞表态</t-divider>
        </div>
      </div>
    </div>
    <div style="display:flex;justify-content: center;flex-direction: column;gap:20px;margin-top:20px;">
      <t-list :split="true">
        <t-list-item v-for="(item, index) in commentsData" :key="index">
          <template #content>
            <t-comment 
              v-if="item.id"
              :avatar="item.comment_user.avatar"
              :author="item.comment_user.name"
              :datetime="timeAgo(item.create_datetime)"
              :content="item.content"
              class="comment-reply"
            >
              <template #actions>
                <t-space v-if="false" key="thumbUp" :size="6">
                  <t-icon name="thumb-up" />
                  <span>6</span>
                </t-space>
                <t-space key="chat" :size="6">
                  <div  @click="replyChildFunc(item)">
                    <t-space key="chat" :size="6">
                      <t-icon name="chat" @click="replyChildFunc(item)"/>
                      <span>回复</span>
                    </t-space>
                  </div>
                </t-space>
              </template>

              <template v-if="item.children.length > 0" #reply >
                <template v-for="(reply,indexR) in item.children" :key="indexR"  >
                  <t-comment 
                    :avatar="reply.comment_user.avatar"
                    :datetime="timeAgo(reply.create_datetime)"
                    :content="reply.content"
                  >
                    <template #author>
                      <span style="font-size:12px;">评论作者名 {{reply.comment_user.name}}</span>
                      <t-icon name="caret-right-small" size="medium" style="margin: 0 4px" />
                      <span  style="font-size:12px;">评论作者名 {{item.comment_user.name}}</span>
                    </template>

                    <template #actions>
                      <t-space v-if="false" key="thumbUp" :size="6">
                        <t-icon name="thumb-up" />
                        <span>6</span>
                      </t-space>
                      <t-space v-if="false" key="chat" :size="6" >
                        <t-icon name="chat" />
                        <span>回复</span>
                      </t-space>
                    </template>
                  </t-comment>
                </template>
              </template>
            </t-comment>
          </template>
        </t-list-item>
      </t-list>
      
      <t-comment :avatar="user.avatarUrl">
        <template #content>
          <div class="form-container">
            <div v-if="replyTipInfo && replyTipInfo.length > 20" v-html="replyTipInfo" ></div>
            <t-textarea v-model="replyData" style="padding-top:40px;" placeholder="请输入内容" />
            <t-button class="form-submit" style="margin-top:10px;float: right;" @click="submitReply()">回复</t-button>
          </div>
        </template>
      </t-comment>
      <t-space> </t-space>
    </div>
    
  </div>
</template>

<script setup>
  import { 
get_experiment_record_commentListFetch,get_experiment_record_likeListFetch,
    post_experiment_record_commentFetch,post_experiment_record_likeFetch,  } from '@/api/experiment'
  import { timeAgo } from '@/utils/time-ago'
  const props = defineProps({
    
  });
  const { options } = useStore();
  const {user}  =  options.value;
  const savedAt = ref()
  const $key_data = JSON.parse( localStorage.getItem('key_data'))
  const commentsData = ref([])
  const replyData = ref('')

  const time = useTimestamp({ offset: 0 })
  savedAt.value = time.value

  const replySubmitInfo = ref({
    show: false,
    info: '回复@zhaoziw: fdsafds ',
    data: {}
  })
  const replyTipInfo = ref('')
  const record_likeList = ref([])

  const getCommentLikeList = () => {
    get_experiment_record_likeListFetch($key_data.experiment_record?.id).then((res) => {
      if (res.data.code === 2000) {
        record_likeList.value = res.data.data
      }else{
        console.log('获取点赞列表失败');
      }
    }).catch((err) => {
      console.log(err);
    })

  }
  

  const submitLike = () => {
    post_experiment_record_likeFetch($key_data.experiment_record?.id).then((res) => {
      if (res.data.code === 2000) {
        nextTick(() => {
          const {experiment_record} = $key_data
          experiment_record.liked = !experiment_record.liked
          // $key_data.experiment_record = experiment_record
          replyTipInfo.value = ''
          getCommentLikeList()
          console.log('--------------submitLike-----------', $key_data.experiment_record);
        })
        console.log('点赞成功');
      }
    }).catch((err) => {
      console.log(err);
    })

  }

  const getCommentList = () => {
    get_experiment_record_commentListFetch($key_data.experiment_record?.id).then((res) => {
      if (res.data.code === 2000) {
        commentsData.value = res.data.data
      }else{
        console.log('获取评论列表失败');
      }
    }).catch((err) => {
      console.log(err);
    })
  };

  const replyChildFunc = (item)=>{
    console.log('------176------replyChildFunc', item);
    replySubmitInfo.value = {
      show: true,
      info: `回复@${item.comment_user.name}: ${item.content}`,
      data: item
    }
    replyTipInfo.value = `<div style=" background-color: #e8e8e8;padding:4px 4px;"> <div style="border-left: 4px solid #c1bbbb;"><div class="t-comment" style="padding-left:20px;"><div class="t-comment__inner"><!----><div class="t-comment__content"><div class="t-comment__detail">${ replySubmitInfo.value.info }</div><!----><!----></div></div><!----></div></div></div> `
    console.log('------181------replyChildFunc', replySubmitInfo.value);
  }
  const submitReply = () => {
    let parent = undefined
    if (replySubmitInfo.value?.show && replySubmitInfo.value.data && replySubmitInfo.value.data.id) {
      parent = replySubmitInfo.value.data.id
    }
    const params = {
      content: replyData.value,
      parent
    }
    post_experiment_record_commentFetch($key_data.experiment_record.id,params).then((res) => {
      if (res.data.code === 2000) {
        nextTick(() => {
          if (parent) {
            replySubmitInfo.value.show = false
            replySubmitInfo.value.data = {}
            replyTipInfo.value = ''
          }
          getCommentList()
        })
      }else{
        console.log('评论失败');
      }
    }).catch((err) => {
      console.log(err);
    })
  };
  console.log('----------comment-body----18----------',user,options,props,$key_data );

  onMounted(() => {
    getCommentLikeList()
    getCommentList()
  })
</script>


<style lang="scss" scoped> 
:deep(.umo-comment__avatar-image){
  width: var(--td-comp-size-xl);
  height: var(--td-comp-size-xl);
  border-radius: var(--td-radius-circle);
}
.comment-body {
  width: 100%;
}
</style>
<style lang="less" scoped>
.comment-reply {
  > .t-comment__inner {
    > .t-comment__content {
      > .t-comment__actions {
        margin-right: 24px;
      }
    }
  }
}
</style>