<template>
  <menus-button
    ico="table"
    :text="t('insert.tTable')"
    huge
    @menu-click="editor?.chain().focus().addXmTitle({key: 'default', title: '标题',content: '内容' }).run()"
  />
</template>

<script setup lang="ts">
const editor = inject('editor')
</script>
