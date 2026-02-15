export class ApiError extends Error {
  status: number;
  code?: string;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }
}

export async function apiRequest<T>(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<T> {
  try {
    const response = await fetch(input, init);

    if (!response.ok) {
      const payload = await response.json().catch(() => ({} as { message?: string; code?: string }));
      throw new ApiError(payload.message ?? `HTTP ${response.status}`, response.status, payload.code);
    }

    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Network error', 0, 'NETWORK_ERROR');
  }
}

