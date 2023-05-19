/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}", "./dist/index.html"],
  theme: {
    extend: {},
    colors: {
      "dracula-background": "#282a36",
      "dracula-foreground": "#f8f8f2",
      "dracula-selection": "#44475a",
      "dracula-current-line": "#44475a",
      "dracula-comment": "#6272a4",
      "dracula-cyan": "#8be9fd",
      "dracula-green": "#50fa7b",
      "dracula-orange": "#ffb86c",
      "dracula-pink": "#ff79c6",
      "dracula-purple": "#bd93f9",
      "dracula-red": "#ff5555",
      "dracula-yellow": "#f1fa8c",
    }
  },
  plugins: [],
};
