<template>
  <menus-button
    ico="table-add-row-after"
    :text="t('table.addRowBefore')"
    :hide-text="$toolbar.mode === 'classic'"
    :disabled="!editor?.can().addRowBefore()"
    @menu-click="editor?.chain().focus().addRowBefore().run()"
  />
</template>

<script setup lang="ts">
const { editor ,options} = useStore()
const $toolbar = useState('toolbar',options.value.editorKey)
</script>
