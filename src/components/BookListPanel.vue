<script setup lang="ts">
import { computed, ref } from 'vue'
import { useBibleStore } from '@/stores/bible'

const bibleStore = useBibleStore()
const searchQuery = ref('')
const testamentFilter = ref<'ALL' | 'OT' | 'NT'>('ALL')

const filteredBooks = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  return bibleStore.books.filter((book) => {
    const matchesTestament =
      testamentFilter.value === 'ALL' || book.testament === testamentFilter.value
    const matchesQuery =
      !query || book.name.toLowerCase().includes(query) || book.id.toLowerCase().includes(query)
    return matchesTestament && matchesQuery
  })
})
</script>

<template>
  <aside
    aria-label="Bible Books"
    data-testid="book-list-panel"
    class="flex h-full flex-col border-b border-slate-200 bg-white lg:w-64 lg:shrink-0 lg:border-r lg:border-b-0 dark:border-slate-800 dark:bg-slate-900"
  >
    <div class="border-b border-slate-200 p-4 dark:border-slate-800">
      <div>
        <input
          v-model="searchQuery"
          type="search"
          placeholder="Filter books..."
          aria-label="Filter books"
          data-testid="book-search-input"
          class="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-900 placeholder-slate-400 transition focus:border-amber-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:border-amber-400 dark:focus:bg-slate-800"
        />
      </div>

      <div
        class="mt-2.5 grid grid-cols-3 gap-1 rounded-lg bg-slate-100 p-1 text-xs font-medium dark:bg-slate-800"
      >
        <button
          type="button"
          class="cursor-pointer rounded-md py-1 transition"
          :class="
            testamentFilter === 'ALL'
              ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-700 dark:text-white'
              : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
          "
          @click="testamentFilter = 'ALL'"
        >
          All (66)
        </button>
        <button
          type="button"
          class="cursor-pointer rounded-md py-1 transition"
          :class="
            testamentFilter === 'OT'
              ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-700 dark:text-white'
              : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
          "
          @click="testamentFilter = 'OT'"
        >
          Old (39)
        </button>
        <button
          type="button"
          class="cursor-pointer rounded-md py-1 transition"
          :class="
            testamentFilter === 'NT'
              ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-700 dark:text-white'
              : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
          "
          @click="testamentFilter = 'NT'"
        >
          New (27)
        </button>
      </div>
    </div>

    <nav aria-label="Book list" class="flex-1 overflow-y-auto p-2">
      <ul class="space-y-0.5">
        <li v-for="book in filteredBooks" :key="book.id">
          <button
            type="button"
            :data-testid="`book-item-${book.id}`"
            :aria-current="bibleStore.selectedBookId === book.id ? 'true' : undefined"
            class="flex w-full cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition"
            :class="
              bibleStore.selectedBookId === book.id
                ? 'bg-amber-50 font-semibold text-amber-900 ring-1 ring-amber-200 dark:bg-amber-950/50 dark:text-amber-200 dark:ring-amber-800/60'
                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/60 dark:hover:text-white'
            "
            @click="bibleStore.selectBook(book.id)"
          >
            <span class="truncate">{{ book.name }}</span>
            <span
              class="ml-2 shrink-0 rounded-md px-1.5 py-0.5 text-xs tabular-nums"
              :class="
                bibleStore.selectedBookId === book.id
                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/70 dark:text-amber-200'
                  : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
              "
            >
              {{ book.chapters }}
            </span>
          </button>
        </li>
      </ul>

      <p
        v-if="filteredBooks.length === 0"
        class="px-3 py-6 text-center text-sm text-slate-500 dark:text-slate-400"
      >
        No matching books found.
      </p>
    </nav>
  </aside>
</template>
