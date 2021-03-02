module.exports = {
  purge: {
    enabled: process.env.NODE_ENV === 'production',
    content: ['./renderer/components/**/*.{js,ts,jsx,tsx}', './renderer/pages/**/*.{js,ts,jsx,tsx}'],
  },
  // purge: ['./renderer/components/**/*.{js,ts,jsx,tsx}', './renderer/pages/**/*.{js,ts,jsx,tsx}'],
  darkMode: false,
  theme: {
    extend: {
      colors: {
        'accent-1': '#333',
      },
    },
  },
  variants: {
    backgroundColor: ['responsive', 'hover', 'group-hover', 'focus', 'active', 'checked'],
    extend: {},
  },
  plugins: [],
}
