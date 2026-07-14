export const colors = {
  brand: {
    primary: '#0E7C4A',
    primaryLight: '#3FA873',
    primaryDark: '#0A5C37',
    onPrimary: '#FFFFFF',
    secondaryContainer: '#D9F2E3',
  },
  neutral: {
    white: '#FFFFFF',
    background: '#F7F9F8',
    surface: '#FFFFFF',
    surfaceVariant: '#EDF2EF',
    backgroundDark: '#0F1411',
    surfaceDark: '#171D19',
    surfaceVariantDark: '#212824',
    outline: '#DDE2DF',
    outlineDark: '#3A423E',
  },
  semantic: {
    success: '#2E9E5B',
    warning: '#D9A441',
    error: '#D64545',
    info: '#3B7DD8',
  },
  text: {
    primary: '#12140F',
    secondary: '#5B655F',
    onDark: '#F2F5F3',
    secondaryDark: '#A8B3AD',
    disabled: '#9AA39D',
  },
} as const;

export const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48 } as const;

export const radii = { sm: 8, md: 12, lg: 20, xl: 28, pill: 999 } as const;

export const typography = {
  fontFamily: { regular: 'System', medium: 'System', bold: 'System' },
  scale: {
    displayLarge: 34,
    headlineMedium: 24,
    titleLarge: 20,
    titleMedium: 17,
    bodyLarge: 16,
    bodyMedium: 14,
    labelSmall: 12,
  },
} as const;

export const elevation = { level0: 0, level1: 1, level2: 3, level3: 6 } as const;
