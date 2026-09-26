<script setup lang="ts">
import { useBibleStore } from '@/stores/bible'

const bibleStore = useBibleStore()
</script>

<template>
  <aside
    aria-label="Book Chapters"
    data-testid="chapter-list-panel"
    class="flex h-full flex-col border-b border-slate-200 bg-slate-50/60 lg:w-56 lg:shrink-0 lg:border-r lg:border-b-0 dark:border-slate-800 dark:bg-slate-900/60"
  >
    <div class="border-b border-slate-200 p-4 dark:border-slate-800">
      <div class="flex items-center justify-between">
        <h2
          class="text-sm font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400"
        >
          Chapters
        </h2>
        <span
          class="rounded-full bg-amber-100/80 px-2 py-0.5 text-xs font-medium text-amber-900 dark:bg-amber-950 dark:text-amber-300"
        >
          {{ bibleStore.selectedBook.id }}
        </span>
      </div>
      <p class="mt-1 truncate text-base font-semibold text-slate-900 dark:text-slate-100">
        {{ bibleStore.selectedBook.name }}
      </p>
      <p class="text-xs text-slate-500 dark:text-slate-400">
        {{ bibleStore.selectedBook.chapters }}
        {{ bibleStore.selectedBook.chapters === 1 ? 'chapter' : 'chapters' }}
      </p>
    </div>

    <nav aria-label="Chapter list" class="flex-1 overflow-y-auto p-3">
      <ul class="grid grid-cols-5 gap-1.5 sm:grid-cols-6 lg:grid-cols-4">
        <li v-for="chapter in bibleStore.chapters" :key="chapter">
          <button
            type="button"
            :data-testid="`chapter-item-${chapter}`"
            :aria-label="`Chapter ${chapter}`"
            :aria-current="bibleStore.selectedChapter === chapter ? 'true' : undefined"
            class="flex h-9 w-full cursor-pointer items-center justify-center rounded-lg text-sm font-medium tabular-nums transition"
            :class="
              bibleStore.selectedChapter === chapter
                ? 'bg-blue-600 text-white shadow-xs dark:bg-amber-500 dark:text-slate-950'
                : 'border border-slate-200/80 bg-white text-slate-700 hover:border-blue-300 hover:bg-blue-50/60 hover:text-blue-900 dark:border-slate-800 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:border-amber-700 dark:hover:bg-amber-950/40 dark:hover:text-amber-200'
            "
            @click="bibleStore.selectChapter(chapter)"
          >
            {{ chapter }}
          </button>
        </li>
      </ul>
    </nav>
  </aside>
</template>
