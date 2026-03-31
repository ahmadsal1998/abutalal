import type { ComponentType } from 'react'
import type { StoreTemplateId } from '@/types/storeTheme'
import type { StorefrontTemplateProps } from './types'
import { ModernMinimalTemplate } from './ModernMinimalTemplate'
import { BoldColorfulTemplate } from './BoldColorfulTemplate'
import { LuxuryTemplate } from './LuxuryTemplate'
import { GridCleanTemplate } from './GridCleanTemplate'
import { DynamicInteractiveTemplate } from './DynamicInteractiveTemplate'

export const storefrontTemplateRegistry: Record<
  StoreTemplateId,
  ComponentType<StorefrontTemplateProps>
> = {
  'modern-minimal': ModernMinimalTemplate,
  'bold-colorful': BoldColorfulTemplate,
  luxury: LuxuryTemplate,
  'grid-clean': GridCleanTemplate,
  'dynamic-interactive': DynamicInteractiveTemplate,
}

export function getStorefrontTemplate(
  id: StoreTemplateId,
): ComponentType<StorefrontTemplateProps> {
  return storefrontTemplateRegistry[id] ?? ModernMinimalTemplate
}
