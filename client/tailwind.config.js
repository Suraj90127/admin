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
        // Monochrome color palette for both light and dark modes
        gray: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
          950: '#0a0a0a',
        },
        // Theme-specific colors
        theme: {
          light: {
            bg: {
              primary: '#ffffff',
              secondary: '#f8f8f8',
              tertiary: '#f0f0f0',
            },
            text: {
              primary: '#111827',
              secondary: '#4b5563',
              tertiary: '#6b7280',
            }
          },
          dark: {
            bg: {
              primary: '#0a0a0a',
              secondary: '#111111',
              tertiary: '#1a1a1a',
            },
            text: {
              primary: '#f9fafb',
              secondary: '#d1d5db',
              tertiary: '#9ca3af',
            }
          }
        }
      },
      animation: {
        'gradient': 'gradient 8s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'slide-in': 'slideIn 0.5s ease-out',
        'fade-in': 'fadeIn 0.3s ease-out',
        'shimmer': 'shimmer 2s infinite linear',
        'glow': 'glow 2s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'border-glow': 'borderGlow 2s ease-in-out infinite',
        'text-shimmer': 'textShimmer 2s infinite linear',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        gradient: {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        slideIn: {
          from: {
            opacity: '0',
            transform: 'translateY(20px)'
          },
          to: {
            opacity: '1',
            transform: 'translateY(0)'
          }
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' }
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' }
        },
        glow: {
          '0%, 100%': {
            'box-shadow': '0 0 20px rgba(255, 255, 255, 0.1), 0 0 40px rgba(255, 255, 255, 0.05), 0 0 60px rgba(255, 255, 255, 0.025)'
          },
          '50%': {
            'box-shadow': '0 0 30px rgba(255, 255, 255, 0.2), 0 0 60px rgba(255, 255, 255, 0.1), 0 0 90px rgba(255, 255, 255, 0.05)'
          }
        },
        pulseGlow: {
          '0%, 100%': {
            'box-shadow': '0 0 10px rgba(255, 255, 255, 0.1)',
            'transform': 'scale(1)'
          },
          '50%': {
            'box-shadow': '0 0 30px rgba(255, 255, 255, 0.3), 0 0 60px rgba(255, 255, 255, 0.15)',
            'transform': 'scale(1.02)'
          }
        },
        borderGlow: {
          '0%, 100%': {
            'border-color': 'rgba(255, 255, 255, 0.1)',
            'box-shadow': '0 0 10px rgba(255, 255, 255, 0.05)'
          },
          '50%': {
            'border-color': 'rgba(255, 255, 255, 0.3)',
            'box-shadow': '0 0 20px rgba(255, 255, 255, 0.2), inset 0 0 20px rgba(255, 255, 255, 0.1)'
          }
        },
        textShimmer: {
          '0%': {
            'background-position': '-200% center',
            'text-shadow': '0 0 10px rgba(255, 255, 255, 0.3)'
          },
          '100%': {
            'background-position': '200% center',
            'text-shadow': '0 0 20px rgba(255, 255, 255, 0.5)'
          }
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        // Monochrome gradients
        'gradient-monochrome': 'linear-gradient(90deg, #000 0%, #333 25%, #666 50%, #999 75%, #fff 100%)',
        'gradient-silver': 'linear-gradient(135deg, #888 0%, #aaa 50%, #888 100%)',
        'gradient-light': 'linear-gradient(135deg, #f8f8f8 0%, #e5e5e5 50%, #f8f8f8 100%)',
        'gradient-dark': 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)',
        'gradient-shimmer': 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.1) 20%, transparent 40%)',
        'gradient-shimmer-light': 'linear-gradient(90deg, transparent 0%, rgba(0, 0, 0, 0.1) 20%, transparent 40%)',
      },
      backdropBlur: {
        xs: '2px',
        '4xl': '40px',
      },
      boxShadow: {
        // Glowing shadows for dark mode
        'glow-sm': '0 0 10px rgba(255, 255, 255, 0.1)',
        'glow': '0 0 20px rgba(255, 255, 255, 0.2), 0 0 40px rgba(255, 255, 255, 0.1)',
        'glow-lg': '0 0 30px rgba(255, 255, 255, 0.3), 0 0 60px rgba(255, 255, 255, 0.15), 0 0 90px rgba(255, 255, 255, 0.05)',
        'glow-xl': '0 0 40px rgba(255, 255, 255, 0.4), 0 0 80px rgba(255, 255, 255, 0.2), 0 0 120px rgba(255, 255, 255, 0.1)',
        'glow-inner': 'inset 0 0 20px rgba(255, 255, 255, 0.1)',
        'glow-inner-lg': 'inset 0 0 40px rgba(255, 255, 255, 0.2)',
        // Light mode shadows
        'glow-light-sm': '0 0 10px rgba(0, 0, 0, 0.1)',
        'glow-light': '0 0 20px rgba(0, 0, 0, 0.1), 0 0 40px rgba(0, 0, 0, 0.05)',
        'glow-light-lg': '0 0 30px rgba(0, 0, 0, 0.15), 0 0 60px rgba(0, 0, 0, 0.08), 0 0 90px rgba(0, 0, 0, 0.03)',
      },
      textShadow: {
        'glow-sm': '0 0 5px rgba(255, 255, 255, 0.5)',
        'glow': '0 0 10px rgba(255, 255, 255, 0.7), 0 0 20px rgba(255, 255, 255, 0.5)',
        'glow-lg': '0 0 15px rgba(255, 255, 255, 0.8), 0 0 30px rgba(255, 255, 255, 0.6), 0 0 45px rgba(255, 255, 255, 0.4)',
        'glow-light-sm': '0 0 5px rgba(0, 0, 0, 0.3)',
        'glow-light': '0 0 10px rgba(0, 0, 0, 0.4), 0 0 20px rgba(0, 0, 0, 0.3)',
      },
      borderColor: {
        'glow': 'rgba(255, 255, 255, 0.2)',
        'glow-light': 'rgba(255, 255, 255, 0.1)',
        'glow-strong': 'rgba(255, 255, 255, 0.3)',
        'glow-dark': 'rgba(0, 0, 0, 0.2)',
      },
      backgroundSize: {
        'shimmer': '1000px 100%',
      },
    },
  },
  plugins: [
    function({ addBase, addComponents, addUtilities, theme }) {
      // Base styles
      addBase({
        'html': {
          '@apply transition-colors duration-300': {},
        },
        'body': {
          '@apply antialiased': {},
        },
      });

      // Custom components
      addComponents({
        // Glass effect components
        '.glass': {
          '@apply backdrop-blur-md bg-white/5 dark:bg-black/10 border border-white/10 dark:border-white/5': {},
        },
        '.glass-light': {
          '@apply backdrop-blur-md bg-white/80 border border-black/10': {},
        },
        '.glass-dark': {
          '@apply backdrop-blur-md bg-black/30 border border-white/10': {},
        },
        
        // Text gradients
        '.text-gradient-silver': {
          background: 'linear-gradient(90deg, #888 0%, #fff 50%, #888 100%)',
          backgroundSize: '200% auto',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          color: 'transparent',
          animation: 'gradient 3s linear infinite',
        },
        '.text-gradient-dark': {
          background: 'linear-gradient(90deg, #666 0%, #333 50%, #666 100%)',
          backgroundSize: '200% auto',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          color: 'transparent',
          animation: 'gradient 3s linear infinite',
        },
        
        // Custom buttons
        '.btn-glow': {
          '@apply relative overflow-hidden transition-all duration-300 hover:scale-[1.02]': {},
          '&::before': {
            content: '""',
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '0',
            height: '0',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.1)',
            transform: 'translate(-50%, -50%)',
            transition: 'width 0.6s, height 0.6s',
          },
          '&:hover::before': {
            width: '300px',
            height: '300px',
          },
        },
        
        // Card hover effects
        '.card-hover': {
          '@apply transition-all duration-300 hover:-translate-y-1': {},
        },
      });

      // Custom utilities
      addUtilities({
        // Scrollbar utilities
        '.scrollbar-hidden': {
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },
        
        // Selection color
        '.selection-primary': {
          '&::selection': {
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            color: 'white',
          },
        },
        '.selection-dark': {
          '&::selection': {
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
            color: 'black',
          },
        },
        
        // Grid patterns
        '.grid-pattern': {
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
        },
        '.grid-pattern-light': {
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.05) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(0, 0, 0, 0.05) 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
        },
      });
    }
  ],
}