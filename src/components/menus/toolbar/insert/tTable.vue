<template>
  <menus-button
    ico="t-table"
    :text="formData.name"
    huge
    @menu-click="editor?.chain().focus().addTtables(formData).run()"
  >
    <!-- <modal
      :visible="dialogVisible"
      icon="web-page"
      header="插入数据表格"
      width="480px"
      :footer="false"
    >
      <div class="umo-web-page-container">
        <div class="umo-web-page-tip" v-text="请先选择实体表单"></div>
        <t-list :split="true">
          <t-list-item v-for=" item in formList" :key="item.key">
            {{item.name}} ：{{ item.key }}
            <template #action>
              <t-link theme="primary" hover="color" style="margin-left: 16px" @click="linkClick(item)"> 选用 </t-link>
            </template>
          </t-list-item>
        </t-list>
      </div>
    </modal> -->
  </menus-button>
</template>

<script setup lang="ts">
const { editor,options } = useStore()

const props = defineProps({
  formData: {
    type: Object,
    default: () => ({})
  }
})

let dialogVisible = $ref(false)

const formList = ref([])

const linkClick = (item: any) => {
  editor.value.chain().focus().addTtables(item).run()
  dialogVisible = false
}

// onMounted(() => {
//   options.value.getEntityFormMethod().then((res:any) =>{
//     console.log('----222-----getEntityFormMethod--------------',res)
//     formList.value = res
//   })
// });
</script>
