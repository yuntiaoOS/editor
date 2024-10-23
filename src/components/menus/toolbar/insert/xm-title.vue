<template>
  <menus-button
    ico="table"
    :text="t('insert.tTable')"
    huge
    @menu-click="editor?.chain().focus().addXmTitle().run()"
  />
</template>

<script setup lang="ts">
const { editor } = useStore()
</script>
