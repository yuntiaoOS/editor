<template>
  <menus-button
    ico="lucide--panel-right"
    :text="'右侧边栏'"
    @menu-click="editor?.chain().focus().setLayout(ColumnLayout.SidebarRight).run()"
  />
</template>

<script setup lang="ts">
import { ColumnLayout } from '@/extensions/MultiColumn/Columns'
const { editor } = useStore()

</script>
