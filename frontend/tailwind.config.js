/**
 * Cores semanticas (estrutura no estilo shadcn/ui).
 * Os valores vivem em src/index.css como variaveis RGB, o que permite
 * usar opacidade: bg-primary/10, ring-accent/40, etc.
 */
const token = (name) => `rgb(var(--${name}) / <alpha-value>)`;

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // --- Tokens semanticos (usar estes nas telas novas) ---
        background: token('background'),
        foreground: token('foreground'),
        card: token('card'),
        muted: {
          DEFAULT: token('muted'),
          foreground: token('muted-foreground'),
        },
        border: token('border'),
        ring: token('ring'),
        primary: {
          DEFAULT: token('primary'),
          hover: token('primary-hover'),
          light: token('primary-light'),
          foreground: token('primary-foreground'),
        },
        secondary: {
          DEFAULT: token('secondary'),
          hover: token('secondary-hover'),
          foreground: token('secondary-foreground'),
        },
        accent: {
          DEFAULT: token('accent'),
          hover: token('accent-hover'),
          light: token('accent-light'),
        },
        destructive: {
          DEFAULT: token('destructive'),
          hover: token('destructive-hover'),
          light: token('destructive-light'),
          foreground: token('destructive-foreground'),
        },
        // Status de prazo (usar SOMENTE para prazo/progresso)
        status: {
          success: token('status-success'),
          warning: token('status-warning'),
          danger: token('status-danger'),
          done: token('status-done'),
        },

        // --- Aliases legados (mantidos para nao quebrar telas antigas) ---
        brand: {
          primary: token('primary'),
          'primary-hover': token('primary-hover'),
          'primary-light': token('primary-light'),
          accent: token('accent'),
          'accent-hover': token('accent-hover'),
          'accent-light': token('accent-light'),
        },
        aldebaran: {
          dark0: '#F4F5F6',
          dark: '#FAFAFB',
          gray: '#FFFFFF',
          border: '#E6E7EA',
          gold: '#1C1D1F',
          goldDark: '#2F3033',
          orange: '#266DF0',
        },
        theme: {
          strong: '#1C1D1F',
          normal: '#36383D',
          weak: '#6E727A',
        }
      },
      borderWidth: { 3: '3px' },
      backdropBlur: { xs: '2px', '2xs': '1px' },
      animation: {
        'spin-slow': 'spin 12s linear infinite',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        title: ['Outfit', 'Inter', 'sans-serif'],
        display: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      boxShadow: {
        '2xs': '0 1px 1px 0 rgba(15, 23, 42, 0.04)',
        'xs': '0 1px 2px 0 rgba(15, 23, 42, 0.05)',
        'card': '0 1px 3px 0 rgba(15, 23, 42, 0.06), 0 1px 2px -1px rgba(15, 23, 42, 0.04)',
        'card-hover': '0 4px 6px -1px rgba(15, 23, 42, 0.08), 0 2px 4px -2px rgba(15, 23, 42, 0.04)',
        'dropdown': '0 10px 15px -3px rgba(15, 23, 42, 0.1), 0 4px 6px -4px rgba(15, 23, 42, 0.05)',
      }
    },
  },
  plugins: [],
}
