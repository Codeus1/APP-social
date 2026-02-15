import { mockPlans } from '@/features/plans/mock-data';

export function getAllPlans() {
  return mockPlans;
}

export function getPlanById(id: string) {
  return mockPlans.find((plan) => plan.id === id) ?? null;
}

