import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        blue_shade: "var(--blue-shade)",
        white: "#f8f8f8",
        primary: {
          DEFAULT: "var(--primary)",
          dark: "var(--primary-dark)",
          light: "var(--primary-light)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          dark: "var(--secondary-dark)",
          light: "var(--secondary-light)",
          foreground: "var(--secondary-foreground)",
        },
        surface: "var(--surface)",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },
      fontFamily: {
        alex: "var(--font-alexandria)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "caret-blink": {
          "0%,70%,100%": { opacity: "1" },
          "20%,50%": { opacity: "0" },
        },
				enterFromRight: {
					from: { opacity: "0", transform: "translateX(200px)" },
					to: { opacity: "1", transform: "translateX(-20px)" },
				},
				enterFromLeft: {
					from: { opacity: "0", transform: "translateX(-200px)" },
					to: { opacity: "1", transform: "translateX(0)" },
				},
				exitToRight: {
					from: { opacity: "1", transform: "translateX(0)" },
					to: { opacity: "0", transform: "translateX(200px)" },
				},
				exitToLeft: {
					from: { opacity: "1", transform: "translateX(0)" },
					to: { opacity: "0", transform: "translateX(-200px)" },
				},
				scaleIn: {
					from: { opacity: "0", transform: "rotateX(-10deg) scale(0.9)" },
					to: { opacity: "1", transform: "rotateX(0deg) scale(1)" },
				},
				scaleOut: {
					from: { opacity: "1", transform: "rotateX(0deg) scale(1)" },
					to: { opacity: "0", transform: "rotateX(-10deg) scale(0.95)" },
				},
				fadeIn: {
					from: { opacity: "0" },
					to: { opacity: "1" },
				},
				fadeOut: {
					from: { opacity: "1" },
					to: { opacity: "0" },
				},
			},
		},
      animation: {
        "caret-blink": "caret-blink 1.25s ease-out infinite",
        scaleIn: "scaleIn 200ms ease",
			  scaleOut: "scaleOut 200ms ease",
			  fadeIn: "fadeIn 200ms ease",
			  fadeOut: "fadeOut 200ms ease",
			  enterFromLeft: "enterFromLeft 250ms ease",
			  enterFromRight: "enterFromRight 250ms ease",
			  exitToLeft: "exitToLeft 250ms ease",
			  exitToRight: "exitToRight 250ms ease",
      },
      screens: {
        tablet: "640px",
        laptop: "1024px",
        desktop: "1280px",
      },
    },
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
