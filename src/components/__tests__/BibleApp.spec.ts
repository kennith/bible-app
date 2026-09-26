import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import App from '@/App.vue'
import { BIBLE_BOOKS } from '@/data/bibleBooks'
import { useBibleStore } from '@/stores/bible'

const mockGenesis1Response = {
  id: 'GEN.1',
  bibleId: '71c6eab17ae5b667-01',
  number: '1',
  bookId: 'GEN',
  reference: 'Genesis 1',
  content:
    '<p class="s1">The Beginning</p><p class="pi"><span class="v">1</span>In the beginning God created the heavens and the earth.</p>',
}

const mock1Samuel3Response = {
  id: '1SA.3',
  bibleId: '71c6eab17ae5b667-01',
  number: '3',
  bookId: '1SA',
  reference: '1 Samuel 3',
  content:
    '<p class="s1">The Lord Calls Samuel</p><p class="pi">Speak, for your servant is listening.</p>',
}

describe('Bible App', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.restoreAllMocks()
  })

  it('hardcodes all 66 Christian Bible books in canonical order with accurate chapter counts', () => {
    expect(BIBLE_BOOKS).toHaveLength(66)
    expect(BIBLE_BOOKS[0]).toEqual({
      id: 'GEN',
      name: 'Genesis',
      chapters: 50,
      testament: 'OT',
    })
    expect(BIBLE_BOOKS[8]).toEqual({
      id: '1SA',
      name: '1 Samuel',
      chapters: 31,
      testament: 'OT',
    })
    expect(BIBLE_BOOKS[18]).toEqual({
      id: 'PSA',
      name: 'Psalms',
      chapters: 150,
      testament: 'OT',
    })
    expect(BIBLE_BOOKS[39]).toEqual({
      id: 'MAT',
      name: 'Matthew',
      chapters: 28,
      testament: 'NT',
    })
    expect(BIBLE_BOOKS[65]).toEqual({
      id: 'REV',
      name: 'Revelation',
      chapters: 22,
      testament: 'NT',
    })
  })

  it('renders the book panel, chapter panel, and main content panel and loads Genesis 1 on mount', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => mockGenesis1Response,
    })
    vi.stubGlobal('fetch', fetchMock)

    const wrapper = mount(App)
    await flushPromises()

    expect(fetchMock).toHaveBeenCalledWith('/api/bible/71c6eab17ae5b667-01/chapters/GEN.1')
    expect(wrapper.find('[data-testid="book-list-panel"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="chapter-list-panel"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="bible-content-panel"]').exists()).toBe(true)

    // Verify 50 chapters are rendered for Genesis
    const chapterButtons = wrapper.findAll('[data-testid^="chapter-item-"]')
    expect(chapterButtons).toHaveLength(50)

    // Verify API content object is displayed in the main panel
    const contentEl = wrapper.find('[data-testid="bible-content"]')
    expect(contentEl.exists()).toBe(true)
    expect(contentEl.text()).toContain('In the beginning God created the heavens and the earth.')
  })

  it('updates chapter list when selecting a book and fetches the selected chapter content', async () => {
    const fetchMock = vi.fn().mockImplementation(async (url: string) => {
      if (url.includes('1SA.3')) {
        return {
          ok: true,
          headers: new Headers({ 'content-type': 'application/json' }),
          json: async () => mock1Samuel3Response,
        }
      }
      return {
        ok: true,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => mockGenesis1Response,
      }
    })
    vi.stubGlobal('fetch', fetchMock)

    const wrapper = mount(App)
    await flushPromises()

    // Click 1 Samuel in the left book panel
    await wrapper.find('[data-testid="book-item-1SA"]').trigger('click')
    await flushPromises()

    const store = useBibleStore()
    expect(store.selectedBookId).toBe('1SA')
    expect(store.selectedChapter).toBe(1)

    // 1 Samuel has 31 chapters
    const chapterButtons = wrapper.findAll('[data-testid^="chapter-item-"]')
    expect(chapterButtons).toHaveLength(31)

    // Click chapter 3 in the second panel
    await wrapper.find('[data-testid="chapter-item-3"]').trigger('click')
    await flushPromises()

    expect(fetchMock).toHaveBeenLastCalledWith('/api/bible/71c6eab17ae5b667-01/chapters/1SA.3')
    expect(wrapper.find('[data-testid="bible-content"]').text()).toContain(
      'Speak, for your servant is listening.',
    )
  })
})
