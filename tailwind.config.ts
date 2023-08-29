import type {Config} from 'tailwindcss'

export default {
  content: ['./app/**/*.{ts,tsx,jsx,js}'],
  purge: false,
  theme: {
    extend: {
      typography: (theme: any) => ({
        DEFAULT: {
          css: {
            color: theme('colors.gray.900'),
            a: {
              color: theme('colors.brand.dark'),
              transition: 'color 0.2s',
              textDecoration: 'none',
              '&:hover': {
                color: theme('colors.brand.light')
              }
            }
          }
        },

        dark: {
          css: {
            color: theme('colors.gray.300'),
            a: {
              color: theme('colors.brand.light'),
              '&:hover': {
                color: theme('colors.brand.dark')
              }
            },
            h1: {
              color: theme('colors.gray.400')
            },
            h2: {
              color: theme('colors.gray.400')
            },
            h3: {
              color: theme('colors.gray.400')
            },
            h4: {
              color: theme('colors.gray.400')
            },
            h5: {
              color: theme('colors.gray.400')
            },
            h6: {
              color: theme('colors.gray.400')
            },
            blockquote: {
              color: theme('colors.gray.300')
            },
            code: {
              color: theme('colors.gray.500')
            }
          }
        }
      }),
      colors: {
        brand: {
          light: 'rgb(104, 109, 224)',
          dark: 'rgb(72, 52, 212)'
        },
        brands: {
          dev: '#0a0a0a',
          twitter: '#1da1f2',
          github: '#181717',
          youtube: '#ff0000',
          facebook: '#1877f2',
          reddit: '#ff4500'
        }
      },
      fontFamily: {
        headings: ['Montserrat', 'Serif']
      },
      gridTemplateColumns: {
        form: '1fr 2fr',
        articler: '1fr 3fr',
        articlel: '3fr 1fr',
        //layout: 'minmax(150px, 10vw) 1fr',
        content:
          'minmax(0.6rem, 1fr) minmax(0.6rem, 1fr) minmax(auto, 60ch) minmax(0.6rem, 1fr) minmax(0.6rem, 1fr)',
        layout: 'minmax(1.2rem, 1fr) minmax(auto, 75vw) minmax(1.2rem, 1fr)'
      },
      width: {
        dbl: '200vw'
      },
      height: {
        dbl: '200vh'
      },
      minHeight: {
        '1/4': '25vh',
        '1/2': '50vh',
        hero: '50vh'
      },
      minWidth: {
        hero: '50vw'
      },
      maxHeight: {
        hero: '85vh'
      },
      maxWidth: {
        hero: '95vw'
      },
      rotate: {
        '2-5': '2.5deg',
        5: '5deg',
        '-2-5': '-2.5deg'
      }
    }
  },
  variants: {
    typography: ['dark']
  },
  plugins: [require('@tailwindcss/typography')]
} satisfies Config
