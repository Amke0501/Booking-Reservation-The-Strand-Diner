module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#b8860b',
        'primary-dark': '#8b6508',
        secondary: '#3a3a3a',
        'light-bg': '#f8f5f0',
        'dark-bg': '#222222',
      },
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
        playfair: ['Playfair Display', 'serif'],
        body: ['ui-sans-serif', 'system-ui', 'Arial']
      }
    },
  },
  plugins: [],
}
