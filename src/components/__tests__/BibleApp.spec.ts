import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import App from '@/App.vue'
import { BIBLE_BOOKS, CHINESE_BIBLE_ID, DEFAULT_BIBLE_ID } from '@/data/bibleBooks'
import { useBibleStore } from '@/stores/bible'

const mockGenesis1Response = {
  id: 'GEN.1',
  bibleId: DEFAULT_BIBLE_ID,
  number: '1',
  bookId: 'GEN',
  reference: 'Genesis 1',
  content:
    '<p class="s1">The Beginning</p><p class="pi"><span class="v">1</span>In the beginning God created the heavens and the earth.</p>',
}

const mockChineseGenesis1Response = {
  id: 'GEN.1',
  bibleId: CHINESE_BIBLE_ID,
  number: '1',
  bookId: 'GEN',
  reference: '創世記 1',
  content:
    '<p class="s">上帝的創造</p><p class="p"><span class="v">1</span>起初，上帝創造天地。</p>',
}

const mock1Samuel3Response = {
  id: '1SA.3',
  bibleId: DEFAULT_BIBLE_ID,
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
    wrapper.unmount()
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
    wrapper.unmount()
  })

  it('groups BookListPanel and ChapterListPanel together and toggles their display when pressing f', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => mockGenesis1Response,
    })
    vi.stubGlobal('fetch', fetchMock)

    const wrapper = mount(App, { attachTo: document.body })
    await flushPromises()

    const navGroup = wrapper.find('[data-testid="navigation-panels"]')
    expect(navGroup.exists()).toBe(true)
    expect(navGroup.find('[data-testid="book-list-panel"]').exists()).toBe(true)
    expect(navGroup.find('[data-testid="chapter-list-panel"]').exists()).toBe(true)
    expect(navGroup.isVisible()).toBe(true)

    // Press 'f' to hide both panels
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'f' }))
    await flushPromises()
    expect(navGroup.isVisible()).toBe(false)

    // Press 'f' again to show both panels
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'f' }))
    await flushPromises()
    expect(navGroup.isVisible()).toBe(true)

    // Pressing 'f' while focused inside the search input should not toggle the panels
    const searchInput = wrapper.find('[data-testid="book-search-input"]')
    searchInput.element.dispatchEvent(new KeyboardEvent('keydown', { key: 'f', bubbles: true }))
    await flushPromises()
    expect(navGroup.isVisible()).toBe(true)

    wrapper.unmount()
  })

  it('allows the user to choose Chinese language (c44765fbdfdb0ed9-01) and fetches Chinese chapter content', async () => {
    const fetchMock = vi.fn().mockImplementation(async (url: string) => {
      if (url.includes('c44765fbdfdb0ed9-01')) {
        return {
          ok: true,
          headers: new Headers({ 'content-type': 'application/json' }),
          json: async () => mockChineseGenesis1Response,
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

    const languageSelect = wrapper.find('[data-testid="language-select"]')
    expect(languageSelect.exists()).toBe(true)

    await languageSelect.setValue('c44765fbdfdb0ed9-01')
    await flushPromises()

    const store = useBibleStore()
    expect(store.bibleId).toBe('c44765fbdfdb0ed9-01')
    expect(fetchMock).toHaveBeenLastCalledWith('/api/bible/c44765fbdfdb0ed9-01/chapters/GEN.1')
    expect(wrapper.find('[data-testid="chapter-reference"]').text()).toBe('創世記 1')
    expect(wrapper.find('[data-testid="bible-version-badge"]').text()).toBe('CUV')
    expect(wrapper.find('[data-testid="bible-content"]').text()).toContain('起初，上帝創造天地。')

    wrapper.unmount()
  })
})
