import { createTheme, type ThemeOptions } from '@mui/material/styles';
import { colors, radii, spacing, typography } from './tokens';

const shape = { borderRadius: radii.md };

const typographyOptions: ThemeOptions['typography'] = {
  fontFamily: 'var(--font-inter), "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  h1: { fontSize: typography.scale.displayLarge, fontWeight: 700 },
  h2: { fontSize: typography.scale.headlineMedium, fontWeight: 700 },
  h3: { fontSize: typography.scale.titleLarge, fontWeight: 600 },
  subtitle1: { fontSize: typography.scale.titleMedium, fontWeight: 600 },
  body1: { fontSize: typography.scale.bodyLarge },
  body2: { fontSize: typography.scale.bodyMedium },
  caption: { fontSize: typography.scale.labelSmall },
  button: { textTransform: 'none', fontWeight: 600 },
};

const componentOverrides: ThemeOptions['components'] = {
  MuiButton: {
    styleOverrides: {
      root: { borderRadius: radii.pill, paddingLeft: spacing.lg, paddingRight: spacing.lg },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: { borderRadius: radii.lg },
    },
  },
  MuiPaper: {
    styleOverrides: {
      root: { backgroundImage: 'none' },
    },
  },
  MuiChip: {
    styleOverrides: {
      root: { borderRadius: radii.pill },
    },
  },
};

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: colors.brand.primary,
      light: colors.brand.primaryLight,
      dark: colors.brand.primaryDark,
      contrastText: colors.brand.onPrimary,
    },
    secondary: { main: colors.brand.primaryLight },
    background: { default: colors.neutral.background, paper: colors.neutral.surface },
    text: { primary: colors.text.primary, secondary: colors.text.secondary },
    error: { main: colors.semantic.error },
    warning: { main: colors.semantic.warning },
    success: { main: colors.semantic.success },
    info: { main: colors.semantic.info },
    divider: colors.neutral.outline,
  },
  shape,
  typography: typographyOptions,
  components: componentOverrides,
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: colors.brand.primaryLight,
      light: colors.brand.primary,
      dark: colors.brand.primaryDark,
      contrastText: colors.brand.primaryDark,
    },
    secondary: { main: colors.brand.primary },
    background: { default: colors.neutral.backgroundDark, paper: colors.neutral.surfaceDark },
    text: { primary: colors.text.onDark, secondary: colors.text.secondaryDark },
    error: { main: colors.semantic.error },
    warning: { main: colors.semantic.warning },
    success: { main: colors.semantic.success },
    info: { main: colors.semantic.info },
    divider: colors.neutral.outlineDark,
  },
  shape,
  typography: typographyOptions,
  components: componentOverrides,
});
