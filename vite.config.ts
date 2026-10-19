import { defineConfig } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';
import adapter from '@sveltejs/adapter-vercel';
import nodeAdapter from '@sveltejs/adapter-node';

export default defineConfig({
  plugins: [
    sveltekit({
      adapter: process.env.VERCEL
        ? adapter({ runtime: 'nodejs24.x' })
        : nodeAdapter(),
    }),
  ],
});
