# Bible App

A responsive web application for reading the Christian Bible across all 66 canonical books, featuring multi-language support (English NIV & Traditional Chinese CUV), instant book/testament filtering, chapter navigation, and a distraction-free reading mode.

## Features

- **Complete 66-Book Canon**: Browse all 39 Old Testament and 27 New Testament books in canonical order with accurate chapter counts.
- **Book Search & Testament Filtering**: Quickly filter books by name or abbreviation (`GEN`, `PSA`, `MAT`, etc.) or switch between **All (66)**, **Old (39)**, and **New (27)** testaments.
- **Multi-Language Support with Persistence**:
  - **English**: New International Version (`NIV`, Bible ID `71c6eab17ae5b667-01`)
  - **Chinese (中文)**: Chinese Union Version / 和合本 (`CUV`, Bible ID `c44765fbdfdb0ed9-01`)
  - Automatically persists your selected language in `localStorage` (`bible-app:bible-id`) across browser reloads.
- **Seamless Chapter Navigation**: Jump directly to any chapter from the chapter grid, or step sequentially through scripture using **Prev** / **Next** controls that automatically transition across book boundaries.
- **Distraction-Free Reading Mode**: Press `f` anywhere outside text inputs to toggle the book and chapter navigation panels on or off.
- **Adaptive Typography & Theme**: Styled scripture headings, poetry indentations, verse numbers, and automatic light/dark mode support.

## Tech Stack

- **Frontend Framework**: [Vue 3](https://vuejs.org/) (Composition API with `<script setup>`) & [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite 6](https://vite.dev/)
- **State Management**: [Pinia 3](https://pinia.vuejs.org/)
- **Routing**: [Vue Router 4](https://router.vuejs.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) (`@tailwindcss/vite`)
- **Unit Testing**: [Vitest 3](https://vitest.dev/), [Vue Test Utils](https://test-utils.vuejs.org/), and `jsdom`
- **Linting & Formatting**: [ESLint 9](https://eslint.org/), [Prettier 3](https://prettier.io/), and `vue-tsc`
- **Scripture API**: ODBM Bible API (`https://www.odbm.org/api/bible/{bibleId}/chapters/{bookId}.{chapter}`)

## Usage

### Reading & Navigation

1. **Choose a Language**: Use the **Language** selector in the top header bar to switch between **English** (`NIV`) and **Chinese (中文)** (`CUV`). Your preference is saved automatically.
2. **Select a Book**: Use the left **Bible Books** panel to pick a book. Use the search box (`Filter books...`) or the **All / Old / New** tabs to narrow down the list.
3. **Select a Chapter**: Click any chapter number in the middle **Chapters** panel to load that chapter's scripture in the main reading pane.
4. **Sequential Reading**: Use the **Prev** and **Next** buttons in the sticky chapter header (or at the bottom of the chapter) to move chapter by chapter.
5. **Toggle Navigation Panels (`f` shortcut)**: Press `f` on your keyboard to hide or reveal the book and chapter sidebars for focused reading.

### Development

Install dependencies:

```sh
npm install
```

Start the local development server with hot-reload:

```sh
npm run dev
```

Type-check, compile, and minify for production:

```sh
npm run build
```

Preview the production build locally:

```sh
npm run preview
```

Run unit tests with Vitest:

```sh
npm run test:unit -- --run
```

Run TypeScript type checking:

```sh
npm run type-check
```

Lint and auto-fix files with ESLint:

```sh
npm run lint
```

Format source files with Prettier:

```sh
npm run format
```

## Deploy to GitHub Pages

This project is configured to deploy automatically to GitHub Pages when code is pushed to the `main` branch.

1. In GitHub, open repository settings.
2. Go to `Pages`.
3. Set `Source` to `GitHub Actions`.
4. Push to `main` and wait for the `Deploy to GitHub Pages` workflow to finish.

The Vite base path defaults to `/bible-app/` for this repository. If you rename the repository or use a custom domain, override it during build:

```sh
VITE_BASE_PATH=/your-repo-name/ npm run build
```
