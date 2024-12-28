import { Editor } from '@tiptap/core'
import type { Group } from './types'

import { hasExtension } from '@/utils/utils'

export function renderGroups(editor: Editor) {
  const groups: Group[] = [
    {
      name: 'format',
      title: '插入数据表格',
      commands: [
        {
          name: 'raw_material_table',
          label: '物料表格',
          iconName: 't-table',
          action: ({ editor, range }) => {
            editor?.chain().focus().deleteRange(range).addRaw_material_tables({is_integration:true}).run()
          },
        },
        {
          name: 'technology_table',
          label: "工艺路线",
          iconName: 'technology',
          action: ({ editor, range }) => {
            editor?.chain().focus().deleteRange(range).addTechnology_tables({is_integration:true}).run()
          },
        },
        // {
        //   name: 'experimental_design',
        //   label: '试验方法设计',
        //   iconName: 'experimental_design',
        //   action: ({ editor, range }) => {
        //     editor?.chain().focus().deleteRange(range).addExperimental_designs().run()
        //   },
        // },
        {
          name: 'test_record_table',
          label: '试验记录',
          iconName: 'test-records',
          action: ({ editor, range }) => {
            editor?.chain().focus().deleteRange(range).addTest_record_table().run()
          },
        },
        {
          name: 'sample_table',
          label: '样品表格',
          iconName: 'sample',
          action: ({ editor, range }) => {
            editor?.chain().focus().deleteRange(range).addSample_tables({is_integration:true}).run()
          },
        },
        {
          name: 'evaluating_table',
          label: '评测表格',
          iconName: 'evaluating',
          action: ({ editor, range }) => {
            editor?.chain().focus().deleteRange(range).addEvaluating_tables().run()
          },
        },
      ],
    },
    {
      name: 'format',
      title: t('blockMenu.toogleNode'),
      commands: [
        {
          name: 'paragraph',
          label: t('base.heading.paragraph'),
          iconName: 'paragraph',
          action: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).setParagraph().run()
          },
        },
        {
          name: 'heading1',
          label: t('base.heading.text', { level: 1 }),
          aliases: ['h1', 'bt', 'bt1'],
          iconName: 'heading',
          action: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).setHeading({ level: 1 }).run()
          },
        },
        {
          name: 'heading2',
          label: t('base.heading.text', { level: 2 }),
          aliases: ['h2', 'bt', 'bt2'],
          iconName: 'heading',
          action: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).setNode('heading', { level: 2 }).run()
          },
        },
        {
          name: 'heading3',
          label: t('base.heading.text', { level: 3 }),
          aliases: ['h3', 'bt', 'bt3'],
          iconName: 'heading',
          action: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).setNode('heading', { level: 3 }).run()
          },
        },
        {
          name: 'heading4',
          label: t('base.heading.text', { level: 4 }),
          aliases: ['h4', 'bt', 'bt4'],
          iconName: 'heading',
          action: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).setNode('heading', { level: 4 }).run()
          },
        },
        {
          name: 'heading5',
          label: t('base.heading.text', { level: 5 }),
          aliases: ['h5', 'bt', 'bt5'],
          iconName: 'heading',
          action: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).setNode('heading', { level: 5 }).run()
          },
        },
        {
          name: 'heading6',
          label: t('base.heading.text', { level: 6 }),
          aliases: ['h6', 'bt', 'bt6'],
          iconName: 'heading',
          action: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).setNode('heading', { level: 6 }).run()
          },
        },
        {
          name: 'bulletList',
          label: t('list.bullet.text'),
          aliases: ['ul', 'yxlb'],
          iconName: 'bullet-list-2',
          action: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).toggleBulletList().run()
          },
        },
        {
          name: 'numberedList',
          label: t('list.ordered.text'),
          aliases: ['ol', 'yxlb'],
          iconName: 'ordered-list-2',
          action: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).toggleOrderedList().run()
          },
        },
        {
          name: 'taskList',
          label: t('list.task.text'),
          iconName: 'task-list-2',
          description: 'Task list with todo items',
          aliases: ['todo'],
          action: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).toggleTaskList().run()
          },
        },
        {
          name: 'blockquote',
          label: t('base.quote'),
          description: '插入引入格式',
          aliases: ['yr'],
          iconName: 'quote',
          action: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).toggleBlockquote().run()
          },
        },
      ],
    },
    {
      name: 'insert',
      title: t('editor.slash.insert'),
      commands: [
        {
          name: 'table',
          label: t('table.insert.text'),
          iconName: 'table',
          action: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).insertTable().run()
          },
        },
        {
          name: 'image',
          label: t('insert.image'),
          iconName: 'image',
          action: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).selectFiles('image').run()
          },
        },
        {
          name: 'video',
          label: t('insert.video'),
          iconName: 'video',
          action: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).selectFiles('video').run()
          },
        },
        {
          name: 'audio',
          label: t('insert.audio'),
          iconName: 'audio',
          action: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).selectFiles('audio').run()
          },
        },
        {
          name: 'file',
          label: t('insert.file'),
          iconName: 'file',
          action: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).selectFiles('file').run()
          },
        },
        {
          name: 'codeBlock',
          label: t('insert.codeBlock'),
          iconName: 'code-block',
          action: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).setCodeBlock().run()
          },
        },
        {
          name: 'hr',
          label: t('insert.hr.text'),
          iconName: 'hr',
          action: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).setHr({ type: 'signle' }).run()
          },
        },
        {
          name: 'toc',
          label: t('insert.toc'),
          iconName: 'toc',
          action: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).addTableOfContents().run()
          },
        },
        {
          name: 'textBox',
          label: t('insert.textBox'),
          iconName: 'text-box',
          action: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).setTextBox({}).run()
          },
        },
        // {
        //   name: 'webPage',
        //   label: t('insert.web.text'),
        //   iconName: 'web-page',
        //   action: ({ editor, range }) => {
        //     editor.chain().focus().deleteRange(range).setCodeBlock().run()
        //   },
        // },
        // {
        //   name: 'qrcode',
        //   label: t('tools.qrcode.text'),
        //   iconName: 'qrcode',
        //   action: ({ editor, range }) => {
        //     editor.chain().focus().deleteRange(range).setCodeBlock().run()
        //   },
        // },
        // {
        //   name: 'barcode',
        //   label: t('tools.barcode.text'),
        //   iconName: 'barcode',
        //   action: ({ editor, range }) => {
        //     editor.chain().focus().deleteRange(range).setCodeBlock().run()
        //   },
        // },
        // {
        //   name: 'signature',
        //   label: t('tools.signature.text'),
        //   iconName: 'signature',
        //   action: ({ editor, range }) => {
        //     editor.chain().focus().deleteRange(range).setCodeBlock().run()
        //   },
        // },
        // {
        //   name: 'seal',
        //   label: t('tools.seal.text'),
        //   iconName: 'seal',
        //   action: ({ editor, range }) => {
        //     editor.chain().focus().deleteRange(range).setCodeBlock().run()
        //   },
        // },
        // {
        //   name: 'diagrams',
        //   label: t('tools.diagrams.text'),
        //   iconName: 'diagrams',
        //   action: ({ editor, range }) => {
        //     editor.chain().focus().deleteRange(range).setCodeBlock().run()
        //   },
        // },
        // {
        //   name: 'mermaid',
        //   label: t('tools.mermaid.text'),
        //   iconName: 'mermaid',
        //   action: ({ editor, range }) => {
        //     editor.chain().focus().deleteRange(range).setCodeBlock().run()
        //   },
        // },
      ],
    },
  ]
  return groups
}
