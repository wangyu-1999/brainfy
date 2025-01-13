import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}'],
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: '#2D3748',
            fontSize: '1.125rem',
            lineHeight: '1.8',
            p: {
              marginBottom: '2rem',
              color: '#2D3748',
            },
            a: {
              color: '#bb1919',
              textDecoration: 'none',
              transition: 'all 0.2s ease',
              '&:hover': {
                textDecoration: 'underline',
                color: '#8B0000',
              },
            },
            'h1, h2, h3': {
              color: '#1A202C',
              fontWeight: '700',
              lineHeight: '1.3',
            },
            h2: {
              fontSize: '1.875rem',
              marginTop: '3rem',
              marginBottom: '1.5rem',
              paddingBottom: '0.5rem',
              borderBottom: '1px solid #E2E8F0',
            },
            h3: {
              fontSize: '1.5rem',
              marginTop: '2.5rem',
              marginBottom: '1rem',
            },
            blockquote: {
              borderLeftWidth: '4px',
              borderLeftColor: '#CBD5E0',
              backgroundColor: '#F7FAFC',
              padding: '1.5rem',
              margin: '2rem 0',
              fontSize: '1.125rem',
              lineHeight: '1.7',
              color: '#4A5568',
              fontStyle: 'normal',
            },
            strong: {
              color: '#1A202C',
              fontWeight: '700',
              backgroundColor: 'transparent',
              padding: '0',
              borderRadius: '0',
            },
            em: {
              fontStyle: 'italic',
              color: '#4A5568',
              fontWeight: '500',
            },
            img: {
              margin: '2.5rem auto',
              borderRadius: '0.5rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            },
            hr: {
              margin: '3rem 0',
              borderColor: '#E2E8F0',
            },
            ul: {
              margin: '1.5rem 0',
              paddingLeft: '1.5rem',
            },
            li: {
              margin: '0.75rem 0',
              color: '#2D3748',
            },
            pre: {
              backgroundColor: '#F7FAFC',
              padding: '1.5rem',
              margin: '2rem 0',
              fontSize: '0.875rem',
              lineHeight: '1.7',
              borderRadius: '0.5rem',
              border: '1px solid #E2E8F0',
              overflowX: 'auto',
            },
            code: {
              backgroundColor: '#F7FAFC',
              padding: '0.2rem 0.4rem',
              fontSize: '0.875em',
              borderRadius: '0.25rem',
              border: '1px solid #E2E8F0',
              color: '#2D3748',
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}

export default config
