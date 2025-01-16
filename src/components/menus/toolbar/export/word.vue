<template>
  <menus-button text="Word" ico="word" huge @menu-click="exportToWord"/>
</template>

<script setup lang="ts">

import { Document, Packer, Paragraph, TextRun } from "docx"

import { saveAs } from 'file-saver'
// import { DocxSerializer, defaultNodes, defaultMarks } from 'prosemirror-docx'

import {  DocxSerializer,  defaultNodes, defaultMarks } from '@/extensions/docx'

const { options, editor } = useStore()

const docxSerializer = new DocxSerializer(defaultNodes, defaultMarks)

function exportToWord() {
  const opts: any = {
    getImageBuffer: async (src: string) => {
      const response = await fetch(src)
      const arrayBuffer = await response.arrayBuffer()
      return new Uint8Array(arrayBuffer)
    },
  }
  const wordDocument = docxSerializer.serialize(editor.value.state.doc, opts)

  Packer.toBlob(wordDocument).then(blob => saveAs(new Blob([blob]), 'example.docx'))

}

</script>

<style lang="less" scoped></style>
