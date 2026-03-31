import type { CSSProperties } from 'react'
import type { StoreThemeSettings } from '@/types/storeTheme'

const fontStacks: Record<StoreThemeSettings['typography']['fontFamily'], string> =
  {
    cairo: "'Cairo', ui-sans-serif, system-ui, sans-serif",
    tajawal: "'Tajawal', 'Cairo', ui-sans-serif, system-ui, sans-serif",
    almarai: "'Almarai', 'Cairo', ui-sans-serif, system-ui, sans-serif",
  }

const radiusPx: Record<StoreThemeSettings['layout']['cardRadius'], string> = {
  xl: '0.75rem',
  '2xl': '1rem',
  '3xl': '1.5rem',
}

const gridGap: Record<StoreThemeSettings['layout']['gridDensity'], string> = {
  compact: '0.5rem',
  comfortable: '0.75rem',
  spacious: '1rem',
}

const sectionY: Record<
  StoreThemeSettings['layout']['sectionSpacing'],
  { sm: string; md: string }
> = {
  normal: { sm: '3rem', md: '4rem' },
  relaxed: { sm: '4rem', md: '5rem' },
}

/**
 * Maps theme settings to CSS custom properties for the storefront subtree.
 */
export function storeThemeToCssVars(
  settings: StoreThemeSettings,
): CSSProperties {
  const { colors, typography, layout, header, footer } = settings
  const sy = sectionY[layout.sectionSpacing]
  const hc = header.chromeColors
  const fc = footer.colors
  return {
    fontFamily: fontStacks[typography.fontFamily],
    fontSize: `calc(1rem * ${typography.baseScale})`,
    '--store-primary': colors.primary,
    '--store-secondary': colors.secondary,
    '--store-bg': colors.background,
    '--store-surface': colors.surface,
    '--store-text': colors.text,
    '--store-muted': colors.muted,
    '--store-header-bg': hc.background,
    '--store-header-text': hc.text,
    '--store-header-link': hc.link,
    '--store-header-button': hc.button,
    '--store-footer-bg': fc.background,
    '--store-footer-text': fc.text,
    '--store-footer-link': fc.link,
    '--store-footer-button': fc.button,
    '--store-font-body': fontStacks[typography.fontFamily],
    '--store-font-display': fontStacks[typography.fontFamily],
    '--store-font-scale': String(typography.baseScale),
    '--store-radius-card': radiusPx[layout.cardRadius],
    '--store-grid-gap': gridGap[layout.gridDensity],
    '--store-section-y-sm': sy.sm,
    '--store-section-y-md': sy.md,
  } as CSSProperties
}
