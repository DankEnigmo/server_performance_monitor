/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ['Consolas', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', "Liberation Mono", "Courier New", 'monospace'],
      },
    },
  },
  plugins: [],
}
