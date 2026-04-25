export const colors = {
  primary: '#2D6A4F',       // deep forest green
  secondary: '#52796F',     // muted sage
  accent: '#74C69D',        // light green highlight
  background: '#F8F9FA',    // off-white
  surface: '#FFFFFF',
  text: {
    primary: '#1A1A2E',
    secondary: '#6C757D',
    inverse: '#FFFFFF',
  },
  difficulty: {
    easy: '#52B788',
    moderate: '#F4A261',
    hard: '#E76F51',
  },
  mountain: {
    summited: '#2D6A4F',
    unsummited: '#ADB5BD',
  },
}

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
}

export const typography = {
  h1: { fontSize: 32, fontWeight: '700' as const },
  h2: { fontSize: 24, fontWeight: '700' as const },
  h3: { fontSize: 20, fontWeight: '600' as const },
  body: { fontSize: 16, fontWeight: '400' as const },
  caption: { fontSize: 12, fontWeight: '400' as const },
}

export const globalStyles = {
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  row: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
  },
  centeredContent: {
    flex: 1,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
}