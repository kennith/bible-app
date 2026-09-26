<script setup lang="ts">
import HomeView from '@/views/HomeView.vue'
import { useBibleStore } from '@/stores/bible'

const bibleStore = useBibleStore()

function handleLanguageChange(event: Event) {
  const target = event.target as HTMLSelectElement
  bibleStore.selectLanguage(target.value)
}
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
          class="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 font-serif text-sm font-bold text-white shadow-2xs dark:bg-amber-500 dark:text-slate-950"
        >
          B
        </div>
        <div>
          <span class="text-base font-bold tracking-tight text-slate-900 dark:text-white">
            Bible Reader
          </span>
          <span
            data-testid="bible-version-name"
            class="ml-2 hidden text-xs text-slate-500 sm:inline dark:text-slate-400"
          >
            {{ bibleStore.selectedLanguage.versionName }}
          </span>
        </div>
      </div>

      <div class="flex items-center gap-3 text-xs font-medium text-slate-600 dark:text-slate-300">
        <div class="flex items-center gap-2">
          <label for="language-select" class="text-slate-500 dark:text-slate-400"> Language </label>
          <select
            id="language-select"
            name="language"
            data-testid="language-select"
            :value="bibleStore.bibleId"
            class="cursor-pointer rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-900 transition focus:border-amber-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-amber-400"
            @change="handleLanguageChange"
          >
            <option
              v-for="lang in bibleStore.languages"
              :key="lang.id"
              :value="lang.id"
              :data-testid="`language-option-${lang.code}`"
            >
              {{ lang.label }}
            </option>
          </select>
        </div>

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
