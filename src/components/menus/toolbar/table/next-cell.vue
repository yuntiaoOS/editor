<template>
  <menus-button
    ico="table-next-cell"
    :text="t('table.nextCell')"
    shortcut="Tab"
    :hide-text="$toolbar.mode === 'classic'"
    :disabled="!editor?.can().goToNextCell()"
    @menu-click="editor?.chain().focus().goToNextCell().run()"
  />
</template>

<script setup lang="ts">
const { editor ,options} = useStore()
const $toolbar = useState('toolbar',options.value.editorKey)
</script>
