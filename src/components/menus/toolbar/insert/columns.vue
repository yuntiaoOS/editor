<template>
  <menus-button
    ico="lucide--columns-2"
    :text="'两栏布局'"
    huge
    @menu-click="editor?.chain().focus().setColumns().focus(editor.state.selection.head + 1).run()"
  />
</template>

<script setup lang="ts">
const { editor } = useStore()
</script>
