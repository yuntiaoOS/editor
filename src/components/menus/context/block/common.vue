<template>
  <t-dropdown
    :attach="`${container} .umo-page-container`"
    placement="bottom-right"
    overlay-class-name="umo-block-menu-dropdown"
    trigger="click"
    :destroy-on-close="false"
    :popup-props="popupProps"
  >
    <menus-button
      class="umo-block-menu-button"
      :menu-active="menuActive"
      ico="block-menu"
      hide-text
    />
    <t-dropdown-menu>
      <t-dropdown-item class="umo-block-menu-group-name" disabled>
        {{ t('blockMenu.common') }}
      </t-dropdown-item>
      <t-dropdown-item>
        <menus-button
          :disabled="editor?.isActive('raw_material_table') || editor?.isActive('technology_table') || editor?.isActive('test_record_table') ||
           editor?.isActive('sample_table') || editor?.isActive('sample_test_comparison') || editor?.isActive('evaluation_comparison') || editor?.isActive('experimental_design') || editor?.isActive('evaluating_table')"
          ico="node-clear-format"
          :text="t('blockMenu.clearFormat')"
          :tooltip="false"
          @menu-click="clearTextFormatting"
        />
      </t-dropdown-item>
      <t-dropdown-item divider>
        <menus-button
          ico="node-duplicate"
          :text="t('blockMenu.duplicate')"
          :tooltip="false"
          @menu-click="duplicateNode"
        />
      </t-dropdown-item>
      <t-dropdown-item>
        <menus-button
           :disabled="editor?.isActive('raw_material_table') || editor?.isActive('technology_table') || editor?.isActive('test_record_table') ||
           editor?.isActive('sample_table') || editor?.isActive('sample_test_comparison') || editor?.isActive('evaluation_comparison') || editor?.isActive('experimental_design') || editor?.isActive('evaluating_table')"
           ico="node-copy"
          :text="t('blockMenu.copy')"
          :tooltip="false"
          @menu-click="copyNodeToClipboard"
        />
      </t-dropdown-item>
      <t-dropdown-item>
        <menus-button
          :disabled="editor?.isActive('raw_material_table') || editor?.isActive('technology_table') || editor?.isActive('test_record_table') ||
           editor?.isActive('sample_table') || editor?.isActive('sample_test_comparison') || editor?.isActive('evaluation_comparison') || editor?.isActive('experimental_design') || editor?.isActive('evaluating_table')"
          ico="node-cut"
          :text="t('blockMenu.cut')"
          :tooltip="false"
          @menu-click="cutNodeToClipboard"
        />
      </t-dropdown-item>
      <t-dropdown-item class="umo-delete-node">
        <menus-button
          ico="node-delete-2"
          :text="t('blockMenu.delete')"
          :tooltip="false"
          @menu-click="deleteNode"
        />
      </t-dropdown-item>
    </t-dropdown-menu>
  </t-dropdown>
</template>

<script setup lang="ts">
import type { Node } from '@tiptap/pm/model'

import { getSelectionNode } from '@/extensions/selection'
import { shortId } from '@/utils/short-id'
import { v4 as uuid } from 'uuid'
import { timeFormat } from '@/utils/time-ago'

const { container, editor, blockMenu } = useStore()

let menuActive = $ref(false)

const popupProps = {
  onVisibleChange(visible: boolean) {
    editor.value.commands.focus()
    blockMenu.value = visible
    menuActive = visible
  },
}

const clearTextFormatting = () => {
  editor.value?.chain().focus().setCurrentNodeSelection().unsetAllMarks().run()
}
const copyNodeToClipboard = () => {
  editor.value?.commands.setCurrentNodeSelection()
  document.execCommand('copy')
}
const cutNodeToClipboard = () => {
  editor.value?.commands.setCurrentNodeSelection()
  document.execCommand('cut')
}
const duplicateNode = () => {
  const selectionNode = editor.value ? getSelectionNode(editor.value) : null
  const getPosition = () => {
    let point = 0
    editor.value?.state.doc.descendants((node: Node, pos: number) => {
      if (node === selectionNode) {
        point = pos + node.nodeSize // 返回节点结束位置
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
const deleteNode = () => {
  const selectionNode = editor.value ? getSelectionNode(editor.value) : null
  const getPosition = () => {
    let point = 0
    editor.value?.state.doc.descendants((node: Node, pos: number) => {
      if (node === selectionNode) {
        point = pos + node.nodeSize // 返回节点结束位置
      }
    })
    return point
  }

  if (!selectionNode) {
    return
  }

  const startPos = getPosition() - selectionNode.nodeSize
  const endPos = getPosition()

  // 使用 deleteRange 删除从起始位置到结束位置的节点
  editor.value?.commands.deleteRange({ from: startPos, to: endPos })
  // // 获取当前选中的节点ID
  // const selectedNodeId = selectionNode.attrs.id
  // // 使用该ID来定位并删除对应的 t-table
  // const tableElement = document.querySelector(`#${selectedNodeId}`)
  // console.log('tableElement-----139-------', tableElement,selectionNode, selectedNodeId)
  // if (tableElement) {
  //   tableElement.remove()  // 删除当前选中的 t-table
  // }

  // editor.value?.chain().focus().deleteSelectionNode().run()
}
</script>

<style lang="less" scoped></style>
