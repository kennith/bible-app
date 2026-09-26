import { computed, ref, watch } from 'vue'
import { defineStore } from 'pinia'
import {
  BIBLE_BOOKS,
  BIBLE_LANGUAGES,
  DEFAULT_BIBLE_ID,
  type BibleBook,
  type BibleLanguageOption,
} from '@/data/bibleBooks'

export const BIBLE_LANGUAGE_STORAGE_KEY = 'bible-app:bible-id'

const fallbackStorage = new Map<string, string>()

function getStoredValue(key: string): string | null {
  try {
    if (typeof window !== 'undefined' && typeof window.localStorage?.getItem === 'function') {
      return window.localStorage.getItem(key)
    }
  } catch {
    // Ignore storage access errors in restricted environments
  }
  return fallbackStorage.get(key) ?? null
}

function setStoredValue(key: string, value: string): void {
  try {
    if (typeof window !== 'undefined' && typeof window.localStorage?.setItem === 'function') {
      window.localStorage.setItem(key, value)
      return
    }
  } catch {
    // Ignore storage write errors in restricted environments
  }
  fallbackStorage.set(key, value)
}

export function clearPersistedBibleId(): void {
  try {
    if (typeof window !== 'undefined' && typeof window.localStorage?.removeItem === 'function') {
      window.localStorage.removeItem(BIBLE_LANGUAGE_STORAGE_KEY)
    }
  } catch {
    // Ignore storage access errors
  }
  fallbackStorage.delete(BIBLE_LANGUAGE_STORAGE_KEY)
}

function resolveLanguageBibleId(
  languageOrBibleId: string,
  availableLanguages: BibleLanguageOption[] = BIBLE_LANGUAGES,
): string {
  const normalized = languageOrBibleId.trim().toLowerCase()
  const matched = availableLanguages.find(
    (lang) =>
      lang.id === languageOrBibleId ||
      lang.code === normalized ||
      lang.label.toLowerCase().includes(normalized),
  )
  return matched ? matched.id : languageOrBibleId
}

function readInitialBibleId(): string {
  const saved = getStoredValue(BIBLE_LANGUAGE_STORAGE_KEY)
  if (!saved) return DEFAULT_BIBLE_ID

  const matched = BIBLE_LANGUAGES.find(
    (lang) => lang.id === saved || lang.code === saved.trim().toLowerCase(),
  )
  return matched ? matched.id : DEFAULT_BIBLE_ID
}

export interface BibleChapterNav {
  id: string
  number: string
  bookId: string
  reference: string | null
}

export interface BibleChapterResponse {
  id: string
  bibleId: string
  number: string
  bookId: string
  reference: string
  content: string
  previous?: BibleChapterNav | null
  next?: BibleChapterNav | null
}

