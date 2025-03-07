module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'neon-blue': '#00eaff',
        'neon-green': '#00ff9d',
        'deep-space': '#0a0a1f',
        'space-gray': '#2a2a3a',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 8s linear infinite',
        'spin-reverse-slow': 'spin 6s linear infinite reverse',
      },
      boxShadow: {
        'neon-soft': '0 0 5px theme("colors.neon-blue"), 0 0 10px theme("colors.neon-green")',
        'neon-glow': '0 0 10px theme("colors.neon-blue"), 0 0 20px theme("colors.neon-green"), 0 0 30px theme("colors.neon-blue")',
      },
      backdropFilter: {
        'none': 'none',
        'blur': 'blur(20px)',
      },
      screens: {
        'xs': '480px',
        '3xl': '1600px',
      },
    },
  },
  plugins: [],
}
