<script lang="ts" setup>
import { ref, watch, nextTick } from 'vue'
import type { MenuListProps } from './types'

// 选中的索引
const selectedCommandIndex = ref(0)
const selectedGroupIndex = ref(0)
// 滚动ref
const scrollContainer = ref<HTMLDivElement | null>(null)

const activeItemRefs = ref<(HTMLButtonElement | null)[]>([])
const props = withDefaults(defineProps<MenuListProps>(), {
  items: undefined,
  command: undefined,
})

defineExpose({ onKeyDown })

watch([() => selectedCommandIndex.value, () => selectedGroupIndex.value], async () => {
  if (!scrollContainer.value) return
  await nextTick() // 等待 DOM 更新完成
  const activeItemIndex = selectedGroupIndex.value * 1000 + selectedCommandIndex.value
  // 取当前选中的dom元素
  const activeItem = activeItemRefs.value[activeItemIndex]
  if (activeItem) {
    activeItem.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
    })
  }
})

function onKeyDown({ event }) {
  if (event.key === 'ArrowUp') {
    upHandler()
    return true
  }

  if (event.key === 'ArrowDown') {
    downHandler()
    return true
  }

  if (event.key === 'Enter') {
    enterHandler()
    return true
  }

  return false
}

function upHandler() {
  if (!props.items.length) {
    return false
  }
  let newCommandIndex = selectedCommandIndex.value - 1
  let newGroupIndex = selectedGroupIndex.value

  if (newCommandIndex < 0) {
    newGroupIndex = selectedGroupIndex.value - 1
    newCommandIndex = props.items[newGroupIndex]?.commands.length - 1 || 0
  }

  if (newGroupIndex < 0) {
    newGroupIndex = props.items.length - 1
    newCommandIndex = props.items[newGroupIndex].commands.length - 1
  }

  selectedCommandIndex.value = newCommandIndex
  selectedGroupIndex.value = newGroupIndex
}

function downHandler() {
  if (!props.items.length) {
    return false
  }
  const commands = props.items[selectedGroupIndex.value].commands
  let newCommandIndex = selectedCommandIndex.value + 1
  let newGroupIndex = selectedGroupIndex.value

  if (commands.length - 1 < newCommandIndex) {
    newCommandIndex = 0
    newGroupIndex = selectedGroupIndex.value + 1
  }
  if (props.items.length - 1 < newGroupIndex) {
    newGroupIndex = 0
  }
  selectedCommandIndex.value = newCommandIndex
  selectedGroupIndex.value = newGroupIndex
}

function enterHandler() {
  if (!props.items.length || selectedGroupIndex.value === -1 || selectedCommandIndex.value === -1) {
    return false
  }

  selectItem(selectedGroupIndex.value, selectedCommandIndex.value)
}

function selectItem(groupIndex: number, commandIndex: number) {
  const command = props.items[groupIndex].commands[commandIndex]
  props.command(command)
}

function createCommandClickHandler(groupIndex: number, commandIndex: number) {
  selectItem(groupIndex, commandIndex)
}
function setActiveItemRef(groupIndex: number, commandIndex: number, el: any) {
  activeItemRefs.value[groupIndex * 1000 + commandIndex] = el
}
</script>
<template>
  <div style="color: black; max-height: min(80vh, 24rem); overflow: auto; flex-wrap: wrap; margin-bottom: 2rem; padding: 0.5rem; background-color: white; border-radius: 0.5rem; box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); border: 1px solid #e5e7eb; border-color: #e5e7eb;"
    ref="scrollContainer"
  >
    <div style="display: grid; grid-template-columns: repeat(1, minmax(0, 1fr)); gap: 0.125rem; min-width: 12rem;" v-if="items?.length">
      <template v-for="(group, groupIndex) in items" :key="group.title">
        <div style="color: #737373; font-size: 0.65rem; grid-column: 1 / -1; margin-left: 0.5rem; margin-right: 0.5rem; margin-top: 0.5rem; font-weight: 600; letter-spacing: 0.05em; user-select: none; text-transform: uppercase; &:first-child { margin-top: 0.125rem; }"
        >
          {{ group.title }}
        </div>
        <button
          style="display: flex;border: none; align-items: center; gap: 0.75rem; padding-left: 0.5rem; padding-right: 0.5rem; padding-top: 0.375rem; padding-bottom: 0.375rem; font-size: 12px; color: #262626; text-align: left; width: 100%; border-radius: 0.125rem; outline: none; transition: colors 0.3s;"
          :style=" selectedGroupIndex === groupIndex && selectedCommandIndex === commandIndex
            ? 'background-color: #ffffff; color: #262626; ' :
            'background-color: #ffffff; color: #262626; transition: background-color 0.3s, color 0.3s;'"
          :ref="el => setActiveItemRef(groupIndex, commandIndex, el)"
          v-for="(command, commandIndex) in group.commands"
          :key="commandIndex"
          @click="createCommandClickHandler(groupIndex, commandIndex)"
        >
          <img v-if="command.iconUrl" style="width: 24px; height:24px;" :src="command.iconUrl" />
          <icon v-if="command.iconName" :name="command.iconName" style="margin-right: 2px; font-size: 14px;line-height: 1;" />
          {{ command.label }}
        </button>
      </template>
    </div>
    <div style="padding: 8px;" v-else>
      <span style="line-height: 1rem; font-size: 0.75rem; color: rgb(146 146 146 / var(--r-text-opacity));">{{ t('editor.slash.empty') }}</span>
    </div>
  </div>
</template>
