<script setup lang="ts">
import HomeView from '@/views/HomeView.vue'
import { useBibleStore } from '@/stores/bible'

const bibleStore = useBibleStore()
</script>

<template>
  <div
    class="flex h-screen flex-col overflow-hidden bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100"
  >
    <header
      class="flex shrink-0 items-center justify-between border-b border-slate-200 bg-white px-6 py-3 dark:border-slate-800 dark:bg-slate-900"
    >
      <div class="flex items-center gap-3">
        <div
          class="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-600 font-serif text-sm font-bold text-white shadow-2xs dark:bg-amber-500 dark:text-slate-950"
        >
          B
        </div>
        <div>
          <span class="text-base font-bold tracking-tight text-slate-900 dark:text-white">
            Bible Reader
          </span>
          <span class="ml-2 hidden text-xs text-slate-500 sm:inline dark:text-slate-400">
            New International Version (NIV)
          </span>
        </div>
      </div>

      <div class="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-300">
        <span
          class="rounded-md bg-slate-100 px-2.5 py-1 dark:bg-slate-800"
          data-testid="active-selection-badge"
        >
          {{ bibleStore.selectedBook.name }} {{ bibleStore.selectedChapter }}
        </span>
      </div>
    </header>

    <HomeView />
  </div>
</template>
