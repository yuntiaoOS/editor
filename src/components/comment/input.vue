<template>
  <div class="umo-comment-container">
    <t-comment
      :avatar="user.avatarUrl || options.user?.avatarUrl"
      :author="user.nickName || options.user?.nickName || '未知用户'"
    >
      <template #content>
        <div class="umo-comment-form">
          <t-textarea
            v-model="commentText"
            size="small"
            placeholder="请输入评论内容"
            autosize
            autofocus
          />
          <div class="umo-comment-buttons">
            <t-button
              class="umo-comment-button"
              :disabled="commentText === ''"
              @click="submitComment"
            >
              回复
            </t-button>
            <t-button
              theme="default"
              class="umo-comment-button"
              variant="text"
              @click="closeComment"
            >
              取消
            </t-button>
          </div>
        </div>
      </template>
    </t-comment>
  </div>
</template>

<script setup lang="ts">
const { commentBox } = useStore()
const editor = inject('editor')
const options = inject('options')
import { v4 as uuid } from 'uuid'
const props = defineProps({
  user: {
    type: Object,
    default: () => ({}),
  },
})
interface CommentInstance {
  uuid?: string;
  comments?: any[];
}

const activeCommentsInstance = ref<CommentInstance>({});

const allComments = ref<any[]>([]);

const findCommentsAndStoreValues = (editor: any) => {
  const tempComments: any[] = [];

  editor.state.doc.descendants((node: any, pos: any) => {
    const { marks } = node;

    marks.forEach((mark:any) => {
      if (mark.type.name === "comment") {
        const markComments = mark.attrs.comment;

        const jsonComments = markComments ? JSON.parse(markComments) : null;

        if (jsonComments !== null) {
          tempComments.push({
            node,
            jsonComments,
            from: pos,
            to: pos + (node.text?.length || 0),
            text: node.text
          });
        }
      }
    });
  });

  allComments.value = tempComments;
};

const setComment = (val?: string) => {
  const localVal = val || commentText.value;

  if (!localVal.trim().length) return;

  const activeCommentInstance: CommentInstance = JSON.parse(JSON.stringify(activeCommentsInstance.value));
  const commentsArray = typeof activeCommentInstance.comments === "string" ? JSON.parse(activeCommentInstance.comments) : activeCommentInstance.comments;

  if (commentsArray) {
    commentsArray.push({
      userName: props.user.nickName || options.value.user?.nickName,
      user: props.user.nickName? props.user : options.value.user,
      time: Date.now(),
      content: localVal
    });

    const commentWithUuid = JSON.stringify({
      uuid: activeCommentsInstance.value.uuid || uuid(),
      comments: commentsArray
    });
    editor.value?.chain().setComment(commentWithUuid).run();
  } else {
    const commentWithUuid = JSON.stringify({
      uuid: uuid(),
      comments: [
        {
          userName: props.user.nickName || options.value.user?.nickName,
          user: props.user.nickName? props.user : options.value.user,
          time: Date.now(),
          content: localVal
        }
      ]
    });
    editor.value?.chain().setComment(commentWithUuid).run();
  }

  setTimeout(() => (commentText.value = ""), 50);
};

const commentText = ref('')
const submitComment = () => {

  setComment(commentText.value)
  closeComment()
}
const closeComment = () => {
  commentBox.value = false
  editor.value?.commands.focus()
}
</script>

<style lang="less" scoped>
.umo-comment {
  &-container {
    width: 300px;
    padding: 5px 3px 6px;
    :deep(.umo-comment__inner) {
      .umo-comment {
        &__avatar {
          margin-right: 10px;
          cursor: default;
          img {
            width: 48px;
            height: 48px;
          }
        }
        &__name {
          cursor: default;
          font-size: 14px;
        }
      }
    }
  }
  &-form {
    .umo-comment-buttons {
      margin-top: 10px;
      :deep(.umo-button) {
        margin-right: 10px;
        padding: 0 15px;
        height: 28px;
        font-size: 12px;
      }
    }
  }
}
</style>
