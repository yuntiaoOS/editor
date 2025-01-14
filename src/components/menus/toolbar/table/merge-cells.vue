<template>
  <menus-button
    ico="table-merge-cell"
    :text="t('table.mergeCells')"
    :hide-text="$toolbar.mode === 'classic'"
    :disabled="!editor?.can().mergeCells()"
    @menu-click="editor?.chain().focus().mergeCells().run()"
  />
</template>

<script setup lang="ts">
const { editor ,options } = useStore()
const $toolbar = useState('toolbar',options.value.editorKey)
</script>
