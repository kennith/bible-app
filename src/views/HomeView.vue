<script setup lang="ts">
import { onMounted } from 'vue'
import BookListPanel from '@/components/BookListPanel.vue'
import ChapterListPanel from '@/components/ChapterListPanel.vue'
import BibleContentPanel from '@/components/BibleContentPanel.vue'
import { useBibleStore } from '@/stores/bible'

const bibleStore = useBibleStore()

onMounted(() => {
  if (!bibleStore.chapterData && !bibleStore.loading) {
    bibleStore.fetchChapter()
  }
})
</script>

<template>
  <div class="flex flex-1 flex-col overflow-hidden lg:flex-row">
    <BookListPanel />
    <ChapterListPanel />
    <BibleContentPanel />
  </div>
</template>
