import { Node } from '@tiptap/core'
import { v4 as uuid } from 'uuid'
export default class xmNode extends Node{
  addAttributes() {
    return {
      id: {
        default: uuid(),
        parseHTML: (element:any) => element.getAttribute('data-id'),
        renderHTML: (attributes:any) => {
          if (!attributes.id) {
            return {};
          }
          return { 'data-id': attributes.id };
        },
      },
      key: {
        default: uuid(),
        parseHTML: (element:any) => element.getAttribute('data-key'),
        renderHTML: (attributes:any) => {
          if (!attributes.key) {
            return {};
          }
          return { 'data-key': attributes.key };
        },
      },
      name: {
        default: uuid(),
        parseHTML: (element:any) => element.getAttribute('data-name'),
        renderHTML: (attributes:any) => {
          if (!attributes.name) {
            return {};
          }
          return { 'data-name': attributes.name };
        },
      },
      value: {
        default: undefined,
        parseHTML: (element:any) => element.getAttribute('data-value'),
        renderHTML: (attributes:any) => {
          return { 'data-value': attributes.value };
        },
      },
      isChanged: {
        default: false,
        parseHTML: (element:any) => element.getAttribute('data-isChanged'),
        renderHTML: (attributes:any) => {
          return { 'data-isChanged': attributes.isChanged };
        },
      },
    }
  }
}
