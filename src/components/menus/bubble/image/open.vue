<template>
  <menus-button
    ico="image-open"
    :text="t('bubbleMenu.image.open')"
    @menu-click="openImage"
  />
</template>

<script setup lang="ts">
import { getSelectionNode } from '@/extensions/selection'
import { fixedImageUrls, fixedImageUrl } from '@/utils/index'
const { editor } = useStore()

const openImage = () => {
  const node = editor.value ? getSelectionNode(editor?.value) : null
  const a = document.createElement('a')
  a.href = fixedImageUrl( node?.attrs.src )
  a.target = '_blank'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}
</script>
