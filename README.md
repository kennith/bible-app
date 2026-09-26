# Bible App

A Vue 3 + Vite application configured with TypeScript, Vue Router, Pinia, Tailwind CSS v4, Vitest, ESLint, and Prettier.

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with Vitest

```sh
npm run test:unit
```

### Lint with ESLint

```sh
npm run lint
```

### Format with Prettier

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
