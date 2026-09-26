<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import BookListPanel from '@/components/BookListPanel.vue'
import ChapterListPanel from '@/components/ChapterListPanel.vue'
import BibleContentPanel from '@/components/BibleContentPanel.vue'
import { useBibleStore } from '@/stores/bible'

const bibleStore = useBibleStore()
const showNavigationPanels = ref(true)

function handleKeydown(event: KeyboardEvent) {
  if (event.ctrlKey || event.metaKey || event.altKey) {
    return
  }

  const target = event.target as HTMLElement | null
  if (
    target &&
    (target.tagName === 'INPUT' ||
      target.tagName === 'TEXTAREA' ||
      target.tagName === 'SELECT' ||
      target.isContentEditable)
  ) {
    return
  }

  if (event.key.toLowerCase() === 'f') {
    showNavigationPanels.value = !showNavigationPanels.value
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
  if (!bibleStore.chapterData && !bibleStore.loading) {
    bibleStore.fetchChapter()
  }
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <div class="flex flex-1 flex-col overflow-hidden lg:flex-row">
    <div
      v-show="showNavigationPanels"
      data-testid="navigation-panels"
      class="flex shrink-0 flex-col overflow-hidden lg:h-full lg:flex-row"
    >
      <BookListPanel />
      <ChapterListPanel />
    </div>
    <BibleContentPanel />
  </div>
</template>
