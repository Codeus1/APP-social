import type { PlanEnergy, PlanPrice } from '@/features/plans/types';

export function formatPrice(price: PlanPrice): string {
  switch (price) {
    case 'cheap':
      return '€ Cheap';
    case 'moderate':
      return '€€ Moderate';
    case 'expensive':
      return '€€€ Expensive';
  }
}

export function formatEnergy(energy: PlanEnergy): string {
  switch (energy) {
    case 'low':
      return 'Chill Vibe';
    case 'medium':
      return 'Social';
    case 'high':
      return 'High Energy';
  }
}

export function priceChipColor(price: PlanPrice): string {
  switch (price) {
    case 'cheap':
      return '#4ade80';
    case 'moderate':
      return '#b79eab';
    case 'expensive':
      return '#b79eab';
  }
}
