export default {
  content: ['./src/**/*.{svelte,js}'],
  theme: {
    extend: {
      colors: Object.fromEntries(
        [
          'canvas',
          'surface',
          'soft',
          'ink',
          'muted',
          'line',
          'accent',
          'accent-ink',
          'positive',
          'danger',
        ].map((name) => [name, `var(--${name})`]),
      ),
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        control: 'var(--radius-control)',
        panel: 'var(--radius-panel)',
      },
      spacing: { gutter: 'var(--space-gutter)' },
      fontSize: {
        display: [
          'clamp(2.8rem, 6vw, 5.6rem)',
          { lineHeight: '1.03', letterSpacing: '-.055em' },
        ],
      },
    },
  },
};