export const useBibleStore = defineStore('bible', () => {
  const books = ref<BibleBook[]>(BIBLE_BOOKS)
  const languages = ref<BibleLanguageOption[]>(BIBLE_LANGUAGES)
  const bibleId = ref<string>(readInitialBibleId())
  const selectedBookId = ref<string>(BIBLE_BOOKS[0]!.id)
  const selectedChapter = ref<number>(1)

  const chapterData = ref<BibleChapterResponse | null>(null)
  const loading = ref<boolean>(false)
  const error = ref<string | null>(null)

  let latestRequestId = 0

  watch(bibleId, (newBibleId) => {
    setStoredValue(BIBLE_LANGUAGE_STORAGE_KEY, newBibleId)
  })

  const selectedLanguage = computed<BibleLanguageOption>(() => {
    return languages.value.find((l) => l.id === bibleId.value) ?? languages.value[0]!
  })

  const selectedBook = computed<BibleBook>(() => {
    return books.value.find((b) => b.id === selectedBookId.value) ?? books.value[0]!
  })

  const chapters = computed<number[]>(() => {
    return Array.from({ length: selectedBook.value.chapters }, (_, i) => i + 1)
  })

  const chapterId = computed<string>(() => `${selectedBookId.value}.${selectedChapter.value}`)

  const apiUrl = computed<string>(
    () => `https://www.odbm.org/api/bible/${bibleId.value}/chapters/${chapterId.value}`,
  )

  const proxyUrl = computed<string>(() => `/api/bible/${bibleId.value}/chapters/${chapterId.value}`)

  const chapterContent = computed<string>(() => chapterData.value?.content ?? '')

  const chapterReference = computed<string>(
    () => chapterData.value?.reference ?? `${selectedBook.value.name} ${selectedChapter.value}`,
  )

  async function fetchChapter(bookId = selectedBookId.value, chapter = selectedChapter.value) {
    const requestId = ++latestRequestId
    loading.value = true
    error.value = null

    const targetChapterId = `${bookId}.${chapter}`
    const localEndpoint = `/api/bible/${bibleId.value}/chapters/${targetChapterId}`
    const remoteEndpoint = `https://www.odbm.org/api/bible/${bibleId.value}/chapters/${targetChapterId}`

    try {
      let response = await fetch(localEndpoint)

      const contentType = response.headers?.get?.('content-type') ?? ''
      if (response.ok && contentType.includes('text/html')) {
        response = await fetch(remoteEndpoint)
      }

      if (!response.ok) {
        throw new Error(`Failed to load ${bookId} ${chapter} (HTTP ${response.status})`)
      }

      const data = (await response.json()) as BibleChapterResponse

      if (requestId !== latestRequestId) {
        return
      }

      chapterData.value = data
    } catch (err) {
      if (requestId !== latestRequestId) {
        return
      }
      error.value = err instanceof Error ? err.message : 'Unable to fetch Bible chapter content.'
      chapterData.value = null
    } finally {
      if (requestId === latestRequestId) {
        loading.value = false
      }
    }
  }

  async function selectBook(bookId: string) {
    const book = books.value.find((b) => b.id === bookId)
    if (!book) return

    selectedBookId.value = book.id
    selectedChapter.value = 1
    await fetchChapter(book.id, 1)
  }

  async function selectChapter(chapter: number) {
    if (chapter < 1 || chapter > selectedBook.value.chapters) return

    selectedChapter.value = chapter
    await fetchChapter(selectedBookId.value, chapter)
  }

  async function selectLanguage(languageOrBibleId: string) {
    const nextBibleId = resolveLanguageBibleId(languageOrBibleId, languages.value)
    if (!nextBibleId) return

    bibleId.value = nextBibleId
    setStoredValue(BIBLE_LANGUAGE_STORAGE_KEY, nextBibleId)
    await fetchChapter(selectedBookId.value, selectedChapter.value)
  }

  const hasPreviousChapter = computed<boolean>(() => {
    const bookIndex = books.value.findIndex((b) => b.id === selectedBookId.value)
    return bookIndex > 0 || selectedChapter.value > 1
  })

  const hasNextChapter = computed<boolean>(() => {
    const bookIndex = books.value.findIndex((b) => b.id === selectedBookId.value)
    return bookIndex < books.value.length - 1 || selectedChapter.value < selectedBook.value.chapters
  })

  async function goToPreviousChapter() {
    if (selectedChapter.value > 1) {
      await selectChapter(selectedChapter.value - 1)
      return
    }
    const bookIndex = books.value.findIndex((b) => b.id === selectedBookId.value)
    if (bookIndex > 0) {
      const prevBook = books.value[bookIndex - 1]!
      selectedBookId.value = prevBook.id
      selectedChapter.value = prevBook.chapters
      await fetchChapter(prevBook.id, prevBook.chapters)
    }
  }

  async function goToNextChapter() {
    if (selectedChapter.value < selectedBook.value.chapters) {
      await selectChapter(selectedChapter.value + 1)
      return
    }
    const bookIndex = books.value.findIndex((b) => b.id === selectedBookId.value)
    if (bookIndex >= 0 && bookIndex < books.value.length - 1) {
      const nextBook = books.value[bookIndex + 1]!
      selectedBookId.value = nextBook.id
      selectedChapter.value = 1
      await fetchChapter(nextBook.id, 1)
    }
  }

  return {
    books,
    languages,
    bibleId,
    selectedLanguage,
    selectedBookId,
    selectedChapter,
    selectedBook,
    chapters,
    chapterId,
    apiUrl,
    proxyUrl,
    chapterData,
    chapterContent,
    chapterReference,
    loading,
    error,
    hasPreviousChapter,
    hasNextChapter,
    fetchChapter,
    selectBook,
    selectChapter,
    selectLanguage,
    goToPreviousChapter,
    goToNextChapter,
  }
})
