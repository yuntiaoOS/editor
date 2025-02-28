<template>
  <menus-button
    ico="lucide--panel-left"
    :text="'左侧边栏'"
    @menu-click="editor?.chain().focus().setLayout(ColumnLayout.SidebarLeft).run()"
  />
</template>

<script setup lang="ts">
import { ColumnLayout } from '@/extensions/MultiColumn/Columns'
const editor = inject('editor')

</script>
