import { Node } from '@tiptap/core'

export default class xmNode extends Node{
  addAttributes() {
    return {
      id: {
        default: '',
        parseHTML: (element) => element.getAttribute('data-id'),
        renderHTML: (attributes) => {
          if (!attributes.id) {
            return {};
          }
          return { 'data-id': attributes.id };
        },
      },
      key: {
        default: '',
        parseHTML: (element) => element.getAttribute('data-key'),
        renderHTML: (attributes) => {
          if (!attributes.key) {
            return {};
          }
          return { 'data-key': attributes.key };
        },
      },
      name: {
        default: '',
        parseHTML: (element) => element.getAttribute('data-name'),
        renderHTML: (attributes) => {
          if (!attributes.name) {
            return {};
          }
          return { 'data-name': attributes.name };
        },
      },
      value: {
        default: '',
        parseHTML: (element) => element.getAttribute('data-value'),
        renderHTML: (attributes) => {
          if (!attributes.value) {
            return {};
          }
          return { 'data-value': attributes.value };
        },
      },
    }
  }
}
