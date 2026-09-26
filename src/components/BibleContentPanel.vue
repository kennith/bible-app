<script setup lang="ts">
import { ref, watch } from 'vue'
import { useBibleStore } from '@/stores/bible'

const bibleStore = useBibleStore()
const scrollContainer = ref<HTMLElement | null>(null)

watch(
  () => bibleStore.chapterId,
  () => {
    scrollContainer.value?.scrollTo?.({ top: 0, behavior: 'smooth' })
  },
)
</script>

<template>
  <main
    ref="scrollContainer"
    data-testid="bible-content-panel"
    class="flex flex-1 flex-col overflow-y-auto bg-amber-50/20 dark:bg-slate-950"
  >
    <!-- Chapter Header Bar -->
    <header
      class="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 bg-white/90 px-6 py-4 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/90"
    >
      <div>
        <div class="flex items-center gap-2.5">
          <h1
            data-testid="chapter-reference"
            class="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100"
          >
            {{ bibleStore.chapterReference }}
          </h1>
          <span
            class="rounded-md bg-amber-100 px-2 py-0.5 text-xs font-semibold tracking-wide text-amber-900 uppercase dark:bg-amber-950 dark:text-amber-300"
          >
            NIV
          </span>
        </div>
        <p class="mt-0.5 font-mono text-xs text-slate-400 dark:text-slate-500">
          {{ bibleStore.apiUrl }}
        </p>
      </div>

      <div class="flex items-center gap-2">
        <button
          type="button"
          data-testid="prev-chapter-btn"
          :disabled="!bibleStore.hasPreviousChapter || bibleStore.loading"
          class="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-2xs transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          @click="bibleStore.goToPreviousChapter()"
        >
          <span aria-hidden="true">&larr;</span>
          <span>Prev</span>
        </button>

        <button
          type="button"
          data-testid="next-chapter-btn"
          :disabled="!bibleStore.hasNextChapter || bibleStore.loading"
          class="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-2xs transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          @click="bibleStore.goToNextChapter()"
        >
          <span>Next</span>
          <span aria-hidden="true">&rarr;</span>
        </button>
      </div>
    </header>

    <!-- Main Content Body -->
    <div class="mx-auto w-full max-w-3xl flex-1 px-6 py-8 sm:px-10 sm:py-10">
      <!-- Loading State -->
      <div
        v-if="bibleStore.loading"
        data-testid="loading-indicator"
        class="flex flex-col items-center justify-center py-24 text-slate-500 dark:text-slate-400"
      >
        <progress aria-label="Loading chapter" class="loading-spinner"></progress>
        <p class="mt-4 text-sm font-medium">
          Loading {{ bibleStore.selectedBook.name }} {{ bibleStore.selectedChapter }}...
        </p>
      </div>

      <!-- Error State -->
      <div
        v-else-if="bibleStore.error"
        data-testid="error-message"
        role="alert"
        class="rounded-xl border border-red-200 bg-red-50 p-6 text-center dark:border-red-900/60 dark:bg-red-950/40"
      >
        <p class="text-base font-semibold text-red-800 dark:text-red-300">
          Could not load chapter content
        </p>
        <p class="mt-1 text-sm text-red-600 dark:text-red-400">
          {{ bibleStore.error }}
        </p>
        <button
          type="button"
          data-testid="retry-btn"
          class="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-500"
          @click="bibleStore.fetchChapter()"
        >
          Try Again
        </button>
      </div>

      <!-- Scripture Content -->
      <article
        v-else-if="bibleStore.chapterContent"
        data-testid="bible-content"
        class="bible-content rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs sm:p-10 dark:border-slate-800/80 dark:bg-slate-900"
        v-html="bibleStore.chapterContent"
      ></article>

      <!-- Empty State -->
      <div v-else class="py-20 text-center text-sm text-slate-500 dark:text-slate-400">
        Select a book and chapter to begin reading.
      </div>

      <!-- Bottom Chapter Navigation -->
      <footer
        v-if="bibleStore.chapterContent && !bibleStore.loading"
        class="mt-8 flex items-center justify-between border-t border-slate-200/80 pt-6 dark:border-slate-800"
      >
        <button
          type="button"
          :disabled="!bibleStore.hasPreviousChapter"
          class="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          @click="bibleStore.goToPreviousChapter()"
        >
          <span aria-hidden="true">&larr;</span>
          <span>Previous Chapter</span>
        </button>

        <span class="text-xs font-medium text-slate-400 dark:text-slate-500">
          {{ bibleStore.chapterReference }}
        </span>

        <button
          type="button"
          :disabled="!bibleStore.hasNextChapter"
          class="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          @click="bibleStore.goToNextChapter()"
        >
          <span>Next Chapter</span>
          <span aria-hidden="true">&rarr;</span>
        </button>
      </footer>
    </div>
  </main>
</template>
