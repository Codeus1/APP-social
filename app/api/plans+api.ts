import { getAllPlans } from '@/server/plans-store';

export function GET() {
  const plans = getAllPlans();
  return Response.json({ plans }, { status: 200 });
}

