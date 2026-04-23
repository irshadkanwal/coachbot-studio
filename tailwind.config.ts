import type { Config } from 'tailwindcss';

export default {
  darkMode: 'class',
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        main: 'rgb(var(--colors-main), <alpha-value>)',
        violet: {
          950: 'rgb(var(--colors-violet-950), <alpha-value>)',
        },
        salmon: 'rgb(var(--colors-salmon), <alpha-value>)',
        aquamarine: 'rgb(var(--colors-aquamarine), <alpha-value>)',
        'dark-aquamarine': 'rgb(var(--colors-dark-aquamarine), <alpha-value>)',
        'light-aquamarine': 'rgb(var(--colors-light-aquamarine), <alpha-value>)',
        saffron: 'rgb(var(--colors-saffron), <alpha-value>)',
        'light-gray': 'rgb(var(--colors-light-gray), <alpha-value>)',
        'dark-gray': 'rgb(var(--colors-dark-gray), <alpha-value>)',
        'storm-gray': 'rgb(var(--colors-storm-gray), <alpha-value>)',
        yellow: 'rgb(var(--colors-yellow), <alpha-value>)',
        gunmetal: 'rgb(var(--colors-gunmetal), <alpha-value>)',
        golden: 'rgb(var(--colors-golden), <alpha-value>)',
        background: 'rgb(var(--colors-background), <alpha-value>)',
        graphic: 'rgb(var(--colors-graphic), <alpha-value>)',
        light: 'rgb(var(--colors-light), <alpha-value>)',
        grape: 'rgb(var(--colors-grape), <alpha-value>)',
        blue: 'rgb(var(--colors-blue), <alpha-value>)',
        'background-border': 'rgb(var(--colors-background-border), <alpha-value>)',
        'primary-green': '#3ABEB8',
        'white-opacity': 'var(--colors-white-opacity)',
        'light-opacity': 'var(--colors-light-opacity)',
      },
      backgroundImage: {
        'white-gradient': 'linear-gradient(180deg, rgba(255, 255, 255, 0.18) 0%, rgba(255, 255, 255, 0.036) 100%)',
        'yellow-spinner':
          'conic-gradient(from -146.68deg at 50% 50%, rgba(241, 194, 1, 0) 9deg, rgba(241, 194, 1, 0) 34deg, rgba(241, 194, 1, 1) 350deg)',
        'yellow-green-gradient': 'linear-gradient(270deg, #3ABEB8 0%, #F9BE19 100%)',
      },
      screens: {
        smH: { raw: '(max-height: 450px) and (min-width:667px)' },
        mdH: { raw: '(max-height: 870px)' },
        lgH: { raw: '(min-height: 1000px)' },
        '2xlH': { raw: '(min-height: 1800px)' },
        '3xl': { raw: '(min-width: 2000px)' },
      },
      animation: {
        'text-sequence': 'text-sequence 11s infinite',
        'spin-and-pulse': 'spin-and-pulse 2s linear infinite',
      },
      keyframes: {
        'spin-and-pulse': {
          '0%': { transform: 'rotate(0deg) scale(0.95)' },
          '50%': { transform: 'rotate(180deg) scale(1.1)' },
          '100%': { transform: 'rotate(360deg) scale(1)' },
        },
        'text-sequence': {
          '0%, 100%': { content: '"Analyzing..."', opacity: '1' },
          '33%': { content: '"Thinking..."', opacity: '1' },
          '66%': { content: '"Moderation..."', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
