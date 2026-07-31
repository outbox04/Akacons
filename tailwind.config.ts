import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: '#1C2321',
        paper: '#FAF7F2',
        copper: '#A6592C',
        sage: '#5B6B4F',
        slate: '#46586B',
        ochre: '#B8862B',
      },
      fontFamily: {
        sans: ['Kanit', 'sans-serif'],
        serif: ['Kanit', 'sans-serif'],
        mono: ['Kanit', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
