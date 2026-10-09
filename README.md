# Suraj Gopali Portfolio

A React portfolio built with Vite, TypeScript, and Three.js.

## Languages and Technologies

- **TypeScript and TSX**: the main application and React components in `src/`.
- **HTML**: `index.html`, the Vite page shell that loads `src/main.tsx`.
- **CSS**: application styles in `src/`, with Tailwind CSS 4 available through the Vite plugin.
- **JavaScript**: a standalone `script.js` file is present at the project root, but it is not imported by the active React app and does not run as part of the Vite build.
- **JSON**: project and TypeScript configuration, including `package.json` and the `tsconfig` files.

Main libraries and tools: React 19, Three.js, Tailwind CSS 4, Vite 8, and TypeScript 6.

## Run Locally

Requirements: Node.js and npm.

```sh
npm install
npm run dev
```

Vite prints the local development URL in the terminal.

## Production Build

```sh
npm run build
```

Vite writes the production site to `dist/`. To preview that build locally:

```sh
npm run preview
```

## Deploy to Vercel

### Vercel Dashboard

1. Push this project to a Git provider supported by Vercel, such as GitHub.
2. In the Vercel dashboard, choose **Add New > Project** and import the repository.
3. Use the project root as the root directory. Vercel should detect Vite automatically.
4. Confirm these build settings:
   - Build command: `npm run build`
   - Output directory: `dist`
   - Install command: `npm install` (the default is fine)
5. Choose **Deploy**. Future pushes to the connected branch will trigger deployments.

### Vercel CLI

From the project directory, run:

```sh
npm install
npm run build
npx vercel
```

Follow the prompts to link or create a Vercel project. To deploy to production, run:

```sh
npx vercel --prod
```