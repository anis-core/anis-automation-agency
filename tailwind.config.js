/** Tailwind build config (was the inline `tailwind.config` used with the CDN). */
module.exports = {
  // Every class name lives in these files; app.js builds the page from config.json with literal class strings.
  content: ['./public/index.html', './public/assets/app.js'],
  theme: {
    extend: {
      colors: {
        page: '#ffffff',
        surface: '#f0f9ff',
        raised: '#e0f2fe',
        line: '#d5e8f3',
        ink: '#0c1824',
        muted: '#4f6272',
        accent: '#38bdf8',
        accentdeep: '#0284c7',
        dark: '#0c2233'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif']
      }
    }
  }
};
