<template>
  <menus-button
    ico="node-duplicate"
    :text="t('blockMenu.duplicate')"
    @menu-click="duplicateNode"
  />
</template>

<script setup lang="ts">
import type { Node } from '@tiptap/pm/model'

import { getSelectionNode } from '@/extensions/selection'
import { shortId } from '@/utils/short-id'
import { v4 as uuid } from 'uuid'
import { timeFormat } from '@/utils/time-ago'

const { editor } = useStore()

const duplicateNode = () => {
  const selectionNode = editor.value ? getSelectionNode(editor.value) : null
  const getPosition = () => {
    let point = 0
    editor.value?.state.doc.descendants((node: Node, pos: number) => {
      if (node === selectionNode) {
        point = pos + node.nodeSize
      }
    })
    return point
  }
  const copeNode = selectionNode?.type.create(
    {
      ...selectionNode.attrs,
      id: uuid(),
      title: selectionNode?.attrs?.title + ' - 复制',
      key: Xm_Table_key[selectionNode?.type.name]  + timeFormat(null,'yyyymmddhhMMss'),
    },
    selectionNode.content,
    selectionNode.marks,
  )
  editor.value?.commands.insertContentAt(getPosition(), copeNode?.toJSON())
}
</script>
