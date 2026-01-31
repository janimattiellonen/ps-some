/**
 * Theme colors used across the application.
 * These colors are used for templates, overlays, and accent elements.
 */

// Base color values (RGB components)
export const THEME_COLORS = {
  blue: {
    r: 27,
    g: 154,
    b: 213,
    hex: "#1B9AD5",
  },
  pink: {
    r: 238,
    g: 86,
    b: 160,
    hex: "#EE56A0",
  },
} as const;

// Helper function to create rgba string
const rgba = (r: number, g: number, b: number, a: number): string => `rgba(${r}, ${g}, ${b}, ${a})`;

// Pre-computed color values for common use cases
export const TEMPLATE_COLORS = {
  blue: {
    solid: THEME_COLORS.blue.hex,
    withOpacity: (opacity: number) =>
      rgba(THEME_COLORS.blue.r, THEME_COLORS.blue.g, THEME_COLORS.blue.b, opacity),
    standard: rgba(THEME_COLORS.blue.r, THEME_COLORS.blue.g, THEME_COLORS.blue.b, 0.85),
    overlay: rgba(THEME_COLORS.blue.r, THEME_COLORS.blue.g, THEME_COLORS.blue.b, 0.8),
  },
  pink: {
    solid: THEME_COLORS.pink.hex,
    withOpacity: (opacity: number) =>
      rgba(THEME_COLORS.pink.r, THEME_COLORS.pink.g, THEME_COLORS.pink.b, opacity),
    standard: rgba(THEME_COLORS.pink.r, THEME_COLORS.pink.g, THEME_COLORS.pink.b, 0.85),
    overlay: rgba(THEME_COLORS.pink.r, THEME_COLORS.pink.g, THEME_COLORS.pink.b, 0.8),
  },
} as const;

/**
 * UI colors used for form elements, buttons, and general UI components.
 */
export const UI_COLORS = {
  // Primary palette
  primary: "#2563eb",
  primaryHover: "#1d4ed8",
  primaryFocus: "#1e40af",

  // Neutral palette
  gray50: "#f9fafb",
  gray100: "#f3f4f6",
  gray300: "#d1d5db",
  gray400: "#9ca3af",
  gray500: "#6b7280",
  gray700: "#374151",
  gray900: "#111827",

  // Semantic colors
  error: "#dc2626",

  // Custom colors
  darkBlue: "#1e3a5f",
  overlayDark: "rgba(9, 50, 81, 0.8)",
  contentBackdrop: "rgba(0, 0, 0, 0.5)",

  // Base colors
  white: "#ffffff",
  black: "#000000",
} as const;
