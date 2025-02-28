<template>
  <menus-button
    ico="lucide--columns-2"
    :text="'两栏布局'"
    @menu-click="editor?.chain().focus().setLayout(ColumnLayout.TwoColumn).run()"
  />
</template>

<script setup lang="ts">
import { ColumnLayout } from '@/extensions/MultiColumn/Columns'
const editor = inject('editor')

</script>
