import { getPlanById } from '@/server/plans-store';

export function GET(_request: Request, { id }: { id: string }) {
  const plan = getPlanById(id);

  if (!plan) {
    return Response.json({ message: 'Plan not found' }, { status: 404 });
  }

  return Response.json({ plan }, { status: 200 });
}

