/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 主色彩 - 深蓝紫色调
        'primary': {
          50: '#f0f2ff',
          100: '#d9deff',
          200: '#b3c0ff',
          300: '#8da2ff',
          400: '#6784ff',
          500: '#4166ff', // 主蓝色
          600: '#2a4ee0',
          700: '#1a3ab3',
          800: '#0e2986',
          900: '#071b59',
        },
        // 辅助色 - 绿松石调
        'secondary': {
          50: '#ebffff',
          100: '#c8fdfd',
          200: '#95f9f9',
          300: '#62f5f5',
          400: '#2fefe9',
          500: '#00e6d6', // 主绿松石色
          600: '#00b3a6',
          700: '#008078',
          800: '#004d47',
          900: '#001a18',
        },
        // 强调色 - 紫色调
        'accent': {
          50: '#f9f0ff',
          100: '#f0d9ff',
          200: '#e1b3ff',
          300: '#d28dff',
          400: '#c367ff',
          500: '#a855f7', // 主紫色
          600: '#9333ea',
          700: '#7e22ce',
          800: '#6b21a8',
          900: '#581c87',
        },
        // 保留原有颜色以保持兼容性
        'warm': {
          50: '#fef9f3',
          100: '#fdf2e7',
          200: '#fae5d0',
          300: '#f5d8b9',
          400: '#f0cba2',
          500: '#ebbe8b',
          600: '#d9a35d',
          700: '#c7882f',
          800: '#a56d1a',
          900: '#83520b',
        },
        'calm': {
          50: '#f3f9fa',
          100: '#e6f3f5',
          200: '#cde6eb',
          300: '#b4d9e1',
          400: '#9bccd7',
          500: '#82bfcd',
          600: '#5aa5b8',
          700: '#328ba3',
          800: '#1a7189',
          900: '#0b576f',
        }
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'serif': ['Merriweather', 'Georgia', 'serif'],
      },
      animation: {
        'soft-pulse': 'soft-pulse 2s infinite',
        'gentle-float': 'gentle-float 6s ease-in-out infinite',
      },
      keyframes: {
        'soft-pulse': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
        'gentle-float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}